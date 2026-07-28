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
  /**
   * Translations for ḥadīth cannot come from the Qurʾān API, so they are
   * written here. They are marked as project drafts awaiting review and render
   * with a notice saying so — unlike the Qurʾānic entries, where Pickthall and
   * Elmalılı are established, attributed, public-domain work.
   */
  translations: { en: string; tr: string };
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
    translations: {
      en: "O Allah, I have wronged myself greatly, and none forgives sins but You. So forgive me with forgiveness from Yourself, and have mercy on me. You are the Forgiving, the Merciful.",
      tr: "Allah'ım! Kendime çok zulmettim. Günahları ancak Sen bağışlarsın. Öyleyse katından bir bağışlamayla beni bağışla ve bana merhamet et. Şüphesiz Sen çok bağışlayan, çok merhamet edensin.",
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
    translations: {
      en: "O Allah, I seek refuge in You from the punishment of Hell, from the punishment of the grave, from the trials of life and death, and from the evil of the trial of the False Messiah.",
      tr: "Allah'ım! Cehennem azabından, kabir azabından, hayatın ve ölümün fitnelerinden ve Deccal fitnesinin şerrinden Sana sığınırım.",
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
    translations: {
      en: "O Allah, set right for me my religion, which is the safeguard of my affairs; and set right for me my worldly life, in which is my livelihood; and set right for me my Hereafter, to which is my return.",
      tr: "Allah'ım! İşlerimin koruyucusu olan dinimi benim için düzelt. Geçimimin içinde bulunduğu dünyamı benim için düzelt. Dönüşümün kendisine olduğu âhiretimi de benim için düzelt.",
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
    translations: {
      en: "O Allah, I ask You for guidance, piety, chastity, and sufficiency.",
      tr: "Allah'ım! Senden hidayet, takva, iffet ve gönül zenginliği dilerim.",
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
    translations: {
      en: "O Allah, I seek refuge in You from anxiety and sorrow, from weakness and laziness, from miserliness and cowardice, from the burden of debt and from being overpowered by men.",
      tr: "Allah'ım! Kaygıdan ve kederden, âcizlikten ve tembellikten, cimrilikten ve korkaklıktan, borcun ağırlığından ve insanların baskısından Sana sığınırım.",
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
