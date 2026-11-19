/*
 * The Duʿāʾ of the Prophets — shared browser behaviour.
 *
 * Plain JavaScript, no dependencies. Everything a reader keeps (settings,
 * saved entries, lists, recently read) lives in localStorage on their own
 * device and is never sent anywhere. Every read and write is guarded: storage
 * can be unavailable (private windows, blocked site data) and the site must
 * still work as a reference without it.
 */
(() => {
  "use strict";
  const D = window.DUA || { lang: "en", base: "/dua" };
  const { lang, base } = D;
  const s = window.DUA_S || {};
  const fmt = (k, v = {}) => (s[k] || k).replace(/\{(\w+)\}/g, (m, n) => (n in v ? v[n] : m));
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  /* ------------------------------ storage ------------------------------ */

  const store = {
    get(k, d) {
      try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; }
    },
    set(k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; }
    },
  };
  // `dua.bookmarks` keeps its old name so existing saved entries carry over.
  const K = { settings: "dua.settings", saved: "dua.bookmarks", lists: "dua.lists", recent: "dua.recent" };

  let persistAsked = false;
  const askPersist = () => {
    if (persistAsked) return;
    persistAsked = true;
    try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch {}
  };

  /* ------------------------------ settings ----------------------------- */

  const defaults = { theme: "auto", type: "normal", translit: true, honorific: "arabic", reading: "auto" };
  let st = Object.assign({}, defaults, store.get(K.settings, {}));

  function apply() {
    const r = document.documentElement;
    if (st.theme === "auto") delete r.dataset.theme; else r.dataset.theme = st.theme;
    if (st.type === "normal") delete r.dataset.type; else r.dataset.type = st.type;
    r.dataset.translit = st.translit ? "on" : "off";
    r.dataset.honorific = st.honorific;
    r.dataset.reading = !st.reading || st.reading === "auto" ? lang : st.reading;
    $$("[data-hon]").forEach((el) => {
      const key = st.honorific === "full" ? "honFull" : st.honorific === "abbr" ? "honAbbr" : "honArabic";
      el.textContent = el.dataset[key] || "";
      const latin = st.honorific !== "arabic";
      el.style.fontFamily = latin ? "inherit" : "var(--font-arabic)";
      if (latin) { el.removeAttribute("dir"); el.lang = lang; }
    });
  }
  const saveSettings = () => { store.set(K.settings, st); apply(); };

  function wireSettings() {
    const dlg = $("[data-settings]");
    if (!dlg) return;
    $$("input[type=radio]", dlg).forEach((input) => {
      const n = input.name;
      const cur = n === "translit" ? (st.translit ? "on" : "off") : st[n] || defaults[n];
      input.checked = input.value === cur;
      input.addEventListener("change", () => {
        st[n] = n === "translit" ? input.value === "on" : input.value;
        saveSettings();
      });
    });
    $$("[data-open-settings]").forEach((b) => b.addEventListener("click", () => dlg.showModal()));
  }

  /* --------------------------- language choice ------------------------- */

  function wireLanguage() {
    $$("[data-set-lang]").forEach((a) =>
      a.addEventListener("click", () => { st.uilang = a.dataset.setLang; store.set(K.settings, st); }),
    );
    // On the English home page only: a reader who chose Turkish, or whose
    // browser is Turkish and who has never chosen, goes to the Turkish home.
    const onEnHome = lang === "en" && (location.pathname === base + "/" || location.pathname === base);
    if (!onEnHome || location.search.includes("lang=en")) return;
    let want = st.uilang;
    if (!want) {
      const langs = navigator.languages || [navigator.language || ""];
      want = langs.some((l) => /^tr\b/i.test(l)) ? "tr" : "en";
      st.uilang = want;
      store.set(K.settings, st);
    }
    if (want === "tr") location.replace(base + "/tr/" + location.hash);
  }

  /* -------------------------------- toast ------------------------------ */

  let toastTimer;
  function toast(msg) {
    const el = $("[data-toast]");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("on"), 2600);
  }

  /* --------------------------- saved and lists ------------------------- */

  const saved = () => store.get(K.saved, []);
  const isSaved = (id) => saved().includes(id);
  function toggleSaved(id) {
    const l = saved();
    const i = l.indexOf(id);
    if (i === -1) l.unshift(id); else l.splice(i, 1);
    store.set(K.saved, l);
    askPersist();
    return i === -1;
  }

  const lists = () => store.get(K.lists, []);
  const setLists = (l) => { store.set(K.lists, l); askPersist(); };
  function createList(name) {
    const l = lists();
    const item = { id: "l" + Date.now().toString(36), name: name.slice(0, 60), items: [] };
    l.push(item);
    setLists(l);
    return item;
  }
  function toggleInList(listId, duaId) {
    const l = lists();
    const list = l.find((x) => x.id === listId);
    if (!list) return false;
    const i = list.items.indexOf(duaId);
    if (i === -1) list.items.push(duaId); else list.items.splice(i, 1);
    setLists(l);
    return i === -1;
  }

  function openListSheet(duaId) {
    const dlg = $("[data-list-sheet]");
    if (!dlg) return;
    const ul = $("[data-list-options]", dlg);
    const render = () => {
      ul.innerHTML = "";
      lists().forEach((list) => {
        const li = document.createElement("li");
        const label = document.createElement("label");
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = list.items.includes(duaId);
        cb.addEventListener("change", () => toggleInList(list.id, duaId));
        label.append(cb, document.createTextNode(list.name));
        li.append(label);
        ul.append(li);
      });
    };
    render();
    const btn = $("[data-new-list]", dlg);
    btn.onclick = () => {
      const name = (prompt(s.newListPrompt) || "").trim();
      if (!name) return;
      const list = createList(name);
      toggleInList(list.id, duaId);
      render();
    };
    dlg.showModal();
  }

  function recordRecent(id) {
    const r = store.get(K.recent, []).filter((x) => x.id !== id);
    r.unshift({ id, at: Date.now() });
    store.set(K.recent, r.slice(0, 30));
  }

  /* ------------------------------- cards ------------------------------- */

  let cardsP;
  const cards = () =>
    (cardsP ||= fetch(base + "/cards.json").then((r) => r.json()).then((list) => {
      const byId = new Map(list.map((c) => [c.id, c]));
      return { list, byId };
    }));
  const pickL = (o) => (o && (o[lang] || o.en)) || "";
  const cardUrl = (id) => base + (lang === "tr" ? "/tr" : "") + "/duas/" + id + "/";

  /* ---------------------------- duʿāʾ of the day ----------------------- */

  /** Same entry for everyone on a given local date; changes at midnight. */
  function dayIndex(n, date = new Date()) {
    const days = Math.floor(
      (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(2024, 0, 1)) / 864e5,
    );
    // A fixed stride co-prime with most pool sizes, so neighbours differ.
    return ((days * 37) % n + n) % n;
  }

  /* ------------------------------- audio ------------------------------- */

  const AUDIO = (n) => `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${n}.mp3`;
  let player = null;
  function playAyahs(ayahs, btn) {
    if (player) { player.stop(); if (player.btn === btn) return; }
    let i = 0;
    const a = new Audio();
    a.preload = "auto";
    const setBtn = (on) => {
      if (!btn) return;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      const lab = $("[data-label]", btn);
      if (lab) lab.textContent = on ? s.actPause : s.actListen;
      const svg = $("svg", btn);
      if (svg) svg.innerHTML = on ? '<path d="M8 5v14M16 5v14"/>' : '<path d="M8 5.5v13l10.5-6.5z"/>';
    };
    const next = () => {
      if (i >= ayahs.length) { stop(); return; }
      a.src = AUDIO(ayahs[i++]);
      a.play().catch(() => { toast(s.audioNeedsNet); stop(); });
    };
    const stop = () => { a.pause(); a.removeAttribute("src"); setBtn(false); player = null; };
    a.addEventListener("ended", next);
    a.addEventListener("error", () => { toast(s.audioNeedsNet); stop(); });
    player = { stop, btn };
    setBtn(true);
    next();
  }

  const stopAudio = () => { if (player) player.stop(); };

  /** A figure's honorific in the reader's chosen form, for names built in script. */
  function hon(h) {
    if (!h || !h.a) return "";
    const f = st.honorific === "full" ? h.f[lang] || h.f.en : st.honorific === "abbr" ? h.b : h.a;
    return f;
  }

  /* ---------------------------- share as image ------------------------- */

  function wrap(ctx, text, maxW) {
    const words = text.split(/\s+/);
    const lines = [];
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
    }
    if (line) lines.push(line);
    return lines;
  }

  async function makeImage(c) {
    const W = 1080, H = 1350, M = 96;
    const cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d");
    const css = getComputedStyle(document.documentElement);
    const col = (v, d) => (css.getPropertyValue(v) || d).trim();
    // Always the light palette: a shared image should look the same everywhere.
    const paper = "#f4f2ec", ink = "#1b1e1c", soft = "#4b504b", gilt = "#8a6a2f", giltSoft = "#b8995c";
    void col;
    try {
      await Promise.all([
        document.fonts.load('56px "Amiri"', c.ar || "ا"),
        document.fonts.load('600 40px "Source Serif"', "Aa"),
        document.fonts.load('30px "Source Sans"', "Aa"),
      ]);
    } catch {}
    ctx.fillStyle = paper; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = giltSoft; ctx.lineWidth = 2; ctx.strokeRect(40, 40, W - 80, H - 80);
    ctx.globalAlpha = 0.55; ctx.strokeRect(52, 52, W - 104, H - 104); ctx.globalAlpha = 1;
    // corner stars
    const star = (x, y, r) => {
      ctx.save(); ctx.translate(x, y); ctx.strokeStyle = gilt; ctx.lineWidth = 2.2;
      for (let k = 0; k < 2; k++) { ctx.save(); ctx.rotate((k * Math.PI) / 4); ctx.strokeRect(-r, -r, 2 * r, 2 * r); ctx.restore(); }
      ctx.fillStyle = gilt; ctx.beginPath(); ctx.arc(0, 0, r / 4, 0, 7); ctx.fill(); ctx.restore();
    };
    [[46, 46], [W - 46, 46], [46, H - 46], [W - 46, H - 46]].forEach(([x, y]) => star(x, y, 13));
    star(W / 2, 46, 15);

    const maxW = W - 2 * M;
    const tr = c[lang] || c.en;
    // Fit: shrink the Arabic, then the translation, until everything fits.
    let arSize = 62, trSize = 38, arLines, trLines, total;
    for (let guard = 0; guard < 40; guard++) {
      ctx.font = `${arSize}px "Amiri", serif`;
      arLines = c.ar ? wrap(ctx, c.ar, maxW) : [];
      ctx.font = `${trSize}px "Source Serif", serif`;
      trLines = wrap(ctx, tr, maxW);
      total = arLines.length * arSize * 1.9 + 60 + trLines.length * trSize * 1.45;
      if (total <= H - 2 * M - 230) break;
      if (arSize > 34) arSize -= 4; else if (trSize > 24) trSize -= 2; else break;
    }
    let y = M + 60 + Math.max(0, (H - 2 * M - 230 - total) / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = ink;
    ctx.font = `${arSize}px "Amiri", serif`;
    try { ctx.direction = "rtl"; } catch {}
    for (const l of arLines) { y += arSize * 1.9; ctx.fillText(l, W / 2, y - arSize * 0.45); }
    try { ctx.direction = "ltr"; } catch {}
    y += 40;
    ctx.fillStyle = giltSoft; ctx.fillRect(W / 2 - 40, y, 80, 2); y += 30;
    ctx.fillStyle = soft; ctx.font = `${trSize}px "Source Serif", serif`;
    for (const l of trLines) { y += trSize * 1.45; ctx.fillText(l, W / 2, y); }

    ctx.fillStyle = ink; ctx.font = '600 34px "Source Serif", serif';
    ctx.fillText(pickL(c.t), W / 2, H - M - 92);
    ctx.fillStyle = gilt; ctx.font = '28px "Source Sans", sans-serif';
    // Locale-aware: "SÛRESİ", not "SÛRESI".
    ctx.fillText(`${pickL(c.s)} · ${pickL(c.r)}`.toLocaleUpperCase(lang === "tr" ? "tr-TR" : "en-GB"), W / 2, H - M - 46);
    ctx.fillStyle = soft; ctx.font = '24px "Source Sans", sans-serif';
    ctx.fillText(`${s.siteName} · candanumut.github.io/dua`, W / 2, H - M);
    return new Promise((res) => cv.toBlob(res, "image/png"));
  }

  async function shareCard(c) {
    toast(s.shareMaking);
    const blob = await makeImage(c);
    if (!blob) return;
    const file = new File([blob], `${c.id}.png`, { type: "image/png" });
    const link = location.origin + cardUrl(c.id);
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: pickL(c.t), text: `${pickL(c.t)} — ${pickL(c.r)}\n${link}` });
        return;
      }
    } catch (e) { if (e && e.name === "AbortError") return; }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = file.name;
    document.body.append(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  /* ----------------------------- duʿāʾ page ---------------------------- */

  function wireDuaPage() {
    const dataEl = $("#dua-data");
    if (!dataEl) return;
    let c;
    try { c = JSON.parse(dataEl.textContent); } catch { return; }
    recordRecent(c.id);

    const saveBtn = $("[data-act=save]");
    const syncSave = () => {
      if (!saveBtn) return;
      const on = isSaved(c.id);
      saveBtn.setAttribute("aria-pressed", on ? "true" : "false");
      const lab = $("[data-label]", saveBtn);
      if (lab) lab.textContent = on ? s.actSaved : s.actSave;
    };
    saveBtn && saveBtn.addEventListener("click", () => { toast(toggleSaved(c.id) ? s.savedToast : s.removedToast); syncSave(); });
    syncSave();

    $$("[data-act=list]").forEach((b) => b.addEventListener("click", () => openListSheet(c.id)));
    $$("[data-act=share]").forEach((b) => b.addEventListener("click", () => shareCard(c)));
    $$("[data-act=listen]").forEach((b) => b.addEventListener("click", () => playAyahs(c.au, b)));
    $$("[data-act=copy]").forEach((b) =>
      b.addEventListener("click", async () => {
        // A copied duʿāʾ carries its source; scripture detached from its
        // citation is how misattribution spreads.
        const text = [c.ar, c[lang] || c.en, `— ${pickL(c.r)}`, location.origin + cardUrl(c.id)].filter(Boolean).join("\n\n");
        try { await navigator.clipboard.writeText(text); toast(s.copied); } catch { toast(s.copyFailed); }
      }),
    );
  }

  /* ------------------------------ boot --------------------------------- */

  function boot() {
    apply();
    wireSettings();
    wireLanguage();
    wireDuaPage();
    if ("serviceWorker" in navigator) {
      addEventListener("load", () =>
        navigator.serviceWorker
          .register(base + "/sw.js")
          .then(() => navigator.serviceWorker.ready)
          // The worker precaches shared files on install; the pages are cached
          // for the language this reader uses, which halves the download.
          .then((reg) => reg.active && reg.active.postMessage({ type: "precache", lang }))
          .catch(() => {}),
      );
    }
  }

  window.DuaApp = {
    lang, base, s, fmt, store, K, toast, cards, pickL, cardUrl, dayIndex,
    saved, isSaved, toggleSaved, lists, setLists, createList, toggleInList, openListSheet,
    playAyahs, stopAudio, hon, shareCard, makeImage, askPersist,
    settings: () => st,
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
