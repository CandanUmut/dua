/**
 * The occasion of each Qurʾānic duʿāʾ, and the project's editorial reflections,
 * in English and Turkish.
 *
 * Rules every entry here follows:
 *
 *  - **The occasion says what the cited sources say, and nothing more.** Facts
 *    come from the surrounding āyāt (cited by number) or from Tafsīr
 *    al-Jalālayn (named in the text when used). Nothing is added from memory
 *    or from the wider story literature. Where the Qurʾān leaves something
 *    unnamed, so does this file — the Qurʾān does not name Ādam's wife, and
 *    neither does the occasion.
 *  - **It covers the whole range.** An entry spanning 14:36–41 describes all
 *    six āyāt, not the first.
 *  - **Imprecations are stated plainly.** 71:26 and 10:88 ask for the
 *    destruction of a people. Softening them into "ask for justice" misreports
 *    the text. They are described as what they are, and the reflection says
 *    why they are not words for a reader to turn on others.
 *  - **A reflection is the project's voice**, labelled as such on the page,
 *    and makes no claim of reward, virtue or occasion.
 *
 * The Turkish was written alongside the English, not machine-translated; it is
 * a project translation awaiting the maintainer's review.
 */

export type Bi = { en: string; tr: string };
export type Editorial = {
  occasion: Bi;
  /** Loci the occasion draws on, e.g. "Qurʾān 7:19–23". */
  refs: string[];
  /** True when the occasion quotes or summarises Tafsīr al-Jalālayn. */
  jalalayn?: boolean;
  reflection?: Bi;
};

const Q = (locus: string) => `Qurʾān ${locus}`;

