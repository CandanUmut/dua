/**
 * Theme taxonomy — the primary way most people will actually find a duʿāʾ.
 *
 * Two rules shaped this list:
 *
 * 1. **Themes are needs, not categories.** Someone arriving here is usually in
 *    the middle of something — a diagnosis, a debt, a burial, a decision they
 *    cannot make. They are not browsing a subject index. So the label is the
 *    situation in the second person ("When there seems no way out"), and the
 *    abstract noun is demoted to the description. This is the difference
 *    between a reference someone uses and one they bounce off.
 *
 * 2. **Sixteen, and no deeper.** The brief caps it at 12–16 top level and adds
 *    no second level, which is right: a taxonomy that needs drilling is a
 *    taxonomy that has stopped being a door. Where an entry belongs in several
 *    places it gets several themes rather than a new sub-branch.
 *
 * The `situations` field on each duʿāʾ carries the finer-grained phrasing
 * ("before a difficult conversation") and is reached through search, not
 * through this list.
 */

import type { Theme } from "./schema.js";

export const THEMES: Theme[] = [
  {
    id: "distress",
    label: {
      en: "When there seems no way out",
      tr: "Çıkış yolu görünmediğinde",
    },
    description: {
      en: "Trapped, cornered, out of options — the duʿāʾ said from inside the difficulty rather than after it.",
      tr: "Sıkışmış, köşeye kısılmış, seçenekleri tükenmiş hâldeyken — zorluğun ardından değil, tam içindeyken edilen dualar.",
    },
    order: 1,
  },
  {
    id: "forgiveness",
    label: { en: "When you have done wrong", tr: "Bir yanlış yaptığınızda" },
    description: {
      en: "Turning back after a mistake, without excuses and without despair.",
      tr: "Bir hatanın ardından, mazeret üretmeden ve ümit kesmeden dönüş.",
    },
    order: 2,
  },
  {
    id: "grief",
    label: { en: "When you are grieving", tr: "Yas tuttuğunuzda" },
    description: {
      en: "Loss, separation, and sorrow that does not lift on schedule.",
      tr: "Kayıp, ayrılık ve zamanla dinmeyen keder.",
    },
    order: 3,
  },
  {
    id: "fear",
    label: { en: "When you are afraid", tr: "Korktuğunuzda" },
    description: {
      en: "Facing something or someone you have reason to fear — before it happens, not after.",
      tr: "Korkmakta haklı olduğunuz bir şeyle yüzleşirken — olaydan sonra değil, öncesinde.",
    },
    order: 4,
  },
  {
    id: "illness",
    label: { en: "When you or someone you love is ill", tr: "Siz ya da sevdiğiniz biri hastalandığında" },
    description: {
      en: "Sickness, pain, and long affliction borne without complaint against the One who sent it.",
      tr: "Hastalık, ağrı ve onu gönderene şikâyet etmeden taşınan uzun ıstırap.",
    },
    order: 5,
  },
  {
    id: "provision",
    label: { en: "When you are in need", tr: "İhtiyaç içinde olduğunuzda" },
    description: {
      en: "Hunger, debt, work, shelter — asking for what sustains you without naming a figure.",
      tr: "Açlık, borç, iş, barınak — bir miktar belirtmeden geçiminizi istemek.",
    },
    order: 6,
  },
  {
    id: "children",
    label: { en: "When you long for a child", tr: "Bir evlat özlediğinizde" },
    description: {
      en: "Childlessness, and prayers for offspring — including those made long past the age of expecting.",
      tr: "Evlatsızlık ve zürriyet duaları — ümidin çoktan tükendiği yaşlarda edilenler dâhil.",
    },
    order: 7,
  },
  {
    id: "family",
    label: { en: "For your parents and your family", tr: "Anne babanız ve aileniz için" },
    description: {
      en: "Praying for the people you are bound to — parents, spouse, descendants, household.",
      tr: "Bağlı olduğunuz insanlar için dua: anne baba, eş, zürriyet, hane halkı.",
    },
    order: 8,
  },
  {
    id: "guidance",
    label: { en: "When you must decide", tr: "Karar vermeniz gerektiğinde" },
    description: {
      en: "A choice you cannot see the end of, and the request to be shown rather than told.",
      tr: "Sonunu göremediğiniz bir tercih ve söylenmek yerine gösterilmeyi isteme.",
    },
    order: 9,
  },
  {
    id: "knowledge",
    label: { en: "When you want to understand", tr: "Anlamak istediğinizde" },
    description: {
      en: "Study, memorisation, teaching, and the honest admission of not knowing.",
      tr: "İlim, ezber, öğretmek ve bilmediğini dürüstçe kabul etmek.",
    },
    order: 10,
  },
  {
    id: "strength",
    label: { en: "When the task is beyond you", tr: "Görev gücünüzü aştığında" },
    description: {
      en: "Being sent to do something you do not feel equal to, and asking for capacity rather than escape.",
      tr: "Kendinizi yeterli hissetmediğiniz bir işle görevlendirildiğinizde, kaçış değil güç istemek.",
    },
    order: 11,
  },
  {
    id: "injustice",
    label: { en: "When you are wronged", tr: "Haksızlığa uğradığınızda" },
    description: {
      en: "Oppression, slander, and power used against you — taking it to Allah instead of into your own hands.",
      tr: "Zulüm, iftira ve aleyhinize kullanılan güç — meseleyi kendi elinize almak yerine Allah'a götürmek.",
    },
    order: 12,
  },
  {
    id: "protection",
    label: { en: "When you need protecting", tr: "Korunmaya ihtiyaç duyduğunuzda" },
    description: {
      en: "Seeking refuge — from harm, from people, from what you cannot see, and from yourself.",
      tr: "Sığınma: zarardan, insanlardan, göremediğinizden ve kendinizden.",
    },
    order: 13,
  },
  {
    id: "steadfastness",
    label: { en: "When you must hold firm", tr: "Sebat etmeniz gerektiğinde" },
    description: {
      en: "Standing on something at cost — asking to be poured patience rather than to be spared the test.",
      tr: "Bir şeyin arkasında bedel ödeyerek durmak — imtihandan muaf tutulmayı değil, sabır dökülmesini istemek.",
    },
    order: 14,
  },
  {
    id: "gratitude",
    label: { en: "When you want to give thanks", tr: "Şükretmek istediğinizde" },
    description: {
      en: "After the thing you asked for arrived — the prayer that is easiest to forget.",
      tr: "İstediğiniz şey geldikten sonra — unutulması en kolay dua.",
    },
    order: 15,
  },
  {
    id: "hereafter",
    label: { en: "When you think of the end", tr: "Sonu düşündüğünüzde" },
    description: {
      en: "Death, the reckoning, and asking to be gathered with the righteous.",
      tr: "Ölüm, hesap ve salihlerle birlikte haşredilmeyi istemek.",
    },
    order: 16,
  },
];

export const THEME_IDS = THEMES.map((t) => t.id);
