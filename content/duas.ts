/**
 * The duʿāʾ inventory.
 *
 * **There is no Arabic in this file, and there never will be.** Each entry
 * names its āyāt and, where the supplication sits inside a longer verse, the
 * half-open word range `[fromWord, toWord)` that isolates it. `npm run
 * content:fetch` resolves those into text from the `quran-uthmani` edition and
 * writes `content.lock.json`; `npm run content:verify` fails CI if a byte
 * drifts.
 *
 * Every word range below was chosen by reading `scripts/inspect-ayah.ts`
 * output against the Pickthall gloss — never by typing or recalling Arabic.
 * The `excerptNote` states what was cut, and the UI discloses it, so a reader
 * can always tell a whole āyah from a fragment. The Phase 1 audit found 16
 * silent excerpts in the old corpus and two places where a cut had been
 * papered over with invented words; this structure makes both impossible.
 *
 * `legacyId` maps back to `data/prayers.json` so `scripts/migrate-legacy.ts`
 * can carry the existing Turkish translations, context and reflections
 * forward. Entries without a `legacyId` are new.
 */

import type { AyahRef } from "./schema.js";

export type DuaSeed = {
  id: string;
  speaker: string;
  legacyId?: string;
  title: { en: string; tr: string };
  ayat: AyahRef[];
  /** Half-open [fromWord, toWord). Omit when the duʿāʾ is the whole passage. */
  excerpt?: { fromWord: number; toWord: number; note: string };
  themes: string[];
  form?: "dua" | "statement" | "istiadha" | "dhikr";
  situations: { en: string[]; tr: string[] };
};

const a = (surah: number, ...ayat: number[]): AyahRef[] =>
  ayat.map((ayah) => ({ surah, ayah }));

const range = (surah: number, from: number, to: number): AyahRef[] =>
  Array.from({ length: to - from + 1 }, (_, i) => ({ surah, ayah: from + i }));

/** Standard excerpt notes, so the wording stays consistent across 60 entries. */
const CUT = {
  preamble: "Opens mid-āyah; the narrative introduction is not part of the supplication.",
  saidThat: "Opens after the verb of speech introducing the supplication.",
  tail: "Ends before the āyah's closing narration.",
  both: "Both the narrative introduction and the closing narration are outside the supplication.",
} as const;