export const EDITORIAL: Record<string, Editorial> = {
  "adam-rabbana-zalamna-anfusana": {
    occasion: {
      en: "Ādam and his wife had eaten, at Satan's prompting, from the tree they were forbidden. When their Lord called to them, this was their answer: the wrong is placed on themselves.",
      tr: "Âdem ile eşi, Şeytan'ın vesvesesine uyarak kendilerine yasaklanan ağaçtan yemişlerdi. Rableri onlara seslendiğinde verdikleri cevap budur: Yanlışı kendi üzerlerine alırlar.",
    },
    refs: [Q("7:19–23")],
    reflection: {
      en: "The first repentance in the Qurʾān has no excuse in it. It names the wrong and leaves the outcome to Allah.",
      tr: "Kur'ân'daki ilk tövbede hiçbir mazeret yoktur. Yanlışı adıyla söyler, sonucu Allah'a bırakır.",
    },
  },

  "nuh-rabbi-ighfir-li-wa-liwalidayya": {
    occasion: {
      en: "The close of Nūḥ's long address to his Lord, after calling his people for nine hundred and fifty years. He asks forgiveness for himself; for his parents, both of them believers, as al-Jalālayn notes; for whoever enters his house believing; and for all believing men and women.",
      tr: "Nûh'un, kavmini dokuz yüz elli yıl davet ettikten sonra Rabbine yaptığı uzun yakarışın sonu. Kendisi için; Celâleyn'in belirttiğine göre ikisi de mümin olan anne babası için; evine mümin olarak giren herkes için ve bütün mümin erkekler ve kadınlar için bağışlanma diler.",
    },
    refs: [Q("71:5–28"), Q("29:14")],
    jalalayn: true,
    reflection: {
      en: "It widens in circles — himself, his parents, his household, every believer — and costs the one who prays nothing to include them.",
      tr: "Halka halka genişler: kendisi, anne babası, ev halkı, bütün müminler. Onları duaya katmak dua edene hiçbir şey kaybettirmez.",
    },
  },

  "nuh-rabbi-anzilni-munzalan-mubarakan": {
    occasion: {
      en: "When Nūḥ and those with him were settled on the Ark, Allah told him to praise the One who had saved them from the wrongdoing people, and to say this. Al-Jalālayn places it at the moment of disembarking.",
      tr: "Nûh ve beraberindekiler gemiye yerleşince Allah ona, kendilerini zalim kavimden kurtaran Allah'a hamdetmesini ve bunu söylemesini emretti. Celâleyn bunu gemiden inerken söylenen söz olarak açıklar.",
    },
    refs: [Q("23:27–29")],
    jalalayn: true,
    reflection: {
      en: "Words for arriving somewhere new: the place is asked for as a blessing rather than assumed to be one.",
      tr: "Yeni bir yere varırken söylenecek sözler: Varılan yerin bereketli olması varsayılmaz, istenir.",
    },
  },

  "nuh-anni-maghlubun-fantasir": {
    occasion: {
      en: "Nūḥ's people denied him, called him mad, and he was driven back. This short cry is the whole of what he said. The next āyāt give the answer: the gates of heaven opened with pouring water.",
      tr: "Kavmi Nûh'u yalanladı, ona “deli” dedi; o da azarlanıp engellendi. Bu kısa yakarış, söylediğinin tamamıdır. Sonraki âyetler cevabı verir: Gökyüzünün kapıları boşalan sularla açıldı.",
    },
    refs: [Q("54:9–12")],
  },

  "nuh-rabbi-unsurni-bima-kadhdhabun": {
    occasion: {
      en: "The chiefs of his people dismissed Nūḥ as a mere man, possessed, and told the others to wait and see. He asked for help; Allah's answer was the command to build the Ark.",
      tr: "Kavminin ileri gelenleri Nûh'u sıradan bir insan ve cinlenmiş biri diye küçümseyip diğerlerine beklemelerini söylediler. O da yardım istedi; Allah'ın cevabı gemiyi yapma emri oldu.",
    },
    refs: [Q("23:23–27")],
  },

  "nuh-rabbi-inni-audhu-bika": {
    occasion: {
      en: "When the Flood rose, Nūḥ called to Allah for his son, who had refused to board, saying his son was of his family. Allah told him the son was not of his family, for his conduct was not righteous, and not to ask for what he had no knowledge of. This is Nūḥ's reply.",
      tr: "Tufan yükselince Nûh, gemiye binmeyi reddeden oğlu için “Oğlum benim ailemdendir” diyerek Allah'a seslendi. Allah ona, oğlunun —işi salih olmadığından— ailesinden olmadığını ve hakkında bilgisi olmadığı şeyi istememesini bildirdi. Nûh'un cevabı budur.",
    },
    refs: [Q("11:42–47")],
    reflection: {
      en: "A prophet, corrected about his own son, answers with refuge and a plea for mercy rather than with argument.",
      tr: "Kendi oğlu hakkında uyarılan bir peygamber, itiraz ederek değil, Allah'a sığınarak ve rahmet dileyerek cevap verir.",
    },
  },

  "nuh-rabbi-la-tadhar-ala-al-ard": {
    occasion: {
      en: "Said at the end of Nūḥ's mission, after he had called his people for nine hundred and fifty years and Allah had told him that none of them would believe beyond those who already had. He asks that not one disbeliever be left on the earth, and gives the reason in the next āyah: they would only lead Allah's servants astray and beget none but the wicked.",
      tr: "Nûh'un görevinin sonunda, kavmini dokuz yüz elli yıl davet ettikten ve Allah ona daha önce inananlardan başka hiçbirinin iman etmeyeceğini bildirdikten sonra söylenmiştir. Yeryüzünde tek bir kâfir bırakılmamasını ister ve sebebini sonraki âyette söyler: Onlar Allah'ın kullarını saptırır ve ancak günahkâr nesiller doğururlar.",
    },
    refs: [Q("71:26–27"), Q("11:36"), Q("29:14")],
    reflection: {
      en: "This was asked by a prophet on what revelation had told him about his people. It is here so that the record is complete — not as words for a reader to turn against others.",
      tr: "Bu duayı, kavmi hakkında vahiyle bilgilendirilmiş bir peygamber etmiştir. Kaydın eksiksiz olması için buradadır; okuyucunun başkalarına karşı kullanması için değil.",
    },
  },

  "nuh-rabbi-inna-qawmi-kadhdhabuni": {
    occasion: {
      en: "Nūḥ's people threatened to stone him if he did not stop. He laid it before his Lord: they had denied him, so let Allah judge between them, and save him and the believers with him. They were saved in the laden Ark.",
      tr: "Nûh'un kavmi, vazgeçmezse onu taşlayarak öldürmekle tehdit etti. O da durumu Rabbine arz etti: Onlar kendisini yalanlamıştı; Allah aralarında hükmetsin, kendisini ve beraberindeki müminleri kurtarsın. Dolu gemide kurtarıldılar.",
    },
    refs: [Q("26:105–119")],
  },

  "ibrahim-rabbi-ijal-hadha-baladan-aminan": {
    occasion: {
      en: "Said by Ibrāhīm for the valley of Mecca, in the passage on the building of the House. He asks for safety for the place and for fruits for those of its people who believe; Allah answers that the disbeliever too will be given enjoyment for a while. Al-Jalālayn notes the request was granted: Mecca became a sanctuary, and fruits came to it from as far as Syria.",
      tr: "İbrâhim'in, Beytullah'ın inşasını anlatan bölümde Mekke vadisi için söylediği sözdür. Orası için güvenlik, halkından iman edenler için meyveler ister; Allah, inkâr edene de bir süre faydalanma imkânı verileceğini bildirir. Celâleyn isteğin kabul edildiğini belirtir: Mekke bir harem oldu ve oraya Şam'dan bile meyveler geldi.",
    },
    refs: [Q("2:124–127")],
    jalalayn: true,
  },

  "ibrahim-rabbana-taqabbal-minna": {
    occasion: {
      en: "Said by Ibrāhīm and Ismāʿīl together as they raised the foundations of the House. Across three āyāt they ask for three things: that the work be accepted; that they and their descendants be made a community submitting to Allah, shown their rites and turned to in mercy; and that a messenger be raised among their descendants to recite His signs, teach the Book and wisdom, and purify them.",
      tr: "İbrâhim ile İsmâil'in, Beytullah'ın temellerini yükseltirken birlikte söyledikleri sözlerdir. Üç âyet boyunca üç şey isterler: yaptıkları işin kabul edilmesi; kendilerinin ve soylarının Allah'a teslim olmuş bir ümmet kılınması, ibadet usullerinin gösterilmesi ve tövbelerinin kabulü; ve soylarının içinden, onlara âyetlerini okuyacak, Kitab'ı ve hikmeti öğretecek ve onları arındıracak bir peygamber gönderilmesi.",
    },
    refs: [Q("2:127–129")],
    reflection: {
      en: "Two prophets, finishing the House of Allah, do not ask whether the work is done but whether it is accepted.",
      tr: "Allah'ın evini bitiren iki peygamber, işin bitip bitmediğini değil, kabul edilip edilmediğini sorar.",
    },
  },

  "ibrahim-rabbi-ijal-hadha-al-balada-aminan": {
    occasion: {
      en: "The first of Ibrāhīm's supplications in the sūrah named after him, made for Mecca: that the land be made secure, and that he and his sons be kept from worshipping idols.",
      tr: "Kendi adını taşıyan sûrede İbrâhim'in dualarının ilkidir; Mekke için edilmiştir: Bu beldenin güvenli kılınmasını ve kendisinin ve oğullarının putlara tapmaktan uzak tutulmasını ister.",
    },
    refs: [Q("14:35")],
    jalalayn: true,
    reflection: {
      en: "Ibrāhīm, who broke his people's idols with his own hands, still asks to be kept from them.",
      tr: "Kavminin putlarını kendi elleriyle kıran İbrâhim, yine de onlardan uzak tutulmayı ister.",
    },
  },

  "ibrahim-rabbana-inni-askantu": {
    occasion: {
      en: "The rest of the same prayer, made after he had settled some of his descendants — Ismāʿīl and his mother, as al-Jalālayn explains — in a valley without crops beside the Sacred House. He asks that people's hearts incline toward them and that they be provided with fruits; that he and his descendants keep up the prayer; and that he, his parents and the believers be forgiven on the Day of Reckoning. In the middle he thanks Allah for giving him Ismāʿīl and Isḥāq in old age.",
      tr: "Aynı duanın devamıdır. İbrâhim, soyundan bazılarını —Celâleyn'in açıkladığına göre İsmâil'i ve annesini— Beyt-i Harâm'ın yanında ekin bitmeyen bir vadiye yerleştirdikten sonra söylemiştir. İnsanların gönüllerinin onlara meyletmesini ve onlara meyvelerden rızık verilmesini; kendisinin ve soyunun namazı dosdoğru kılmasını; hesap gününde kendisinin, anne babasının ve müminlerin bağışlanmasını ister. Arada, ihtiyarlığında kendisine İsmâil'i ve İshâk'ı verdiği için Allah'a hamdeder.",
    },
    refs: [Q("14:36–41")],
    jalalayn: true,
  },

  "ibrahim-rabbi-hab-li-hukman": {
    occasion: {
      en: "Ibrāhīm makes this supplication after describing his Lord to his father and his people: the One who created him and guides him, feeds him, heals him when he is ill, and will cause him to die and bring him to life. He asks for wisdom; to be joined with the righteous; a good name among later generations; a place among the heirs of the Garden; forgiveness for his father; and not to be disgraced on the Day when neither wealth nor sons avail, but only a sound heart.",
      tr: "İbrâhim bu duayı, babasına ve kavmine Rabbini anlattıktan sonra eder: kendisini yaratıp yol gösteren, yediren, hastalandığında şifa veren, öldürüp dirilten Rab. Hikmet; salihlere katılmayı; sonrakiler arasında güzel bir anılışı; Naîm cennetinin vârislerinden olmayı; babasının bağışlanmasını; malın da evladın da fayda vermediği, yalnızca selim bir kalbin fayda verdiği günde rezil edilmemeyi ister.",
    },
    refs: [Q("26:69–89")],
    reflection: {
      en: "It ends on the one thing that will count: a sound heart. Everything asked for before it is asked in that light.",
      tr: "Dua, sayılacak tek şeyle biter: selim bir kalp. Ondan önce istenen her şey bu ışıkta istenir.",
    },
  },

  "ibrahim-rabbi-hab-li-mina-al-salihin": {
    occasion: {
      en: "Said after Ibrāhīm left his people, saying he was going to his Lord, who would guide him. Allah answered with the good news of a forbearing son — the son he would later be commanded to sacrifice.",
      tr: "İbrâhim, “Ben Rabbime gidiyorum, O bana yol gösterecektir” diyerek kavminden ayrıldıktan sonra söylemiştir. Allah ona halîm bir oğul müjdesiyle cevap verdi — daha sonra kurban etmesi emredilecek olan oğul.",
    },
    refs: [Q("37:99–102")],
  },

  "ibrahim-rabbana-alayka-tawakkalna": {
    occasion: {
      en: "The Qurʾān holds up Ibrāhīm and those with him as an example: they told their people they were free of them and of all they worshipped besides Allah. The āyah ends with their supplication of trust. Al-Jalālayn notes the one exception to the example — Ibrāhīm's promise to ask forgiveness for his father, which believers are not to follow for those who disbelieve.",
      tr: "Kur'ân, İbrâhim'i ve beraberindekileri örnek gösterir: Kavimlerine, onlardan ve Allah'ı bırakıp taptıkları her şeyden uzak olduklarını söylediler. Âyet, onların tevekkül duasıyla biter. Celâleyn bu örnekteki tek istisnaya dikkat çeker: İbrâhim'in babası için bağışlanma dileyeceğine dair sözü; müminler inkâr edenler için bunda ona uymazlar.",
    },
    refs: [Q("60:4")],
    jalalayn: true,
  },

  "ibrahim-rabbana-la-tajalna-fitnatan": {
    occasion: {
      en: "The continuation of the same supplication. Al-Jalālayn explains “do not make us a trial for those who disbelieve” as: do not let them prevail over us, lest they take it as proof that they are on the truth.",
      tr: "Aynı duanın devamıdır. Celâleyn, “bizi inkâr edenler için bir fitne kılma” ifadesini şöyle açıklar: Onları bize galip getirme; yoksa bunu hak üzere olduklarının delili sayarlar.",
    },
    refs: [Q("60:4–5")],
    jalalayn: true,
    reflection: {
      en: "A rare duʿāʾ about how the believers' own state looks to others.",
      tr: "Müminlerin kendi hâllerinin başkalarına nasıl göründüğüne dair nadir bir dua.",
    },
  },

  "lut-rabbi-najjini-wa-ahli": {
    occasion: {
      en: "Lūṭ had called his people to give up their abominable practice, and they threatened to expel him. He asked that he and his family be saved from what they did — al-Jalālayn adds: from its punishment. He and his family were saved, except an old woman among those who stayed behind.",
      tr: "Lût kavmini çirkin işlerini bırakmaya çağırmış, onlar da onu sürgün etmekle tehdit etmişti. O da kendisinin ve ailesinin onların yaptıklarından —Celâleyn'e göre bunun cezasından— kurtarılmasını istedi. Geride kalanlar arasındaki yaşlı bir kadın dışında o ve ailesi kurtarıldı.",
    },
    refs: [Q("26:160–171")],
    jalalayn: true,
  },

  "lut-rabbi-unsurni-ala-al-qawm-al-mufsidin": {
    occasion: {
      en: "Lūṭ's people answered his warning by daring him to bring Allah's punishment if he was truthful. He asked for help against them; al-Jalālayn explains, by making the punishment he had warned of come true. The messengers who came next to Ibrāhīm were sent for this.",
      tr: "Lût'un kavmi uyarısına, doğru söylüyorsa Allah'ın azabını getirmesini isteyerek karşılık verdi. O da onlara karşı yardım istedi; Celâleyn bunu, uyardığı azabın gerçekleşmesi olarak açıklar. Ardından İbrâhim'e gelen elçiler bunun için gönderilmişti.",
    },
    refs: [Q("29:28–31")],
    jalalayn: true,
  },

  "yaqub-innama-ashku-baththi": {
    occasion: {
      en: "Years after losing Yūsuf, and having now lost his youngest son too, Yaʿqūb turned away from his sons, and his eyes went white with grief. When they told him he would grieve himself to death, he answered with this. Al-Jalālayn explains bathth as grief so heavy it cannot be borne without telling someone — and he told it only to Allah.",
      tr: "Yûsuf'u kaybetmesinin üzerinden yıllar geçmiş, şimdi en küçük oğlunu da kaybetmişti. Ya'kûb oğullarından yüz çevirdi ve gözleri kederden ağardı. Oğulları onun kederden öleceğini söyleyince bu cevabı verdi. Celâleyn “bess”i, insanın birine açmadan taşıyamayacağı ağır keder olarak açıklar; o ise onu yalnızca Allah'a açtı.",
    },
    refs: [Q("12:83–86")],
    jalalayn: true,
    reflection: {
      en: "Grief is not hidden here or called patience. It is told — to the One who can bear it.",
      tr: "Burada keder gizlenmez, sabır diye de adlandırılmaz. Anlatılır — onu taşıyabilecek olana.",
    },
  },

  "yaqub-fa-sabrun-jamil": {
    occasion: {
      en: "Yūsuf's brothers had thrown him into the well and come back to their father with his shirt stained with false blood, saying a wolf had eaten him. Al-Jalālayn notes that the shirt was untorn, and Yaʿqūb knew they were lying. His answer was patience, and seeking Allah's help against what they described.",
      tr: "Yûsuf'un kardeşleri onu kuyuya atmış ve babalarına, gömleğine sahte kan sürülmüş olarak dönüp onu kurdun yediğini söylemişlerdi. Celâleyn, gömleğin yırtılmamış olduğunu ve Ya'kûb'un yalan söylediklerini anladığını belirtir. Onun cevabı sabır ve anlattıklarına karşı Allah'tan yardım dilemek oldu.",
    },
    refs: [Q("12:15–18")],
    jalalayn: true,
    reflection: {
      en: "He knew he was being lied to, and chose patience anyway. Beautiful patience is not ignorance of the wrong.",
      tr: "Kendisine yalan söylendiğini biliyordu ve yine de sabrı seçti. Güzel sabır, yapılan yanlıştan habersiz olmak değildir.",
    },
  },

  "yusuf-rabbi-al-sijnu-ahabbu-ilayya": {
    occasion: {
      en: "The wife of the ʿAzīz had tried to seduce Yūsuf, and threatened him with prison if he would not do as she asked; the women of the city had joined in. He preferred prison, and asked Allah to turn their plotting from him. Allah answered and turned it from him, and he was imprisoned.",
      tr: "Azîz'in karısı Yûsuf'u baştan çıkarmaya çalışmış, dediğini yapmazsa onu zindana attırmakla tehdit etmişti; şehrin kadınları da buna katılmıştı. Yûsuf zindanı tercih etti ve tuzaklarını kendisinden uzaklaştırmasını Allah'tan istedi. Allah duasını kabul edip tuzaklarını ondan uzaklaştırdı; o da zindana atıldı.",
    },
    refs: [Q("12:23–35")],
    reflection: {
      en: "He does not trust his own resolve: “if You do not turn their plotting from me, I will incline to them.”",
      tr: "Kendi azmine güvenmez: “Onların tuzağını benden uzaklaştırmazsan onlara meylederim.”",
    },
  },

  "yusuf-tawaffani-musliman": {
    occasion: {
      en: "Said after his parents and brothers had come to him in Egypt and his childhood dream had come true. Having been given authority and the interpretation of events, he asks to die in submission and be joined with the righteous. Al-Jalālayn says he said it near the end of his life.",
      tr: "Anne babası ve kardeşleri Mısır'da yanına gelip çocukluk rüyası gerçekleştikten sonra söylemiştir. Kendisine iktidar ve olayların yorumu verilmişken Müslüman olarak ölmeyi ve salihlere katılmayı ister. Celâleyn bunu hayatının sonuna doğru söylediğini belirtir.",
    },
    refs: [Q("12:99–101")],
    jalalayn: true,
    reflection: {
      en: "At the height of everything he was given, what he asks for is a good end.",
      tr: "Kendisine verilen her şeyin zirvesinde istediği, güzel bir sondur.",
    },
  },

  "ayyub-anni-massaniya-al-durr": {
    occasion: {
      en: "Ayyūb's call after long affliction. Al-Jalālayn describes it: the loss of all his wealth and children, illness in his body, and being shunned by all but his wife, for many years. He states his condition and names Allah's mercy, without asking outright. Allah answered, removed his affliction, and gave him back his family and as many again with them.",
      tr: "Eyyûb'un uzun bir musibetten sonraki yakarışı. Celâleyn bunu şöyle anlatır: bütün malını ve çocuklarını kaybetmesi, bedenindeki hastalık ve eşi dışında herkesin ondan uzaklaşması; yıllarca. Durumunu söyler ve Allah'ın rahmetini anar; açıkça bir şey istemez. Allah duasını kabul etti, sıkıntısını giderdi, ailesini ve onlarla birlikte bir mislini daha verdi.",
    },
    refs: [Q("21:83–84")],
    jalalayn: true,
    reflection: {
      en: "He puts his pain and Allah's mercy side by side, and leaves the asking unsaid.",
      tr: "Acısını ve Allah'ın rahmetini yan yana koyar; istemeyi söze dökmez.",
    },
  },

  "ayyub-anni-massaniya-al-shaytan": {
    occasion: {
      en: "The same trial, as Sūrat Ṣād tells it. Al-Jalālayn notes that he attributes the hardship to Satan, though all things are from Allah, out of reverence in addressing Him. He was told to strike the ground with his foot, and a spring came, for washing and for drinking.",
      tr: "Aynı imtihan, Sâd Sûresi'nin anlatımıyla. Celâleyn, her şey Allah'tan olduğu hâlde Eyyûb'un O'na hitap ederken edebinden ötürü sıkıntıyı Şeytan'a nispet ettiğini belirtir. Ona ayağını yere vurması söylendi ve yıkanmak ve içmek için bir pınar çıktı.",
    },
    refs: [Q("38:41–42")],
    jalalayn: true,
  },

  "shuayb-rabbana-iftah-baynana": {
    occasion: {
      en: "The arrogant chiefs of Shuʿayb's people told him they would drive him and the believers out of their town unless they returned to their religion. His answer refuses, puts trust in Allah, and asks Him to judge between them with truth. The earthquake seized them next.",
      tr: "Şuayb'ın kavminin büyüklenen ileri gelenleri, dinlerine dönmedikleri takdirde onu ve müminleri şehirlerinden çıkaracaklarını söylediler. Onun cevabı bunu reddeder, Allah'a tevekkül eder ve O'ndan aralarında hak ile hükmetmesini ister. Ardından onları sarsıntı yakaladı.",
    },
    refs: [Q("7:88–91")],
  },

  "musa-rabbi-ishrah-li-sadri": {
    occasion: {
      en: "Said when Allah first spoke to Mūsā in the valley of Ṭuwā and commanded him to go to Pharaoh, who had transgressed. Before setting out he asks for four things: an expanded chest, an eased task, an untied tongue, and to be understood. He then asked for his brother Hārūn as a helper, and was told: “You have been granted your request, Mūsā.”",
      tr: "Allah, Tuvâ vadisinde Mûsâ ile ilk kez konuşup ona azgınlaşan Firavun'a gitmesini emrettiğinde söylenmiştir. Yola çıkmadan önce dört şey ister: göğsünün genişletilmesi, işinin kolaylaştırılması, dilindeki düğümün çözülmesi ve sözünün anlaşılması. Ardından kardeşi Hârûn'u yardımcı olarak istedi ve kendisine “İsteğin sana verildi, ey Mûsâ” denildi.",
    },
    refs: [Q("20:9–36")],
    reflection: {
      en: "Sent to the most powerful man on earth, he asks first for room inside himself.",
      tr: "Yeryüzünün en güçlü adamına gönderilirken önce kendi içinde genişlik ister.",
    },
  },

  "musa-rabbi-inni-zalamtu-nafsi": {
    occasion: {
      en: "As a young man in Egypt, Mūsā found a man of his own people fighting an Egyptian, and struck the Egyptian, who died. He said at once, “This is of Satan's doing,” and asked forgiveness with these words. Allah forgave him.",
      tr: "Mûsâ gençliğinde Mısır'da, kendi kavminden biriyle bir Mısırlının kavga ettiğini gördü; Mısırlıya vurdu ve adam öldü. Hemen “Bu Şeytan'ın işidir” dedi ve bu sözlerle bağışlanma diledi. Allah onu bağışladı.",
    },
    refs: [Q("28:15–16")],
    jalalayn: true,
  },

  "musa-rabbi-najjini-mina-al-qawm-al-zalimin": {
    occasion: {
      en: "A man came running from the far end of the city to warn Mūsā that the chiefs were conspiring to kill him. He left the city afraid and watchful, and said this, and set out toward Madyan.",
      tr: "Şehrin öbür ucundan koşarak gelen bir adam, ileri gelenlerin onu öldürmek için toplandığını Mûsâ'ya haber verdi. Mûsâ korku içinde, etrafı gözeterek şehirden çıktı, bunu söyledi ve Medyen'e doğru yola koyuldu.",
    },
    refs: [Q("28:20–22")],
  },

  "musa-rabbi-inni-lima-anzalta-ilayya-faqir": {
    occasion: {
      en: "Arriving at the water of Madyan a fugitive, Mūsā watered the flock of two women who were holding back until the shepherds had finished. Then he turned aside into the shade and said this. Al-Jalālayn adds that he was hungry and the heat was intense. Soon one of the two women came to him, walking shyly, with an invitation from her father.",
      tr: "Bir kaçak olarak Medyen suyuna varan Mûsâ, çobanlar sulamayı bitirene kadar geride bekleyen iki kadının sürüsünü suladı. Sonra gölgeye çekildi ve bunu söyledi. Celâleyn aç olduğunu ve sıcağın şiddetli olduğunu ekler. Çok geçmeden iki kadından biri utana utana yürüyerek babasının davetiyle yanına geldi.",
    },
    refs: [Q("28:22–25")],
    jalalayn: true,
    reflection: {
      en: "He does not name what he needs — food, shelter, work, a home. He names his need, and leaves the good to Allah. All of it came.",
      tr: "Neye ihtiyacı olduğunu —yiyecek, barınak, iş, bir yuva— söylemez. Muhtaç olduğunu söyler, hayrı Allah'a bırakır. Hepsi geldi.",
    },
  },

  "musa-rabbi-arini-anzur-ilayk": {
    occasion: {
      en: "At the appointed meeting, after his Lord had spoken to him, Mūsā asked to see Him. He was told he would not see Him, but to look at the mountain: if it stayed in its place, he would. When his Lord manifested Himself to the mountain it crumbled to dust, and Mūsā fell unconscious.",
      tr: "Belirlenen buluşmada Rabbi onunla konuştuktan sonra Mûsâ O'nu görmeyi istedi. Kendisine, O'nu göremeyeceği, fakat dağa bakması, dağ yerinde durursa göreceği söylendi. Rabbi dağa tecelli edince dağ paramparça oldu ve Mûsâ baygın düştü.",
    },
    refs: [Q("7:142–143")],
    jalalayn: true,
  },

  "musa-subhanaka-tubtu-ilayk": {
    occasion: {
      en: "The same āyah. When Mūsā came to after falling unconscious at the mountain, these were his first words.",
      tr: "Aynı âyet. Mûsâ dağın önünde bayıldıktan sonra kendine geldiğinde ilk sözleri bunlar oldu.",
    },
    refs: [Q("7:143")],
  },

  "musa-rabbi-ighfir-li-wa-li-akhi": {
    occasion: {
      en: "Mūsā came back from the appointed meeting to find his people worshipping the calf. He threw down the Tablets and seized his brother by the head, pulling him toward him. Hārūn told him the people had overpowered him and nearly killed him, and asked him not to let enemies gloat. Mūsā then asked forgiveness for himself and his brother — al-Jalālayn says for what he had done to his brother, including Hārūn to set his heart at rest.",
      tr: "Mûsâ buluşmadan döndüğünde kavmini buzağıya tapar buldu. Levhaları yere bıraktı ve kardeşini başından tutup kendine doğru çekti. Hârûn, kavmin kendisini güçsüz bıraktığını ve neredeyse öldüreceklerini söyledi, düşmanları sevindirmemesini istedi. Mûsâ bunun üzerine kendisi ve kardeşi için bağışlanma diledi; Celâleyn'e göre kardeşine yaptığı için, Hârûn'u da gönlünü almak için duaya katarak.",
    },
    refs: [Q("7:148–151")],
    jalalayn: true,
    reflection: {
      en: "Anger turned into a prayer for the person it fell on.",
      tr: "Öfke, onun üzerine düştüğü kişi için bir duaya dönüşür.",
    },
  },

  "musa-anta-waliyyuna-faghfir-lana": {
    occasion: {
      en: "Mūsā chose seventy men of his people for the appointed meeting; al-Jalālayn says they were to come and apologise for those who had worshipped the calf. When a violent earthquake seized them, Mūsā said: had Allah willed, He could have destroyed them long before, and him with them — would He destroy them for what the foolish among them had done? He asked for forgiveness, mercy, and good in this world and the next. Allah answered that His mercy embraces all things.",
      tr: "Mûsâ buluşma vakti için kavminden yetmiş adam seçti; Celâleyn'e göre bunlar buzağıya tapanlar adına özür dilemeye gelecekti. Onları şiddetli bir sarsıntı yakalayınca Mûsâ şöyle dedi: Allah dileseydi onları da kendisini de çok önce helâk ederdi; içlerindeki beyinsizlerin yaptığı yüzünden mi onları helâk edecekti? Bağışlanma, rahmet, dünyada ve âhirette iyilik istedi. Allah, rahmetinin her şeyi kuşattığını bildirerek cevap verdi.",
    },
    refs: [Q("7:155–156")],
    jalalayn: true,
  },

  "musa-rabbi-inni-la-amliku-illa-nafsi": {
    occasion: {
      en: "Mūsā had commanded his people to enter the Holy Land, and they refused: “Go, you and your Lord, and fight; we will sit here.” He turned to his Lord with this. Allah decreed that the land would be forbidden to them for forty years, and that they would wander in the earth.",
      tr: "Mûsâ kavmine Mukaddes Topraklar'a girmelerini emretmiş, onlar ise “Sen ve Rabbin gidin savaşın, biz burada oturuyoruz” diyerek reddetmişlerdi. Mûsâ bununla Rabbine yöneldi. Allah o toprakların kırk yıl onlara yasak kılındığını ve yeryüzünde şaşkın dolaşacaklarını hükmetti.",
    },
    refs: [Q("5:20–26")],
  },

  "musa-rabbana-innaka-atayta-firawn": {
    occasion: {
      en: "Said by Mūsā — with Hārūn saying “āmīn”, according to al-Jalālayn — after he had called Pharaoh and his chiefs and shown them clear signs. He names the splendour and wealth they had been given, which they used to lead people from Allah's way, and asks that their wealth be obliterated and their hearts hardened, so that they would not believe until they saw the painful punishment. Allah answered: “The prayer of you both is answered.”",
      tr: "Celâleyn'e göre Hârûn'un “âmin” demesiyle Mûsâ tarafından, Firavun'u ve ileri gelenlerini davet edip onlara apaçık mucizeler gösterdikten sonra söylenmiştir. Onlara verilen ihtişamı ve serveti —ki bununla insanları Allah'ın yolundan saptırıyorlardı— anar ve mallarının yok edilmesini, kalplerinin katılaştırılmasını, böylece elem verici azabı görmedikçe iman etmemelerini ister. Allah cevap verdi: “İkinizin duası kabul edildi.”",
    },
    refs: [Q("10:75–89")],
    jalalayn: true,
    reflection: {
      en: "Asked by a prophet against a tyrant, on knowledge given to him. It is here so that the record is complete — not as words for a reader to turn against others.",
      tr: "Bir peygamber tarafından, kendisine verilen bilgiye dayanarak bir zorbaya karşı edilmiştir. Kaydın eksiksiz olması için buradadır; okuyucunun başkalarına karşı kullanması için değil.",
    },
  },

  "dawud-al-hamdu-lillah-alladhi-faddalana": {
    occasion: {
      en: "The Qurʾān records that Allah gave Dāwūd and Sulaymān knowledge, and that they said this. Al-Jalālayn names the knowledge — of judging between people, and of the speech of birds, among other things — and says they said it in thanks for prophethood and all they had been given.",
      tr: "Kur'ân, Allah'ın Dâvûd ile Süleyman'a ilim verdiğini ve onların bunu söylediğini bildirir. Celâleyn bu ilmi —insanlar arasında hüküm verme ve kuşların dilini anlama gibi— açıklar ve bunu peygamberlik ve kendilerine verilen her şey için şükrederek söylediklerini belirtir.",
    },
    refs: [Q("27:15")],
    jalalayn: true,
  },

  "sulayman-rabbi-awzini-an-ashkura": {
    occasion: {
      en: "Sulaymān and his hosts reached the valley of the ants, and one ant warned the rest to enter their dwellings lest they be crushed unawares. He smiled, amused at her words, and said this. Al-Jalālayn adds that he halted his hosts until the ants had gone in.",
      tr: "Süleyman ve orduları karıncalar vadisine vardığında bir karınca diğerlerine, farkına varılmadan ezilmemeleri için yuvalarına girmelerini söyledi. Süleyman onun sözüne gülümsedi ve bunu söyledi. Celâleyn, karıncalar yuvalarına girene kadar ordusunu durdurduğunu ekler.",
    },
    refs: [Q("27:17–19")],
    jalalayn: true,
    reflection: {
      en: "A king who could hear an ant, and whose first response was to ask for gratitude.",
      tr: "Bir karıncayı duyabilen ve ilk tepkisi şükür istemek olan bir hükümdar.",
    },
  },

  "sulayman-rabbi-ighfir-li-wa-hab-li-mulkan": {
    occasion: {
      en: "Said after Sulaymān was tried — the Qurʾān says a body was placed on his throne, and that he then turned back in repentance. He asked for forgiveness first, and then for a kingdom unlike any after him. Allah gave him the wind and the jinn in his service.",
      tr: "Süleyman imtihan edildikten sonra söylenmiştir; Kur'ân, tahtına bir ceset bırakıldığını, onun da sonra tövbeyle Allah'a döndüğünü söyler. Önce bağışlanma, sonra kendisinden sonra kimseye nasip olmayacak bir mülk istedi. Allah rüzgârı ve cinleri onun hizmetine verdi.",
    },
    refs: [Q("38:34–38")],
    reflection: {
      en: "Forgiveness comes before the kingdom, even in the prayer of a king.",
      tr: "Bir hükümdarın duasında bile bağışlanma mülkten önce gelir.",
    },
  },

  "zakariyya-rabbi-hab-li-dhurriyyatan-tayyibah": {
    occasion: {
      en: "Zakariyyā was Maryam's guardian. Whenever he came to her in the sanctuary he found provision with her, and she told him it was from Allah, who provides for whom He wills without measure. There and then he prayed this. Al-Jalālayn: he had understood that the One who brings things out of their season could give him a child in old age.",
      tr: "Zekeriyyâ, Meryem'in hamisiydi. Mâbette yanına her girişinde onun yanında bir rızık bulur, Meryem de bunun Allah'tan olduğunu, Allah'ın dilediğine hesapsız rızık verdiğini söylerdi. Zekeriyyâ orada Rabbine bu duayı etti. Celâleyn: Bir şeyi mevsimi dışında var edenin ihtiyarlıkta da çocuk verebileceğini anlamıştı.",
    },
    refs: [Q("3:37–38")],
    jalalayn: true,
  },

  "zakariyya-rabbi-inni-wahana-al-azmu-minni": {
    occasion: {
      en: "Zakariyyā called to his Lord in secret. He was old, his wife was barren, and he feared for his kin after him. He asks for an heir who would inherit from him and from the family of Yaʿqūb. The answer was the news of a son named Yaḥyā, a name given to no one before.",
      tr: "Zekeriyyâ Rabbine gizlice seslendi. Yaşlanmıştı, eşi kısırdı ve kendisinden sonra yakınlarından endişe ediyordu. Kendisine ve Ya'kûb ailesine vâris olacak bir veli ister. Cevap, daha önce kimseye verilmemiş Yahyâ adında bir oğul müjdesi oldu.",
    },
    refs: [Q("19:2–7")],
    reflection: {
      en: "“I have never been disappointed in calling on You” — he asks on the strength of every earlier answer.",
      tr: "“Sana dua etmekle hiç mahrum kalmadım” — önceki her cevabın gücüyle ister.",
    },
  },

  "zakariyya-rabbi-la-tadharni-fardan": {
    occasion: {
      en: "The same prayer, as Sūrat al-Anbiyāʾ records it. Allah answered, gave him Yaḥyā and made his wife fit to bear, and describes them as people who hastened to good and called on Him in longing and in awe.",
      tr: "Aynı dua, Enbiyâ Sûresi'ndeki şekliyle. Allah duasını kabul etti, ona Yahyâ'yı verdi ve eşini doğurmaya elverişli kıldı; onları hayırlarda yarışan, umarak ve korkarak O'na yalvaranlar olarak niteler.",
    },
    refs: [Q("21:89–90")],
  },

  "yunus-la-ilaha-illa-anta": {
    occasion: {
      en: "Yūnus left his people in anger — before Allah had permitted him to, as al-Jalālayn explains. He was swallowed by the fish, and called out from within the darknesses: of the night, the sea and the belly of the fish. Allah answered and saved him from distress, and adds: “Thus do We save the believers.”",
      tr: "Yûnus, Celâleyn'in açıkladığına göre Allah'ın izni gelmeden kavmine öfkelenip onları terk etti. Balık onu yuttu ve o karanlıklar içinden —gecenin, denizin ve balığın karnının karanlığından— seslendi. Allah duasını kabul edip onu kederden kurtardı ve ekledi: “İşte biz müminleri böyle kurtarırız.”",
    },
    refs: [Q("21:87–88")],
    jalalayn: true,
    reflection: {
      en: "The āyah that follows does not end with his rescue. It ends: thus do We save the believers — not only him.",
      tr: "Ardından gelen âyet onun kurtuluşuyla bitmez. Şöyle biter: İşte biz müminleri böyle kurtarırız — yalnızca onu değil.",
    },
  },

  "isa-allahumma-rabbana-anzil-alayna-maidah": {
    occasion: {
      en: "The disciples asked ʿĪsā whether his Lord could send down a table spread with food from heaven; they wanted to eat from it, to have their hearts reassured, and to be witnesses to it. He made this supplication. Allah answered that He would send it down — and that whoever disbelieved after it would be punished as no one else.",
      tr: "Havâriler Îsâ'ya, Rabbinin gökten bir sofra indirip indiremeyeceğini sordular; ondan yemek, kalplerinin mutmain olması ve buna şahit olmak istiyorlardı. Îsâ bu duayı etti. Allah onu indireceğini —ve bundan sonra inkâr edene kimseye etmediği bir azapla azap edeceğini— bildirdi.",
    },
    refs: [Q("5:112–115")],
    jalalayn: true,
  },

  "isa-in-tuadhdhibhum-fa-innahum-ibaduk": {
    occasion: {
      en: "On the Day of Judgement, Allah will ask ʿĪsā whether he told people to take him and his mother as gods besides Allah. He disowns it, says he told them only to worship Allah, and ends with this — leaving them entirely to Allah's judgement.",
      tr: "Kıyamet günü Allah Îsâ'ya, insanlara kendisini ve annesini Allah'tan başka iki ilâh edinmelerini söyleyip söylemediğini soracak. Îsâ bunu reddeder, onlara yalnızca Allah'a ibadet etmelerini söylediğini anlatır ve sözünü bununla bitirir — onları tamamen Allah'ın hükmüne bırakır.",
    },
    refs: [Q("5:116–118")],
    jalalayn: true,
    reflection: {
      en: "He neither condemns them nor excuses them. He hands them back to their Lord.",
      tr: "Onları ne mahkûm eder ne de mazur gösterir. Onları Rablerine geri bırakır.",
    },
  },

  "muhammad-rabbi-zidni-ilman": {
    occasion: {
      en: "Addressed to the Prophet ﷺ: not to hasten with the Qurʾān before its revelation to him was complete, and to say this. Al-Jalālayn explains it as knowledge of the Qurʾān: each time something of it was revealed, his knowledge increased.",
      tr: "Peygamber'e ﷺ hitaptır: Kur'ân'ın vahyi kendisine tamamlanmadan onu okumakta acele etmemesi ve bunu söylemesi emredilir. Celâleyn bunu Kur'ân ilmi olarak açıklar: Ondan bir şey her indiğinde ilmi artardı.",
    },
    refs: [Q("20:114")],
    jalalayn: true,
  },

  "muhammad-rabbi-adkhilni-mudkhala-sidq": {
    occasion: {
      en: "Taught to the Prophet ﷺ in Sūrat al-Isrāʾ, a Meccan sūrah. Al-Jalālayn explains the entrance as into Medina and the departure as from Mecca — a prayer for the Hijrah, given before it.",
      tr: "Mekke'de inen İsrâ Sûresi'nde Peygamber'e ﷺ öğretilmiştir. Celâleyn girişi Medine'ye, çıkışı Mekke'den olarak açıklar — hicretten önce verilmiş, hicret için bir dua.",
    },
    refs: [Q("17:80")],
    jalalayn: true,
  },

  "muhammad-rabbi-ighfir-warham": {
    occasion: {
      en: "The last āyah of Sūrat al-Muʾminūn. After describing those whose scales will be light on the Day of Judgement, the sūrah closes by telling the Prophet ﷺ to say this. Al-Jalālayn: forgive the believers, and have mercy on them.",
      tr: "Mü'minûn Sûresi'nin son âyeti. Kıyamet günü tartıları hafif gelecekleri anlattıktan sonra sûre, Peygamber'e ﷺ bunu söylemesini emrederek biter. Celâleyn: Müminleri bağışla ve onlara merhamet et.",
    },
    refs: [Q("23:101–118")],
    jalalayn: true,
  },

  "ashab-al-kahf-rabbana-atina-min-ladunka-rahmah": {
    occasion: {
      en: "A group of young men, fearing for their faith among a people who worshipped others besides Allah, took refuge in a cave and said this. Allah put them to sleep in the cave for a number of years.",
      tr: "Allah'tan başkasına tapan bir kavmin arasında inançları için endişe duyan bir grup genç bir mağaraya sığındı ve bunu söyledi. Allah onları mağarada yıllarca uyuttu.",
    },
    refs: [Q("18:9–16")],
    jalalayn: true,
  },

  "asiyah-rabbi-ibni-li-indaka-baytan": {
    occasion: {
      en: "The Qurʾān gives the wife of Pharaoh as an example for those who believe. Al-Jalālayn names her Āsiyah, and says Pharaoh tortured her for believing in Mūsā — staked out in the sun with a millstone on her chest — and that she said this during it.",
      tr: "Kur'ân, Firavun'un karısını iman edenler için bir örnek olarak verir. Celâleyn onun adının Âsiye olduğunu, Mûsâ'ya iman ettiği için Firavun tarafından işkenceye uğradığını —güneşin altında kazıklara bağlanıp göğsüne bir değirmen taşı konduğunu— ve bu duayı işkence sırasında ettiğini söyler.",
    },
    refs: [Q("66:11")],
    jalalayn: true,
    reflection: {
      en: "She lived in a palace and asked for a house — “with You” coming before “in the Garden”.",
      tr: "Bir sarayda yaşıyordu ve bir ev istedi — “Senin katında” sözü “cennette” sözünden önce gelir.",
    },
  },

  "umm-maryam-rabbi-inni-nadhartu-laka": {
    occasion: {
      en: "The wife of ʿImrān — al-Jalālayn names her Ḥannah — vowed the child she was carrying to Allah's service. When she gave birth she said, “My Lord, I have given birth to a female”; and Allah accepted the child, Maryam, with a goodly acceptance.",
      tr: "İmrân'ın karısı —Celâleyn adının Hanne olduğunu söyler— karnındaki çocuğu Allah'ın hizmetine adadı. Doğurduğunda “Rabbim, onu kız doğurdum” dedi; Allah da o çocuğu, Meryem'i, güzel bir kabulle kabul etti.",
    },
    refs: [Q("3:35–37")],
    jalalayn: true,
  },

  "maryam-inni-audhu-bil-rahman-minka": {
    occasion: {
      en: "Maryam had withdrawn from her family to a place to the east, behind a screen. The spirit Allah sent to her appeared before her as a man in perfect form, and this was her first response. He answered that he was a messenger of her Lord, sent to give her a pure son.",
      tr: "Meryem ailesinden ayrılıp doğu tarafında bir yere çekilmiş, onlarla arasına bir perde koymuştu. Allah'ın ona gönderdiği ruh, kusursuz bir insan suretinde karşısına çıktı; bu onun ilk cevabıydı. O da Rabbinin elçisi olduğunu, ona tertemiz bir oğul bağışlamak için gönderildiğini söyledi.",
    },
    refs: [Q("19:16–19")],
  },

  "saharat-firawn-rabbana-afrigh-alayna-sabran": {
    occasion: {
      en: "Pharaoh's magicians, seeing Mūsā's staff swallow what they had conjured, fell down in prostration and believed. Pharaoh threatened to cut off their hands and feet on opposite sides and crucify them all. This was their answer to him, ending in supplication.",
      tr: "Firavun'un sihirbazları, Mûsâ'nın asasının uydurduklarını yuttuğunu görünce secdeye kapanıp iman ettiler. Firavun ellerini ve ayaklarını çaprazlama kesip hepsini asmakla tehdit etti. Bu, onların ona verdiği cevaptır ve bir duayla biter.",
    },
    refs: [Q("7:113–126")],
    jalalayn: true,
    reflection: {
      en: "Believers of an hour, facing death, ask for patience and a good end — not for rescue.",
      tr: "Bir saatlik müminler, ölümle yüz yüzeyken kurtuluş değil, sabır ve güzel bir son isterler.",
    },
  },

  "ashab-talut-rabbana-afrigh-alayna-sabran": {
    occasion: {
      en: "Ṭālūt's army had crossed the river, and most had fallen away at the test of drinking from it. Those who remained, facing Jālūt and his forces, said this. They routed them by Allah's leave, and Dāwūd killed Jālūt.",
      tr: "Tâlût'un ordusu ırmağı geçmiş, çoğu ondan içme imtihanında dökülmüştü. Geriye kalanlar Câlût ve ordusunun karşısına çıkınca bunu söylediler. Allah'ın izniyle onları bozguna uğrattılar ve Dâvûd Câlût'u öldürdü.",
    },
    refs: [Q("2:249–251")],
    jalalayn: true,
  },

  "quran-rabbana-la-tuakhidhna": {
    occasion: {
      en: "The closing āyah of Sūrat al-Baqarah, given for believers to say. Al-Jalālayn notes, citing ḥadīth, that taking this community to task for forgetting and error had already been lifted, so asking for it is a way of acknowledging Allah's favour. The Prophet ﷺ said that whoever recites the last two āyāt of Sūrat al-Baqarah at night, they will suffice him.",
      tr: "Bakara Sûresi'nin son âyeti; müminlerin söylemesi için verilmiştir. Celâleyn, hadise dayanarak unutma ve hata yüzünden sorgulanmanın bu ümmetten zaten kaldırıldığını, dolayısıyla bunu istemenin Allah'ın lütfunu kabul etmenin bir yolu olduğunu belirtir. Peygamber ﷺ, Bakara Sûresi'nin son iki âyetini gece okuyana bunların yeteceğini söylemiştir.",
    },
    refs: [Q("2:285–286"), "Ṣaḥīḥ al-Bukhārī 5009"],
    jalalayn: true,
    reflection: {
      en: "It begins with what Allah has promised — no soul is charged beyond its capacity — and only then asks.",
      tr: "Allah'ın vaadiyle —hiçbir nefse gücünün üstünde yük yüklenmez— başlar ve ancak ondan sonra ister.",
    },
  },

  "quran-rabbana-la-tuzigh-qulubana": {
    occasion: {
      en: "The prayer of “those firmly grounded in knowledge”. The āyah before it says that some āyāt are precise and others ambiguous; that those with deviation in their hearts pursue the ambiguous, seeking discord; and that those grounded in knowledge say, “We believe in it; all of it is from our Lord.” Then this.",
      tr: "“İlimde derinleşmiş olanların” duası. Önceki âyet, bazı âyetlerin muhkem, bazılarının müteşâbih olduğunu; kalplerinde eğrilik bulunanların fitne arayarak müteşâbihlerin peşine düştüğünü; ilimde derinleşmiş olanların ise “Ona inandık, hepsi Rabbimizdendir” dediğini bildirir. Ardından bu dua gelir.",
    },
    refs: [Q("3:7–8")],
    jalalayn: true,
  },

  "quran-rabbana-ighfir-lana-dhunubana": {
    occasion: {
      en: "From the passage on the battle of Uḥud, about the many godly men who fought alongside earlier prophets and did not weaken or give in at what befell them — al-Jalālayn says, even when their prophet had been killed. This was all they said.",
      tr: "Uhud savaşını anlatan bölümden: önceki peygamberlerle birlikte savaşan ve başlarına gelenler yüzünden gevşemeyen, boyun eğmeyen pek çok Rabbânî kişi anılır; Celâleyn'e göre peygamberleri öldürüldüğünde bile. Söyledikleri yalnızca buydu.",
    },
    refs: [Q("3:146–148")],
    jalalayn: true,
    reflection: {
      en: "In defeat they blame no one but themselves, and ask for firm feet.",
      tr: "Yenilgide kendilerinden başka kimseyi suçlamaz, ayaklarının sabit kılınmasını isterler.",
    },
  },

  "quran-rabbana-hab-lana-qurrata-ayun": {
    occasion: {
      en: "From the description that closes Sūrat al-Furqān of “the servants of the Most Merciful”: those who walk the earth humbly, spend the night in prayer, spend in moderation, keep away from the great sins and do not bear false witness — and who say this. Al-Jalālayn: a joyful sight, in that we see them obedient to You.",
      tr: "Furkân Sûresi'nin sonundaki “Rahmân'ın kulları” tasvirinden: yeryüzünde tevazuyla yürüyen, geceyi namazla geçiren, harcamada ölçülü olan, büyük günahlardan uzak duran, yalan yere şahitlik etmeyen ve bunu söyleyenler. Celâleyn: Onları Sana itaat eder görerek gözümüzün aydınlanması.",
    },
    refs: [Q("25:63–77")],
    jalalayn: true,
    reflection: {
      en: "It asks for a family that is a joy to look at — and in the same breath, to be worth following.",
      tr: "Bakınca göz aydınlatan bir aile ister — ve aynı nefeste, örnek alınmaya layık olmayı.",
    },
  },
};
