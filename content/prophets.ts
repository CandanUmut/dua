/**
 * The figures whose supplications this site collects.
 *
 * Two design points carried from the brief:
 *
 * **Honorifics are data.** Each record declares which honorific applies; the UI
 * renders the form (Arabic glyph / "peace be upon him" / abbreviation) from a
 * user setting. No honorific is ever concatenated into a name string.
 *
 * **`order` is the prophetic sequence, not the alphabet.** The index reads
 * Ādam → Muḥammad ﷺ, because that is the shape of the thing being described.
 * The numbers are ordering keys only — the traditional chronology is not
 * uniformly datable and this file does not pretend otherwise.
 *
 * The `companion` section holds the non-prophetic supplicants the brief asks
 * for — the People of the Cave, Āsiyah, the mother of Maryam, Maryam, the
 * magicians. They are on the site because they are among the most-searched
 * duʿāʾ in the Qurʾān. They are in a separate section because they are not
 * prophets, and a comprehensive site is not the same as an undifferentiated one.
 */

import type { Prophet } from "./schema.js";

const QURAN = (locus: string) => ({ work: "Qurʾān", locus });

export const PROPHETS: Prophet[] = [
  {
    id: "adam",
    name: { en: "Ādam", enCommon: "Adam", tr: "Âdem", ar: "آدم" },
    honorific: "alayhi-salam",
    order: 10,
    section: "prophet",
    summary: {
      en: "The first human being and the first prophet. Taught the names of all things, settled in the Garden, and removed from it after eating from the forbidden tree.",
      tr: "İlk insan ve ilk peygamber. Kendisine bütün isimler öğretildi, cennete yerleştirildi ve yasaklanan ağaçtan yedikten sonra oradan çıkarıldı.",
    },
    trial: {
      en: "Having done the one thing he was told not to do, and answering for it without excuse.",
      tr: "Yapmaması söylenen tek şeyi yapmak ve bunun hesabını mazeret üretmeden vermek.",
    },
    references: [QURAN("2:30–37"), QURAN("7:19–25"), QURAN("20:115–122")],
  },
  {
    id: "nuh",
    name: { en: "Nūḥ", enCommon: "Noah", tr: "Nûh", ar: "نوح" },
    honorific: "alayhi-salam",
    order: 20,
    section: "prophet",
    summary: {
      en: "Called his people for 950 years and was believed by few. Built the ark on command and was carried through the flood with those who followed him.",
      tr: "Kavmini 950 yıl davet etti ve pek azı ona inandı. Emir üzerine gemiyi yaptı ve kendisine uyanlarla birlikte tufandan geçirildi.",
    },
    trial: {
      en: "A lifetime of work with almost nothing to show for it, and a son among those who refused.",
      tr: "Neredeyse hiçbir karşılık görmeden geçen bir ömür ve reddedenler arasında bir oğul.",
    },
    references: [QURAN("11:25–49"), QURAN("29:14"), QURAN("71:1–28")],
  },
  {
    id: "ibrahim",
    name: { en: "Ibrāhīm", enCommon: "Abraham", tr: "İbrâhim", ar: "إبراهيم" },
    honorific: "alayhi-salam",
    order: 30,
    section: "prophet",
    summary: {
      en: "Broke with his people's idols, was cast into a fire he survived, and left his wife and infant son in an empty valley on command. Raised the foundations of the House with Ismāʿīl.",
      tr: "Kavminin putlarından ayrıldı, atıldığı ateşten sağ çıktı ve emir üzerine hanımı ile bebek oğlunu ıssız bir vadide bıraktı. İsmâil ile birlikte Kâbe'nin temellerini yükseltti.",
    },
    trial: {
      en: "Being asked, repeatedly, to give up the thing he had waited longest for.",
      tr: "En uzun beklediği şeyden vazgeçmesinin defalarca istenmesi.",
    },
    references: [QURAN("2:124–132"), QURAN("14:35–41"), QURAN("21:51–70"), QURAN("37:99–113")],
  },
  {
    id: "lut",
    name: { en: "Lūṭ", enCommon: "Lot", tr: "Lût", ar: "لوط" },
    honorific: "alayhi-salam",
    order: 40,
    section: "prophet",
    summary: {
      en: "Sent to a people whose public conduct he opposed alone. Delivered with his household, except his wife.",
      tr: "Açıkça sürdürdükleri davranışa tek başına karşı çıktığı bir kavme gönderildi. Hanımı dışında ailesiyle birlikte kurtarıldı.",
    },
    trial: {
      en: "Standing against an entire town, with his own household divided.",
      tr: "Kendi evi bölünmüşken bütün bir şehre karşı durmak.",
    },
    references: [QURAN("26:160–175"), QURAN("29:28–35"), QURAN("11:77–83")],
  },
  {
    id: "yaqub",
    name: { en: "Yaʿqūb", enCommon: "Jacob", tr: "Ya'kûb", ar: "يعقوب" },
    honorific: "alayhi-salam",
    order: 50,
    section: "prophet",
    summary: {
      en: "Father of Yūsuf. Lost him to his brothers' deception and wept until his sight went, saying he complained of his grief to Allah alone. His sight returned when word of his son came.",
      tr: "Yûsuf'un babası. Oğlunu kardeşlerinin hilesiyle kaybetti; gözleri ağlamaktan görmez oldu ve kederini yalnız Allah'a arz ettiğini söyledi. Oğlundan haber gelince gözleri yeniden açıldı.",
    },
    trial: {
      en: "Grief carried without complaint to anyone but Allah.",
      tr: "Allah'tan başkasına şikâyet edilmeden taşınan bir keder.",
    },
    references: [QURAN("12:18"), QURAN("12:83–87"), QURAN("12:96")],
  },
  {
    id: "yusuf",
    name: { en: "Yūsuf", enCommon: "Joseph", tr: "Yûsuf", ar: "يوسف" },
    honorific: "alayhi-salam",
    order: 60,
    section: "prophet",
    summary: {
      en: "Thrown into a well by his brothers, sold into service, imprisoned on a false accusation, and raised to authority over the treasuries of Egypt.",
      tr: "Kardeşleri tarafından kuyuya atıldı, köle olarak satıldı, iftirayla hapsedildi ve Mısır'ın hazinelerinin başına getirildi.",
    },
    trial: {
      en: "Being punished for the thing he refused to do.",
      tr: "Yapmayı reddettiği şey yüzünden cezalandırılmak.",
    },
    references: [QURAN("12:4–101")],
  },
  {
    id: "ayyub",
    name: { en: "Ayyūb", enCommon: "Job", tr: "Eyyûb", ar: "أيوب" },
    honorific: "alayhi-salam",
    order: 70,
    section: "prophet",
    summary: {
      en: "Afflicted in his body and separated from his family, and remembered for the patience with which he bore it. The Qurʾān says he was found steadfast.",
      tr: "Bedeninde bir dertle imtihan edildi ve ailesinden ayrı düştü; bunu taşıdığı sabırla anılır. Kur'ân onu sabreden biri olarak nitelendirir.",
    },
    trial: {
      en: "Prolonged illness — the kind that outlasts other people's sympathy.",
      tr: "Uzayan hastalık — başkalarının merhametinden daha uzun süren cinsten.",
    },
    references: [QURAN("21:83–84"), QURAN("38:41–44"), QURAN("38:44")],
  },
  {
    id: "shuayb",
    name: { en: "Shuʿayb", tr: "Şuayb", ar: "شعيب" },
    honorific: "alayhi-salam",
    order: 80,
    section: "prophet",
    summary: {
      en: "Sent to Madyan, calling his people to honest weights and measures and to leave off cheating in trade.",
      tr: "Medyen'e gönderildi; kavmini ölçü ve tartıda dürüstlüğe, ticarette hile bırakmaya çağırdı.",
    },
    trial: {
      en: "Being threatened with expulsion for refusing to return to what he had left.",
      tr: "Terk ettiği şeye dönmeyi reddettiği için sürgünle tehdit edilmek.",
    },
    references: [QURAN("7:85–93"), QURAN("11:84–95"), QURAN("26:176–191")],
  },
  {
    id: "musa",
    name: { en: "Mūsā", enCommon: "Moses", tr: "Mûsâ", ar: "موسى" },
    honorific: "alayhi-salam",
    order: 90,
    section: "prophet",
    summary: {
      en: "Raised in Pharaoh's household, fled Egypt after a killing he did not intend, and was sent back to the man who had raised him. Spoken to directly by Allah.",
      tr: "Firavun'un sarayında büyüdü, kastetmediği bir ölümün ardından Mısır'dan kaçtı ve kendisini büyüten adama geri gönderildi. Allah kendisiyle doğrudan konuştu.",
    },
    trial: {
      en: "Being sent back to the household he had fled, to confront the most powerful ruler of his time.",
      tr: "Kaçtığı saraya geri gönderilip zamanının en güçlü hükümdarının karşısına çıkarılmak.",
    },
    references: [QURAN("20:9–98"), QURAN("28:3–46"), QURAN("7:103–156"), QURAN("4:164")],
  },
  {
    id: "dawud",
    name: { en: "Dāwūd", enCommon: "David", tr: "Dâvûd", ar: "داود" },
    honorific: "alayhi-salam",
    order: 100,
    section: "prophet",
    summary: {
      en: "Given the Zabūr, the mountains and birds joining him in praise. Killed Jālūt as a young man and was given kingship and sound judgement.",
      tr: "Kendisine Zebûr verildi; dağlar ve kuşlar tesbihine katıldı. Gençliğinde Câlût'u öldürdü, ona hükümdarlık ve isabetli hüküm verildi.",
    },
    trial: {
      en: "Holding power and judging between people while remaining answerable himself.",
      tr: "İktidarı elinde tutup insanlar arasında hüküm verirken kendisinin de hesap verecek olması.",
    },
    references: [QURAN("2:251"), QURAN("38:17–26"), QURAN("34:10–11")],
  },
  {
    id: "sulayman",
    name: { en: "Sulaymān", enCommon: "Solomon", tr: "Süleyman", ar: "سليمان" },
    honorific: "alayhi-salam",
    order: 110,
    section: "prophet",
    summary: {
      en: "Son of Dāwūd. Given understanding of the speech of birds and authority over the wind and the jinn, and a kingdom he asked would belong to no one after him.",
      tr: "Dâvûd'un oğlu. Kendisine kuş dilini anlama, rüzgâra ve cinlere hükmetme ve kendisinden sonra kimseye nasip olmayacak bir mülk verildi.",
    },
    trial: {
      en: "Being given everything, and having to stay grateful for it.",
      tr: "Her şeyin verilmiş olması ve buna şükreder kalabilmek.",
    },
    references: [QURAN("27:15–44"), QURAN("38:30–40")],
  },
  {
    id: "yunus",
    name: { en: "Yūnus", enCommon: "Jonah", tr: "Yûnus", ar: "يونس" },
    honorific: "alayhi-salam",
    order: 120,
    section: "prophet",
    summary: {
      en: "Left his people in anger before he was permitted to, was swallowed by the fish, and called out from inside the darknesses. Returned to a people who then believed.",
      tr: "İzin verilmeden önce kavmini öfkeyle terk etti, balık tarafından yutuldu ve karanlıkların içinden seslendi. Sonra iman eden bir kavme geri döndü.",
    },
    trial: {
      en: "Being entirely alone, in the dark, in a situation he had walked into himself.",
      tr: "Kendi adımlarıyla girdiği bir durumda, karanlıkta, tamamen yalnız kalmak.",
    },
    references: [QURAN("21:87–88"), QURAN("37:139–148"), QURAN("68:48–50")],
  },
  {
    id: "zakariyya",
    name: { en: "Zakariyyā", enCommon: "Zechariah", tr: "Zekeriyyâ", ar: "زكريا" },
    honorific: "alayhi-salam",
    order: 130,
    section: "prophet",
    summary: {
      en: "Guardian of Maryam. Childless into old age, he asked for an heir and was given Yaḥyā when his wife was barren and his bones had weakened.",
      tr: "Meryem'in hâmisi. Yaşlılığına kadar çocuğu olmadı; bir vâris istedi ve hanımı kısır, kemikleri gevşemişken kendisine Yahyâ verildi.",
    },
    trial: {
      en: "Wanting a child past the age when wanting one is reasonable.",
      tr: "Evlat istemenin artık makul olmadığı bir yaşta evlat istemek.",
    },
    references: [QURAN("3:37–41"), QURAN("19:2–15"), QURAN("21:89–90")],
  },
  {
    id: "isa",
    name: { en: "ʿĪsā", enCommon: "Jesus", tr: "Îsâ", ar: "عيسى" },
    honorific: "alayhi-salam",
    order: 140,
    section: "prophet",
    summary: {
      en: "Born to Maryam without a father and spoke from the cradle. Given the Injīl, and raised to Allah rather than killed.",
      tr: "Meryem'den babasız dünyaya geldi ve beşikte konuştu. Kendisine İncil verildi ve öldürülmeyip Allah'a yükseltildi.",
    },
    trial: {
      en: "Being answerable for what people would later say about him.",
      tr: "İnsanların sonradan kendisi hakkında söyleyeceklerinden sorumlu tutulmak.",
    },
    references: [QURAN("3:45–59"), QURAN("5:110–120"), QURAN("19:16–36")],
  },
  {
    id: "muhammad",
    name: { en: "Muḥammad", tr: "Muhammed", ar: "محمد" },
    honorific: "sallallahu-alayhi-wa-sallam",
    order: 150,
    section: "prophet",
    summary: {
      en: "The final Prophet, to whom the Qurʾān was revealed over twenty-three years. Orphaned young, driven from Mecca, and returned to it.",
      tr: "Kendisine Kur'ân'ın yirmi üç yılda indirildiği son peygamber. Küçük yaşta yetim kaldı, Mekke'den çıkarıldı ve oraya geri döndü.",
    },
    trial: {
      en: "Losing, in a single year, both the wife who believed him first and the uncle who protected him.",
      tr: "Tek bir yıl içinde hem kendisine ilk inanan hanımını hem de onu koruyan amcasını kaybetmek.",
    },
    references: [
      QURAN("33:21"),
      QURAN("93:1–11"),
      QURAN("94:1–8"),
      {
        work: "al-Sīra al-Nabawiyya",
        author: "Ibn Hishām",
        locus: "on the year of Khadīja's and Abū Ṭālib's deaths",
      },
    ],
  },

  /* ---------------- companion section — not prophets ---------------- */

  {
    id: "ashab-al-kahf",
    name: { en: "The People of the Cave", tr: "Ashâb-ı Kehf", ar: "أصحاب الكهف" },
    honorific: "none",
    order: 900,
    section: "companion",
    summary: {
      en: "Young men who withdrew to a cave rather than abandon their belief, and were kept there for years.",
      tr: "İnançlarından vazgeçmektense bir mağaraya çekilen ve orada yıllarca tutulan gençler.",
    },
    references: [QURAN("18:9–26")],
  },
  {
    id: "asiyah",
    name: { en: "Āsiyah", tr: "Âsiye", ar: "آسية" },
    honorific: "alayha-salam",
    order: 910,
    section: "companion",
    summary: {
      en: "The wife of Pharaoh, who believed while living in his house, and asked for a home with Allah instead of the one she had.",
      tr: "Firavun'un hanımı; onun sarayında yaşarken iman etti ve sahip olduğu evin yerine Allah katında bir ev istedi.",
    },
    references: [QURAN("66:11")],
  },
  {
    id: "umm-maryam",
    name: { en: "The mother of Maryam", tr: "Meryem'in annesi", ar: "امرأة عمران" },
    honorific: "none",
    order: 920,
    section: "companion",
    summary: {
      en: "The wife of ʿImrān, who vowed the child in her womb to Allah's service and was given a daughter instead of the son she expected.",
      tr: "İmrân'ın hanımı; karnındaki çocuğu Allah'a adadı ve beklediği oğul yerine kendisine bir kız verildi.",
    },
    references: [QURAN("3:35–37")],
  },
  {
    id: "maryam",
    name: { en: "Maryam", enCommon: "Mary", tr: "Meryem", ar: "مريم" },
    honorific: "alayha-salam",
    order: 930,
    section: "companion",
    summary: {
      en: "Chosen and purified above the women of the worlds. Mother of ʿĪsā, who bore an accusation she could not answer except by pointing to her child.",
      tr: "Âlemlerin kadınlarına üstün kılınan ve arındırılan Meryem. Îsâ'nın annesi; çocuğunu göstermekten başka cevap veremeyeceği bir iftirayı taşıdı.",
    },
    references: [QURAN("3:42–47"), QURAN("19:16–34"), QURAN("66:12")],
  },
  {
    id: "saharat-firawn",
    name: { en: "Pharaoh's magicians", tr: "Firavun'un sihirbazları", ar: "سحرة فرعون" },
    honorific: "none",
    order: 940,
    section: "companion",
    summary: {
      en: "Brought to defeat Mūsā, they recognised what they saw, believed on the spot, and accepted execution rather than retract.",
      tr: "Mûsâ'yı yenmek için getirildiler; gördüklerini tanıdılar, orada iman ettiler ve sözlerinden dönmektense idamı kabul ettiler.",
    },
    references: [QURAN("7:113–126"), QURAN("20:70–73"), QURAN("26:38–51")],
  },
  {
    id: "quran-taught",
    name: {
      en: "Duʿāʾ the Qurʾān teaches",
      tr: "Kur'ân'ın öğrettiği dualar",
      ar: "أدعية القرآن",
    },
    honorific: "none",
    order: 800,
    section: "quran-taught",
    summary: {
      en: "Supplications the Qurʾān gives to be said, rather than quoting from a named speaker. They are here because they belong on a complete site, and separate because attributing them to a prophet would overstate the text.",
      tr: "Kur'ân'ın belirli bir söyleyenden nakletmek yerine söylenmek üzere verdiği dualar. Eksiksiz bir derlemeye ait oldukları için buradalar; bir peygambere nispet etmek metnin ötesine geçeceği için de ayrı tutuldular.",
    },
    references: [QURAN("2:285–286"), QURAN("3:8"), QURAN("25:74")],
  },
  {
    id: "ashab-talut",
    name: { en: "The companions of Ṭālūt", tr: "Tâlût'un askerleri", ar: "أصحاب طالوت" },
    honorific: "none",
    order: 950,
    section: "companion",
    summary: {
      en: "The small band who crossed the river with Ṭālūt and faced Jālūt's army. Dāwūd was among them, but the duʿāʾ is theirs collectively.",
      tr: "Tâlût ile nehri geçip Câlût'un ordusuyla yüzleşen küçük topluluk. Dâvûd da aralarındaydı, ancak dua topluca onlarındır.",
    },
    references: [QURAN("2:246–251")],
  },
];

export const PROPHET_IDS = PROPHETS.map((p) => p.id);
export const PROPHETS_IN_ORDER = [...PROPHETS].sort((a, b) => a.order - b.order);
