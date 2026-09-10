const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "cs", label: "Čeština" },
  { code: "da", label: "Dansk" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "fi", label: "Suomi" },
  { code: "fr", label: "Français" },
  { code: "hu", label: "Magyar" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "it", label: "Italiano" },
  { code: "ko", label: "한국어" },
  { code: "nl", label: "Nederlands" },
  { code: "no", label: "Norsk" },
  { code: "ja", label: "日本語" },
  { code: "pl", label: "Polski" },
  // Google Translate exposes Portuguese as a single language code.
  { code: "pt-BR", label: "Português (Brasil)", translateCode: "pt" },
  { code: "pt-PT", label: "Português (Portugal)", translateCode: "pt" },
  { code: "sv", label: "Svenska" },
  { code: "th", label: "ไทย" },
  { code: "zh-CN", label: "简体中文" },
  { code: "zh-TW", label: "繁體中文" }
];

// Scoring-setting names, generated from the app's own strings.xml files so
// the website always shows exactly the terms the watch shows. The cells are
// marked notranslate; applyModeNames() swaps them per selected language.
const MODE_NAMES = {
  "cs": {
    "f1set": "1 set",
    "fbo3": "Nejlepší z 3",
    "fbo5": "Nejlepší z 5",
    "ftb10": "TB to 10",
    "ftb3": "Tiebreak 3.",
    "ftb7": "TB to 7",
    "menuFormat": "Formát",
    "menuScoring": "Skóre",
    "menuSetStyle": "Typ setu",
    "noad": "Bez výhody",
    "standard": "Standardní",
    "style4": "4 hry",
    "style6": "6 her"
  },
  "da": {
    "f1set": "1 sæt",
    "fbo3": "Bedst af 3",
    "fbo5": "Bedst af 5",
    "ftb10": "TB to 10",
    "ftb3": "Tiebreak 3.",
    "ftb7": "TB to 7",
    "menuFormat": "Format",
    "menuScoring": "Scoring",
    "menuSetStyle": "Sættype",
    "noad": "Uden fordel",
    "standard": "Standard",
    "style4": "4 partier",
    "style6": "6 partier"
  },
  "de": {
    "f1set": "1 Satz",
    "fbo3": "Best of 3",
    "fbo5": "Best of 5",
    "ftb10": "TB to 10",
    "ftb3": "Tiebreak 3.",
    "ftb7": "TB to 7",
    "menuFormat": "Format",
    "menuScoring": "Zählweise",
    "menuSetStyle": "Satz-Typ",
    "noad": "Ohne Vorteil",
    "standard": "Standard",
    "style4": "4 Spiele",
    "style6": "6 Spiele"
  },
  "en": {
    "f1set": "1 Set",
    "fbo3": "Best of 3",
    "fbo5": "Best of 5",
    "ftb10": "TB to 10",
    "ftb3": "Tiebreak 3rd",
    "ftb7": "TB to 7",
    "menuFormat": "Format",
    "menuScoring": "Scoring",
    "menuSetStyle": "Set Style",
    "noad": "No-Ad",
    "standard": "Standard",
    "style4": "4-Game",
    "style6": "6-Game"
  },
  "es": {
    "f1set": "1 set",
    "fbo3": "Al mejor de 3",
    "fbo5": "Al mejor de 5",
    "ftb10": "TB to 10",
    "ftb3": "Tiebreak 3.º",
    "ftb7": "TB to 7",
    "menuFormat": "Formato",
    "menuScoring": "Puntuación",
    "menuSetStyle": "Tipo de set",
    "noad": "Sin ventaja",
    "standard": "Estándar",
    "style4": "4 juegos",
    "style6": "6 juegos"
  },
  "fi": {
    "f1set": "1 erä",
    "fbo3": "Paras 3:sta",
    "fbo5": "Paras 5:sta",
    "ftb10": "TB to 10",
    "ftb3": "Tiebreak 3.",
    "ftb7": "TB to 7",
    "menuFormat": "Muoto",
    "menuScoring": "Pisteytys",
    "menuSetStyle": "Erätyyppi",
    "noad": "Ei etua",
    "standard": "Vakio",
    "style4": "4 peliä",
    "style6": "6 peliä"
  },
  "fr": {
    "f1set": "1 set",
    "fbo3": "Au meilleur de 3",
    "fbo5": "Au meilleur de 5",
    "ftb10": "TB to 10",
    "ftb3": "Tie-break 3e",
    "ftb7": "TB to 7",
    "menuFormat": "Format",
    "menuScoring": "Comptage",
    "menuSetStyle": "Type de set",
    "noad": "Sans avantage",
    "standard": "Standard",
    "style4": "4 jeux",
    "style6": "6 jeux"
  },
  "hu": {
    "f1set": "1 szett",
    "fbo3": "Legjobb 3-ból",
    "fbo5": "Legjobb 5-ből",
    "ftb10": "TB to 10",
    "ftb3": "Tiebreak 3.",
    "ftb7": "TB to 7",
    "menuFormat": "Formátum",
    "menuScoring": "Számolás",
    "menuSetStyle": "Szett típusa",
    "noad": "Előny nélkül",
    "standard": "Normál",
    "style4": "4 játék",
    "style6": "6 játék"
  },
  "id": {
    "f1set": "1 set",
    "fbo3": "Terbaik dari 3",
    "fbo5": "Terbaik dari 5",
    "ftb10": "TB to 10",
    "ftb3": "Tiebreak ke-3",
    "ftb7": "TB to 7",
    "menuFormat": "Format",
    "menuScoring": "Penilaian",
    "menuSetStyle": "Jenis Set",
    "noad": "Tanpa Ad",
    "standard": "Standar",
    "style4": "4 gim",
    "style6": "6 gim"
  },
  "it": {
    "f1set": "1 set",
    "fbo3": "Al meglio di 3",
    "fbo5": "Al meglio di 5",
    "ftb10": "TB to 10",
    "ftb3": "Tiebreak 3°",
    "ftb7": "TB to 7",
    "menuFormat": "Formato",
    "menuScoring": "Punteggio",
    "menuSetStyle": "Tipo di set",
    "noad": "Senza vantaggi",
    "standard": "Standard",
    "style4": "4 game",
    "style6": "6 game"
  },
  "ja": {
    "f1set": "1セット",
    "fbo3": "3セットマッチ",
    "fbo5": "5セットマッチ",
    "ftb10": "TB to 10",
    "ftb3": "3セット目TB",
    "ftb7": "TB to 7",
    "menuFormat": "形式",
    "menuScoring": "採点",
    "menuSetStyle": "セット形式",
    "noad": "ノーアド",
    "standard": "標準",
    "style4": "4ゲーム",
    "style6": "6ゲーム"
  },
  "ko": {
    "f1set": "1세트",
    "fbo3": "3판 2선승",
    "fbo5": "5판 3선승",
    "ftb10": "TB to 10",
    "ftb3": "3세트 타이브레이크",
    "ftb7": "TB to 7",
    "menuFormat": "형식",
    "menuScoring": "채점",
    "menuSetStyle": "세트 방식",
    "noad": "노애드",
    "standard": "표준",
    "style4": "4게임",
    "style6": "6게임"
  },
  "nl": {
    "f1set": "1 set",
    "fbo3": "Best of 3",
    "fbo5": "Best of 5",
    "ftb10": "TB to 10",
    "ftb3": "Tiebreak 3e",
    "ftb7": "TB to 7",
    "menuFormat": "Formaat",
    "menuScoring": "Telling",
    "menuSetStyle": "Settype",
    "noad": "Geen voordeel",
    "standard": "Standaard",
    "style4": "4 games",
    "style6": "6 games"
  },
  "no": {
    "f1set": "1 sett",
    "fbo3": "Best av 3",
    "fbo5": "Best av 5",
    "ftb10": "TB to 10",
    "ftb3": "Tiebreak 3.",
    "ftb7": "TB to 7",
    "menuFormat": "Format",
    "menuScoring": "Poeng",
    "menuSetStyle": "Sett-type",
    "noad": "Uten fordel",
    "standard": "Standard",
    "style4": "4 game",
    "style6": "6 game"
  },
  "pl": {
    "f1set": "1 set",
    "fbo3": "Najlepszy z 3",
    "fbo5": "Najlepszy z 5",
    "ftb10": "TB to 10",
    "ftb3": "Tiebreak 3.",
    "ftb7": "TB to 7",
    "menuFormat": "Format",
    "menuScoring": "Punktacja",
    "menuSetStyle": "Typ seta",
    "noad": "Bez przewagi",
    "standard": "Standard",
    "style4": "4 gemy",
    "style6": "6 gemów"
  },
  "pt-BR": {
    "f1set": "1 set",
    "fbo3": "Melhor de 3",
    "fbo5": "Melhor de 5",
    "ftb10": "TB to 10",
    "ftb3": "Tiebreak 3º",
    "ftb7": "TB to 7",
    "menuFormat": "Formato",
    "menuScoring": "Pontuação",
    "menuSetStyle": "Tipo de set",
    "noad": "Sem vantagem",
    "standard": "Padrão",
    "style4": "4 games",
    "style6": "6 games"
  },
  "pt-PT": {
    "f1set": "1 set",
    "fbo3": "Melhor de 3",
    "fbo5": "Melhor de 5",
    "ftb10": "TB to 10",
    "ftb3": "Tiebreak 3.º",
    "ftb7": "TB to 7",
    "menuFormat": "Formato",
    "menuScoring": "Pontuação",
    "menuSetStyle": "Tipo de set",
    "noad": "Sem vantagem",
    "standard": "Padrão",
    "style4": "4 jogos",
    "style6": "6 jogos"
  },
  "sv": {
    "f1set": "1 set",
    "fbo3": "Bäst av 3",
    "fbo5": "Bäst av 5",
    "ftb10": "TB to 10",
    "ftb3": "Tiebreak 3:e",
    "ftb7": "TB to 7",
    "menuFormat": "Format",
    "menuScoring": "Poäng",
    "menuSetStyle": "Set-typ",
    "noad": "Utan fördel",
    "standard": "Standard",
    "style4": "4 gem",
    "style6": "6 gem"
  },
  "th": {
    "f1set": "1 เซต",
    "fbo3": "ดีที่สุดใน 3",
    "fbo5": "ดีที่สุดใน 5",
    "ftb10": "TB to 10",
    "ftb3": "ไทเบรกเซต 3",
    "ftb7": "TB to 7",
    "menuFormat": "รูปแบบ",
    "menuScoring": "การนับแต้ม",
    "menuSetStyle": "ชนิดเซต",
    "noad": "ไม่มีแอด",
    "standard": "มาตรฐาน",
    "style4": "4 เกม",
    "style6": "6 เกม"
  },
  "zh-CN": {
    "f1set": "1盘",
    "fbo3": "三盘两胜",
    "fbo5": "五盘三胜",
    "ftb10": "TB to 10",
    "ftb3": "第三盘抢十",
    "ftb7": "TB to 7",
    "menuFormat": "赛制",
    "menuScoring": "计分",
    "menuSetStyle": "盘制",
    "noad": "无占先",
    "standard": "标准",
    "style4": "4局",
    "style6": "6局"
  },
  "zh-TW": {
    "f1set": "1盤",
    "fbo3": "三盤兩勝",
    "fbo5": "五盤三勝",
    "ftb10": "TB to 10",
    "ftb3": "第三盤搶十",
    "ftb7": "TB to 7",
    "menuFormat": "賽制",
    "menuScoring": "計分",
    "menuSetStyle": "盤制",
    "noad": "無占先",
    "standard": "標準",
    "style4": "4局",
    "style6": "6局"
  }
};

