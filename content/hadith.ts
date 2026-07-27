/**
 * Sunnah duʿāʾ of the Prophet Muḥammad ﷺ.
 *
 * **These are the one place on the site where Arabic is hand-entered**, because
 * there is no ḥadīth equivalent of the Qurʾān API — nothing that serves graded,
 * versioned, machine-checkable text. So the schema compensates by demanding
 * more of each entry than a Qurʾānic one: a collection, a number, a grading,
 * and the authority who gave that grading. `content/schema.ts` will not
 * validate a ḥadīth source missing any of them.
 *
 * The Arabic below is carried verbatim from the legacy `data/prayers.json`. It
 * has **not** been re-typed, "cleaned up", or corrected — the Phase 1 audit's
 * central finding was that hand-touching Arabic silently corrupts it, and that
 * applies to me as much as to anyone. It is also not independently verified,
 * which is exactly why every entry here is `needs-review` and renders with a
 * visible notice saying so.
 *
 * On the gradings: inclusion in Ṣaḥīḥ al-Bukhārī or Ṣaḥīḥ Muslim is itself the
 * grading, so `grading: "ṣaḥīḥ"` with `gradedBy` naming the compiler is a
 * factual statement about where the report sits, not a judgement I am making.
 * The *reference numbers* are a different matter — numbering varies between
 * printings and these came from an unverified source, so they carry the review
 * flag until a human checks them against a specific edition.
 */

export type HadithSeed = {
  id: string;
  legacyId: string;
  title: { en: string; tr: string };
  /** Verbatim from the legacy corpus. Never edited. */
  arabic: string;
  source: {
    collection: string;
    collectionAr: string;
    number: string;
    grading: string;
    gradedBy: string;
    url: string;
  };
  themes: string[];
  situations: { en: string[]; tr: string[] };
};

export const HADITH_SEEDS: HadithSeed[] = [
  {
    id: "muhammad-allahumma-inni-zalamtu-nafsi",
    legacyId: "muhammad-bukhari-834",
    title: {
      en: "I have wronged myself greatly",
      tr: "Kendime çok zulmettim",
    },
    arabic:
      "اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ",
    source: {
      collection: "Ṣaḥīḥ al-Bukhārī",
      collectionAr: "صحيح البخاري",
      number: "834",
      grading: "ṣaḥīḥ",
      gradedBy: "al-Bukhārī",
      url: "https://sunnah.com/bukhari:834",
    },
    themes: ["forgiveness"],
    situations: {
      en: ["in prayer, before the closing salām", "when you want words the Prophet ﷺ taught directly"],
      tr: ["namazda, selâmdan önce", "Peygamber'in ﷺ bizzat öğrettiği kelimeleri istediğinizde"],
    },
  },
  {
    id: "muhammad-audhu-bika-min-adhab-jahannam",
    legacyId: "muhammad-muslim-843",
    title: {
      en: "Refuge from the four",
      tr: "Dört şeyden sığınma",
    },
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ وَمِنْ عَذَابِ الْقَبْرِ وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ",
    source: {
      collection: "Ṣaḥīḥ Muslim",
      collectionAr: "صحيح مسلم",
      number: "843",
      grading: "ṣaḥīḥ",
      gradedBy: "Muslim",
      url: "https://sunnah.com/muslim:843",
    },
    themes: ["protection", "hereafter", "fear"],
    situations: {
      en: ["in prayer, before the closing salām"],
      tr: ["namazda, selâmdan önce"],
    },
  },
  {
    id: "muhammad-allahumma-aslih-li-dini",
    legacyId: "muhammad-muslim-2720",
    title: {
      en: "Set right my religion, my world, my end",
      tr: "Dinimi, dünyamı ve âhiretimi düzelt",
    },
    arabic:
      "اللَّهُمَّ أَصْلِحْ لِي دِينِيَ الَّذِي هُوَ عِصْمَةُ أَمْرِي وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي وَأَصْلِحْ لِي آخِرَتِيَ الَّتِي فِيهَا مَعَادِي",
    source: {
      collection: "Ṣaḥīḥ Muslim",
      collectionAr: "صحيح مسلم",
      number: "2720",
      grading: "ṣaḥīḥ",
      gradedBy: "Muslim",
      url: "https://sunnah.com/muslim:2720",
    },
    themes: ["guidance", "provision", "hereafter"],
    situations: {
      en: ["when several parts of your life need attention at once", "when you do not know which thing to fix first"],
      tr: ["hayatınızın birkaç alanı aynı anda ilgi istediğinde", "önce neyi düzelteceğinizi bilemediğinizde"],
    },
  },
  {
    id: "muhammad-as-aluka-al-huda-wal-tuqa",
    legacyId: "muhammad-muslim-2721",
    title: {
      en: "Guidance, piety, chastity, sufficiency",
      tr: "Hidayet, takva, iffet ve gönül zenginliği",
    },
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
    source: {
      collection: "Ṣaḥīḥ Muslim",
      collectionAr: "صحيح مسلم",
      number: "2721",
      grading: "ṣaḥīḥ",
      gradedBy: "Muslim",
      url: "https://sunnah.com/muslim:2721",
    },
    themes: ["guidance", "provision", "protection"],
    situations: {
      en: ["a short duʿāʾ to keep", "when you want to ask for the whole of it in four words"],
      tr: ["ezberde tutulacak kısa bir dua", "her şeyi dört kelimeyle istemek istediğinizde"],
    },
  },
  {
    id: "muhammad-audhu-bika-min-al-hamm-wal-hazan",
    legacyId: "muhammad-bukhari-6369",
    title: {
      en: "Refuge from anxiety and debt",
      tr: "Keder ve borçtan sığınma",
    },
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
    source: {
      collection: "Ṣaḥīḥ al-Bukhārī",
      collectionAr: "صحيح البخاري",
      number: "6369",
      grading: "ṣaḥīḥ",
      gradedBy: "al-Bukhārī",
      url: "https://sunnah.com/bukhari:6369",
    },
    themes: ["distress", "provision", "protection", "grief"],
    situations: {
      en: ["in debt", "worn down and unable to start", "when worry has become the background of the day"],
      tr: ["borç altındayken", "yıpranmış ve başlayamıyorken", "endişe günün fonu hâline geldiğinde"],
    },
  },
];
