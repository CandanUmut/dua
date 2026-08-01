/**
 * UI strings.
 *
 * Two separate things are being chosen here and they are worth keeping apart:
 *
 *  - **Interface language** — the chrome: navigation, labels, buttons. Swapped
 *    client-side by `data-i18n` key, because the site is statically generated
 *    and building a parallel route tree per language for a handful of labels
 *    would double every page for very little.
 *
 *  - **Reading language** — which translations appear under the Arabic. This is
 *    the setting that actually matters to a Turkish reader, and it is separate
 *    because plenty of people want an English interface with Turkish
 *    translations, or both translations at once.
 *
 * Long-form prose — the About page, prophet summaries, context — is not in this
 * dictionary. Machine-swapping paragraphs of sourced editorial text is how you
 * end up with an unreviewed Turkish claim about scripture, which is precisely
 * what this project is trying not to do. Those pages stay in the language they
 * were written and reviewed in until a human translates them.
 */

export type UiLang = "en" | "tr";

export const UI: Record<string, Record<UiLang, string>> = {
  siteName: { en: "The Duʿāʾ of the Prophets", tr: "Peygamberlerin Duaları" },

  navNeed: { en: "By need", tr: "İhtiyaca göre" },
  navProphets: { en: "Prophets", tr: "Peygamberler" },
  navSearch: { en: "Search", tr: "Ara" },
  navSaved: { en: "Saved", tr: "Kayıtlı" },
  navAbout: { en: "About", tr: "Hakkında" },
  navSettings: { en: "Settings", tr: "Ayarlar" },

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
  setEnglishForm: { en: "In English", tr: "Yazıyla" },
  setAbbr: { en: "Abbreviated", tr: "Kısaltma" },
  setInterface: { en: "Interface language", tr: "Arayüz dili" },
  setReading: { en: "Translations shown", tr: "Gösterilen çeviriler" },
  setBoth: { en: "Both", tr: "İkisi de" },
  setEnglish: { en: "English", tr: "İngilizce" },
  setTurkish: { en: "Türkçe", tr: "Türkçe" },
  setDone: { en: "Done", tr: "Tamam" },

  copyArabic: { en: "Copy Arabic", tr: "Arapçayı kopyala" },
  copyTranslation: { en: "Copy translation", tr: "Çeviriyi kopyala" },
  copyFull: { en: "Copy with citation", tr: "Kaynağıyla kopyala" },
  bookmark: { en: "Bookmark", tr: "Kaydet" },
  bookmarked: { en: "Bookmarked ✓", tr: "Kaydedildi ✓" },
  copied: { en: "Copied.", tr: "Kopyalandı." },
  copyFailed: { en: "Copy failed — select the text instead.", tr: "Kopyalanamadı — metni seçin." },
  bookmarkAdded: { en: "Bookmarked.", tr: "Kaydedildi." },
  bookmarkRemoved: { en: "Bookmark removed.", tr: "Kayıt kaldırıldı." },

  secWhenWhy: { en: "When and why it was said", tr: "Ne zaman ve niçin söylendi" },
  secReflection: { en: "Reflection", tr: "Değerlendirme" },
  secSaidWhen: { en: "Said when", tr: "Şu durumlarda" },
  secThemes: { en: "Themes", tr: "Konular" },
  secNear: { en: "Near this", tr: "Buna yakın olanlar" },
  secTrial: { en: "What he faced", tr: "Karşılaştığı imtihan" },
  secInQuran: { en: "In the Qurʾān", tr: "Kur'ân'da" },
  secSource: { en: "Source", tr: "Kaynak" },
  secGrading: { en: "Grading", tr: "Derece" },
  secStatus: { en: "Status", tr: "Durum" },
  secExtent: { en: "Extent", tr: "Kapsam" },
  secText: { en: "Text", tr: "Metin" },
  crumbProphets: { en: "The Prophets", tr: "Peygamberler" },
  crumbThemes: { en: "I need words for…", tr: "Şunun için kelime arıyorum…" },
  excerptNote: { en: "excerpt, framing dimmed", tr: "alıntı, çerçeve soluk" },
  textUthmani: { en: "Uthmani, verified by checksum", tr: "Osmanî hat, sağlama ile doğrulandı" },
  textHadith: {
    en: "Hand-entered — no ḥadīth edition exists to fetch",
    tr: "Elle girildi — çekilebilecek bir hadis neşri yok",
  },
  textWeb: { en: "World English Bible, verified by checksum", tr: "World English Bible, sağlama ile doğrulandı" },
  statusOutside: { en: "Outside the Qurʾān and Sunnah", tr: "Kur'ân ve Sünnet dışı" },

  homeNeed: { en: "I need words for…", tr: "Şunun için kelime arıyorum…" },
  homeProphets: { en: "By prophet", tr: "Peygambere göre" },
  duaCount: { en: "duʿāʾ", tr: "dua" },
  footReport: { en: "Report a correction", tr: "Bir hata bildir" },
  moreDepth: {
    en: "Commentary, reflection and related duʿāʾ",
    tr: "Tefsir, değerlendirme ve ilgili dualar",
  },
  moreTafsir: { en: "Commentary and related duʿāʾ", tr: "Tefsir ve ilgili dualar" },
  moreReflection: { en: "Reflection and related duʿāʾ", tr: "Değerlendirme ve ilgili dualar" },
  secCommentary: { en: "Commentary", tr: "Tefsir" },
  secOccasion: { en: "Occasion of revelation", tr: "Nüzul sebebi" },
  hisDua: { en: "His duʿāʾ", tr: "Duaları" },
  jumpTo: { en: "Jump to a duʿāʾ", tr: "Bir duaya git" },
  bookmarksTitle: { en: "Saved", tr: "Kayıtlı" },
  bookmarksEmpty: {
    en: "Nothing saved yet. The bookmark link at the foot of any duʿāʾ keeps it here, on this device only.",
    tr: "Henüz bir şey kaydedilmedi. Herhangi bir duanın altındaki kaydet bağlantısı onu yalnızca bu cihazda burada tutar.",
  },
  searchStart: {
    en: "Start typing, or try one of these.",
    tr: "Yazmaya başlayın ya da şunlardan birini deneyin.",
  },
  noResults: { en: "Nothing matched", tr: "Eşleşme bulunamadı" },
};

export const t = (key: string, lang: UiLang): string => UI[key]?.[lang] ?? UI[key]?.en ?? key;

/** The dictionary the client-side switcher uses. */
export const UI_JSON = UI;
