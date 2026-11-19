/**
 * Sunnah duʿāʾ of the Prophet Muḥammad ﷺ.
 *
 * **No Arabic is written in this file.** Like the Qurʾānic entries, each seed
 * names its source and the half-open word range `[fromWord, toWord)` that
 * isolates the supplication inside the narration. `scripts/fetch-hadith.ts`
 * fetches the narration from the hadith-api dataset, checks that the record's
 * standard reference number is the one cited here, slices the supplication
 * out, and writes a SHA-256 to `hadith.lock.json`. CI re-derives it and fails
 * on drift. Choose ranges with `npx tsx scripts/inspect-hadith.ts book:n`.
 *
 * This replaced a corpus of five hand-typed ḥadīth. Checking them against the
 * dataset found one citing the wrong number entirely (the refuge from the
 * punishment of Jahannam was cited as Muslim 843, which is a report about the
 * two muʾadhdhins; it is Muslim 588), and the dataset's copy of Bukhārī 834
 * contains a corrupted character, so that entry is now drawn from Bukhārī
 * 6326, the same supplication through another chain.
 *
 * Gradings: inclusion in Ṣaḥīḥ al-Bukhārī or Ṣaḥīḥ Muslim is itself the
 * grading. For the Sunan, the grade is read from the dataset (al-Albānī's), not
 * typed here, and the build fails if it is weaker than ḥasan.
 *
 * Translations: all are the project's own. The Turkish of the five original
 * entries began as Umut Candan's and was revised where meaning had been
 * dropped (the critic's review: «مغفرة من عندك», hamm as anxiety), so it too
 * awaits his review. Each renders as "not yet reviewed" until `reviewed` is
 * set for that language.
 *
 * `moments` differ from `situations`: a moment is stated by the narration
 * itself ("when he went to his bed"), so it is sourced; a situation is the
 * site's suggestion of when a reader might turn to the words.
 */

import type { Book } from "../scripts/hadith-api.js";

export const MOMENTS = [
  "waking",
  "morning-evening",
  "leaving-home",
  "mosque",
  "in-prayer",
  "after-prayer",
  "eating",
  "travel",
  "rain",
  "illness",
  "distress",
  "sleep",
] as const;
export type Moment = (typeof MOMENTS)[number];

export type HadithSeed = {
  id: string;
  /** Maps to `data/prayers.json`, for the five original entries. */
  legacyId?: string;
  title: { en: string; tr: string };
  ref: {
    book: Book;
    /** The dataset's own record number, used to fetch. */
    datasetNumber: number;
    /** The standard reference number, as printed editions and sunnah.com cite it. */
    number: number;
    /** Muslim's sub-narrations: 1 → "a", 2 → "b". */
    variant?: number;
  };
  excerpt: { fromWord: number; toWord: number };
  translations: { en: string; tr: string };
  reviewed?: { en?: boolean; tr?: boolean };
  /** What the narration says about when and why — told, not embellished. */
  context: { en: string; tr: string };
  themes: string[];
  moments?: Moment[];
  form?: "dua" | "dhikr" | "istiadha";
  situations: { en: string[]; tr: string[] };
};

