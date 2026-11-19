/**
 * Sūrah names in the site's own transliteration (English) and in the
 * conventional Turkish spelling. Replaces the API's names, which use a third
 * scheme ("Al-A'raaf") that sat oddly beside everything else on the page.
 *
 * Only sūrahs the site cites are listed; the build fails if one is missing.
 */
export const SURAH_NAMES: Record<number, { en: string; tr: string }> = {
  2: { en: "al-Baqarah", tr: "Bakara" },
  3: { en: "Āl ʿImrān", tr: "Âl-i İmrân" },
  5: { en: "al-Māʾidah", tr: "Mâide" },
  7: { en: "al-Aʿrāf", tr: "A'râf" },
  10: { en: "Yūnus", tr: "Yûnus" },
  11: { en: "Hūd", tr: "Hûd" },
  12: { en: "Yūsuf", tr: "Yûsuf" },
  14: { en: "Ibrāhīm", tr: "İbrâhim" },
  17: { en: "al-Isrāʾ", tr: "İsrâ" },
  18: { en: "al-Kahf", tr: "Kehf" },
  19: { en: "Maryam", tr: "Meryem" },
  20: { en: "Ṭā Hā", tr: "Tâhâ" },
  21: { en: "al-Anbiyāʾ", tr: "Enbiyâ" },
  23: { en: "al-Muʾminūn", tr: "Mü'minûn" },
  25: { en: "al-Furqān", tr: "Furkân" },
  26: { en: "al-Shuʿarāʾ", tr: "Şuarâ" },
  27: { en: "al-Naml", tr: "Neml" },
  28: { en: "al-Qaṣaṣ", tr: "Kasas" },
  29: { en: "al-ʿAnkabūt", tr: "Ankebût" },
  37: { en: "al-Ṣāffāt", tr: "Sâffât" },
  38: { en: "Ṣād", tr: "Sâd" },
  54: { en: "al-Qamar", tr: "Kamer" },
  60: { en: "al-Mumtaḥanah", tr: "Mümtehine" },
  66: { en: "al-Taḥrīm", tr: "Tahrîm" },
  71: { en: "Nūḥ", tr: "Nûh" },
};
