/**
 * Interface strings, and the helpers that put a page in one language.
 *
 * Every page exists twice — `/dua/…` in English and `/dua/tr/…` in Turkish —
 * and is rendered in its language on the server. The earlier version swapped
 * text in the browser after load, which meant search engines only ever saw
 * English and a Turkish reader saw English first, then a flash.
 *
 * Content strings (titles, occasions, situations) ship with both languages in
 * the data and are picked with `pick()`. This file holds the chrome.
 */

export type Lang = "en" | "tr";
export const LANGS: Lang[] = ["en", "tr"];

type Dict = Record<string, Record<Lang, string>>;

export const UI = {
  siteName: { en: "The Duʿāʾ of the Prophets", tr: "Peygamberlerin Duaları" },
  siteShort: { en: "Duʿāʾ of the Prophets", tr: "Peygamberlerin Duaları" },
  tagline: {
    en: "What the Prophets said to their Lord — and what they were facing when they said it.",
    tr: "Peygamberlerin Rablerine ne söylediği — ve bunu söylerken neyle karşı karşıya oldukları.",
  },

  /* navigation */
  navToday: { en: "Today", tr: "Bugün" },
  navNeed: { en: "By need", tr: "İhtiyaca göre" },
  navDay: { en: "Through the day", tr: "Gün boyu" },
  navProphets: { en: "Prophets", tr: "Peygamberler" },
  navSearch: { en: "Search", tr: "Ara" },
  navMine: { en: "Mine", tr: "Benim" },
  navAbout: { en: "About", tr: "Hakkında" },
  navSettings: { en: "Settings", tr: "Ayarlar" },
  skip: { en: "Skip to content", tr: "İçeriğe geç" },
  otherLang: { en: "Türkçe", tr: "English" },
  otherLangLabel: { en: "Bu sayfayı Türkçe aç", tr: "Open this page in English" },

  /* home */
  todayLabel: { en: "Duʿāʾ of the day", tr: "Günün duası" },
  todayNow: { en: "For this time of day", tr: "Günün bu vakti için" },
  continueReading: { en: "Continue where you left off", tr: "Kaldığınız yerden devam edin" },
  homeNeed: { en: "I need words for…", tr: "Şunun için söz arıyorum…" },
  homeProphets: { en: "By prophet", tr: "Peygambere göre" },
  homeDay: { en: "Through the day", tr: "Gün boyu" },
  homeDayLede: {
    en: "What the Prophet ﷺ said on waking, leaving the house, eating, travelling and lying down.",
    tr: "Peygamber'in ﷺ uyanırken, evden çıkarken, yemek yerken, yolculukta ve yatarken söyledikleri.",
  },
  homeLists: { en: "Your lists", tr: "Listeleriniz" },
  homeListsEmpty: {
    en: "Make a list — “Morning”, “For my parents” — and read it straight through each day.",
    tr: "Bir liste oluşturun —“Sabah”, “Anne babam için”— ve her gün baştan sona okuyun.",
  },
  allThemes: { en: "All sixteen", tr: "Hepsi" },
  allProphets: { en: "All prophets", tr: "Bütün peygamberler" },
  countLine: {
    en: "{q} from the Qurʾān · {h} from the Sunnah",
    tr: "{q} Kur'ân'dan · {h} Sünnet'ten",
  },

  /* moments */
  "moment-waking": { en: "On waking", tr: "Uyanınca" },
  "moment-morning-evening": { en: "Morning and evening", tr: "Sabah ve akşam" },
  "moment-leaving-home": { en: "Leaving the house", tr: "Evden çıkarken" },
  "moment-mosque": { en: "At the mosque", tr: "Mescitte" },
  "moment-after-prayer": { en: "After the prayer", tr: "Namazdan sonra" },
  "moment-eating": { en: "After eating", tr: "Yemekten sonra" },
  "moment-travel": { en: "Travelling", tr: "Yolculukta" },
  "moment-rain": { en: "When it rains", tr: "Yağmur yağınca" },
  "moment-illness": { en: "Pain and illness", tr: "Ağrı ve hastalık" },
  "moment-distress": { en: "In anguish", tr: "Sıkıntı anında" },
  "moment-sleep": { en: "Going to sleep", tr: "Uyumadan önce" },
  dayTitle: { en: "Through the day", tr: "Gün boyu" },
  dayLede: {
    en: "Each of these is tied to its moment by the narration itself — not by this site.",
    tr: "Bunların her biri, bu site tarafından değil, rivayetin kendisi tarafından o âna bağlanmıştır.",
  },

  /* duʿāʾ page */
  secWhenWhy: { en: "When and why it was said", tr: "Ne zaman ve niçin söylendi" },
  secReflection: { en: "Reflection", tr: "Değerlendirme" },
  reflectionByline: {
    en: "Editorial note — not a transmitted narration",
    tr: "Editör notu — rivayet edilmiş bir bilgi değildir",
  },
  secSaidWhen: { en: "You might turn to it", tr: "Okunabileceği hâller" },
  secThemes: { en: "Themes", tr: "Konular" },
  secNear: { en: "Near this", tr: "Buna yakın olanlar" },
  secCommentary: { en: "Commentary", tr: "Tefsir" },
  commentaryEnglishOnly: {
    en: "",
    tr: "Bu tefsirin yalnızca İngilizce çevirisi bulunduğu için İngilizce verilmiştir.",
  },
  tafsirCite: { en: "Translated by {t}.", tr: "Çeviri: {t}." },
  secSource: { en: "Source", tr: "Kaynak" },
  secGrading: { en: "Grading", tr: "Derece" },
  secExtent: { en: "Extent", tr: "Kapsam" },
  secTranslation: { en: "Translation", tr: "Çeviri" },
  extentNote: {
    en: "Part of a longer āyah. The supplication is in full ink; the rest is dimmed.",
    tr: "Daha uzun bir âyetin parçası. Dua koyu, âyetin geri kalanı soluk gösterilir.",
  },
  extentHadith: {
    en: "The supplication only; the narration around it is in the occasion below.",
    tr: "Yalnızca dua; etrafındaki rivayet aşağıdaki açıklamadadır.",
  },
  creditProject: { en: "project translation", tr: "proje çevirisi" },
  creditDraft: { en: "project translation, not yet reviewed", tr: "proje çevirisi, henüz gözden geçirilmedi" },
  surah: { en: "Sūrat {n}", tr: "{n} Sûresi" },
  langEn: { en: "English", tr: "İngilizce" },
  langTr: { en: "Turkish", tr: "Türkçe" },
  formStatement: {
    en: "Grammatically a statement rather than a supplication, though widely said as one.",
    tr: "Dilbilgisi açısından bir dua değil, bir ifadedir; yine de yaygın olarak dua gibi söylenir.",
  },
  formIstiadhaMaryam: {
    en: "A seeking of refuge, addressed to the one before her rather than a petition to Allah.",
    tr: "Karşısındakine yöneltilmiş bir sığınma sözüdür; Allah'tan bir şey istemek değildir.",
  },

  /* actions */
  actListen: { en: "Listen", tr: "Dinle" },
  actPause: { en: "Pause", tr: "Durdur" },
  actRead: { en: "Reading mode", tr: "Okuma modu" },
  actShare: { en: "Share", tr: "Paylaş" },
  actSave: { en: "Save", tr: "Kaydet" },
  actSaved: { en: "Saved", tr: "Kaydedildi" },
  actCopy: { en: "Copy", tr: "Kopyala" },
  actReport: { en: "Report a mistake", tr: "Hata bildir" },
  addToList: { en: "Add to a list", tr: "Listeye ekle" },
  newList: { en: "New list", tr: "Yeni liste" },
  newListPrompt: { en: "Name the list", tr: "Listeye bir ad verin" },
  copied: { en: "Copied, with its source.", tr: "Kaynağıyla birlikte kopyalandı." },
  copyFailed: { en: "Copy failed — select the text instead.", tr: "Kopyalanamadı — metni seçin." },
  savedToast: { en: "Saved.", tr: "Kaydedildi." },
  removedToast: { en: "Removed.", tr: "Kaldırıldı." },
  audioNeedsNet: { en: "Recitation needs a connection.", tr: "Tilavet için internet bağlantısı gerekir." },
  audioBy: { en: "Recited by Mishary Rashid Alafasy", tr: "Okuyan: Mişari Raşid el-Afasi" },
  shareMaking: { en: "Making the image…", tr: "Görsel hazırlanıyor…" },
  close: { en: "Close", tr: "Kapat" },

  /* reader */
  readerPrev: { en: "Previous", tr: "Önceki" },
  readerNext: { en: "Next", tr: "Sonraki" },
  readerMemorise: { en: "Memorise", tr: "Ezberle" },
  readerHideAll: { en: "Hide words", tr: "Kelimeleri gizle" },
  readerFirstLetters: { en: "First letters", tr: "İlk harfler" },
  readerShowAll: { en: "Show all", tr: "Hepsini göster" },
  readerTapHint: {
    en: "Tap a hidden word to reveal it.",
    tr: "Gizli bir kelimeyi göstermek için üzerine dokunun.",
  },
  readerTranslation: { en: "Translation", tr: "Çeviri" },
  readerOf: { en: "{i} of {n}", tr: "{i} / {n}" },
  readerEmpty: { en: "Nothing to read here yet.", tr: "Burada henüz okunacak bir şey yok." },
  readerOpen: { en: "Open full page", tr: "Sayfasını aç" },

  /* mine */
  mineTitle: { en: "Mine", tr: "Benim" },
  mineLede: {
    en: "Everything here stays on this device. Nothing is sent anywhere.",
    tr: "Buradaki her şey bu cihazda kalır. Hiçbir yere gönderilmez.",
  },
  mineSaved: { en: "Saved", tr: "Kaydettiklerim" },
  mineSavedEmpty: {
    en: "Nothing saved yet. The Save button on any duʿāʾ keeps it here.",
    tr: "Henüz bir şey kaydedilmedi. Herhangi bir duadaki Kaydet düğmesi onu burada tutar.",
  },
  mineLists: { en: "Lists", tr: "Listeler" },
  mineReadAll: { en: "Read through", tr: "Baştan sona oku" },
  mineRename: { en: "Rename", tr: "Yeniden adlandır" },
  mineDelete: { en: "Delete", tr: "Sil" },
  mineDeleteConfirm: { en: "Delete this list?", tr: "Bu liste silinsin mi?" },
  mineUp: { en: "Move up", tr: "Yukarı taşı" },
  mineDown: { en: "Move down", tr: "Aşağı taşı" },
  mineRemove: { en: "Remove", tr: "Çıkar" },
  mineRecent: { en: "Recently read", tr: "Son okunanlar" },
  mineBackup: { en: "Keep your data safe", tr: "Verilerinizi koruyun" },
  mineBackupLede: {
    en: "Browsers can clear a site's storage — Safari does so after seven days without a visit unless the site is on your home screen. Download a backup now and then, and add the site to your home screen.",
    tr: "Tarayıcılar bir sitenin verilerini silebilir — Safari, site ana ekrana eklenmemişse yedi gün ziyaret edilmediğinde siler. Ara sıra yedek indirin ve siteyi ana ekranınıza ekleyin.",
  },
  mineExport: { en: "Download backup", tr: "Yedeği indir" },
  mineImport: { en: "Restore from backup", tr: "Yedekten geri yükle" },
  mineImported: { en: "Restored.", tr: "Geri yüklendi." },
  mineImportFailed: { en: "That file is not a backup from this site.", tr: "Bu dosya bu sitenin bir yedeği değil." },
  minePersisted: { en: "This browser has agreed to keep your data.", tr: "Bu tarayıcı verilerinizi saklamayı kabul etti." },
  mineReminder: { en: "A daily reminder", tr: "Günlük hatırlatıcı" },
  mineReminderLede: {
    en: "Adds a daily event to your phone's calendar that opens today's duʿāʾ. Works on every phone, needs no account, and you can delete it like any other event.",
    tr: "Telefonunuzun takvimine, günün duasını açan günlük bir etkinlik ekler. Her telefonda çalışır, hesap gerektirmez ve diğer etkinlikler gibi silinebilir.",
  },
  mineReminderTime: { en: "Time", tr: "Saat" },
  mineReminderAdd: { en: "Add to calendar", tr: "Takvime ekle" },
  reminderTitle: { en: "Duʿāʾ of the day", tr: "Günün duası" },

  /* settings */
  settingsTitle: { en: "Settings", tr: "Ayarlar" },
  setAppearance: { en: "Appearance", tr: "Görünüm" },
  setAuto: { en: "Auto", tr: "Otomatik" },
  setLight: { en: "Light", tr: "Açık" },
  setDark: { en: "Dark", tr: "Koyu" },
  setTextSize: { en: "Text size", tr: "Yazı boyutu" },
  setNormal: { en: "Normal", tr: "Normal" },
  setLarge: { en: "Large", tr: "Büyük" },
  setXLarge: { en: "Larger", tr: "Daha büyük" },
  setTranslit: { en: "Transliteration", tr: "Okunuş" },
  setShow: { en: "Show", tr: "Göster" },
  setHide: { en: "Hide", tr: "Gizle" },
  setHonorifics: { en: "Honorifics", tr: "Saygı ifadeleri" },
  setArabicForm: { en: "Arabic", tr: "Arapça" },
  setEnglishForm: { en: "In words", tr: "Yazıyla" },
  setAbbr: { en: "Abbreviated", tr: "Kısaltma" },
  setReading: { en: "Translations shown", tr: "Gösterilen çeviriler" },
  setReadingAuto: { en: "This language", tr: "Bu dil" },
  setBoth: { en: "Both", tr: "İkisi de" },
  setDone: { en: "Done", tr: "Tamam" },

  /* index pages */
  themesTitle: { en: "I need words for…", tr: "Şunun için söz arıyorum…" },
  themesLede: {
    en: "Sixteen situations rather than sixteen categories. Pick the one you are in.",
    tr: "On altı kategori değil, on altı hâl. İçinde bulunduğunuzu seçin.",
  },
  prophetsTitle: { en: "The Prophets", tr: "Peygamberler" },
  prophetsLede: {
    en: "In the order they came. Each page carries every supplication in full.",
    tr: "Geliş sırasına göre. Her sayfada bütün duaları eksiksiz yer alır.",
  },
  sectionCompanion: { en: "Others the Qurʾān quotes", tr: "Kur'ân'ın sözlerini aktardığı diğer kişiler" },
  sectionQuranTaught: { en: "Taught by the Qurʾān", tr: "Kur'ân'ın öğrettiği dualar" },
  secTrial: { en: "What he faced", tr: "Karşılaştığı imtihan" },
  secTrialF: { en: "What she faced", tr: "Karşılaştığı imtihan" },
  hisDua: { en: "Supplications", tr: "Duaları" },
  duaCount: { en: "{n} duʿāʾ", tr: "{n} dua" },
  readThrough: { en: "Read them through", tr: "Hepsini sırayla oku" },
  moreOnPage: { en: "Commentary and more", tr: "Tefsir ve fazlası" },

  /* search */
  searchTitle: { en: "Search", tr: "Ara" },
  searchLede: {
    en: "Arabic works without diacritics, and transliteration without the dots and macrons.",
    tr: "Arapça harekesiz, okunuş da nokta ve uzatma işaretleri olmadan aranabilir.",
  },
  searchPlaceholder: { en: "grief · debt · Yūnus · zalimin", tr: "keder · borç · Yûnus · sabır" },
  searchStart: { en: "Start typing, or try one of these.", tr: "Yazmaya başlayın ya da şunlardan birini deneyin." },
  searchCount: { en: "{n} for “{q}”", tr: "“{q}” için {n} sonuç" },
  searchOne: { en: "1 result", tr: "1" },
  searchMany: { en: "{n} results", tr: "{n}" },
  searchNone: {
    en: "Nothing matched “{q}”. Try fewer words, or a different spelling.",
    tr: "“{q}” ile eşleşen bir şey bulunamadı. Daha az kelime ya da farklı bir yazım deneyin.",
  },

  /* footer */
  footText: {
    en: "Qurʾānic Arabic from a published edition of the muṣḥaf; ḥadīth Arabic from an open edition of the collections. Translations of the Qurʾān by Marmaduke Pickthall and Elmalılı Hamdi Yazır.",
    tr: "Kur'ân metni basılı bir mushaf neşrinden, hadis metinleri hadis külliyatının açık bir neşrinden alınmıştır. Kur'ân çevirileri Marmaduke Pickthall ve Elmalılı Hamdi Yazır'a aittir.",
  },
  footPrivacy: { en: "No account, no tracking. Works offline.", tr: "Hesap yok, takip yok. Çevrimdışı çalışır." },

  notFound: { en: "That page is not here.", tr: "Bu sayfa burada değil." },
  notFoundLede: {
    en: "It may have moved. Search, or start from today's duʿāʾ.",
    tr: "Taşınmış olabilir. Arama yapın ya da günün duasından başlayın.",
  },
} satisfies Dict;

export type Key = keyof typeof UI;

/** A UI string, with `{name}` placeholders filled. */
export function t(key: Key, lang: Lang, vars: Record<string, string | number> = {}): string {
  let s: string = UI[key][lang] ?? UI[key].en;
  for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}

/** Pick the right language from a bilingual content object. */
export const pick = (o: { en: string; tr: string } | undefined, lang: Lang): string =>
  o ? o[lang] || o.en : "";

const BASE = (import.meta.env?.BASE_URL ?? "/dua/").replace(/\/$/, "");

/** A path in a given language: url("tr", "/duas/x/") → "/dua/tr/duas/x/". */
export const url = (lang: Lang, path = "/"): string =>
  `${BASE}${lang === "tr" ? "/tr" : ""}${path}`;

/** The same page in the other language, from the current pathname. */
export function alternate(pathname: string, to: Lang): string {
  const rest = pathname.replace(new RegExp(`^${BASE}`), "").replace(/^\/tr(?=\/|$)/, "") || "/";
  return url(to, rest);
}

/** The strings the browser needs, for one language. */
export const clientStrings = (lang: Lang) =>
  Object.fromEntries(Object.entries(UI).map(([k, v]) => [k, v[lang]]));
