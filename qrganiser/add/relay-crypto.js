// Shared by the companion page (index.html inlines the same functions) and
// the test-vector generator. Must match source/Pairing.mc exactly:
//   key = SHA-256("qrganiser-v1|" + code)[0..15]   AES-128-CBC, PKCS#7
//   id  = hex(SHA-256("qrganiser-id|" + code))[0..23]
//   plaintext = "qrganiser1" RS (name US data US fmt) RS ...
export const RS = "\u001e";
export const US = "\u001f";

const enc = new TextEncoder();

async function sha256(text) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(text)));
}

export function normaliseCode(code) {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export async function relayId(code) {
  const h = await sha256("qrganiser-id|" + code);
  return [...h].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 24);
}

export function packCards(cards) {
  const clean = (s) => String(s).replace(/[\u001e\u001f]/g, " ");
  return "qrganiser1" + RS + cards.map((c) => [clean(c.name).slice(0, 24), clean(c.data).slice(0, 300), String(c.fmt | 0)].join(US)).join(RS);
}

const b64 = (u8) => btoa(String.fromCharCode(...u8));

export async function encryptCards(code, cards, iv = crypto.getRandomValues(new Uint8Array(16))) {
  const raw = (await sha256("qrganiser-v1|" + code)).slice(0, 16);
  const key = await crypto.subtle.importKey("raw", raw, { name: "AES-CBC" }, false, ["encrypt"]);
  // WebCrypto AES-CBC applies PKCS#7 padding itself.
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-CBC", iv }, key, enc.encode(packCards(cards))));
  return { iv: b64(iv), ct: b64(ct) };
}