const STORAGE_KEY = "tennis-lang";
const GOOGLE_LANG_CODES = LANGUAGES
  .filter((l) => l.code !== "en")
  .map((l) => l.translateCode || l.code)
  .filter((code, index, allCodes) => allCodes.indexOf(code) === index);

function getLangMeta(code) {
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
}

function getStoredLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && LANGUAGES.some((l) => l.code === stored)) return stored;
  } catch (e) {
    // localStorage may be blocked; fall through
  }
  return "en";
}

function storeLang(code) {
  try {
    if (code === "en") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, code);
  } catch (e) {
    // ignore
  }
}

function findGoogleSelect() {
  return document.querySelector("select.goog-te-combo");
}

function waitFor(predicate, timeoutMs) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    (function check() {
      const value = predicate();
      if (value) return resolve(value);
      if (Date.now() - start > timeoutMs) return reject(new Error("timeout"));
      setTimeout(check, 80);
    })();
  });
}

async function applyLanguage(code) {
  const meta = getLangMeta(code);
  const targetCode = code === "en" ? "" : meta.translateCode || meta.code;
  let select;
  try {
    select = await waitFor(findGoogleSelect, 8000);
  } catch (err) {
    return;
  }
  if (select.value === targetCode) return;
  select.value = targetCode;
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

function clearGoogleTranslateCookie() {
  const host = window.location.hostname;
  const candidates = ["", host, "." + host];
  if (host && host.includes(".")) {
    candidates.push("." + host.split(".").slice(-2).join("."));
  }
  candidates.forEach((domain) => {
    let cookie = "googtrans=; path=/; max-age=0";
    if (domain) cookie += `; domain=${domain}`;
    document.cookie = cookie;
  });
}


function applyModeNames(code) {
  const names = MODE_NAMES[code] || MODE_NAMES.en;
  document.querySelectorAll("[data-mode-name]").forEach((el) => {
    const name = names[el.dataset.modeName];
    if (name) el.textContent = name;
  });
}

function setLang(code) {
  const previous = getStoredLang();
  storeLang(code);
  updatePickerSelection(code);
  applyModeNames(code);
  if (code === "en" && previous !== "en") {
    // Google's TranslateElement sets a googtrans cookie on change events,
    // which would auto-re-translate on reload. Clear it before reloading.
    clearGoogleTranslateCookie();
    window.location.reload();
    return;
  }
  applyLanguage(code);
}

function updatePickerSelection(code) {
  document.querySelectorAll(".lang-option").forEach((opt) => {
    opt.classList.toggle("lang-option--active", opt.dataset.lang === code);
    opt.setAttribute("aria-checked", opt.dataset.lang === code ? "true" : "false");
  });
  const label = document.querySelector("[data-lang-current]");
  if (label) {
    const meta = getLangMeta(code);
    label.textContent = meta.label;
  }
}

function googleTranslateElementInit() {
  // eslint-disable-next-line no-undef
  new google.translate.TranslateElement(
    {
      pageLanguage: "en",
      includedLanguages: GOOGLE_LANG_CODES.join(","),
      autoDisplay: false
    },
    "google_translate_element"
  );
  const stored = getStoredLang();
  if (stored !== "en") {
    applyLanguage(stored);
  }
}
window.googleTranslateElementInit = googleTranslateElementInit;

function buildLangPicker() {
  const root = document.querySelector("[data-lang-picker]");
  if (!root) return;

  const current = getStoredLang();
  const currentMeta = getLangMeta(current);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "lang-button notranslate";
  button.setAttribute("translate", "no");
  button.setAttribute("aria-haspopup", "true");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-label", "Select language");
  button.innerHTML = `
    <svg class="lang-button__icon" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
    <span class="lang-button__label" data-lang-current>${currentMeta.label}</span>
    <svg class="lang-button__chevron" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `;

  const panel = document.createElement("div");
  panel.className = "lang-panel notranslate";
  panel.setAttribute("translate", "no");
  panel.setAttribute("role", "menu");
  panel.hidden = true;

  const search = document.createElement("div");
  search.className = "lang-search";
  search.innerHTML = `
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
    <input type="text" class="lang-search__input" placeholder="Search language" aria-label="Search language" autocomplete="off" spellcheck="false">
  `;
  const searchInput = search.querySelector(".lang-search__input");

  const list = document.createElement("div");
  list.className = "lang-list";

  const checkSvg = `<svg class="lang-option__check" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

  LANGUAGES.forEach(({ code, label }) => {
    const opt = document.createElement("button");
    opt.type = "button";
    opt.className = "lang-option" + (code === current ? " lang-option--active" : "");
    opt.dataset.lang = code;
    opt.dataset.search = label.toLowerCase();
    opt.setAttribute("role", "menuitemradio");
    opt.setAttribute("aria-checked", code === current ? "true" : "false");
    opt.innerHTML = `<span class="lang-option__label">${label}</span>${checkSvg}`;
    opt.addEventListener("click", () => {
      closePanel();
      if (code === getStoredLang()) return;
      setLang(code);
    });
    list.appendChild(opt);
  });

  panel.appendChild(search);
  panel.appendChild(list);

  function openPanel() {
    panel.hidden = false;
    root.classList.add("lang-picker--open");
    button.setAttribute("aria-expanded", "true");
    searchInput.value = "";
    filterOptions("");
    requestAnimationFrame(() => searchInput.focus());
  }

  function closePanel() {
    panel.hidden = true;
    root.classList.remove("lang-picker--open");
    button.setAttribute("aria-expanded", "false");
  }

  function filterOptions(query) {
    const q = query.trim().toLowerCase();
    list.querySelectorAll(".lang-option").forEach((opt) => {
      opt.hidden = q !== "" && opt.dataset.search.indexOf(q) === -1;
    });
  }

  searchInput.addEventListener("input", (e) => filterOptions(e.target.value));
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const firstVisible = list.querySelector(".lang-option:not([hidden])");
      if (firstVisible) firstVisible.click();
    }
  });

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    if (panel.hidden) { openPanel(); } else { closePanel(); }
  });

  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) closePanel();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) {
      closePanel();
      button.focus();
    }
  });

  root.appendChild(button);
  root.appendChild(panel);
}

function injectGoogleTranslate() {
  if (document.getElementById("google_translate_script")) return;
  if (!document.getElementById("google_translate_element")) {
    const host = document.createElement("div");
    host.id = "google_translate_element";
    host.setAttribute("aria-hidden", "true");
    document.body.appendChild(host);
  }

  const script = document.createElement("script");
  script.id = "google_translate_script";
  script.src =
    "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);
}

document.addEventListener("DOMContentLoaded", () => {
  buildLangPicker();
  applyModeNames(getStoredLang());
  injectGoogleTranslate();
});