export const DUA_SEEDS: DuaSeed[] = [
  /* ------------------------------- Ādam ------------------------------- */
  {
    id: "adam-rabbana-zalamna-anfusana",
    speaker: "adam",
    legacyId: "adam-7-23",
    title: { en: "We have wronged ourselves", tr: "Kendimize zulmettik" },
    ayat: a(7, 23),
    excerpt: { fromWord: 1, toWord: 12, note: CUT.saidThat },
    themes: ["forgiveness"],
    situations: {
      en: ["after doing something you cannot justify", "when you want to stop making excuses"],
      tr: ["savunamayacağınız bir şey yaptıktan sonra", "mazeret üretmeyi bırakmak istediğinizde"],
    },
  },

  /* -------------------------------- Nūḥ ------------------------------- */
  {
    id: "nuh-rabbi-ighfir-li-wa-liwalidayya",
    speaker: "nuh",
    legacyId: "nuh-71-28",
    title: { en: "Forgive me, my parents, and the believers", tr: "Beni, anne babamı ve müminleri bağışla" },
    ayat: a(71, 28),
    themes: ["forgiveness", "family"],
    situations: {
      en: ["praying for parents, living or dead", "when you want to include more than yourself"],
      tr: ["yaşayan ya da vefat etmiş anne baba için dua ederken", "duanıza kendinizden fazlasını katmak istediğinizde"],
    },
  },
  {
    id: "nuh-rabbi-anzilni-munzalan-mubarakan",
    speaker: "nuh",
    legacyId: "nuh-23-29",
    title: { en: "A blessed landing place", tr: "Mübarek bir konak" },
    ayat: a(23, 29),
    excerpt: { fromWord: 1, toWord: 8, note: CUT.saidThat },
    themes: ["provision", "protection"],
    situations: {
      en: ["moving house", "arriving somewhere new", "starting again after upheaval"],
      tr: ["ev değiştirirken", "yeni bir yere varırken", "büyük bir alt üst oluştan sonra yeniden başlarken"],
    },
  },
  {
    id: "nuh-anni-maghlubun-fantasir",
    speaker: "nuh",
    title: { en: "I am overcome, so help", tr: "Ben yenik düştüm, yardım et" },
    ayat: a(54, 10),
    excerpt: { fromWord: 2, toWord: 5, note: CUT.saidThat },
    themes: ["distress", "injustice", "strength"],
    situations: {
      en: ["when you have run out of your own strength", "outnumbered and out of arguments"],
      tr: ["kendi gücünüz tükendiğinde", "sayıca ve delil bakımından yenik düştüğünüzde"],
    },
  },
  {
    id: "nuh-rabbi-unsurni-bima-kadhdhabun",
    speaker: "nuh",
    legacyId: "nuh-23-26",
    title: { en: "Help me, for they have denied me", tr: "Beni yalanladıkları için bana yardım et" },
    ayat: a(23, 26),
    excerpt: { fromWord: 1, toWord: 5, note: CUT.saidThat },
    themes: ["injustice", "strength", "distress"],
    situations: {
      en: ["when you are disbelieved by the people you were trying to help"],
      tr: ["yardım etmeye çalıştığınız insanlar size inanmadığında"],
    },
  },
  {
    id: "nuh-rabbi-inni-audhu-bika",
    speaker: "nuh",
    legacyId: "nuh-11-47",
    title: { en: "I seek refuge from asking what I do not know", tr: "Bilmediğim şeyi istemekten sana sığınırım" },
    ayat: a(11, 47),
    excerpt: { fromWord: 1, toWord: 19, note: CUT.saidThat },
    themes: ["forgiveness", "knowledge", "protection"],
    situations: {
      en: ["after asking for something you should not have", "when you realise you were wrong to ask"],
      tr: ["istememeniz gereken bir şeyi istedikten sonra", "istemekle hata ettiğinizi fark ettiğinizde"],
    },
  },
  {
    id: "nuh-rabbi-la-tadhar-ala-al-ard",
    speaker: "nuh",
    legacyId: "nuh-71-26",
    title: { en: "Against those who would not stop", tr: "Vazgeçmeyenlere karşı" },
    ayat: a(71, 26),
    excerpt: { fromWord: 2, toWord: 10, note: CUT.saidThat },
    themes: ["injustice"],
    situations: {
      en: ["after every appeal has been exhausted"],
      tr: ["her çağrı tükendikten sonra"],
    },
  },
  {
    id: "nuh-rabbi-inna-qawmi-kadhdhabuni",
    speaker: "nuh",
    title: { en: "My people have denied me", tr: "Kavmim beni yalanladı" },
    ayat: range(26, 117, 118),
    excerpt: { fromWord: 1, toWord: 14, note: CUT.saidThat },
    themes: ["injustice", "distress"],
    situations: {
      en: ["when you are not believed", "when the people closest to the work reject it"],
      tr: ["size inanılmadığında", "işe en yakın olanlar onu reddettiğinde"],
    },
  },

  /* ------------------------------ Ibrāhīm ----------------------------- */
  {
    id: "ibrahim-rabbi-ijal-hadha-baladan-aminan",
    speaker: "ibrahim",
    legacyId: "ibrahim-2-126",
    title: { en: "Make this a place of safety", tr: "Burayı güvenli bir belde kıl" },
    ayat: a(2, 126),
    excerpt: { fromWord: 3, toWord: 18, note: CUT.both },
    themes: ["protection", "provision", "family"],
    situations: {
      en: ["praying for the place you live", "for a city in danger"],
      tr: ["yaşadığınız yer için dua ederken", "tehlikedeki bir şehir için"],
    },
  },
  {
    id: "ibrahim-rabbana-taqabbal-minna",
    speaker: "ibrahim",
    legacyId: "ibrahim-2-127",
    title: { en: "Accept this from us", tr: "Bunu bizden kabul buyur" },
    ayat: range(2, 127, 129),
    excerpt: { fromWord: 7, toWord: 47, note: CUT.preamble },
    themes: ["gratitude", "family", "guidance"],
    situations: {
      en: ["after finishing something you built", "when you want the work accepted, not just done"],
      tr: ["inşa ettiğiniz bir işi bitirdikten sonra", "işin sadece bitmesini değil kabul edilmesini istediğinizde"],
    },
  },
  {
    id: "ibrahim-rabbi-ijal-hadha-al-balada-aminan",
    speaker: "ibrahim",
    legacyId: "ibrahim-14-35",
    title: { en: "Keep me and my sons from idols", tr: "Beni ve oğullarımı putlardan uzak tut" },
    ayat: a(14, 35),
    excerpt: { fromWord: 3, toWord: 13, note: CUT.saidThat },
    themes: ["protection", "family", "guidance"],
    situations: {
      en: ["praying for your children's belief", "when you fear what your family will drift toward"],
      tr: ["çocuklarınızın imanı için dua ederken", "ailenizin neye savrulacağından korktuğunuzda"],
    },
  },
  {
    id: "ibrahim-rabbana-inni-askantu",
    speaker: "ibrahim",
    legacyId: "ibrahim-14-36",
    title: { en: "The prayer of the empty valley", tr: "Issız vadinin duası" },
    ayat: range(14, 36, 41),
    themes: ["family", "provision", "forgiveness", "children"],
    situations: {
      en: ["leaving family somewhere you cannot protect them", "praying for descendants you will not meet"],
      tr: ["ailenizi koruyamayacağınız bir yerde bırakırken", "göremeyeceğiniz nesiller için dua ederken"],
    },
  },
  {
    id: "ibrahim-rabbi-hab-li-hukman",
    speaker: "ibrahim",
    legacyId: "ibrahim-26-83",
    title: { en: "Wisdom, and to be joined to the righteous", tr: "Hikmet ve salihlere katılmak" },
    ayat: range(26, 83, 89),
    themes: ["guidance", "hereafter", "family", "forgiveness"],
    situations: {
      en: ["when you want to be remembered well", "praying for a parent who does not share your belief"],
      tr: ["hayırla anılmak istediğinizde", "inancınızı paylaşmayan bir ebeveyn için dua ederken"],
    },
  },
  {
    id: "ibrahim-rabbi-hab-li-mina-al-salihin",
    speaker: "ibrahim",
    legacyId: "ibrahim-37-100",
    title: { en: "Grant me one of the righteous", tr: "Bana salihlerden birini bağışla" },
    ayat: a(37, 100),
    themes: ["children", "family"],
    situations: {
      en: ["asking for a child", "when you want the child more than you want anything"],
      tr: ["evlat isterken", "evladı her şeyden çok istediğinizde"],
    },
  },
  {
    id: "ibrahim-rabbana-alayka-tawakkalna",
    speaker: "ibrahim",
    title: { en: "In You we have put our trust", tr: "Sana tevekkül ettik" },
    ayat: a(60, 4),
    excerpt: { fromWord: 45, toWord: 52, note: CUT.preamble },
    themes: ["steadfastness", "distress"],
    situations: {
      en: ["after a break with people you cannot go back to", "when the decision is made and the cost is coming"],
      tr: ["dönemeyeceğiniz kişilerle yollar ayrıldıktan sonra", "karar verilmiş ve bedeli yaklaşıyorken"],
    },
  },
  {
    id: "ibrahim-rabbana-la-tajalna-fitnatan",
    speaker: "ibrahim",
    title: { en: "Do not make us a trial for the disbelievers", tr: "Bizi inkâr edenler için bir fitne kılma" },
    ayat: a(60, 5),
    themes: ["protection", "steadfastness"],
    situations: {
      en: ["when your failure would be used against what you believe"],
      tr: ["başarısızlığınız inancınıza karşı kullanılacaksa"],
    },
  },

  /* -------------------------------- Lūṭ ------------------------------- */
  {
    id: "lut-rabbi-najjini-wa-ahli",
    speaker: "lut",
    legacyId: "lut-26-169",
    title: { en: "Save me and my household", tr: "Beni ve ailemi kurtar" },
    ayat: a(26, 169),
    themes: ["protection", "family"],
    situations: {
      en: ["when you cannot change your surroundings and want your family kept from them"],
      tr: ["çevrenizi değiştiremiyorken ailenizin ondan korunmasını istediğinizde"],
    },
  },
  {
    id: "lut-rabbi-unsurni-ala-al-qawm-al-mufsidin",
    speaker: "lut",
    title: { en: "Help me against the corrupters", tr: "Bozguncu topluluğa karşı bana yardım et" },
    ayat: a(29, 30),
    excerpt: { fromWord: 1, toWord: 6, note: CUT.saidThat },
    themes: ["injustice", "strength"],
    situations: {
      en: ["standing alone against something organised"],
      tr: ["örgütlü bir şeyin karşısında yalnız dururken"],
    },
  },

  /* ------------------------------- Yaʿqūb ----------------------------- */
  {
    id: "yaqub-innama-ashku-baththi",
    speaker: "yaqub",
    title: { en: "I complain of my grief only to Allah", tr: "Kederimi yalnız Allah'a arz ederim" },
    ayat: a(12, 86),
    excerpt: { fromWord: 1, toWord: 13, note: CUT.saidThat },
    themes: ["grief"],
    form: "statement",
    situations: {
      en: ["grief you are tired of explaining to people", "when sympathy has run out and the loss has not"],
      tr: ["insanlara anlatmaktan yorulduğunuz bir keder", "teselli tükendiğinde ama kayıp sürerken"],
    },
  },
  {
    id: "yaqub-fa-sabrun-jamil",
    speaker: "yaqub",
    title: { en: "Beautiful patience", tr: "Güzel bir sabır" },
    ayat: a(12, 18),
    excerpt: { fromWord: 11, toWord: 18, note: CUT.preamble },
    themes: ["grief", "steadfastness"],
    form: "statement",
    situations: {
      en: ["when you have been lied to and cannot prove it"],
      tr: ["size yalan söylendiğinde ve bunu ispat edemediğinizde"],
    },
  },

  /* -------------------------------- Yūsuf ----------------------------- */
  {
    id: "yusuf-rabbi-al-sijnu-ahabbu-ilayya",
    speaker: "yusuf",
    title: { en: "Prison is dearer to me", tr: "Zindan bana daha sevimlidir" },
    ayat: a(12, 33),
    excerpt: { fromWord: 1, toWord: 17, note: CUT.saidThat },
    themes: ["protection", "steadfastness"],
    situations: {
      en: ["choosing the harder option to avoid the wrong one", "when temptation is also the safer path"],
      tr: ["yanlıştan kaçınmak için zor olanı seçerken", "günah aynı zamanda daha güvenli yolken"],
    },
  },
  {
    id: "yusuf-tawaffani-musliman",
    speaker: "yusuf",
    legacyId: "yusuf-12-101",
    title: { en: "Let me die in submission", tr: "Canımı Müslüman olarak al" },
    ayat: a(12, 101),
    themes: ["gratitude", "hereafter"],
    situations: {
      en: ["after long-delayed relief finally arrives", "when everything has been restored and you want to end well"],
      tr: ["uzun süre gecikmiş bir ferahlık nihayet geldiğinde", "her şey geri verildiğinde ve güzel bir son istediğinizde"],
    },
  },

  /* -------------------------------- Ayyūb ----------------------------- */
  {
    id: "ayyub-anni-massaniya-al-durr",
    speaker: "ayyub",
    legacyId: "ayyub-21-83",
    title: { en: "Affliction has touched me", tr: "Bana bir dert dokundu" },
    ayat: a(21, 83),
    excerpt: { fromWord: 4, toWord: 10, note: CUT.saidThat },
    themes: ["illness", "distress", "grief"],
    situations: {
      en: ["long illness", "pain you have stopped describing to people"],
      tr: ["uzun süren hastalık", "insanlara anlatmaktan vazgeçtiğiniz bir acı"],
    },
  },
  {
    id: "ayyub-anni-massaniya-al-shaytan",
    speaker: "ayyub",
    legacyId: "ayyub-38-41",
    title: { en: "With distress and torment", tr: "Bir yorgunluk ve azapla" },
    ayat: a(38, 41),
    excerpt: { fromWord: 6, toWord: 11, note: CUT.saidThat },
    themes: ["illness", "distress", "protection"],
    situations: {
      en: ["exhaustion that feels like it is being aimed at you"],
      tr: ["size yöneltilmiş gibi hissettiren bir bitkinlik"],
    },
  },

  /* ------------------------------- Shuʿayb ---------------------------- */
  {
    id: "shuayb-rabbana-iftah-baynana",
    speaker: "shuayb",
    title: { en: "Decide between us with truth", tr: "Bizimle kavmimiz arasında hak ile hükmet" },
    ayat: a(7, 89),
    excerpt: { fromWord: 33, toWord: 42, note: CUT.preamble },
    themes: ["injustice", "steadfastness", "guidance"],
    situations: {
      en: ["a dispute that cannot be settled between the parties", "when you are pressured to go back on something"],
      tr: ["taraflar arasında çözülemeyen bir anlaşmazlık", "bir şeyden dönmeniz için baskı gördüğünüzde"],
    },
  },

  /* -------------------------------- Mūsā ------------------------------ */
  {
    id: "musa-rabbi-ishrah-li-sadri",
    speaker: "musa",
    legacyId: "musa-20-25",
    title: { en: "Expand my chest, ease my task", tr: "Göğsümü aç, işimi kolaylaştır" },
    ayat: range(20, 25, 28),
    excerpt: { fromWord: 1, toWord: 14, note: CUT.saidThat },
    themes: ["strength", "knowledge", "fear"],
    situations: {
      en: ["before speaking to someone who frightens you", "before a task you do not feel equal to", "before an exam or interview"],
      tr: ["sizi korkutan biriyle konuşmadan önce", "kendinizi yeterli hissetmediğiniz bir işten önce", "sınav ya da mülakat öncesi"],
    },
  },
  {
    id: "musa-rabbi-inni-zalamtu-nafsi",
    speaker: "musa",
    legacyId: "musa-28-16",
    title: { en: "I have wronged myself, so forgive me", tr: "Kendime zulmettim, beni bağışla" },
    ayat: a(28, 16),
    excerpt: { fromWord: 1, toWord: 7, note: CUT.both },
    themes: ["forgiveness"],
    situations: {
      en: ["after harming someone in anger", "when the consequence is already irreversible"],
      tr: ["öfkeyle birine zarar verdikten sonra", "sonuç artık geri döndürülemezken"],
    },
  },
  {
    id: "musa-rabbi-najjini-mina-al-qawm-al-zalimin",
    speaker: "musa",
    legacyId: "musa-28-21",
    title: { en: "Save me from the wrongdoing people", tr: "Beni zalim topluluktan kurtar" },
    ayat: a(28, 21),
    excerpt: { fromWord: 5, toWord: 10, note: CUT.saidThat },
    themes: ["fear", "protection", "injustice"],
    situations: {
      en: ["fleeing", "when you are being looked for"],
      tr: ["kaçarken", "aranıyorken"],
    },
  },
  {
    id: "musa-rabbi-inni-lima-anzalta-ilayya-faqir",
    speaker: "musa",
    legacyId: "musa-28-24",
    title: { en: "I am in need of whatever good You send", tr: "Bana indireceğin her hayra muhtacım" },
    ayat: a(28, 24),
    excerpt: { fromWord: 7, toWord: 15, note: CUT.saidThat },
    themes: ["provision", "distress"],
    situations: {
      en: ["broke, hungry, or without work", "when you do not want to name what you need"],
      tr: ["parasız, aç ya da işsizken", "neye ihtiyacınız olduğunu söylemek istemediğinizde"],
    },
  },
  {
    id: "musa-rabbi-arini-anzur-ilayk",
    speaker: "musa",
    title: { en: "Show me, that I may look upon You", tr: "Bana kendini göster de sana bakayım" },
    ayat: a(7, 143),
    excerpt: { fromWord: 7, toWord: 11, note: CUT.both },
    themes: ["knowledge", "guidance"],
    situations: {
      en: ["longing for certainty rather than information"],
      tr: ["bilgi değil yakîn arzuladığınızda"],
    },
  },
  {
    id: "musa-subhanaka-tubtu-ilayk",
    speaker: "musa",
    title: { en: "Glory to You — I turn to You", tr: "Seni tenzih ederim, sana tevbe ettim" },
    ayat: a(7, 143),
    excerpt: { fromWord: 35, toWord: 41, note: CUT.preamble },
    themes: ["forgiveness", "gratitude"],
    situations: {
      en: ["after asking for something you were not ready for"],
      tr: ["hazır olmadığınız bir şeyi istedikten sonra"],
    },
  },
  {
    id: "musa-rabbi-ighfir-li-wa-li-akhi",
    speaker: "musa",
    legacyId: "musa-7-151",
    title: { en: "Forgive me and my brother", tr: "Beni ve kardeşimi bağışla" },
    ayat: a(7, 151),
    excerpt: { fromWord: 1, toWord: 11, note: CUT.saidThat },
    themes: ["forgiveness", "family"],
    situations: {
      en: ["after being angry with a sibling", "praying for someone you blamed unfairly"],
      tr: ["bir kardeşinize öfkelendikten sonra", "haksız yere suçladığınız biri için dua ederken"],
    },
  },
  {
    id: "musa-anta-waliyyuna-faghfir-lana",
    speaker: "musa",
    legacyId: "musa-7-156",
    title: { en: "You are our Protector", tr: "Sen bizim velimizsin" },
    ayat: range(7, 155, 156),
    excerpt: { fromWord: 10, toWord: 52, note: CUT.both },
    themes: ["forgiveness", "injustice", "steadfastness"],
    situations: {
      en: ["answering for what people under you have done", "when the foolish among you have cost everyone"],
      tr: ["sorumlu olduğunuz kişilerin yaptığının hesabını verirken", "içinizdeki beyinsizler herkese mal olduğunda"],
    },
  },
  {
    id: "musa-rabbi-inni-la-amliku-illa-nafsi",
    speaker: "musa",
    title: { en: "I control none but myself and my brother", tr: "Ben ancak kendime ve kardeşime söz geçirebiliyorum" },
    ayat: a(5, 25),
    excerpt: { fromWord: 1, toWord: 13, note: CUT.saidThat },
    themes: ["distress", "strength", "guidance"],
    situations: {
      en: ["leading people who will not follow", "when you are responsible for an outcome you cannot control"],
      tr: ["peşinizden gelmeyen insanlara önderlik ederken", "kontrol edemediğiniz bir sonuçtan sorumluyken"],
    },
  },
  {
    id: "musa-rabbana-innaka-atayta-firawn",
    speaker: "musa",
    legacyId: "musa-10-88",
    title: { en: "Against Pharaoh's splendour", tr: "Firavun'un ihtişamına karşı" },
    ayat: a(10, 88),
    excerpt: { fromWord: 2, toWord: 29, note: CUT.saidThat },
    themes: ["injustice"],
    situations: {
      en: ["when wealth is being used to lead people away"],
      tr: ["servet insanları saptırmak için kullanıldığında"],
    },
  },

  /* ------------------------------- Dāwūd ------------------------------ */
  {
    id: "dawud-al-hamdu-lillah-alladhi-faddalana",
    speaker: "dawud",
    title: { en: "Praise to the One who favoured us", tr: "Bizi üstün kılana hamd olsun" },
    ayat: a(27, 15),
    excerpt: { fromWord: 6, toWord: 15, note: CUT.saidThat },
    themes: ["gratitude", "knowledge"],
    form: "dhikr",
    situations: {
      en: ["after being given an ability you did not earn", "when knowledge comes easily and you notice it"],
      tr: ["hak etmediğiniz bir kabiliyet verildiğinde", "ilim kolay geldiğinde ve bunu fark ettiğinizde"],
    },
  },

  /* ------------------------------ Sulaymān ---------------------------- */
  {
    id: "sulayman-rabbi-awzini-an-ashkura",
    speaker: "sulayman",
    legacyId: "sulaiman-27-19",
    title: { en: "Enable me to be grateful", tr: "Şükretmemi nasip et" },
    ayat: a(27, 19),
    excerpt: { fromWord: 5, toWord: 24, note: CUT.saidThat },
    themes: ["gratitude", "family", "hereafter"],
    situations: {
      en: ["when something small reminds you how much you have", "after a success you did not earn alone"],
      tr: ["küçük bir şey size ne kadar çok şeyiniz olduğunu hatırlattığında", "tek başınıza kazanmadığınız bir başarıdan sonra"],
    },
  },
  {
    id: "sulayman-rabbi-ighfir-li-wa-hab-li-mulkan",
    speaker: "sulayman",
    legacyId: "sulaiman-38-35",
    title: { en: "Forgive me, and grant me a kingdom", tr: "Beni bağışla ve bana bir mülk ver" },
    ayat: a(38, 35),
    excerpt: { fromWord: 1, toWord: 15, note: CUT.saidThat },
    themes: ["forgiveness", "provision"],
    situations: {
      en: ["asking for something large without apologising for asking"],
      tr: ["büyük bir şeyi istemekten çekinmeden isterken"],
    },
  },

  /* ------------------------------ Zakariyyā --------------------------- */
  {
    id: "zakariyya-rabbi-hab-li-dhurriyyatan-tayyibah",
    speaker: "zakariyya",
    legacyId: "zakariya-3-38",
    title: { en: "Grant me goodly offspring", tr: "Bana tertemiz bir nesil bağışla" },
    ayat: a(3, 38),
    excerpt: { fromWord: 5, toWord: 15, note: CUT.saidThat },
    themes: ["children", "family"],
    situations: {
      en: ["trying for a child", "after a loss", "when the doctors have given a number"],
      tr: ["çocuk sahibi olmaya çalışırken", "bir kayıptan sonra", "doktorlar bir oran verdiğinde"],
    },
  },
  {
    id: "zakariyya-rabbi-inni-wahana-al-azmu-minni",
    speaker: "zakariyya",
    legacyId: "zakariya-19-5",
    title: { en: "My bones have weakened", tr: "Kemiklerim zayıfladı" },
    ayat: range(19, 4, 6),
    excerpt: { fromWord: 1, toWord: 35, note: CUT.saidThat },
    themes: ["children", "family", "hereafter"],
    situations: {
      en: ["asking for something past the age of asking", "when you fear what comes after you"],
      tr: ["istemenin yaşı geçmişken istemek", "sizden sonrasından endişe ettiğinizde"],
    },
  },
  {
    id: "zakariyya-rabbi-la-tadharni-fardan",
    speaker: "zakariyya",
    legacyId: "zakariya-21-89",
    title: { en: "Do not leave me alone", tr: "Beni tek başıma bırakma" },
    ayat: a(21, 89),
    excerpt: { fromWord: 4, toWord: 11, note: CUT.saidThat },
    themes: ["children", "grief", "distress"],
    situations: {
      en: ["childlessness", "loneliness that has no end in sight"],
      tr: ["evlatsızlık", "sonu görünmeyen bir yalnızlık"],
    },
  },

  /* -------------------------------- Yūnus ----------------------------- */
  {
    id: "yunus-la-ilaha-illa-anta",
    speaker: "yunus",
    legacyId: "yunus-21-87",
    title: { en: "The call from the depths", tr: "Karanlıkların içinden gelen çağrı" },
    ayat: a(21, 87),
    excerpt: { fromWord: 14, toWord: 23, note: CUT.preamble },
    themes: ["distress", "forgiveness", "fear", "grief"],
    situations: {
      en: [
        "when there is no way out and it is your own fault",
        "at the lowest point",
        "when you cannot find words of your own",
      ],
      tr: [
        "çıkış yokken ve kabahat sizdeyken",
        "en dip noktada",
        "kendinize ait kelime bulamadığınızda",
      ],
    },
  },

  /* --------------------------------- ʿĪsā ----------------------------- */
  {
    id: "isa-allahumma-rabbana-anzil-alayna-maidah",
    speaker: "isa",
    legacyId: "isa-5-114",
    title: { en: "Send down for us a table", tr: "Üzerimize bir sofra indir" },
    ayat: a(5, 114),
    excerpt: { fromWord: 4, toWord: 22, note: CUT.saidThat },
    themes: ["provision", "gratitude"],
    situations: {
      en: ["asking for food or means for people depending on you"],
      tr: ["size bağlı insanlar için rızık ya da imkân isterken"],
    },
  },
  {
    id: "isa-in-tuadhdhibhum-fa-innahum-ibaduk",
    speaker: "isa",
    title: { en: "They are Your servants", tr: "Onlar senin kullarındır" },
    ayat: a(5, 118),
    themes: ["hereafter", "forgiveness"],
    situations: {
      en: ["praying for people who have gone wrong and are not yours to judge"],
      tr: ["yoldan çıkmış ve hükmü size ait olmayan insanlar için dua ederken"],
    },
  },

  /* ----------------------------- Muḥammad ﷺ --------------------------- */
  {
    id: "muhammad-rabbi-zidni-ilman",
    speaker: "muhammad",
    title: { en: "Increase me in knowledge", tr: "İlmimi artır" },
    ayat: a(20, 114),
    excerpt: { fromWord: 14, toWord: 17, note: CUT.preamble },
    themes: ["knowledge"],
    situations: {
      en: ["before studying", "when you notice how much you do not know"],
      tr: ["ders çalışmadan önce", "ne kadar az bildiğinizi fark ettiğinizde"],
    },
  },
  {
    id: "muhammad-rabbi-adkhilni-mudkhala-sidq",
    speaker: "muhammad",
    title: { en: "A sound entrance and a sound exit", tr: "Doğrulukla girmek, doğrulukla çıkmak" },
    ayat: a(17, 80),
    excerpt: { fromWord: 1, toWord: 14, note: CUT.saidThat },
    themes: ["guidance", "protection", "strength"],
    situations: {
      en: ["starting a new job", "leaving a place for the last time", "travelling"],
      tr: ["yeni bir işe başlarken", "bir yerden son kez ayrılırken", "yolculukta"],
    },
  },
  {
    id: "muhammad-rabbi-ighfir-warham",
    speaker: "muhammad",
    title: { en: "Forgive and have mercy", tr: "Bağışla ve merhamet et" },
    ayat: a(23, 118),
    excerpt: { fromWord: 1, toWord: 7, note: CUT.saidThat },
    themes: ["forgiveness"],
    situations: {
      en: ["when you want to ask for everything in the fewest words"],
      tr: ["en az kelimeyle her şeyi istemek istediğinizde"],
    },
  },

  /* --------------------- companion section (not prophets) -------------- */
  {
    id: "ashab-al-kahf-rabbana-atina-min-ladunka-rahmah",
    speaker: "ashab-al-kahf",
    title: { en: "Mercy from Yourself, and right guidance", tr: "Katından rahmet ve doğruya iletilmek" },
    ayat: a(18, 10),
    excerpt: { fromWord: 6, toWord: 16, note: CUT.saidThat },
    themes: ["guidance", "protection", "fear"],
    situations: {
      en: ["leaving a situation without knowing where you are going", "when belief costs you your place"],
      tr: ["nereye gittiğinizi bilmeden bir durumu terk ederken", "inanç size yerinizi kaybettirdiğinde"],
    },
  },
  {
    id: "asiyah-rabbi-ibni-li-indaka-baytan",
    speaker: "asiyah",
    title: { en: "Build for me a house with You", tr: "Bana katında bir ev yap" },
    ayat: a(66, 11),
    excerpt: { fromWord: 9, toWord: 24, note: CUT.preamble },
    themes: ["protection", "hereafter", "injustice"],
    situations: {
      en: ["trapped in a household you cannot leave", "when the person harming you is the person you live with"],
      tr: ["terk edemeyeceğiniz bir evde sıkışmışken", "size zarar veren kişi birlikte yaşadığınız kişiyken"],
    },
  },
  {
    id: "umm-maryam-rabbi-inni-nadhartu-laka",
    speaker: "umm-maryam",
    title: { en: "I have vowed to You what is in my womb", tr: "Karnımdakini sana adadım" },
    ayat: a(3, 35),
    excerpt: { fromWord: 4, toWord: 18, note: CUT.saidThat },
    themes: ["children", "family", "gratitude"],
    situations: {
      en: ["during pregnancy", "dedicating something before you know how it will turn out"],
      tr: ["hamilelik sırasında", "sonucunu bilmeden bir şeyi adarken"],
    },
  },
  {
    id: "maryam-inni-audhu-bil-rahman-minka",
    speaker: "maryam",
    title: { en: "I seek refuge in the Most Merciful from you", tr: "Senden Rahmân'a sığınırım" },
    ayat: a(19, 18),
    excerpt: { fromWord: 1, toWord: 8, note: CUT.saidThat },
    themes: ["protection", "fear"],
    form: "istiadha",
    situations: {
      en: ["alone with someone you do not trust", "when you need a first sentence that ends it"],
      tr: ["güvenmediğiniz biriyle yalnızken", "meseleyi bitirecek ilk cümleye ihtiyaç duyduğunuzda"],
    },
  },
  {
    id: "saharat-firawn-rabbana-afrigh-alayna-sabran",
    speaker: "saharat-firawn",
    title: { en: "Pour patience upon us", tr: "Üzerimize sabır yağdır" },
    ayat: a(7, 126),
    excerpt: { fromWord: 10, toWord: 16, note: CUT.preamble },
    themes: ["steadfastness", "fear", "hereafter"],
    situations: {
      en: ["when holding to what you believe will cost you badly", "facing a punishment you accepted knowingly"],
      tr: ["inandığınızda direnmek size ağır bir bedele mal olacakken", "bile bile kabul ettiğiniz bir cezayla yüzleşirken"],
    },
  },
  {
    id: "ashab-talut-rabbana-afrigh-alayna-sabran",
    speaker: "ashab-talut",
    title: { en: "Steady our feet", tr: "Ayaklarımızı sabit kıl" },
    ayat: a(2, 250),
    excerpt: { fromWord: 5, toWord: 15, note: CUT.saidThat },
    themes: ["steadfastness", "fear", "strength"],
    situations: {
      en: ["outnumbered", "before something you expect to lose"],
      tr: ["sayıca azken", "kaybetmeyi beklediğiniz bir şeyden önce"],
    },
  },

  /* ------------- duʿāʾ the Qurʾān teaches (no named speaker) ------------- */
  {
    id: "quran-rabbana-la-tuakhidhna",
    speaker: "quran-taught",
    title: { en: "Do not take us to task if we forget", tr: "Unutursak bizi sorumlu tutma" },
    ayat: a(2, 286),
    excerpt: { fromWord: 12, toWord: 49, note: CUT.preamble },
    themes: ["forgiveness", "strength", "steadfastness", "protection"],
    situations: {
      en: ["at the end of the day", "when you are carrying more than you can hold", "before sleep"],
      tr: ["günün sonunda", "taşıyabileceğinizden fazlasını taşırken", "uykudan önce"],
    },
  },
  {
    id: "quran-rabbana-la-tuzigh-qulubana",
    speaker: "quran-taught",
    title: { en: "Do not let our hearts deviate", tr: "Kalplerimizi kaydırma" },
    ayat: a(3, 8),
    themes: ["guidance", "steadfastness", "fear"],
    situations: {
      en: ["after finding something you do not want to lose", "when you fear your own drift"],
      tr: ["kaybetmek istemediğiniz bir şey bulduktan sonra", "kendi savrulmanızdan korktuğunuzda"],
    },
  },
  {
    id: "quran-rabbana-ighfir-lana-dhunubana",
    speaker: "quran-taught",
    title: { en: "Our sins and our excesses", tr: "Günahlarımız ve aşırılıklarımız" },
    ayat: a(3, 147),
    excerpt: { fromWord: 6, toWord: 19, note: CUT.preamble },
    themes: ["forgiveness", "steadfastness", "strength"],
    situations: {
      en: ["after a setback that was partly your own doing", "when you need to keep going anyway"],
      tr: ["kısmen kendi hatanızdan kaynaklanan bir aksilikten sonra", "buna rağmen devam etmeniz gerektiğinde"],
    },
  },
  {
    id: "quran-rabbana-hab-lana-qurrata-ayun",
    speaker: "quran-taught",
    title: { en: "Comfort of our eyes", tr: "Gözümüzün aydınlığı" },
    ayat: a(25, 74),
    excerpt: { fromWord: 2, toWord: 13, note: CUT.saidThat },
    themes: ["family", "children", "guidance"],
    situations: {
      en: ["praying for a spouse and children", "when you want your family to be a source of rest"],
      tr: ["eş ve çocuklar için dua ederken", "ailenizin bir huzur kaynağı olmasını istediğinizde"],
    },
  },
];

export const DUA_IDS = DUA_SEEDS.map((d) => d.id);
