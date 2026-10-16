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

// Scoring and menu terms, generated from Squash Go's own strings.xml files
// (resources-<lang>/strings/strings.xml) so the website always shows exactly
// the terms the watch shows. These spans are marked notranslate;
// applyModeNames() swaps them per selected language.
const MODE_NAMES = {
  "cs": {
    "about": "O aplikaci",
    "ateightall": "Při 8:8",
    "bestof3": "Na 2 vítězné",
    "bestof5": "Na 3 vítězné",
    "bottomstat": "Dolní stat",
    "club": "Klubová zelená",
    "english": "Anglické",
    "gameball": "GAMEBOL",
    "glass": "Skleněný kurt",
    "maple": "Javor",
    "matchball": "MEČBOL",
    "par": "PAR",
    "pastgames": "Minulé hry",
    "pointstowin": "Body k vítězství",
    "refreshlicense": "Obnovit licenci",
    "saveexit": "Uložit a ukončit",
    "scoringrules": "Pravidla skórování",
    "setone": "Set 1 (do 9)",
    "settwo": "Set 2 (do 10)",
    "unlockapp": "Odemknout",
    "warmup": "Rozcvička",
    "winbytwo": "Vítězství o 2"
  },
  "da": {
    "about": "Om",
    "ateightall": "Ved 8-8",
    "bestof3": "Bedst af 3",
    "bestof5": "Bedst af 5",
    "bottomstat": "Nedre stat",
    "club": "Klubgrøn",
    "english": "Engelsk",
    "gameball": "GAMEBOLD",
    "glass": "Glasbane",
    "maple": "Ahorn",
    "matchball": "MATCHBOLD",
    "par": "PAR",
    "pastgames": "Tidligere kampe",
    "pointstowin": "Point for sejr",
    "refreshlicense": "Opdater licens",
    "saveexit": "Gem og afslut",
    "scoringrules": "Pointregler",
    "setone": "Sæt 1 (til 9)",
    "settwo": "Sæt 2 (til 10)",
    "unlockapp": "Lås op",
    "warmup": "Opvarmning",
    "winbytwo": "Vind med 2"
  },
  "de": {
    "about": "Über",
    "ateightall": "Bei 8:8",
    "bestof3": "Best of 3",
    "bestof5": "Best of 5",
    "bottomstat": "Untere Anzeige",
    "club": "Clubgrün",
    "english": "Englisch",
    "gameball": "SATZBALL",
    "glass": "Glascourt",
    "maple": "Ahorn",
    "matchball": "MATCHBALL",
    "par": "PAR",
    "pastgames": "Frühere Spiele",
    "pointstowin": "Punkte zum Sieg",
    "refreshlicense": "Lizenz aktualisieren",
    "saveexit": "Speichern & Beenden",
    "scoringrules": "Zählregeln",
    "setone": "Set 1 (bis 9)",
    "settwo": "Set 2 (bis 10)",
    "unlockapp": "Entsperren",
    "warmup": "Aufwärmen",
    "winbytwo": "Sieg mit 2"
  },
  "en": {
    "about": "About",
    "ateightall": "At 8-all",
    "bestof3": "Best of 3",
    "bestof5": "Best of 5",
    "bottomstat": "Bottom Stat",
    "club": "Club Green",
    "english": "English",
    "gameball": "GAME BALL",
    "glass": "Glass Court",
    "maple": "Maple",
    "matchball": "MATCH BALL",
    "par": "PAR",
    "pastgames": "Past Games",
    "pointstowin": "Points to Win",
    "refreshlicense": "Refresh License",
    "saveexit": "Save & Exit",
    "scoringrules": "Scoring rules",
    "setone": "Set 1 (to 9)",
    "settwo": "Set 2 (to 10)",
    "unlockapp": "Unlock App",
    "warmup": "Warm-Up",
    "winbytwo": "Win by 2"
  },
  "es": {
    "about": "Acerca de",
    "ateightall": "A 8 iguales",
    "bestof3": "Al mejor de 3",
    "bestof5": "Al mejor de 5",
    "bottomstat": "Stat inferior",
    "club": "Verde club",
    "english": "Inglés",
    "gameball": "BOLA DE JUEGO",
    "glass": "Pista de cristal",
    "maple": "Arce",
    "matchball": "BOLA DE PARTIDO",
    "par": "PAR",
    "pastgames": "Partidos anteriores",
    "pointstowin": "Puntos para ganar",
    "refreshlicense": "Actualizar licencia",
    "saveexit": "Guardar y salir",
    "scoringrules": "Reglas de puntuación",
    "setone": "Set 1 (a 9)",
    "settwo": "Set 2 (a 10)",
    "unlockapp": "Desbloquear",
    "warmup": "Calentamiento",
    "winbytwo": "Ganar por 2"
  },
  "fi": {
    "about": "Tietoja",
    "ateightall": "Tilanteessa 8-8",
    "bestof3": "Paras 3:sta",
    "bestof5": "Paras 5:stä",
    "bottomstat": "Alarivi",
    "club": "Klubivihreä",
    "english": "Englanti",
    "gameball": "ERÄPALLO",
    "glass": "Lasikenttä",
    "maple": "Vaahtera",
    "matchball": "OTTELUPALLO",
    "par": "PAR",
    "pastgames": "Aiemmat pelit",
    "pointstowin": "Voittopisteet",
    "refreshlicense": "Päivitä lisenssi",
    "saveexit": "Tallenna ja lopeta",
    "scoringrules": "Pisteytyssäännöt",
    "setone": "Setti 1 (9:ään)",
    "settwo": "Setti 2 (10:een)",
    "unlockapp": "Avaa lukitus",
    "warmup": "Lämmittely",
    "winbytwo": "Voitto 2:lla"
  },
  "fr": {
    "about": "À propos",
    "ateightall": "À 8 partout",
    "bestof3": "Au meilleur de 3",
    "bestof5": "Au meilleur de 5",
    "bottomstat": "Stat bas",
    "club": "Vert club",
    "english": "Anglais",
    "gameball": "BALLE DE JEU",
    "glass": "Court vitré",
    "maple": "Érable",
    "matchball": "BALLE DE MATCH",
    "par": "PAR",
    "pastgames": "Parties passées",
    "pointstowin": "Points pour gagner",
    "refreshlicense": "Actualiser la licence",
    "saveexit": "Enregistrer et quitter",
    "scoringrules": "Règles de score",
    "setone": "Set 1 (à 9)",
    "settwo": "Set 2 (à 10)",
    "unlockapp": "Déverrouiller",
    "warmup": "Échauffement",
    "winbytwo": "Gagner par 2"
  },
  "hu": {
    "about": "Névjegy",
    "ateightall": "8-8-nál",
    "bestof3": "3 játszmás",
    "bestof5": "5 játszmás",
    "bottomstat": "Alsó stat",
    "club": "Klubzöld",
    "english": "Angol",
    "gameball": "JÁTSZMALABDA",
    "glass": "Üvegpálya",
    "maple": "Juhar",
    "matchball": "MECCSLABDA",
    "par": "PAR",
    "pastgames": "Korábbi meccsek",
    "pointstowin": "Nyerő pontszám",
    "refreshlicense": "Licenc frissítése",
    "saveexit": "Mentés és kilépés",
    "scoringrules": "Pontozási szabályok",
    "setone": "1. szett (9-ig)",
    "settwo": "2. szett (10-ig)",
    "unlockapp": "Feloldás",
    "warmup": "Bemelegítés",
    "winbytwo": "2 pont különbség"
  },
  "id": {
    "about": "Tentang",
    "ateightall": "Saat 8-8",
    "bestof3": "Best of 3",
    "bestof5": "Best of 5",
    "bottomstat": "Stat bawah",
    "club": "Hijau klub",
    "english": "Inggris",
    "gameball": "GAME BALL",
    "glass": "Lapangan kaca",
    "maple": "Maple",
    "matchball": "MATCH BALL",
    "par": "PAR",
    "pastgames": "Game Sebelumnya",
    "pointstowin": "Poin untuk menang",
    "refreshlicense": "Perbarui lisensi",
    "saveexit": "Simpan & keluar",
    "scoringrules": "Aturan skor",
    "setone": "Set 1 (ke 9)",
    "settwo": "Set 2 (ke 10)",
    "unlockapp": "Buka Kunci",
    "warmup": "Pemanasan",
    "winbytwo": "Menang selisih 2"
  },
  "it": {
    "about": "Informazioni",
    "ateightall": "Sull'8 pari",
    "bestof3": "Al meglio di 3",
    "bestof5": "Al meglio di 5",
    "bottomstat": "Stat bassa",
    "club": "Verde club",
    "english": "Inglese",
    "gameball": "PALLA GAME",
    "glass": "Campo in vetro",
    "maple": "Acero",
    "matchball": "MATCH POINT",
    "par": "PAR",
    "pastgames": "Partite passate",
    "pointstowin": "Punti per vincere",
    "refreshlicense": "Aggiorna licenza",
    "saveexit": "Salva ed esci",
    "scoringrules": "Regole punteggio",
    "setone": "Set 1 (a 9)",
    "settwo": "Set 2 (a 10)",
    "unlockapp": "Sblocca",
    "warmup": "Riscaldamento",
    "winbytwo": "Vittoria di 2"
  },
  "ja": {
    "about": "アプリ情報",
    "ateightall": "8オール時",
    "bestof3": "3ゲームマッチ",
    "bestof5": "5ゲームマッチ",
    "bottomstat": "下部表示",
    "club": "クラブグリーン",
    "english": "イングリッシュ",
    "gameball": "ゲームボール",
    "glass": "ガラスコート",
    "maple": "メープル",
    "matchball": "マッチボール",
    "par": "PAR",
    "pastgames": "過去の試合",
    "pointstowin": "勝利ポイント",
    "refreshlicense": "ライセンス更新",
    "saveexit": "保存して終了",
    "scoringrules": "スコアルール",
    "setone": "セット1 (9点)",
    "settwo": "セット2 (10点)",
    "unlockapp": "ロック解除",
    "warmup": "ウォームアップ",
    "winbytwo": "2点差で勝利"
  },
  "ko": {
    "about": "정보",
    "ateightall": "8:8일 때",
    "bestof3": "3게임 2선승",
    "bestof5": "5게임 3선승",
    "bottomstat": "하단 통계",
    "club": "클럽 그린",
    "english": "영국식",
    "gameball": "게임 포인트",
    "glass": "유리 코트",
    "maple": "메이플",
    "matchball": "매치 포인트",
    "par": "PAR",
    "pastgames": "지난 경기",
    "pointstowin": "승리 점수",
    "refreshlicense": "라이선스 갱신",
    "saveexit": "저장 후 종료",
    "scoringrules": "점수 규칙",
    "setone": "세트 1 (9점)",
    "settwo": "세트 2 (10점)",
    "unlockapp": "잠금 해제",
    "warmup": "워밍업",
    "winbytwo": "2점 차 승리"
  },
  "nl": {
    "about": "Over",
    "ateightall": "Bij 8-8",
    "bestof3": "Best of 3",
    "bestof5": "Best of 5",
    "bottomstat": "Onderste stat",
    "club": "Clubgroen",
    "english": "Engels",
    "gameball": "GAMEBAL",
    "glass": "Glazen baan",
    "maple": "Esdoorn",
    "matchball": "MATCHBAL",
    "par": "PAR",
    "pastgames": "Eerdere games",
    "pointstowin": "Punten om te winnen",
    "refreshlicense": "Licentie vernieuwen",
    "saveexit": "Opslaan & sluiten",
    "scoringrules": "Telregels",
    "setone": "Set 1 (tot 9)",
    "settwo": "Set 2 (tot 10)",
    "unlockapp": "Ontgrendelen",
    "warmup": "Warming-up",
    "winbytwo": "Win met 2"
  },
  "no": {
    "about": "Om",
    "ateightall": "Ved 8-8",
    "bestof3": "Best av 3",
    "bestof5": "Best av 5",
    "bottomstat": "Nedre stat",
    "club": "Klubbgrønn",
    "english": "Engelsk",
    "gameball": "GAMEBALL",
    "glass": "Glassbane",
    "maple": "Lønn",
    "matchball": "MATCHBALL",
    "par": "PAR",
    "pastgames": "Tidligere kamper",
    "pointstowin": "Poeng for seier",
    "refreshlicense": "Oppdater lisens",
    "saveexit": "Lagre og avslutt",
    "scoringrules": "Poengregler",
    "setone": "Sett 1 (til 9)",
    "settwo": "Sett 2 (til 10)",
    "unlockapp": "Lås opp",
    "warmup": "Oppvarming",
    "winbytwo": "Vinn med 2"
  },
  "pl": {
    "about": "O aplikacji",
    "ateightall": "Przy 8:8",
    "bestof3": "Do 2 wygranych",
    "bestof5": "Do 3 wygranych",
    "bottomstat": "Dolna stat",
    "club": "Klubowa zieleń",
    "english": "Angielski",
    "gameball": "PIŁKA GEMOWA",
    "glass": "Kort szklany",
    "maple": "Klon",
    "matchball": "PIŁKA MECZOWA",
    "par": "PAR",
    "pastgames": "Poprzednie gry",
    "pointstowin": "Punkty do wygranej",
    "refreshlicense": "Odśwież licencję",
    "saveexit": "Zapisz i wyjdź",
    "scoringrules": "Zasady punktacji",
    "setone": "Set 1 (do 9)",
    "settwo": "Set 2 (do 10)",
    "unlockapp": "Odblokuj",
    "warmup": "Rozgrzewka",
    "winbytwo": "Wygrana o 2"
  },
  "pt-BR": {
    "about": "Sobre",
    "ateightall": "Aos 8 iguais",
    "bestof3": "Melhor de 3",
    "bestof5": "Melhor de 5",
    "bottomstat": "Stat inferior",
    "club": "Verde clube",
    "english": "Inglês",
    "gameball": "BOLA DE GAME",
    "glass": "Quadra de vidro",
    "maple": "Bordo",
    "matchball": "BOLA DE PARTIDA",
    "par": "PAR",
    "pastgames": "Jogos anteriores",
    "pointstowin": "Pontos para vencer",
    "refreshlicense": "Atualizar licença",
    "saveexit": "Salvar e sair",
    "scoringrules": "Regras de pontuação",
    "setone": "Set 1 (até 9)",
    "settwo": "Set 2 (até 10)",
    "unlockapp": "Desbloquear",
    "warmup": "Aquecimento",
    "winbytwo": "Vencer por 2"
  },
  "pt-PT": {
    "about": "Acerca de",
    "ateightall": "Aos 8 iguais",
    "bestof3": "Melhor de 3",
    "bestof5": "Melhor de 5",
    "bottomstat": "Stat inferior",
    "club": "Verde clube",
    "english": "Inglês",
    "gameball": "BOLA DE JOGO",
    "glass": "Campo de vidro",
    "maple": "Ácer",
    "matchball": "BOLA DE PARTIDA",
    "par": "PAR",
    "pastgames": "Jogos anteriores",
    "pointstowin": "Pontos para ganhar",
    "refreshlicense": "Atualizar licença",
    "saveexit": "Guardar e sair",
    "scoringrules": "Regras de pontuação",
    "setone": "Set 1 (até 9)",
    "settwo": "Set 2 (até 10)",
    "unlockapp": "Desbloquear",
    "warmup": "Aquecimento",
    "winbytwo": "Ganhar por 2"
  },
  "sv": {
    "about": "Om",
    "ateightall": "Vid 8-8",
    "bestof3": "Bäst av 3",
    "bestof5": "Bäst av 5",
    "bottomstat": "Nedre stat",
    "club": "Klubbgrön",
    "english": "Engelsk",
    "gameball": "GAMEBOLL",
    "glass": "Glasbana",
    "maple": "Lönn",
    "matchball": "MATCHBOLL",
    "par": "PAR",
    "pastgames": "Tidigare matcher",
    "pointstowin": "Poäng för vinst",
    "refreshlicense": "Uppdatera licens",
    "saveexit": "Spara och avsluta",
    "scoringrules": "Poängregler",
    "setone": "Set 1 (till 9)",
    "settwo": "Set 2 (till 10)",
    "unlockapp": "Lås upp",
    "warmup": "Uppvärmning",
    "winbytwo": "Vinn med 2"
  },
  "th": {
    "about": "เกี่ยวกับ",
    "ateightall": "ที่ 8 เท่า",
    "bestof3": "ชนะ 2 ใน 3",
    "bestof5": "ชนะ 3 ใน 5",
    "bottomstat": "สถิติล่าง",
    "club": "เขียวคลับ",
    "english": "แบบอังกฤษ",
    "gameball": "เกมบอล",
    "glass": "คอร์ตกระจก",
    "maple": "เมเปิล",
    "matchball": "แมตช์บอล",
    "par": "PAR",
    "pastgames": "เกมที่ผ่านมา",
    "pointstowin": "แต้มที่ต้องชนะ",
    "refreshlicense": "รีเฟรชใบอนุญาต",
    "saveexit": "บันทึกและออก",
    "scoringrules": "กติกาการนับแต้ม",
    "setone": "เซ็ต 1 (ถึง 9)",
    "settwo": "เซ็ต 2 (ถึง 10)",
    "unlockapp": "ปลดล็อก",
    "warmup": "วอร์มอัป",
    "winbytwo": "ชนะด้วย 2 แต้ม"
  },
  "zh-CN": {
    "about": "关于",
    "ateightall": "8平时",
    "bestof3": "三局两胜",
    "bestof5": "五局三胜",
    "bottomstat": "底部统计",
    "club": "俱乐部绿",
    "english": "英式",
    "gameball": "局点",
    "glass": "玻璃场",
    "maple": "枫木",
    "matchball": "赛点",
    "par": "PAR",
    "pastgames": "历史对局",
    "pointstowin": "获胜分数",
    "refreshlicense": "刷新许可证",
    "saveexit": "保存并退出",
    "scoringrules": "计分规则",
    "setone": "Set 1 (至9分)",
    "settwo": "Set 2 (至10分)",
    "unlockapp": "解锁",
    "warmup": "热身",
    "winbytwo": "净胜2分"
  },
  "zh-TW": {
    "about": "關於",
    "ateightall": "8平時",
    "bestof3": "三局兩勝",
    "bestof5": "五局三勝",
    "bottomstat": "底部統計",
    "club": "俱樂部綠",
    "english": "英式",
    "gameball": "局點",
    "glass": "玻璃場",
    "maple": "楓木",
    "matchball": "賽點",
    "par": "PAR",
    "pastgames": "歷史對局",
    "pointstowin": "獲勝分數",
    "refreshlicense": "重新整理授權",
    "saveexit": "儲存並退出",
    "scoringrules": "計分規則",
    "setone": "Set 1 (至9分)",
    "settwo": "Set 2 (至10分)",
    "unlockapp": "解鎖",
    "warmup": "熱身",
    "winbytwo": "淨勝2分"
  }
};

const STORAGE_KEY = "squash-lang";
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
