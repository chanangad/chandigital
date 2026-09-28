// "Quick add" card builders: turn a few typed fields into the exact text a
// payment, contact or Wi-Fi QR code carries. Pure functions (no DOM) so
// site/templates.test.mjs can check them against known-good payloads.
//
// Every builder returns { name, data } or throws TemplateError(key) where
// key is a strings-*.json message id. The watch shows `data` as a QR code.

export class TemplateError extends Error {
  constructor(key, vars = {}) { super(key); this.key = key; this.vars = vars; }
}

// Cards travel to the watch capped at 300 characters (the settings limit,
// also enforced by the watch's relay parser).
export const MAX_DATA = 300;

const need = (v, key) => { if (!v) throw new TemplateError(key); return v; };

// Strip accents: Pix, PayNow and PromptPay payloads are read by bank apps
// that expect plain ASCII names.
const ascii = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7e]/g, "").trim();

// ---- EMV QR (Pix, PayNow, PromptPay) ----
// Tag-length-value fields; the payload ends with tag 63, a CRC-16/CCITT-FALSE
// (poly 0x1021, init 0xFFFF) over everything before it, "6304" included.

export function crc16(text) {
  let crc = 0xffff;
  for (const b of new TextEncoder().encode(text)) {
    crc ^= b << 8;
    for (let i = 0; i < 8; i++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

const tlv = (tag, value) => {
  const len = new TextEncoder().encode(value).length;
  if (len > 99) throw new TemplateError("tplTooLong");
  return tag + String(len).padStart(2, "0") + value;
};

const emv = (fields) => {
  const body = fields.join("") + "6304";
  return body + crc16(body);
};

// ---- India: UPI (NPCI deep link, read by every UPI app) ----
export function upi({ vpa, payee }) {
  vpa = need((vpa || "").trim(), "tplNeedUpi");
  if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9.\-]{1,64}$/.test(vpa)) throw new TemplateError("tplBadUpi");
  payee = need((payee || "").trim(), "tplNeedName");
  const data = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(payee)}&cu=INR`;
  return { name: `UPI · ${vpa}`.slice(0, 24), data };
}

// ---- Brazil: Pix static BR Code (Banco Central do Brasil) ----
export function pixKey(raw) {
  const key = (raw || "").trim();
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key)) return key.toLowerCase(); // random key
  if (/^\S+@\S+\.\S+$/.test(key)) return key.toLowerCase();                                                  // e-mail
  const digits = key.replace(/\D/g, "");
  if (key.startsWith("+")) return "+" + digits;                                                              // phone, international
  if (/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(key)) return digits;                                              // CPF
  if (/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/.test(key)) return digits;                                      // CNPJ
  if (digits.length === 10 || digits.length === 11) return "+55" + digits;                                    // phone, national
  throw new TemplateError("tplBadPix");
}

export function pix({ key, receiver, city }) {
  const k = pixKey(need(key, "tplNeedPix"));
  const name = ascii(need((receiver || "").trim(), "tplNeedName")).slice(0, 25);
  const town = ascii(need((city || "").trim(), "tplNeedCity")).slice(0, 15);
  const data = emv([
    tlv("00", "01"),
    tlv("26", tlv("00", "br.gov.bcb.pix") + tlv("01", k)),
    tlv("52", "0000"),
    tlv("53", "986"),
    tlv("58", "BR"),
    tlv("59", name),
    tlv("60", town),
    tlv("62", tlv("05", "***")),
  ]);
  return { name: `Pix · ${receiver.trim()}`.slice(0, 24), data };
}

// ---- Singapore: PayNow (SGQR / EMV) ----
export function paynow({ kind, value, receiver }) {
  let proxyType, proxy;
  const v = need((value || "").trim(), "tplNeedPaynow");
  if (kind === "uen") {
    proxy = v.toUpperCase().replace(/\s/g, "");
    if (!/^[0-9A-Z]{9,10}$/.test(proxy)) throw new TemplateError("tplBadPaynow");
    proxyType = "2";
  } else {
    const d = v.replace(/\D/g, "").replace(/^65(?=\d{8}$)/, "");
    if (!/^[3689]\d{7}$/.test(d)) throw new TemplateError("tplBadPaynow");
    proxy = "+65" + d;
    proxyType = "0";
  }
  const name = ascii(need((receiver || "").trim(), "tplNeedName")).slice(0, 25);
  const data = emv([
    tlv("00", "01"),
    tlv("01", "11"),
    tlv("26", tlv("00", "SG.PAYNOW") + tlv("01", proxyType) + tlv("02", proxy) + tlv("03", "1")),
    tlv("52", "0000"),
    tlv("53", "702"),
    tlv("58", "SG"),
    tlv("59", name),
    tlv("60", "Singapore"),
  ]);
  return { name: `PayNow · ${receiver.trim()}`.slice(0, 24), data };
}

// ---- Thailand: PromptPay (EMV, Bank of Thailand AID A000000677010111) ----
export function promptpay({ id }) {
  const d = need((id || "").replace(/\D/g, ""), "tplNeedPromptpay");
  let field;
  if (/^0\d{9}$/.test(d)) field = tlv("01", "0066" + d.slice(1));       // mobile: 0066 + number without its leading 0
  else if (/^66\d{9}$/.test(d)) field = tlv("01", "00" + d);            // mobile typed with country code
  else if (/^\d{13}$/.test(d)) field = tlv("02", d);                    // national ID / tax ID
  else throw new TemplateError("tplBadPromptpay");
  const data = emv([
    tlv("00", "01"),
    tlv("01", "11"),
    tlv("29", tlv("00", "A000000677010111") + field),
    tlv("58", "TH"),
    tlv("53", "764"),
  ]);
  return { name: `PromptPay · ${id.trim()}`.slice(0, 24), data };
}

// ---- Europe: SEPA credit transfer (EPC069-12 "GiroCode", version 002) ----
export function ibanValid(iban) {
  const s = iban.replace(/\s/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(s)) return false;
  const moved = (s.slice(4) + s.slice(0, 4)).replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let rem = 0;
  for (const ch of moved) rem = (rem * 10 + Number(ch)) % 97;
  return rem === 1;
}

export function sepa({ receiver, iban, bic }) {
  const name = need((receiver || "").trim(), "tplNeedName").slice(0, 70);
  const i = need((iban || "").replace(/\s/g, "").toUpperCase(), "tplNeedIban");
  if (!ibanValid(i)) throw new TemplateError("tplBadIban");
  const b = (bic || "").replace(/\s/g, "").toUpperCase();
  if (b && !/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(b)) throw new TemplateError("tplBadBic");
  // Service tag, version, UTF-8, SCT, BIC (optional in 002), name, IBAN.
  // Amount and reference are left out so the payer enters them.
  const data = ["BCD", "002", "1", "SCT", b, name, i].join("\n");
  return { name: `SEPA · ${name}`.slice(0, 24), data };
}

// ---- Everywhere: contact card (vCard 3.0) ----
const vesc = (s) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

export function contact({ first, last, phone, email, org }) {
  first = (first || "").trim(); last = (last || "").trim();
  phone = (phone || "").trim(); email = (email || "").trim(); org = (org || "").trim();
  if (!first && !last) throw new TemplateError("tplNeedName");
  if (!phone && !email) throw new TemplateError("tplNeedPhoneOrEmail");
  if (email && !/^\S+@\S+\.\S+$/.test(email)) throw new TemplateError("tplBadEmail");
  const full = [first, last].filter(Boolean).join(" ");
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `N:${vesc(last)};${vesc(first)};;;`, `FN:${vesc(full)}`];
  if (org) lines.push(`ORG:${vesc(org)}`);
  if (phone) lines.push(`TEL;TYPE=CELL:${phone.replace(/[^\d+]/g, "")}`);
  if (email) lines.push(`EMAIL:${email}`);
  lines.push("END:VCARD");
  const data = lines.join("\n");
  if (data.length > MAX_DATA) throw new TemplateError("tplTooLong");
  return { name: full.slice(0, 24), data };
}

// ---- Everywhere: Wi-Fi network (the de-facto WIFI: scheme phones read) ----
const wesc = (s) => s.replace(/([\\;,:"])/g, "\\$1");

export function wifi({ ssid, password, security }) {
  const net = need(ssid || "", "tplNeedSsid");
  const t = security === "nopass" ? "nopass" : security === "WEP" ? "WEP" : "WPA";
  if (t !== "nopass" && !password) throw new TemplateError("tplNeedPassword");
  const data = `WIFI:T:${t};S:${wesc(net)};` + (t === "nopass" ? "" : `P:${wesc(password)};`) + ";";
  if (data.length > MAX_DATA) throw new TemplateError("tplTooLong");
  return { name: `Wi-Fi · ${net}`.slice(0, 24), data };
}

// ---- Recognising a card from its content ----
// Works on typed and scanned cards alike (scanning your bank's own UPI or
// PayNow sticker gives the same kind of text). Returns { kind, detail } or
// null; detail is a short human-readable line for the card.
function emvFields(s) {
  const out = {};
  let i = 0;
  while (i + 4 <= s.length) {
    const len = Number(s.slice(i + 2, i + 4));
    if (!Number.isInteger(len) || i + 4 + len > s.length) return null;
    out[s.slice(i, i + 2)] = s.slice(i + 4, i + 4 + len);
    i += 4 + len;
  }
  return i === s.length ? out : null;
}

export function describe(data) {
  if (/^upi:\/\/pay\?/i.test(data)) {
    const pa = new URLSearchParams(data.slice(data.indexOf("?") + 1)).get("pa");
    return pa ? { kind: "upi", detail: pa } : null;
  }
  if (/^WIFI:/i.test(data)) {
    const m = /(?:^WIFI:|;)S:((?:\\.|[^;\\])*);/i.exec(data);
    return { kind: "wifi", detail: m ? m[1].replace(/\\(.)/g, "$1") : "" };
  }
  if (/^BEGIN:VCARD/i.test(data)) {
    const tel = /^TEL[^:\n]*:(.+)$/im.exec(data), mail = /^EMAIL[^:\n]*:(.+)$/im.exec(data);
    return { kind: "contact", detail: (tel || mail || [, ""])[1].trim() };
  }
  if (/^BCD\n00[12]\n/.test(data)) {
    const iban = (data.split("\n")[6] || "").trim();
    return { kind: "sepa", detail: iban.length > 8 ? iban.slice(0, 4) + " … " + iban.slice(-4) : iban };
  }
  if (/^000201/.test(data)) {
    const f = emvFields(data);
    if (!f) return null;
    for (const tag of Object.keys(f)) {
      if (tag < "26" || tag > "51") continue;
      const sub = emvFields(f[tag]);
      if (!sub || !sub["00"]) continue;
      const aid = sub["00"].toLowerCase();
      if (aid === "br.gov.bcb.pix") return { kind: "pix", detail: sub["01"] || "" };
      if (aid === "sg.paynow") return { kind: "paynow", detail: sub["02"] || "" };
      if (aid === "a000000677010111") return { kind: "promptpay", detail: (sub["01"] || sub["02"] || "").replace(/^0066/, "0") };
      // Malaysia's DuitNow QR (PayNet, RID A000000615). Not generated here:
      // it carries the bank's own participant code, so the add page asks for
      // the QR the user's bank app produces and only recognises it.
      if (aid.startsWith("a000000615")) return { kind: "duitnow", detail: f["59"] || "" };
    }
  }
  return null;
}

// ---- Which quick-add chips a visitor sees first ----
// By timezone, the same signal the product page uses for ₹ vs $. Everyone
// can still open the full list; this only decides what's up front.
const SEPA_EXCLUDED = /Moscow|Kaliningrad|Samara|Volgograd|Saratov|Ulyanovsk|Astrakhan|Kirov|Minsk|Kiev|Kyiv|Simferopol|Istanbul|Chisinau|Tbilisi|Yerevan|Baku/;

export function regionalTemplates(tz) {
  const out = [];
  if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") out.push("upi");
  else if (/^America\/(Sao_Paulo|Recife|Bahia|Fortaleza|Manaus|Belem|Cuiaba|Campo_Grande|Porto_Velho|Boa_Vista|Rio_Branco|Araguaina|Maceio|Noronha|Santarem)$/.test(tz)) out.push("pix");
  else if (tz === "Asia/Singapore") out.push("paynow");
  else if (tz === "Asia/Bangkok") out.push("promptpay");
  else if (tz === "Asia/Kuala_Lumpur" || tz === "Asia/Kuching") out.push("duitnow");
  else if ((/^Europe\//.test(tz) || /^Atlantic\/(Canary|Madeira|Azores|Reykjavik)$/.test(tz)) && !SEPA_EXCLUDED.test(tz)) out.push("sepa");
  return out.concat(["contact", "wifi"]);
}

export const ALL_TEMPLATES = ["upi", "pix", "paynow", "promptpay", "duitnow", "sepa", "contact", "wifi"];
