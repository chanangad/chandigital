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

const STORAGE_KEY = "rallypoint-lang";
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

function setLang(code) {
  const previous = getStoredLang();
  storeLang(code);
  updatePickerSelection(code);
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
  injectGoogleTranslate();
});