export const HADITH_SEEDS: HadithSeed[] = [
  /* ------------------------- the original five ------------------------- */
  {
    id: "muhammad-allahumma-inni-zalamtu-nafsi",
    legacyId: "muhammad-bukhari-834",
    title: { en: "I have wronged myself greatly", tr: "Kendime çok zulmettim" },
    ref: { book: "bukhari", datasetNumber: 6326, number: 6326 },
    excerpt: { fromWord: 40, toWord: 61 },
    translations: {
      en: "O Allah, I have wronged myself greatly, and none forgives sins but You. So forgive me with forgiveness from Yourself, and have mercy on me. You are the Forgiving, the Merciful.",
      tr: "Allah'ım! Kendime çok zulmettim. Günahları ancak Sen bağışlarsın. Öyleyse katından bir bağışlamayla beni bağışla ve bana merhamet et. Şüphesiz Sen çok bağışlayan, çok merhamet edensin.",
    },
    context: {
      en: "Abū Bakr al-Ṣiddīq asked the Prophet ﷺ to teach him a supplication to say in his prayer, and he taught him these words. Al-Bukhārī also records it at no. 834.",
      tr: "Ebû Bekir es-Sıddîk, Peygamber'den ﷺ namazında okuyacağı bir dua öğretmesini istedi; o da ona bu kelimeleri öğretti. Buhârî bunu 834 numarada da kaydeder.",
    },
    themes: ["forgiveness"],
    moments: ["in-prayer"],
    situations: {
      en: ["in prayer, before the closing salām", "after a wrong you cannot undo"],
      tr: ["namazda, selâmdan önce", "geri alamayacağınız bir yanlıştan sonra"],
    },
  },
  {
    id: "muhammad-audhu-bika-min-adhab-jahannam",
    legacyId: "muhammad-muslim-843",
    title: { en: "Refuge from four things", tr: "Dört şeyden sığınma" },
    ref: { book: "muslim", datasetNumber: 1324, number: 588, variant: 1 },
    excerpt: { fromWord: 61, toWord: 80 },
    translations: {
      en: "O Allah, I seek refuge in You from the punishment of Hell, from the punishment of the grave, from the trial of life and death, and from the evil of the trial of the False Messiah.",
      tr: "Allah'ım! Cehennem azabından, kabir azabından, hayatın ve ölümün fitnesinden ve Mesîh-i Deccâl'in fitnesinin şerrinden Sana sığınırım.",
    },
    context: {
      en: "Abū Hurayrah reports that the Messenger of Allah ﷺ said: when one of you recites the tashahhud, let him seek refuge with Allah from four things — and gave these words.",
      tr: "Ebû Hüreyre'nin rivayetine göre Resûlullah ﷺ şöyle buyurdu: Biriniz teşehhüdü okuduğunda dört şeyden Allah'a sığınsın — ve bu kelimeleri öğretti.",
    },
    themes: ["protection", "hereafter"],
    moments: ["in-prayer"],
    form: "istiadha",
    situations: {
      en: ["after the tashahhud, before the salām", "when you think of death and what follows it"],
      tr: ["teşehhüdden sonra, selâmdan önce", "ölümü ve sonrasını düşündüğünüzde"],
    },
  },
  {
    id: "muhammad-allahumma-aslih-li-dini",
    legacyId: "muhammad-muslim-2720",
    title: { en: "Set right my religion, my world, my Hereafter", tr: "Dinimi, dünyamı ve âhiretimi düzelt" },
    ref: { book: "muslim", datasetNumber: 6903, number: 2720 },
    excerpt: { fromWord: 41, toWord: 75 },
    translations: {
      en: "O Allah, set right for me my religion, which is the safeguard of my affairs; set right for me my worldly life, in which is my livelihood; and set right for me my Hereafter, to which is my return. Make life an increase for me in every good, and make death a relief for me from every evil.",
      tr: "Allah'ım! İşlerimin koruyucusu olan dinimi benim için düzelt; içinde geçimimin bulunduğu dünyamı benim için düzelt; dönüşümün olduğu âhiretimi benim için düzelt. Hayatı benim için her hayırda bir artış, ölümü de her kötülükten bir kurtuluş kıl.",
    },
    context: {
      en: "Abū Hurayrah reports that the Messenger of Allah ﷺ used to say this.",
      tr: "Ebû Hüreyre, Resûlullah'ın ﷺ bu duayı okuduğunu rivayet eder.",
    },
    themes: ["guidance", "hereafter"],
    situations: {
      en: ["when every part of life feels out of order", "at the start of a new chapter"],
      tr: ["hayatın her yanı dağınık göründüğünde", "yeni bir döneme başlarken"],
    },
  },
  {
    id: "muhammad-as-aluka-al-huda-wal-tuqa",
    legacyId: "muhammad-muslim-2721",
    title: { en: "Guidance, piety, chastity and sufficiency", tr: "Hidayet, takva, iffet ve kimseye muhtaç olmamak" },
    ref: { book: "muslim", datasetNumber: 6904, number: 2721, variant: 1 },
    excerpt: { fromWord: 32, toWord: 39 },
    translations: {
      en: "O Allah, I ask You for guidance, piety, chastity and sufficiency.",
      tr: "Allah'ım! Senden hidayet, takva, iffet ve kimseye muhtaç olmamayı isterim.",
    },
    context: {
      en: "ʿAbdullāh ibn Masʿūd reports that the Prophet ﷺ used to say this.",
      tr: "Abdullah b. Mes'ûd, Peygamber'in ﷺ bu duayı okuduğunu rivayet eder.",
    },
    themes: ["guidance", "provision"],
    situations: {
      en: ["when you want one short duʿāʾ that asks for everything", "against wanting more than you need"],
      tr: ["her şeyi isteyen kısa bir dua aradığınızda", "ihtiyacınızdan fazlasını istemeye karşı"],
    },
  },
  {
    id: "muhammad-audhu-bika-min-al-hamm-wal-hazan",
    legacyId: "muhammad-bukhari-6369",
    title: { en: "Refuge from anxiety and debt", tr: "Kaygıdan ve borçtan sığınma" },
    ref: { book: "bukhari", datasetNumber: 6369, number: 6369 },
    excerpt: { fromWord: 23, toWord: 38 },
    translations: {
      en: "O Allah, I seek refuge in You from anxiety and grief, from helplessness and laziness, from cowardice and miserliness, from the burden of debt and from being overpowered by men.",
      tr: "Allah'ım! Kaygıdan ve kederden, acizlikten ve tembellikten, korkaklıktan ve cimrilikten, borç yükünden ve insanların baskısından Sana sığınırım.",
    },
    context: {
      en: "Anas ibn Mālik reports that the Prophet ﷺ used to say this.",
      tr: "Enes b. Mâlik, Peygamber'in ﷺ bu duayı okuduğunu rivayet eder.",
    },
    themes: ["distress", "provision", "grief"],
    form: "istiadha",
    situations: {
      en: ["under the weight of debt", "worn out and unable to begin", "when anxiety has seeped into every hour"],
      tr: ["borç altındayken", "yıpranmış ve başlayamıyorken", "kaygı günün her anına sindiğinde"],
    },
  },

  /* ------------------------------ the day ------------------------------ */
  {
    id: "muhammad-alhamdu-lillahi-alladhi-ahyana",
    title: { en: "On waking", tr: "Uyanınca" },
    ref: { book: "bukhari", datasetNumber: 6312, number: 6312 },
    excerpt: { fromWord: 31, toWord: 40 },
    translations: {
      en: "All praise is for Allah, who gave us life after He had caused us to die, and to Him is the rising.",
      tr: "Bizi öldürdükten sonra dirilten Allah'a hamdolsun. Diriliş de O'nadır.",
    },
    context: {
      en: "Ḥudhayfah reports that when the Prophet ﷺ rose from sleep he would say this. Sleep is spoken of as a death, and waking as being given life again.",
      tr: "Huzeyfe, Peygamber'in ﷺ uykudan kalktığında bunu söylediğini rivayet eder. Uyku bir ölüm, uyanmak da yeniden hayat verilmek olarak anılır.",
    },
    themes: ["gratitude"],
    moments: ["waking"],
    form: "dhikr",
    situations: {
      en: ["the first words of the day"],
      tr: ["günün ilk sözü olarak"],
    },
  },
  {
    id: "muhammad-sayyid-al-istighfar",
    title: { en: "The master of seeking forgiveness", tr: "Seyyidü'l-istiğfâr" },
    ref: { book: "bukhari", datasetNumber: 6306, number: 6306 },
    excerpt: { fromWord: 36, toWord: 73 },
    translations: {
      en: "O Allah, You are my Lord; there is no god but You. You created me and I am Your servant, and I keep to Your covenant and Your promise as far as I am able. I seek refuge in You from the evil of what I have done. I acknowledge before You Your favour upon me, and I acknowledge my sin. So forgive me, for none forgives sins but You.",
      tr: "Allah'ım! Sen benim Rabbimsin. Senden başka ilâh yoktur. Beni Sen yarattın, ben de Senin kulunum. Gücüm yettiğince Sana verdiğim ahdin ve sözün üzerindeyim. Yaptıklarımın şerrinden Sana sığınırım. Bana verdiğin nimeti ikrar ediyorum, günahımı da itiraf ediyorum. Beni bağışla; çünkü günahları ancak Sen bağışlarsın.",
    },
    context: {
      en: "Shaddād ibn Aws reports that the Prophet ﷺ called this “the master of seeking forgiveness”, and said that whoever says it during the day with certainty in it and dies that day before evening is among the people of Paradise; and whoever says it at night with certainty in it and dies before morning is among the people of Paradise.",
      tr: "Şeddâd b. Evs'in rivayetine göre Peygamber ﷺ bu duayı “istiğfarın efendisi” diye niteledi ve şöyle buyurdu: Kim ona yakînen inanarak gündüz söyler de o gün akşam olmadan ölürse cennet ehlindendir; kim de ona yakînen inanarak gece söyler de sabah olmadan ölürse cennet ehlindendir.",
    },
    themes: ["forgiveness"],
    moments: ["morning-evening"],
    situations: {
      en: ["each morning and each evening", "when you want the fullest words for repentance"],
      tr: ["her sabah ve her akşam", "tövbe için en kapsamlı sözleri aradığınızda"],
    },
  },
  {
    id: "muhammad-bismillahi-alladhi-la-yadurru",
    title: { en: "In the name of Allah, with whose name nothing harms", tr: "İsmiyle hiçbir şeyin zarar vermediği Allah'ın adıyla" },
    ref: { book: "abudawud", datasetNumber: 5088, number: 5088 },
    excerpt: { fromWord: 30, toWord: 46 },
    translations: {
      en: "In the name of Allah, with whose name nothing on earth or in the heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
      tr: "İsmi anıldığında yerde ve gökte hiçbir şeyin zarar veremediği Allah'ın adıyla. O her şeyi işiten, her şeyi bilendir.",
    },
    context: {
      en: "ʿUthmān ibn ʿAffān reports that the Messenger of Allah ﷺ said: whoever says this three times will not be struck by a sudden affliction until morning, and whoever says it three times in the morning will not be struck by a sudden affliction until evening. Abān, who narrated it from ʿUthmān, was later struck by paralysis, and said it happened on a day he had been angry and forgot to say it.",
      tr: "Osman b. Affân'ın rivayetine göre Resûlullah ﷺ şöyle buyurdu: Kim bunu üç kez söylerse sabaha kadar ona ansızın bir belâ isabet etmez; kim de sabah olunca üç kez söylerse akşama kadar ona ansızın bir belâ isabet etmez. Bunu Osman'dan rivayet eden Ebân daha sonra felç geçirdi ve bunun, öfkelenip bu sözleri söylemeyi unuttuğu bir günde olduğunu söyledi.",
    },
    themes: ["protection"],
    moments: ["morning-evening"],
    form: "dhikr",
    situations: {
      en: ["three times each morning and evening"],
      tr: ["her sabah ve akşam üçer kez"],
    },
  },
  {
    id: "muhammad-bismillahi-tawakkaltu-ala-allah",
    title: { en: "Leaving the house", tr: "Evden çıkarken" },
    ref: { book: "abudawud", datasetNumber: 5095, number: 5095 },
    excerpt: { fromWord: 37, toWord: 48 },
    translations: {
      en: "In the name of Allah. I put my trust in Allah. There is no power and no strength except through Allah.",
      tr: "Allah'ın adıyla. Allah'a tevekkül ettim. Güç ve kuvvet ancak Allah'ın yardımıyladır.",
    },
    context: {
      en: "Anas ibn Mālik reports that the Prophet ﷺ said: when a man leaves his house and says this, it is said to him, “You are guided, you are sufficed, and you are protected,” and the devils turn away from him.",
      tr: "Enes b. Mâlik'in rivayetine göre Peygamber ﷺ şöyle buyurdu: Kişi evinden çıkarken bunu söylerse ona “Doğru yola iletildin, ihtiyacın karşılandı ve korundun” denir ve şeytanlar ondan uzaklaşır.",
    },
    themes: ["protection"],
    moments: ["leaving-home"],
    form: "dhikr",
    situations: {
      en: ["at the door, every time you go out"],
      tr: ["her dışarı çıkışta, kapıda"],
    },
  },
  {
    id: "muhammad-iftah-li-abwaba-rahmatik",
    title: { en: "Entering the mosque", tr: "Mescide girerken" },
    ref: { book: "muslim", datasetNumber: 1652, number: 713, variant: 1 },
    excerpt: { fromWord: 39, toWord: 44 },
    translations: {
      en: "O Allah, open for me the gates of Your mercy.",
      tr: "Allah'ım! Bana rahmetinin kapılarını aç.",
    },
    context: {
      en: "Abū Ḥumayd or Abū Usayd reports that the Messenger of Allah ﷺ said: when one of you enters the mosque, let him say this; and when he leaves, let him say, “O Allah, I ask You of Your bounty.”",
      tr: "Ebû Humeyd ya da Ebû Üseyd'in rivayetine göre Resûlullah ﷺ şöyle buyurdu: Biriniz mescide girdiğinde bunu söylesin; çıktığında da “Allah'ım! Senden lütfunu isterim” desin.",
    },
    themes: ["provision"],
    moments: ["mosque"],
    situations: { en: ["at the mosque door"], tr: ["mescidin kapısında"] },
  },
  {
    id: "muhammad-asaluka-min-fadlik",
    title: { en: "Leaving the mosque", tr: "Mescitten çıkarken" },
    ref: { book: "muslim", datasetNumber: 1652, number: 713, variant: 1 },
    excerpt: { fromWord: 47, toWord: 52 },
    translations: {
      en: "O Allah, I ask You of Your bounty.",
      tr: "Allah'ım! Senden lütfunu isterim.",
    },
    context: {
      en: "From the same report: the Messenger of Allah ﷺ taught that one entering the mosque asks for mercy, and one leaving it asks for bounty.",
      tr: "Aynı rivayetten: Resûlullah ﷺ mescide giren kişinin rahmet, çıkan kişinin de lütuf istemesini öğretti.",
    },
    themes: ["provision"],
    moments: ["mosque"],
    situations: {
      en: ["going back out to work and the day"],
      tr: ["işe ve günün telaşına geri dönerken"],
    },
  },
  {
    id: "muhammad-allahumma-antas-salam",
    title: { en: "You are Peace", tr: "Sen Selâm'sın" },
    ref: { book: "muslim", datasetNumber: 1334, number: 591 },
    excerpt: { fromWord: 36, toWord: 45 },
    translations: {
      en: "O Allah, You are Peace, and from You is peace. Blessed are You, Possessor of majesty and honour.",
      tr: "Allah'ım! Sen Selâm'sın, selâmet de Sendendir. Ey celâl ve ikrâm sahibi, Sen ne yücesin!",
    },
    context: {
      en: "Thawbān reports that when the Messenger of Allah ﷺ finished his prayer he would seek forgiveness three times and then say this. In the same report al-Awzāʿī explains the seeking of forgiveness as saying “astaghfiru-llāh, astaghfiru-llāh”.",
      tr: "Sevbân'ın rivayetine göre Resûlullah ﷺ namazını bitirince üç kez istiğfar eder, sonra bunu söylerdi. Aynı rivayette Evzâî istiğfarı “estağfirullah, estağfirullah” demek olarak açıklar.",
    },
    themes: ["gratitude"],
    moments: ["after-prayer"],
    form: "dhikr",
    situations: { en: ["immediately after the salām"], tr: ["selâm verir vermez"] },
  },
  {
    id: "muhammad-allahumma-ainni-ala-dhikrik",
    title: { en: "Help me to remember You", tr: "Seni anmama yardım et" },
    ref: { book: "abudawud", datasetNumber: 1522, number: 1522 },
    excerpt: { fromWord: 63, toWord: 70 },
    translations: {
      en: "O Allah, help me to remember You, to thank You, and to worship You well.",
      tr: "Allah'ım! Seni anmak, Sana şükretmek ve Sana güzelce ibadet etmek için bana yardım et.",
    },
    context: {
      en: "Muʿādh ibn Jabal reports that the Messenger of Allah ﷺ took him by the hand and said, “Muʿādh, by Allah, I love you.” Then he said: “I counsel you, Muʿādh, never to leave off saying at the end of every prayer…” and taught him these words.",
      tr: "Muâz b. Cebel'in rivayetine göre Resûlullah ﷺ onun elini tuttu ve “Ey Muâz, vallahi seni seviyorum” dedi. Sonra şöyle buyurdu: “Ey Muâz, sana tavsiye ederim: Her namazın sonunda şunu söylemeyi asla bırakma…” ve ona bu kelimeleri öğretti.",
    },
    themes: ["gratitude", "steadfastness"],
    moments: ["after-prayer"],
    situations: {
      en: ["at the end of every prayer", "when worship has become routine"],
      tr: ["her namazın sonunda", "ibadet alışkanlığa dönüştüğünde"],
    },
  },
  {
    id: "muhammad-alhamdu-lillahi-alladhi-atamani",
    title: { en: "After eating", tr: "Yemekten sonra" },
    ref: { book: "tirmidhi", datasetNumber: 3458, number: 3458 },
    excerpt: { fromWord: 38, toWord: 50 },
    translations: {
      en: "All praise is for Allah, who fed me this and provided it for me without any power or strength on my part.",
      tr: "Bana bunu yediren ve benden hiçbir güç ve kuvvet olmaksızın onu bana rızık olarak veren Allah'a hamdolsun.",
    },
    context: {
      en: "Muʿādh ibn Anas reports that the Messenger of Allah ﷺ said: whoever eats food and then says this, his past sins are forgiven.",
      tr: "Muâz b. Enes'in rivayetine göre Resûlullah ﷺ şöyle buyurdu: Kim bir yemek yer, sonra bunu söylerse geçmiş günahları bağışlanır.",
    },
    themes: ["gratitude", "provision"],
    moments: ["eating"],
    form: "dhikr",
    situations: { en: ["after every meal"], tr: ["her yemekten sonra"] },
  },
  {
    id: "muhammad-dua-al-safar",
    title: { en: "Setting out on a journey", tr: "Yolculuğa çıkarken" },
    ref: { book: "muslim", datasetNumber: 3275, number: 1342 },
    excerpt: { fromWord: 43, toWord: 98 },
    translations: {
      en: "Glory be to the One who has made this subservient to us, for we could never have done it ourselves, and to our Lord we shall surely return. O Allah, on this journey of ours we ask You for righteousness and piety, and for deeds that please You. O Allah, make this journey easy for us and fold up its distance for us. O Allah, You are the Companion on the journey and the One who watches over the family. O Allah, I seek refuge in You from the hardship of travel, from a distressing sight, and from an ill return to wealth and family.",
      tr: "Bunu bizim hizmetimize veren Allah'ın şanı yücedir; yoksa biz buna güç yetiremezdik. Şüphesiz biz Rabbimize döneceğiz. Allah'ım! Bu yolculuğumuzda Senden iyilik ve takva, razı olacağın ameller isteriz. Allah'ım! Bu yolculuğu bize kolaylaştır, uzaklığını bize yakın kıl. Allah'ım! Yolculukta yoldaş, geride kalan ailede gözeten Sensin. Allah'ım! Yolculuğun sıkıntısından, üzücü bir manzaradan, dönüşte malda ve ailede kötü bir hâlle karşılaşmaktan Sana sığınırım.",
    },
    context: {
      en: "Ibn ʿUmar taught that when the Messenger of Allah ﷺ mounted his camel to set out on a journey, he would say “Allāhu akbar” three times and then say this. Its opening words are the Qurʾān's own (43:13–14). On his return he said the same, adding: “Returning, repenting, worshipping, and praising our Lord.”",
      tr: "İbn Ömer'in öğrettiğine göre Resûlullah ﷺ yolculuğa çıkmak üzere devesine binince üç kez “Allâhu ekber” der, sonra bunu söylerdi. Baştaki sözler Kur'ân'dandır (43:13–14). Dönüşte de aynısını söyler ve şunu eklerdi: “Dönüyoruz, tövbe ediyoruz, ibadet ediyoruz ve Rabbimize hamdediyoruz.”",
    },
    themes: ["protection", "family"],
    moments: ["travel"],
    situations: {
      en: ["as the car, train or plane sets off", "leaving family behind for a while"],
      tr: ["araba, tren ya da uçak yola çıkarken", "aileyi bir süre geride bırakırken"],
    },
  },
  {
    id: "muhammad-sayyiban-nafian",
    title: { en: "When it rains", tr: "Yağmur yağınca" },
    ref: { book: "bukhari", datasetNumber: 1032, number: 1032 },
    excerpt: { fromWord: 36, toWord: 38 },
    translations: {
      en: "(O Allah, make it) a beneficial rain.",
      tr: "(Allah'ım, bunu) faydalı bir yağmur (kıl).",
    },
    context: {
      en: "ʿĀʾishah reports that when the Messenger of Allah ﷺ saw rain he would say this. Some printed editions begin it with “O Allah”; the words in brackets complete the sense.",
      tr: "Âişe, Resûlullah'ın ﷺ yağmur gördüğünde bunu söylediğini rivayet eder. Bazı basılı nüshalar sözü “Allah'ım” diye başlatır; parantez içindeki kelimeler anlamı tamamlar.",
    },
    themes: ["gratitude", "provision"],
    moments: ["rain"],
    situations: { en: ["at the first drops"], tr: ["ilk damlalarda"] },
  },
  {
    id: "muhammad-adhhib-al-bas",
    title: { en: "Remove the harm, Lord of mankind", tr: "Sıkıntıyı gider, ey insanların Rabbi" },
    ref: { book: "bukhari", datasetNumber: 5675, number: 5675 },
    excerpt: { fromWord: 33, toWord: 48 },
    translations: {
      en: "Remove the harm, Lord of mankind, and heal, for You are the Healer. There is no healing but Your healing — a healing that leaves no illness behind.",
      tr: "Sıkıntıyı gider, ey insanların Rabbi! Şifa ver, şifa veren Sensin. Senin şifandan başka şifa yoktur. Hiçbir hastalık bırakmayan bir şifa ver.",
    },
    context: {
      en: "ʿĀʾishah reports that when the Messenger of Allah ﷺ visited someone who was ill, or an ill person was brought to him, he would say this.",
      tr: "Âişe, Resûlullah'ın ﷺ bir hastayı ziyaret ettiğinde ya da kendisine bir hasta getirildiğinde bunu söylediğini rivayet eder.",
    },
    themes: ["illness"],
    moments: ["illness"],
    situations: {
      en: ["visiting someone who is ill", "beside a sickbed, your own or another's"],
      tr: ["bir hastayı ziyaret ederken", "kendinizin ya da bir başkasının hasta yatağı başında"],
    },
  },
  {
    id: "muhammad-audhu-billahi-wa-qudratih",
    title: { en: "For pain in the body", tr: "Bedendeki bir ağrı için" },
    ref: { book: "muslim", datasetNumber: 5737, number: 2202 },
    excerpt: { fromWord: 64, toWord: 72 },
    translations: {
      en: "I seek refuge in Allah and His power from the evil of what I feel and what I fear.",
      tr: "Hissettiğim ve endişe ettiğim şeyin şerrinden Allah'a ve O'nun kudretine sığınırım.",
    },
    context: {
      en: "ʿUthmān ibn Abī al-ʿĀṣ complained to the Messenger of Allah ﷺ of a pain he had felt in his body since becoming Muslim. He told him: place your hand on the part of your body that hurts and say “Bismillāh” three times, then say these words seven times.",
      tr: "Osman b. Ebi'l-Âs, Müslüman olduğundan beri bedeninde hissettiği bir ağrıyı Resûlullah'a ﷺ şikâyet etti. O da şöyle buyurdu: Elini bedeninin ağrıyan yerine koy, üç kez “Bismillâh” de, sonra yedi kez bu sözleri söyle.",
    },
    themes: ["illness"],
    moments: ["illness"],
    form: "istiadha",
    situations: {
      en: ["with your hand on the place that hurts"],
      tr: ["eliniz ağrıyan yerin üzerindeyken"],
    },
  },
  {
    id: "muhammad-la-ilaha-illa-allah-al-azim-al-halim",
    title: { en: "Words for a moment of anguish", tr: "Sıkıntı anının duası" },
    ref: { book: "bukhari", datasetNumber: 6346, number: 6346 },
    excerpt: { fromWord: 29, toWord: 53 },
    translations: {
      en: "There is no god but Allah, the Mighty, the Forbearing. There is no god but Allah, Lord of the Mighty Throne. There is no god but Allah, Lord of the heavens, Lord of the earth, and Lord of the Noble Throne.",
      tr: "Azîm ve Halîm olan Allah'tan başka ilâh yoktur. Büyük Arş'ın Rabbi olan Allah'tan başka ilâh yoktur. Göklerin Rabbi, yerin Rabbi ve şerefli Arş'ın Rabbi olan Allah'tan başka ilâh yoktur.",
    },
    context: {
      en: "Ibn ʿAbbās reports that the Messenger of Allah ﷺ used to say this at times of anguish.",
      tr: "İbn Abbâs, Resûlullah'ın ﷺ sıkıntı anlarında bunu söylediğini rivayet eder.",
    },
    themes: ["distress"],
    moments: ["distress"],
    form: "dhikr",
    situations: {
      en: ["when the news is bad and there is nothing to do yet", "the moment fear arrives"],
      tr: ["haber kötü ve henüz yapılacak bir şey yokken", "korkunun geldiği anda"],
    },
  },
  {
    id: "muhammad-allahu-rabbi-la-ushriku-bihi",
    title: { en: "Allah, Allah is my Lord", tr: "Allah, Allah Rabbimdir" },
    ref: { book: "abudawud", datasetNumber: 1525, number: 1525 },
    excerpt: { fromWord: 44, toWord: 51 },
    translations: {
      en: "Allah, Allah is my Lord; I associate nothing with Him.",
      tr: "Allah, Allah benim Rabbimdir; O'na hiçbir şeyi ortak koşmam.",
    },
    context: {
      en: "Asmāʾ bint ʿUmays reports that the Messenger of Allah ﷺ said to her, “Shall I not teach you words to say at a time of distress?” — and taught her this.",
      tr: "Esmâ bint Umeys'in rivayetine göre Resûlullah ﷺ ona “Sana sıkıntı anında söyleyeceğin kelimeler öğreteyim mi?” dedi ve bunu öğretti.",
    },
    themes: ["distress"],
    moments: ["distress"],
    form: "dhikr",
    situations: {
      en: ["when you have no words of your own left"],
      tr: ["kendi sözleriniz tükendiğinde"],
    },
  },
  {
    id: "muhammad-allahumma-inni-audhu-bika-min-zawal-nimatik",
    title: { en: "From the loss of Your blessing", tr: "Nimetinin yok olmasından" },
    ref: { book: "muslim", datasetNumber: 6944, number: 2739 },
    excerpt: { fromWord: 40, toWord: 53 },
    translations: {
      en: "O Allah, I seek refuge in You from the passing of Your blessing, from the changing of the wellbeing You have given, from the suddenness of Your punishment, and from all Your displeasure.",
      tr: "Allah'ım! Nimetinin yok olmasından, verdiğin afiyetin değişmesinden, azabının ansızın gelmesinden ve her türlü gazabından Sana sığınırım.",
    },
    context: {
      en: "ʿAbdullāh ibn ʿUmar reports that this was among the supplications of the Messenger of Allah ﷺ.",
      tr: "Abdullah b. Ömer, bunun Resûlullah'ın ﷺ dualarından olduğunu rivayet eder.",
    },
    themes: ["gratitude", "protection"],
    form: "istiadha",
    situations: {
      en: ["when things are going well", "when you fear losing what you have"],
      tr: ["işler yolundayken", "sahip olduklarınızı kaybetmekten korktuğunuzda"],
    },
  },
  {
    id: "muhammad-ya-muqallib-al-qulub",
    title: { en: "Turner of hearts", tr: "Ey kalpleri çeviren" },
    ref: { book: "tirmidhi", datasetNumber: 3522, number: 3522 },
    excerpt: { fromWord: 41, toWord: 48 },
    translations: {
      en: "O Turner of hearts, make my heart firm upon Your religion.",
      tr: "Ey kalpleri evirip çeviren! Kalbimi dinin üzere sabit kıl.",
    },
    context: {
      en: "Shahr ibn Ḥawshab asked Umm Salamah what the Messenger of Allah ﷺ most often supplicated with when he was with her. She said it was this, and that when she asked him why, he said: “There is no human being whose heart is not between two of the fingers of Allah; whom He wills He keeps upright, and whom He wills He lets deviate.”",
      tr: "Şehr b. Havşeb, Ümmü Seleme'ye Resûlullah'ın ﷺ onun yanındayken en çok hangi duayı ettiğini sordu. O da bunun bu dua olduğunu söyledi; sebebini sorduğunda Resûlullah'ın şöyle buyurduğunu aktardı: “Kalbi Allah'ın parmaklarından iki parmak arasında olmayan hiçbir insan yoktur; dilediğini dosdoğru tutar, dilediğini de kaydırır.”",
    },
    themes: ["steadfastness", "guidance"],
    situations: {
      en: ["when your faith feels thin", "when you fear your heart changing"],
      tr: ["imanınızın zayıfladığını hissettiğinizde", "kalbinizin değişmesinden korktuğunuzda"],
    },
  },
  {
    id: "muhammad-istikhara",
    title: { en: "Asking Allah to choose", tr: "İstihâre duası" },
    ref: { book: "bukhari", datasetNumber: 6382, number: 6382 },
    excerpt: { fromWord: 44, toWord: 116 },
    translations: {
      en: "O Allah, I ask You to choose for me by Your knowledge, and I ask You to enable me by Your power, and I ask You of Your immense bounty. For You are able and I am not; You know and I do not; and You are the Knower of the unseen. O Allah, if You know that this matter is good for me in my religion, my livelihood and the outcome of my affairs — or he said: in my affairs now and later — then decree it for me. And if You know that this matter is bad for me in my religion, my livelihood and the outcome of my affairs — or he said: in my affairs now and later — then turn it away from me and turn me away from it, and decree for me the good wherever it may be, and then make me content with it.",
      tr: "Allah'ım! İlminle Senden hayır diliyorum, kudretinle Senden güç istiyorum ve büyük lütfundan Senden istiyorum. Çünkü Sen güç yetirirsin, ben yetiremem; Sen bilirsin, ben bilemem; gaybları bilen Sensin. Allah'ım! Eğer bu işin dinim, geçimim ve işimin sonu bakımından —ya da şöyle dedi: işimin şimdisi ve sonrası bakımından— benim için hayırlı olduğunu biliyorsan onu bana takdir et. Eğer bu işin dinim, geçimim ve işimin sonu bakımından —ya da şöyle dedi: işimin şimdisi ve sonrası bakımından— benim için kötü olduğunu biliyorsan onu benden, beni de ondan uzaklaştır; hayır nerede ise onu bana takdir et, sonra beni ona razı kıl.",
    },
    context: {
      en: "Jābir reports that the Prophet ﷺ taught them istikhārah in all their affairs as he taught them a sūrah of the Qurʾān: when one of you intends something, let him pray two rakʿahs and then say this — naming his matter where it says “this matter”. “Or he said” marks the narrator's uncertainty over which of the two wordings was used.",
      tr: "Câbir'in rivayetine göre Peygamber ﷺ onlara bütün işlerinde istihâreyi, Kur'ân'dan bir sûre öğretir gibi öğretirdi: Biriniz bir işe niyet ettiğinde iki rekât namaz kılsın, sonra bunu söylesin ve “bu iş” dediği yerde kendi işini ansın. “Ya da şöyle dedi” ifadesi, râvinin iki lafızdan hangisinin söylendiğinden emin olmadığını gösterir.",
    },
    themes: ["guidance"],
    situations: {
      en: ["before a decision you cannot see the end of"],
      tr: ["sonunu göremediğiniz bir karardan önce"],
    },
  },
  {
    id: "muhammad-bismika-amutu-wa-ahya",
    title: { en: "Going to sleep", tr: "Uyurken" },
    ref: { book: "bukhari", datasetNumber: 6312, number: 6312 },
    excerpt: { fromWord: 25, toWord: 28 },
    translations: {
      en: "In Your name I die and I live.",
      tr: "Senin adınla ölür ve dirilirim.",
    },
    context: {
      en: "Ḥudhayfah reports that when the Prophet ﷺ went to his bed he would say this; and when he rose, “All praise is for Allah, who gave us life after He had caused us to die, and to Him is the rising.”",
      tr: "Huzeyfe'nin rivayetine göre Peygamber ﷺ yatağına girdiğinde bunu, kalktığında da “Bizi öldürdükten sonra dirilten Allah'a hamdolsun; diriliş de O'nadır” derdi.",
    },
    themes: ["hereafter"],
    moments: ["sleep"],
    form: "dhikr",
    situations: { en: ["the last words of the day"], tr: ["günün son sözü olarak"] },
  },
  {
    id: "muhammad-allahumma-qini-adhabak",
    title: { en: "Protect me from Your punishment", tr: "Beni azabından koru" },
    ref: { book: "abudawud", datasetNumber: 5045, number: 5045 },
    excerpt: { fromWord: 41, toWord: 47 },
    translations: {
      en: "O Allah, protect me from Your punishment on the day You raise up Your servants.",
      tr: "Allah'ım! Kullarını dirilttiğin gün beni azabından koru.",
    },
    context: {
      en: "Ḥafṣah, wife of the Prophet ﷺ, reports that when the Messenger of Allah ﷺ wanted to sleep he would place his right hand under his cheek and say this three times.",
      tr: "Peygamber'in ﷺ hanımı Hafsa'nın rivayetine göre Resûlullah ﷺ uyumak istediğinde sağ elini yanağının altına koyar ve bunu üç kez söylerdi.",
    },
    themes: ["hereafter", "protection"],
    moments: ["sleep"],
    situations: {
      en: ["lying down, right hand under the cheek"],
      tr: ["sağ el yanağın altında, yatarken"],
    },
  },
];
