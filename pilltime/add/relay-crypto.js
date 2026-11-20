// Shared by the med editor page (index.html imports it) and the test-vector
// generator. Must match source/Pairing.mc exactly:
//   key = SHA-256("pilltime-v1|" + code)[0..15]    AES-128-CBC, PKCS#7
//   id  = hex(SHA-256("pilltime-id|" + code))[0..23]
//   mac = hex(SHA-256("pilltime-mac|" + code + "|" + body))[0..15]
//   plaintext = body RS "#" US mac
//   body = "pill1" US listId US count US pageDay (RS record)*
// The same parcel travels both ways: page -> watch under id, and (1.0.6+)
// the watch's own list -> page under
//   up  = hex(SHA-256("pilltime-up|" + code))[0..23]
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
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

export function normaliseCode(code) {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export async function relayId(code) {
  return hex(await sha256("pilltime-id|" + code)).slice(0, 24);
}

//! Where the watch parks its own list for the page to load.
export async function uploadId(code) {
  return hex(await sha256("pilltime-up|" + code)).slice(0, 24);
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

//! Opens a parcel made with this code (by the watch, or by this page):
//! {listId, meds} with meds in the wire shape packMeds() takes, or null when
//! it is not ours - a wrong code, a tampered or truncated parcel, or a
//! format this page does not know.
export async function openParcel(code, ivB64, ctB64) {
  try {
    const raw = (await sha256("pilltime-v1|" + code)).slice(0, 16);
    const key = await crypto.subtle.importKey("raw", raw, { name: "AES-CBC" }, false, ["decrypt"]);
    const bytes = await crypto.subtle.decrypt({ name: "AES-CBC", iv: unb64(ivB64) }, key, unb64(ctB64));
    return await parseParcel(code, new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    return null;
  }
}

export async function parseParcel(code, text) {
  const cut = text.lastIndexOf(RS);
  if (cut < 0) return null;
  const body = text.slice(0, cut);
  const trailer = text.slice(cut + 1).split(US);
  if (trailer.length !== 2 || trailer[0] !== "#") return null;
  const mac = hex(await sha256("pilltime-mac|" + code + "|" + body)).slice(0, 16);
  if (mac !== trailer[1]) return null;
  const [head, ...records] = body.split(RS);
  const h = head.split(US);
  if (h.length < 2 || h[0] !== MAGIC) return null;
  const meds = [];
  for (const record of records.slice(0, MAX_MEDS)) {
    const f = record.split(US);
    if (f.length < 15) continue;
    const n = (i) => int(f[i]);
    const m = {
      id: n(0), name: f[1], dose: f[2], flags: n(3) & 7, type: n(4),
      times: f[5] ? f[5].split(",").map(int).filter((t) => t >= 0 && t < 1440).slice(0, MAX_TIMES) : [],
      p1: n(6), p2: n(7), start: n(8), days: n(9), perDose: n(10),
      stock: n(11), stockRev: n(12), refill: n(13), pack: n(14),
    };
    if (m.id > 0 && m.name && m.type >= TYPE.DAILY && m.type <= TYPE.PRN) meds.push(m);
  }
  return { listId: h[1], meds };
}

// --- the page's med <-> the wire ---------------------------------------------
// A page med is what the editor form holds: times as "HH:MM", quantities in
// whole units, the schedule spelled out per type.

const TYPE_NAMES = ["daily", "weekdays", "cycle", "interval", "prn"];

function toMinutes(t) {
  const [h, mm] = t.split(":").map(Number);
  return h * 60 + mm;
}

const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

function isoOfDay(day) {
  return new Date(day * 86400000).toISOString().slice(0, 10);
}

export function toWire(m) {
  let p1 = 0, p2 = 0;
  if (m.type === "weekdays") p1 = m.weekdays.reduce((mask, d) => mask | (1 << d), 0);
  if (m.type === "cycle") { p1 = m.on; p2 = m.off; }
  if (m.type === "interval") { p1 = Math.round(m.everyHours * 60); p2 = m.maxPerDay; }
  if (m.type === "prn") { p1 = Math.round((m.gapHours || 0) * 60); p2 = m.prnMax || 0; }
  const [y, mo, d] = m.start.split("-").map(Number);
  return {
    id: m.id, name: m.name, dose: m.dose,
    flags: (m.critical ? FLAG.CRITICAL : 0) | (m.track ? FLAG.STOCK : 0) | (m.paused ? FLAG.PAUSED : 0),
    type: TYPE_NAMES.indexOf(m.type), times: m.times.map(toMinutes), p1, p2,
    start: dayNumber(new Date(y, mo - 1, d)), days: m.days,
    perDose: Math.round(m.perDose * 100), stock: Math.round(m.stock * 100), stockRev: m.stockRev,
    refill: m.track ? m.refill : 0, pack: Math.round(m.pack * 100),
  };
}

//! The reverse of toWire, for a list loaded from the watch. base supplies
//! the form's defaults for what the wire does not carry (the settings of
//! the schedule types this med does not use).
export function fromWire(w, base = {}) {
  const type = TYPE_NAMES[w.type] || "daily";
  const m = {
    ...base,
    id: w.id, name: w.name, dose: w.dose, type,
    times: type === "prn" ? [] : w.times.map(hhmm),
    days: w.days,
    critical: type !== "prn" && !!(w.flags & FLAG.CRITICAL),
    track: !!(w.flags & FLAG.STOCK),
    paused: !!(w.flags & FLAG.PAUSED),
    perDose: (w.perDose > 0 ? w.perDose : 100) / 100,
    stock: w.stock / 100, stockRev: w.stockRev, pack: w.pack / 100,
  };
  if (w.start > 0) m.start = isoOfDay(w.start);
  if (m.track) m.refill = w.refill;
  if (type === "weekdays") m.weekdays = [0, 1, 2, 3, 4, 5, 6].filter((d) => w.p1 & (1 << d));
  if (type === "cycle") { m.on = w.p1; m.off = w.p2; }
  if (type === "interval") { m.everyHours = w.p1 / 60; m.maxPerDay = w.p2; }
  if (type === "prn") { m.gapHours = w.p1 / 60; m.prnMax = w.p2; }
  return m;
}
