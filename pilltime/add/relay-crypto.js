// Shared by the med editor page (index.html imports it) and the test-vector
// generator. Must match source/Pairing.mc exactly:
//   key = SHA-256("pilltime-v1|" + code)[0..15]    AES-128-CBC, PKCS#7
//   id  = hex(SHA-256("pilltime-id|" + code))[0..23]
//   mac = hex(SHA-256("pilltime-mac|" + code + "|" + body))[0..15]
//   plaintext = body RS "#" US mac
//   body = "pill1" US listId US count US pageDay (RS record)*
export const RS = "\u001e";
export const US = "\u001f";
export const MAGIC = "pill1";
// The relay accepts 8192 bytes of JSON; 4096 bytes of plaintext leaves room
// for base64 and the envelope with margin.
export const MAX_PLAINTEXT = 4096;
export const MAX_MEDS = 20;
export const MAX_TIMES = 6;

export const TYPE = { DAILY: 0, WEEKDAYS: 1, CYCLE: 2, INTERVAL: 3, PRN: 4 };
export const FLAG = { CRITICAL: 1, STOCK: 2, PAUSED: 4 };

const enc = new TextEncoder();

async function sha256(text) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(text)));
}

const hex = (u8) => [...u8].map((b) => b.toString(16).padStart(2, "0")).join("");
const b64 = (u8) => btoa(String.fromCharCode(...u8));

export function normaliseCode(code) {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export async function relayId(code) {
  return hex(await sha256("pilltime-id|" + code)).slice(0, 24);
}

//! Days since 1970-01-01 for a local calendar date, as the watch counts them.
export function dayNumber(date) {
  return Math.round(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
}

const clean = (s) => String(s ?? "").replace(/[\u001e\u001f]/g, " ").trim();
const int = (n) => (Number.isFinite(+n) ? Math.round(+n) : 0);

//! meds: [{id, name, dose, flags, type, times: [minutes], p1, p2, start,
//! days, perDose, stock, stockRev, refill, pack}] with quantities in
//! hundredths of a unit.
export function packMeds(listId, meds, pageDay) {
  const head = [MAGIC, listId, meds.length, pageDay].join(US);
  const records = meds.map((m) =>
    [
      int(m.id),
      [...clean(m.name)].slice(0, 24).join(""),
      [...clean(m.dose)].slice(0, 12).join(""),
      int(m.flags) & 7,
      int(m.type),
      (m.times || []).slice(0, MAX_TIMES).map(int).join(","),
      int(m.p1),
      int(m.p2),
      int(m.start),
      int(m.days),
      int(m.perDose),
      int(m.stock),
      int(m.stockRev),
      int(m.refill),
      int(m.pack),
    ].join(US)
  );
  return [head, ...records].join(RS);
}

export async function seal(code, body) {
  const mac = hex(await sha256("pilltime-mac|" + code + "|" + body)).slice(0, 16);
  return body + RS + "#" + US + mac;
}

export async function plaintextFor(code, listId, meds, pageDay) {
  return seal(code, packMeds(listId, meds, pageDay));
}

export async function encryptMeds(code, listId, meds, pageDay, iv = crypto.getRandomValues(new Uint8Array(16))) {
  const bytes = enc.encode(await plaintextFor(code, listId, meds, pageDay));
  if (bytes.length > MAX_PLAINTEXT) {
    throw new Error("TOO_LARGE");
  }
  const raw = (await sha256("pilltime-v1|" + code)).slice(0, 16);
  const key = await crypto.subtle.importKey("raw", raw, { name: "AES-CBC" }, false, ["encrypt"]);
  // WebCrypto AES-CBC applies PKCS#7 padding itself.
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-CBC", iv }, key, bytes));
  return { iv: b64(iv), ct: b64(ct) };
}
