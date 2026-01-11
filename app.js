/* ==========================================================
   Prophets’ Duas — Vanilla JS App
   - GitHub Pages friendly
   - No external libraries
   - Robust for 500+ entries
   ========================================================== */

(() => {
  "use strict";

  /* ------------------------------
     Configuration / Constants
  ------------------------------ */
  const DATA_URL = "./data/prayers.json";
  const LS_KEY = "prophets_duas_v1";

  const DEFAULT_PREFS = {
    theme: "auto",            // auto | light | dark
    uiLang: "en",             // en | tr
    showArabic: true,
    showTranslit: true,
    showEN: true,
    showTR: true,
    fontArabic: 20,           // px
    fontText: 15,             // px
    favorites: [],            // [id]
    recent: [],               // [id] newest first
    lastRoute: "#home",
  };

  const I18N = {
    en: {
      sections: { home: "Home", prophets: "Prophets", topics: "Topics", favorites: "Favorites", about: "About" },
      filters: { prophet: "Prophet", topic: "Topic", source: "Source", allProphets: "All Prophets", allTopics: "All Topics", allSources: "All Sources" },
      meta: { found: "found", prayers: "prayers", shown: "shown", tip: "Tip" },
      actions: { copyArabic: "Copy Arabic", copyFull: "Copy Full", share: "Share", save: "Save", saved: "Saved", retry: "Retry", reset: "Reset" },
      labels: { translit: "Transliteration", english: "English", turkish: "Türkçe", tags: "Tags", reflection: "Reflection & Context", meaning: "Meaning" },
      states: {
        loadingTitle: "Loading…",
        loadingDesc: "Preparing the collection.",
        errorTitle: "Couldn’t load data",
        errorDesc: "Please check your connection or try again.",
        noResultsTitle: "No results",
        noResultsDesc: "Try a different spelling, a topic tag, or search in Arabic.",
        noFavTitle: "No favorites yet",
        noFavDesc: "Save duas you want to revisit. Favorites will appear here.",
      },
      about: {
        title: "About & Sources",
        desc: "This is a static, client-side collection. Always verify references.",
        disclaimers: [
          "Translations can vary; consult trusted sources for study.",
          "Hadith grading depends on scholarly methodology; check the referenced collections.",
          "This site is a convenience tool and does not replace scholarly guidance."
        ]
      },
      home: {
        daily: "Daily Dua",
        featured: "Featured & Recent",
        recentlyViewed: "Recently Viewed",
        open: "Open"
      }
    },
    tr: {
      sections: { home: "Ana Sayfa", prophets: "Peygamberler", topics: "Konular", favorites: "Favoriler", about: "Hakkında" },
      filters: { prophet: "Peygamber", topic: "Konu", source: "Kaynak", allProphets: "Tüm Peygamberler", allTopics: "Tüm Konular", allSources: "Tüm Kaynaklar" },
      meta: { found: "bulundu", prayers: "dua", shown: "gösteriliyor", tip: "İpucu" },
      actions: { copyArabic: "Arapçayı Kopyala", copyFull: "Tamamını Kopyala", share: "Paylaş", save: "Kaydet", saved: "Kaydedildi", retry: "Tekrar Dene", reset: "Sıfırla" },
      labels: { translit: "Okunuş", english: "İngilizce", turkish: "Türkçe", tags: "Etiketler", reflection: "Bağlam & Tefekkür", meaning: "Anlam" },
      states: {
        loadingTitle: "Yükleniyor…",
        loadingDesc: "Koleksiyon hazırlanıyor.",
        errorTitle: "Veri yüklenemedi",
        errorDesc: "Bağlantınızı kontrol edin veya tekrar deneyin.",
        noResultsTitle: "Sonuç yok",
        noResultsDesc: "Farklı yazım deneyin, etiket seçin veya Arapça arayın.",
        noFavTitle: "Henüz favori yok",
        noFavDesc: "Tekrar okumak istediğiniz duaları kaydedin. Favoriler burada görünür.",
      },
      about: {
        title: "Hakkında & Kaynaklar",
        desc: "Bu sayfa tamamen statiktir. Referansları mutlaka doğrulayın.",
        disclaimers: [
          "Mealler değişebilir; ders için güvenilir kaynaklara başvurun.",
          "Hadis sıhhat değerlendirmeleri yönteme göre değişebilir; kaynakları kontrol edin.",
          "Bu site kolaylık aracıdır; ilim ehlinin rehberliğinin yerine geçmez."
        ]
      },
      home: {
        daily: "Günün Duası",
        featured: "Öne Çıkanlar & Son Görüntülenenler",
        recentlyViewed: "Son Görüntülenenler",
        open: "Aç"
      }
    }
  };

  /* ------------------------------
     State
  ------------------------------ */
  let DATA = [];
  let INDEX = []; // {id, search, prophetKey, topicSet, sourceType}
  let PROPHETS = []; // derived list
  let TOPICS = [];   // derived list
  let SOURCE_TYPES = ["Quran", "Hadith", "Other"];

  const state = {
    prefs: loadPrefs(),
    route: "home",
    routeParam: null, // dua id
    q: "",
    prophet: "",
    topic: "",
    source: "",
    renderedIds: [],
  };

  /* ------------------------------
     DOM Helpers
  ------------------------------ */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const warnOnce = (() => {
    const seen = new Set();
    return (key, msg) => {
      if (seen.has(key)) return;
      seen.add(key);
      console.warn(msg);
    };
  })();

  function safeText(v) {
    return (v == null) ? "" : String(v);
  }

  function escapeHTML(str) {
    const s = safeText(str);
    return s.replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;",
    }[m]));
  }

  function normalize(s) {
    return safeText(s)
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function debounce(fn, ms = 160) {
    let t = null;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  /* ------------------------------
     Local Storage
  ------------------------------ */
  function loadPrefs() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return structuredClone(DEFAULT_PREFS);
      const parsed = JSON.parse(raw);
      return { ...structuredClone(DEFAULT_PREFS), ...parsed };
    } catch {
      return structuredClone(DEFAULT_PREFS);
    }
  }

  function savePrefs() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state.prefs));
    } catch { /* ignore */ }
  }

  function setPref(key, value) {
    state.prefs[key] = value;
    savePrefs();
  }

  /* ------------------------------
     Theme + Font
  ------------------------------ */
  function applyTheme() {
    // We can't edit CSS file, but we can set an attribute and allow future CSS hooks.
    const mode = state.prefs.theme || "auto";
    document.documentElement.setAttribute("data-theme", mode);
    // For immediate effect, we can also apply a class that future CSS could use.
    document.body.classList.toggle("force-light", mode === "light");
    document.body.classList.toggle("force-dark", mode === "dark");
  }

  function applyFontSizes() {
    const ar = clamp(Number(state.prefs.fontArabic || 20), 16, 34);
    const txt = clamp(Number(state.prefs.fontText || 15), 13, 20);

    document.documentElement.style.setProperty("--arabic", `${ar}px`);
    document.documentElement.style.setProperty("--arabic-big", `${Math.min(ar + 4, 38)}px`);
    document.documentElement.style.setProperty("--text", `${txt}px`);
  }

  /* ------------------------------
     Routing (hash)
  ------------------------------ */
  function parseHash() {
    const h = (location.hash || "#home").replace(/^#/, "");
    // support:
    // 1) #home, #prophets, #topics, #favorites, #about
    // 2) #dua=<id>
    // 3) #q=...&prophet=...&topic=...&source=...&route=...
    if (!h) return { route: "home" };

    // If it looks like querystring
    if (h.includes("=")) {
      const params = new URLSearchParams(h);
      const dua = params.get("dua");
      const route = params.get("route") || (dua ? "dua" : "home");
      return {
        route,
        dua,
        q: params.get("q") || "",
        prophet: params.get("prophet") || "",
        topic: params.get("topic") || "",
        source: params.get("source") || ""
      };
    }

    // Simple route
    return { route: h };
  }

  function setHashFromState(extra = {}) {
    const params = new URLSearchParams();
    const route = extra.route ?? state.route ?? "home";

    if (route === "dua" && (extra.dua || state.routeParam)) {
      params.set("route", "dua");
      params.set("dua", extra.dua || state.routeParam);
    } else {
      params.set("route", route);
    }

    const q = extra.q ?? state.q;
    const prophet = extra.prophet ?? state.prophet;
    const topic = extra.topic ?? state.topic;
    const source = extra.source ?? state.source;

    if (q) params.set("q", q);
    if (prophet) params.set("prophet", prophet);
    if (topic) params.set("topic", topic);
    if (source) params.set("source", source);

    location.hash = params.toString();
  }

  function handleRouteChange() {
    const parsed = parseHash();

    // update state
    state.route = parsed.route || "home";
    state.routeParam = parsed.dua || null;

    if (parsed.q != null) state.q = parsed.q;
    if (parsed.prophet != null) state.prophet = parsed.prophet;
    if (parsed.topic != null) state.topic = parsed.topic;
    if (parsed.source != null) state.source = parsed.source;

    state.prefs.lastRoute = location.hash || "#route=home";
    savePrefs();

    // sync UI inputs
    syncControlsFromState();

    // render section
    renderApp();
  }

  /* ------------------------------
     Data Loading
  ------------------------------ */
  async function fetchData() {
    try {
      showSkeletons(true);
      showError(false);

      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      if (!Array.isArray(json)) throw new Error("Invalid data format: root must be array");
      DATA = json;
      buildDerived();
      showSkeletons(false);

      // initial render
      renderApp();

      // open deep-linked dua after render if requested
      if (state.route === "dua" && state.routeParam) {
        openDua(state.routeParam, { pushRecent: true, focus: true });
      }
    } catch (err) {
      console.error("Failed to load data:", err);
      showSkeletons(false);
      showError(true);
    }
  }

  function buildDerived() {
    // Build fast search index and distinct lists
    const prophetsSet = new Map(); // key -> {en,tr,ar}
    const topicsSet = new Set();
    const sourceSet = new Set();

    INDEX = DATA.map((p) => {
      const id = safeText(p.id);
      const prophetEN = safeText(p?.prophet?.en);
      const prophetTR = safeText(p?.prophet?.tr);
      const prophetAR = safeText(p?.prophet?.ar);
      const prophetKey = prophetEN || prophetTR || prophetAR;

      if (prophetKey && !prophetsSet.has(prophetKey)) {
        prophetsSet.set(prophetKey, { en: prophetEN, tr: prophetTR, ar: prophetAR, key: prophetKey });
      }

      const topics = Array.isArray(p.topics) ? p.topics.filter(Boolean).map(String) : [];
      topics.forEach(t => topicsSet.add(t));

      const sourceType = safeText(p?.source?.type) || "Other";
      sourceSet.add(sourceType);

      const ref = safeText(p?.source?.reference);
      const book = safeText(p?.source?.book);
      const grade = safeText(p?.source?.grade);

      const hay = normalize([
        id,
        prophetEN, prophetTR, prophetAR,
        sourceType, ref, book, grade,
        safeText(p.arabic),
        safeText(p.transliteration),
        safeText(p.english),
        safeText(p.turkish),
        topics.join(" "),
        safeText(p.notes),
        safeText(p.context),
        safeText(p.reflection),
      ].join(" | "));

      return {
        id,
        prophetKey,
        topics: new Set(topics),
        sourceType,
        search: hay
      };
    });

    PROPHETS = Array.from(prophetsSet.values())
      .sort((a, b) => (normalize(a.key) > normalize(b.key) ? 1 : -1));

    TOPICS = Array.from(topicsSet.values())
      .sort((a, b) => (normalize(a) > normalize(b) ? 1 : -1));

    SOURCE_TYPES = Array.from(sourceSet.values());
    // prefer ordering
    SOURCE_TYPES.sort((a, b) => {
      const rank = (x) => (x === "Quran" ? 0 : x === "Hadith" ? 1 : 2);
      return rank(a) - rank(b);
    });

    // populate filters UI
    fillFilterOptions();
    fillProphetIndex();
  }

  /* ------------------------------
     UI Wiring (DOM)
  ------------------------------ */
  function bindUI() {
    // Ensure app.js is loaded (it isn't included in HTML yet).
    // We'll fail gracefully if not present, but warn.
    if (!$("main")) warnOnce("no-main", "Expected <main> not found.");

    // Search input
    const elSearch = $("#search");
    if (elSearch) {
      elSearch.value = state.q || "";
      elSearch.addEventListener("input", debounce(() => {
        state.q = elSearch.value || "";
        setHashFromState({ route: state.route, q: state.q });
      }, 160));
    } else {
      warnOnce("no-search", "Search input #search not found.");
    }

    // Clear search button (placeholder in HTML as .search .pill-btn.ghost)
    const elClear = $(".search .pill-btn.ghost");
    if (elClear) {
      elClear.addEventListener("click", () => {
        state.q = "";
        if (elSearch) elSearch.value = "";
        setHashFromState({ route: state.route, q: "" });
      });
    }

    // Filters
    const elProphet = $("#prophet");
    const elTopic = $("#topic");
    const elSource = $("#source");

    if (elProphet) elProphet.addEventListener("change", () => {
      state.prophet = elProphet.value === "__all__" ? "" : elProphet.value;
      setHashFromState({ route: state.route, prophet: state.prophet });
    });

    if (elTopic) elTopic.addEventListener("change", () => {
      state.topic = elTopic.value === "__all__" ? "" : elTopic.value;
      setHashFromState({ route: state.route, topic: state.topic });
    });

    if (elSource) elSource.addEventListener("change", () => {
      state.source = elSource.value === "__all__" ? "" : elSource.value;
      setHashFromState({ route: state.route, source: state.source });
    });

    // Reset button in filters panel
    const resetBtn = $$("button").find(b => safeText(b.textContent).trim().toLowerCase() === "reset");
    const resetBtnTR = $$("button").find(b => safeText(b.textContent).trim().toLowerCase() === "sıfırla");
    const reset = resetBtn || resetBtnTR;
    if (reset) {
      reset.addEventListener("click", () => {
        state.q = "";
        state.prophet = "";
        state.topic = "";
        state.source = "";
        if (elSearch) elSearch.value = "";
        setHashFromState({ route: state.route, q: "", prophet: "", topic: "", source: "" });
      });
    }

    // Section navigation (tabs + bottom nav)
    $$("a.tab, a.bn-item").forEach(a => {
      a.addEventListener("click", (e) => {
        // Let hash change happen naturally, but also ensure we set route.
        const href = a.getAttribute("href") || "";
        if (!href.startsWith("#")) return;
        const route = href.replace("#", "");
        // If they clicked a plain section, keep current filters/search in hash
        e.preventDefault();
        setHashFromState({ route });
      });
    });

    // Topic chips row (top)
    $$(".chip-row .chip").forEach(btn => {
      btn.addEventListener("click", () => {
        // "All" clears topic filter
        const label = safeText(btn.textContent).trim();
        if (normalize(label) === "all" || normalize(label) === "tümü" || normalize(label) === "tum") {
          state.topic = "";
        } else {
          state.topic = label;
        }
        setHashFromState({ route: state.route, topic: state.topic });
      });
    });

    // Content visibility toggles
    const toggles = $$(".toggle-strip .toggle");
    toggles.forEach((labelEl) => {
      const txt = normalize(labelEl.textContent);
      const input = $("input", labelEl);
      if (!input) return;

      if (txt.includes("arabic")) input.checked = !!state.prefs.showArabic;
      if (txt.includes("translit")) input.checked = !!state.prefs.showTranslit;
      if (txt === "en") input.checked = !!state.prefs.showEN;
      if (txt === "tr") input.checked = !!state.prefs.showTR;

      input.addEventListener("change", () => {
        if (txt.includes("arabic")) setPref("showArabic", input.checked);
        if (txt.includes("translit")) setPref("showTranslit", input.checked);
        if (txt === "en") setPref("showEN", input.checked);
        if (txt === "tr") setPref("showTR", input.checked);
        renderResults(); // rerender cards quickly
        updateSideSheetVisibility(); // if open
      });
    });

    // Interface language segmented (EN/TR) in filters panel
    const uiLangSeg = $$(".filters .segmented .seg-btn");
    if (uiLangSeg.length >= 2) {
      const [enBtn, trBtn] = uiLangSeg;
      setSegmentActive(uiLangSeg, state.prefs.uiLang === "tr" ? trBtn : enBtn);

      enBtn.addEventListener("click", () => {
        setPref("uiLang", "en");
        setSegmentActive(uiLangSeg, enBtn);
        renderApp();
      });
      trBtn.addEventListener("click", () => {
        setPref("uiLang", "tr");
        setSegmentActive(uiLangSeg, trBtn);
        renderApp();
      });
    }

    // Theme segmented (Auto/Light/Dark)
    const themeSeg = $$(".header-actions .segmented .seg-btn");
    if (themeSeg.length >= 3) {
      const [autoBtn, lightBtn, darkBtn] = themeSeg;
      const mode = state.prefs.theme || "auto";
      setSegmentActive(themeSeg, mode === "light" ? lightBtn : mode === "dark" ? darkBtn : autoBtn);

      autoBtn.addEventListener("click", () => { setPref("theme", "auto"); setSegmentActive(themeSeg, autoBtn); applyTheme(); });
      lightBtn.addEventListener("click", () => { setPref("theme", "light"); setSegmentActive(themeSeg, lightBtn); applyTheme(); });
      darkBtn.addEventListener("click", () => { setPref("theme", "dark"); setSegmentActive(themeSeg, darkBtn); applyTheme(); });
    }

    // Font size controls (A-/A+)
    const fontBtns = $$(".header-actions .font-controls .icon-btn");
    if (fontBtns.length >= 2) {
      const [minus, plus] = fontBtns;
      minus.addEventListener("click", () => {
        setPref("fontArabic", clamp(Number(state.prefs.fontArabic) - 1, 16, 34));
        setPref("fontText", clamp(Number(state.prefs.fontText) - 1, 13, 20));
        applyFontSizes();
      });
      plus.addEventListener("click", () => {
        setPref("fontArabic", clamp(Number(state.prefs.fontArabic) + 1, 16, 34));
        setPref("fontText", clamp(Number(state.prefs.fontText) + 1, 13, 20));
        applyFontSizes();
      });
    }

    // Escape closes sheet
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeSideSheet({ restoreFocus: true });
      }
    });

    // Side-sheet close button
    const sheetClose = $(".side-sheet .sheet-head .icon-btn");
    if (sheetClose) sheetClose.addEventListener("click", () => closeSideSheet({ restoreFocus: true }));

    // Retry button (created in error state)
    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      if (t.matches("[data-action='retry']")) fetchData();
    });

    // Global click handlers for card actions (event delegation)
    document.addEventListener("click", async (e) => {
      const target = e.target instanceof HTMLElement ? e.target : null;
      if (!target) return;

      const actionBtn = target.closest("[data-action]");
      if (!actionBtn) return;

      const action = actionBtn.getAttribute("data-action");
      const id = actionBtn.getAttribute("data-id");
      if (!action || !id) return;

      const entry = findById(id);
      if (!entry) return;

      if (action === "open") {
        openDua(id, { pushRecent: true, focus: true, updateHash: true });
        return;
      }

      if (action === "fav") {
        toggleFavorite(id);
        // update button states in list + sheet
        updateFavoriteButtons(id);
        renderIfRouteFavorites();
        return;
      }

      if (action === "share") {
        const link = makeShareLink({ dua: id });
        await copyToClipboard(link);
        toast(actionBtn, state.prefs.uiLang === "tr" ? "Link kopyalandı!" : "Link copied!");
        return;
      }

      if (action === "copyArabic") {
        await copyToClipboard(safeText(entry.arabic));
        toast(actionBtn, state.prefs.uiLang === "tr" ? "Arapça kopyalandı!" : "Arabic copied!");
        return;
      }

      if (action === "copyFull") {
        const full = buildFullCopy(entry);
        await copyToClipboard(full);
        toast(actionBtn, state.prefs.uiLang === "tr" ? "Metin kopyalandı!" : "Copied!");
        return;
      }
    });

    // Keyboard: Enter on card opens
    document.addEventListener("keydown", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (e.key !== "Enter") return;

      const card = target.closest("[data-card-id]");
      if (!card) return;

      // avoid Enter toggling details when focused on summary
      if (target.tagName.toLowerCase() === "summary") return;

      const id = card.getAttribute("data-card-id");
      if (!id) return;
      openDua(id, { pushRecent: true, focus: true, updateHash: true });
    });
  }

  function setSegmentActive(btns, activeBtn) {
    btns.forEach(b => {
      b.classList.toggle("is-active", b === activeBtn);
      b.setAttribute("aria-pressed", b === activeBtn ? "true" : "false");
    });
  }

  function toast(anchorEl, message) {
    // micro toast near the button
    const el = document.createElement("div");
    el.className = "mini-toast";
    el.textContent = message;
    Object.assign(el.style, {
      position: "fixed",
      zIndex: "9999",
      padding: "8px 10px",
      borderRadius: "12px",
      border: "1px solid rgba(127,127,127,.25)",
      background: "rgba(20,20,28,.72)",
      color: "white",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      fontSize: "12px",
      transform: "translateY(6px)",
      opacity: "0",
      transition: "opacity 180ms ease, transform 180ms ease",
      pointerEvents: "none",
    });

    document.body.appendChild(el);

    const r = anchorEl.getBoundingClientRect();
    const x = Math.min(window.innerWidth - 12, Math.max(12, r.left));
    const y = Math.max(12, r.top - 44);

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    requestAnimationFrame(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });

    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(6px)";
      setTimeout(() => el.remove(), 220);
    }, 900);
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
  }

  /* ------------------------------
     Populate Filters + Index UI
  ------------------------------ */
  function fillFilterOptions() {
    const t = I18N[state.prefs.uiLang] || I18N.en;

    const elProphet = $("#prophet");
    if (elProphet) {
      elProphet.innerHTML = "";
      elProphet.appendChild(new Option(t.filters.allProphets, "__all__"));
      PROPHETS.forEach(p => elProphet.appendChild(new Option(p.key, p.key)));
    }

    const elTopic = $("#topic");
    if (elTopic) {
      elTopic.innerHTML = "";
      elTopic.appendChild(new Option(t.filters.allTopics, "__all__"));
      TOPICS.forEach(tp => elTopic.appendChild(new Option(tp, tp)));
    }

    const elSource = $("#source");
    if (elSource) {
      elSource.innerHTML = "";
      elSource.appendChild(new Option(t.filters.allSources, "__all__"));
      SOURCE_TYPES.forEach(s => elSource.appendChild(new Option(s, s)));
    }
  }

  function fillProphetIndex() {
    // The HTML provides a static chip list; enhance it if present.
    const chipGrid = $(".prophet-index .chip-grid");
    if (!chipGrid) return;

    chipGrid.innerHTML = PROPHETS
      .slice(0, 30)
      .map(p => `<button class="chip" type="button" data-prophet="${escapeHTML(p.key)}">${escapeHTML(p.key)}</button>`)
      .join("");

    chipGrid.addEventListener("click", (e) => {
      const btn = e.target instanceof HTMLElement ? e.target.closest("[data-prophet]") : null;
      if (!btn) return;
      const key = btn.getAttribute("data-prophet") || "";
      state.prophet = key;
      setHashFromState({ route: "prophets", prophet: key });
    });
  }

  function syncControlsFromState() {
    const elSearch = $("#search");
    if (elSearch && elSearch.value !== state.q) elSearch.value = state.q || "";

    const elProphet = $("#prophet");
    if (elProphet) elProphet.value = state.prophet || "__all__";

    const elTopic = $("#topic");
    if (elTopic) elTopic.value = state.topic || "__all__";

    const elSource = $("#source");
    if (elSource) elSource.value = state.source || "__all__";

    // Update nav active states
    setNavActive(state.route);
    // Update chip active states (top chip row)
    updateTopChipsActive();
  }

  function setNavActive(route) {
    $$("a.tab, a.bn-item").forEach(a => {
      const href = a.getAttribute("href") || "";
      const r = href.startsWith("#") ? href.slice(1) : "";
      const active = r === route;
      a.classList.toggle("is-active", active);
      if (active) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function updateTopChipsActive() {
    // Set active for top chip row based on state.topic
    const chips = $$(".chip-row .chip");
    chips.forEach(c => {
      const label = safeText(c.textContent).trim();
      const isAll = normalize(label) === "all" || normalize(label) === "tümü" || normalize(label) === "tum";
      const active = isAll ? !state.topic : normalize(label) === normalize(state.topic);
      c.classList.toggle("is-active", active);
      c.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  /* ------------------------------
     Rendering
  ------------------------------ */
  function renderApp() {
    if (!Array.isArray(DATA) || DATA.length === 0) {
      // data not loaded yet; skeletons handle UI
      return;
    }

    // update labels for i18n
    applyI18n();

    // route-specific rendering
    if (state.route === "dua" && state.routeParam) {
      openDua(state.routeParam, { pushRecent: true, focus: false, updateHash: false });
      // also keep list rendered under current filters
      renderResults();
      return;
    }

    if (state.route === "prophets") {
      renderProphetsSection();
      renderResults(); // results will be filtered by prophet selection when chosen
      return;
    }

    if (state.route === "topics") {
      renderTopicsSection();
      renderResults();
      return;
    }

    if (state.route === "favorites") {
      renderFavoritesSection();
      return;
    }

    if (state.route === "about") {
      renderAboutSection();
      return;
    }

    // default: home
    renderHomeSection();
  }

  function applyI18n() {
    const t = I18N[state.prefs.uiLang] || I18N.en;

    // Update the tabs and bottom nav labels (based on existing structure)
    $$("a.tab").forEach(a => {
      const href = (a.getAttribute("href") || "").replace("#", "");
      const key = href || "home";
      const map = t.sections;
      if (map[key]) a.textContent = map[key];
    });

    $$("a.bn-item").forEach(a => {
      const href = (a.getAttribute("href") || "").replace("#", "");
      const key = href || "home";
      const span = $(".bn-txt", a);
      if (span && t.sections[key]) span.textContent = t.sections[key];
    });

    // Update filters labels if present
    const filtersPanel = $(".filters");
    if (filtersPanel) {
      const prophetLabel = $("label[for='prophet']", filtersPanel);
      const topicLabel = $("label[for='topic']", filtersPanel);
      const sourceLabel = $("label[for='source']", filtersPanel);
      if (prophetLabel) prophetLabel.textContent = t.filters.prophet;
      if (topicLabel) topicLabel.textContent = t.filters.topic;
      if (sourceLabel) sourceLabel.textContent = t.filters.source;
    }

    // Update results title based on route (best effort)
    const resultsTitle = $(".results-title");
    if (resultsTitle) {
      if (state.route === "favorites") resultsTitle.textContent = t.sections.favorites;
      else if (state.route === "prophets") resultsTitle.textContent = t.sections.prophets;
      else if (state.route === "topics") resultsTitle.textContent = t.sections.topics;
      else if (state.route === "about") resultsTitle.textContent = t.sections.about;
      else resultsTitle.textContent = t.home.featured;
    }

    // update meta pill counts (best-effort: we’ll set it in renderResults)
  }

  function showSkeletons(show) {
    const sk = $(".skeletons");
    if (sk) sk.style.display = show ? "" : "none";
  }

  function showError(show) {
    // We'll render an error panel at top of results when needed
    const existing = $("#data-error");
    if (!show) {
      if (existing) existing.remove();
      return;
    }

    const t = I18N[state.prefs.uiLang] || I18N.en;
    const container = $(".content") || document.body;

    if (existing) return;

    const panel = document.createElement("section");
    panel.id = "data-error";
    panel.className = "panel";
    panel.setAttribute("role", "alert");
    panel.innerHTML = `
      <div class="panel-head">
        <div>
          <h2 class="panel-title">${escapeHTML(t.states.errorTitle)}</h2>
          <p class="panel-sub">${escapeHTML(t.states.errorDesc)}</p>
        </div>
        <div class="panel-actions">
          <button class="pill-btn" type="button" data-action="retry">${escapeHTML(t.actions.retry)}</button>
        </div>
      </div>
    `;
    container.prepend(panel);
  }

  function renderHomeSection() {
    // Render daily dua in side-sheet if visible and daily panel in list
    const t = I18N[state.prefs.uiLang] || I18N.en;

    // We'll use results area to show:
    // - Daily Dua card pinned (first)
    // - Recently viewed row
    // - Then filtered results
    renderResults({ includeDaily: true, includeRecent: true });
  }

  function renderProphetsSection() {
    // This route focuses on prophets list; we render a lightweight panel above results.
    const t = I18N[state.prefs.uiLang] || I18N.en;

    const placeholderPanel = ensureDynamicPanel("route-panel");
    placeholderPanel.innerHTML = `
      <div class="panel-head">
        <div>
          <h2 class="panel-title">${escapeHTML(t.sections.prophets)}</h2>
          <p class="panel-sub">${escapeHTML(t.states.loadingDesc)}</p>
        </div>
        <div class="panel-actions">
          <button class="pill-btn ghost" type="button" data-action="reset-filters">${escapeHTML(t.actions.reset)}</button>
        </div>
      </div>
      <div class="chip-grid" id="route-prophets-grid" aria-label="Prophet list"></div>
    `;

    const grid = $("#route-prophets-grid", placeholderPanel);
    if (grid) {
      grid.innerHTML = PROPHETS.map(p => {
        const active = state.prophet && normalize(state.prophet) === normalize(p.key);
        return `<button class="chip ${active ? "is-active" : ""}" type="button" data-route-prophet="${escapeHTML(p.key)}">${escapeHTML(p.key)}</button>`;
      }).join("");

      grid.onclick = (e) => {
        const btn = e.target instanceof HTMLElement ? e.target.closest("[data-route-prophet]") : null;
        if (!btn) return;
        state.prophet = btn.getAttribute("data-route-prophet") || "";
        setHashFromState({ route: "prophets", prophet: state.prophet });
      };
    }

    placeholderPanel.addEventListener("click", (e) => {
      const btn = e.target instanceof HTMLElement ? e.target.closest("[data-action='reset-filters']") : null;
      if (!btn) return;
      state.q = ""; state.prophet = ""; state.topic = ""; state.source = "";
      const elSearch = $("#search"); if (elSearch) elSearch.value = "";
      setHashFromState({ route: "prophets", q: "", prophet: "", topic: "", source: "" });
    });
  }

  function renderTopicsSection() {
    const t = I18N[state.prefs.uiLang] || I18N.en;

    const placeholderPanel = ensureDynamicPanel("route-panel");
    placeholderPanel.innerHTML = `
      <div class="panel-head">
        <div>
          <h2 class="panel-title">${escapeHTML(t.sections.topics)}</h2>
          <p class="panel-sub">${escapeHTML(state.prefs.uiLang === "tr" ? "Bir konu seçerek tüm ilgili duaları görüntüleyin." : "Pick a topic to view all related duas.")}</p>
        </div>
        <div class="panel-actions">
          <button class="pill-btn ghost" type="button" data-action="reset-filters">${escapeHTML(t.actions.reset)}</button>
        </div>
      </div>
      <div class="chip-grid" id="route-topics-grid" aria-label="Topics list"></div>
    `;

    const grid = $("#route-topics-grid", placeholderPanel);
    if (grid) {
      grid.innerHTML = TOPICS.map(tp => {
        const active = state.topic && normalize(state.topic) === normalize(tp);
        return `<button class="chip ${active ? "is-active" : ""}" type="button" data-route-topic="${escapeHTML(tp)}">${escapeHTML(tp)}</button>`;
      }).join("");

      grid.onclick = (e) => {
        const btn = e.target instanceof HTMLElement ? e.target.closest("[data-route-topic]") : null;
        if (!btn) return;
        state.topic = btn.getAttribute("data-route-topic") || "";
        setHashFromState({ route: "topics", topic: state.topic });
      };
    }

    placeholderPanel.addEventListener("click", (e) => {
      const btn = e.target instanceof HTMLElement ? e.target.closest("[data-action='reset-filters']") : null;
      if (!btn) return;
      state.q = ""; state.prophet = ""; state.topic = ""; state.source = "";
      const elSearch = $("#search"); if (elSearch) elSearch.value = "";
      setHashFromState({ route: "topics", q: "", prophet: "", topic: "", source: "" });
    });
  }

  function renderFavoritesSection() {
    // Show favorites only
    renderResults({ favoritesOnly: true });
  }

  function renderAboutSection() {
    const t = I18N[state.prefs.uiLang] || I18N.en;

    // We'll render about content as a panel inserted above results and hide results list content.
    const placeholderPanel = ensureDynamicPanel("route-panel");
    placeholderPanel.innerHTML = `
      <div class="panel-head">
        <div>
          <h2 class="panel-title">${escapeHTML(t.about.title)}</h2>
          <p class="panel-sub">${escapeHTML(t.about.desc)}</p>
        </div>
      </div>

      <div style="margin-top:12px; display:grid; gap:12px;">
        <div class="meta-row">
          <span class="meta-pill"><span class="dot"></span><strong>${DATA.length}</strong>&nbsp;${escapeHTML(t.meta.prayers)}</span>
          <span class="meta-pill ghost">${escapeHTML(state.prefs.uiLang === "tr" ? "Veri dosyası: data/prayers.json" : "Dataset: data/prayers.json")}</span>
        </div>

        <div class="panel" style="padding:14px; box-shadow:none; background:transparent;">
          <h3 style="margin:0 0 8px; font-size:16px;">${escapeHTML(state.prefs.uiLang === "tr" ? "Notlar" : "Notes")}</h3>
          <ul style="margin:0; padding-left: 18px; color: var(--muted); line-height:1.6;">
            ${t.about.disclaimers.map(d => `<li>${escapeHTML(d)}</li>`).join("")}
          </ul>
        </div>

        <div class="panel" style="padding:14px; box-shadow:none; background:transparent;">
          <h3 style="margin:0 0 8px; font-size:16px;">${escapeHTML(state.prefs.uiLang === "tr" ? "Kaynaklar" : "Sources")}</h3>
          <p class="muted" style="margin:0;">
            ${escapeHTML(state.prefs.uiLang === "tr"
              ? "Her dua kaydı için (varsa) kaynak bağlantıları JSON içinde bulunur. Uygulama JS aşamasında bu bağlantılar detay görünümünde gösterilebilir."
              : "Source links (if included) live inside the JSON per entry. The detail view can display them.")}
          </p>
        </div>
      </div>
    `;

    // Clear list content (keep skeleton / empty states hidden)
    const list = ensureListContainer();
    list.innerHTML = "";
    updateMetaPill(0, 0, { shown: 0, custom: t.sections.about });
  }

  function ensureDynamicPanel(id) {
    // Insert under filters panel, above results section
    const existing = document.getElementById(id);
    if (existing) return existing;

    const container = $(".content");
    if (!container) return document.body;

    const results = $(".results");
    const panel = document.createElement("section");
    panel.className = "panel";
    panel.id = id;
    panel.setAttribute("aria-label", "Route panel");
    if (results) container.insertBefore(panel, results);
    else container.appendChild(panel);
    return panel;
  }

  function removeDynamicPanel() {
    const p = $("#route-panel");
    if (p) p.remove();
  }

  function ensureListContainer() {
    // Use existing results section as container; we’ll inject into .results
    const results = $(".results");
    if (!results) {
      warnOnce("no-results", "Results section .results not found. Cannot render list.");
      return document.body;
    }

    // Create a dedicated list node for dynamic cards to avoid mixing with template cards
    let list = $("#dynamic-list", results);
    if (!list) {
      list = document.createElement("div");
      list.id = "dynamic-list";
      list.className = "dynamic-list";
      results.appendChild(list);
    }
    return list;
  }

  function renderResults(opts = {}) {
    removeDynamicPanel(); // unless route adds it later; route render will recreate
    if (state.route === "prophets") renderProphetsSection();
    if (state.route === "topics") renderTopicsSection();
    if (state.route === "about") return; // handled separately

    const list = ensureListContainer();
    const t = I18N[state.prefs.uiLang] || I18N.en;

    // Compute filtered IDs
    const filtered = filterData({
      q: state.q,
      prophet: state.prophet,
      topic: state.topic,
      source: state.source,
      favoritesOnly: !!opts.favoritesOnly || state.route === "favorites"
    });

    // Update meta pill
    updateMetaPill(DATA.length, filtered.length, { shown: filtered.length });

    // Empty states
    const showNoResults = filtered.length === 0 && !(opts.favoritesOnly || state.route === "favorites");
    const showNoFav = filtered.length === 0 && (opts.favoritesOnly || state.route === "favorites");

    // Render blocks:
    // - Daily Dua (optional)
    // - Recently Viewed (optional)
    // - Results list
    let html = "";

    if (opts.includeDaily) {
      const daily = getDailyDua();
      if (daily) {
        html += sectionHeaderHTML(t.home.daily);
        html += cardHTML(daily, { featured: true, highlight: state.q });
      }
    }

    if (opts.includeRecent) {
      const rec = (state.prefs.recent || []).slice(0, 8).map(id => findById(id)).filter(Boolean);
      if (rec.length) {
        html += sectionHeaderHTML(t.home.recentlyViewed);
        html += `<div class="recent-grid">${rec.map(e => miniCardHTML(e)).join("")}</div>`;
      }
    }

    if (showNoResults) {
      html += emptyStateHTML("no-results", t.states.noResultsTitle, t.states.noResultsDesc, [
        { label: state.prefs.uiLang === "tr" ? "Tümünü Göster" : "Show All", action: "resetAll" },
        { label: state.prefs.uiLang === "tr" ? "Konular" : "Topics", action: "goTopics" },
      ]);
      list.innerHTML = html;
      bindEmptyActions(list);
      hideTemplateCards();
      return;
    }

    if (showNoFav) {
      html += emptyStateHTML("no-favorites", t.states.noFavTitle, t.states.noFavDesc, [
        { label: state.prefs.uiLang === "tr" ? "Peygamberler" : "Browse Prophets", action: "goProphets" },
        { label: state.prefs.uiLang === "tr" ? "Konular" : "Browse Topics", action: "goTopics" },
      ]);
      list.innerHTML = html;
      bindEmptyActions(list);
      hideTemplateCards();
      return;
    }

    // Add results header (only when not includeDaily which already has header)
    if (!opts.includeDaily) {
      const title =
        state.route === "favorites" ? t.sections.favorites :
        state.route === "prophets" ? t.sections.prophets :
        state.route === "topics" ? t.sections.topics :
        t.home.featured;

      html += sectionHeaderHTML(title);
    }

    // Render list efficiently
    // Limit for performance? show all; can later add pagination
    html += filtered.map(id => {
      const entry = findById(id);
      return entry ? cardHTML(entry, { highlight: state.q }) : "";
    }).join("");

    list.innerHTML = html;
    hideTemplateCards();

    // Bind mini cards
    bindMiniCards(list);
  }

  function sectionHeaderHTML(title) {
    return `
      <div class="results-head" style="margin-top: 14px;">
        <h2 class="results-title">${escapeHTML(title)}</h2>
        <div class="results-actions">
          <button class="pill-btn ghost" type="button" data-action="sort">${escapeHTML(state.prefs.uiLang === "tr" ? "Sırala" : "Sort")}</button>
          <button class="pill-btn ghost" type="button" data-action="view">${escapeHTML(state.prefs.uiLang === "tr" ? "Görünüm" : "View")}</button>
        </div>
      </div>
    `;
  }

  function emptyStateHTML(kind, title, desc, actions = []) {
    const ic = kind === "no-favorites" ? "☆" : "⟡";
    return `
      <section class="panel empty-state" data-empty="${escapeHTML(kind)}" aria-label="Empty state">
        <div class="empty-ic" aria-hidden="true">${ic}</div>
        <h3>${escapeHTML(title)}</h3>
        <p class="muted">${escapeHTML(desc)}</p>
        <div class="empty-actions">
          ${actions.map(a => `<button class="pill-btn ${a.ghost ? "ghost" : ""}" type="button" data-empty-action="${escapeHTML(a.action)}">${escapeHTML(a.label)}</button>`).join("")}
        </div>
      </section>
    `;
  }

  function bindEmptyActions(root) {
    root.querySelectorAll("[data-empty-action]").forEach(btn => {
      btn.addEventListener("click", () => {
        const act = btn.getAttribute("data-empty-action");
        if (act === "resetAll") {
          state.q = ""; state.prophet = ""; state.topic = ""; state.source = "";
          const elSearch = $("#search"); if (elSearch) elSearch.value = "";
          setHashFromState({ route: "home", q: "", prophet: "", topic: "", source: "" });
        } else if (act === "goTopics") {
          setHashFromState({ route: "topics" });
        } else if (act === "goProphets") {
          setHashFromState({ route: "prophets" });
        }
      });
    });
  }

  function bindMiniCards(root) {
    root.querySelectorAll("[data-mini-open]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-mini-open");
        if (!id) return;
        openDua(id, { pushRecent: true, focus: true, updateHash: true });
      });
    });
  }

  function hideTemplateCards() {
    // Hide static sample cards/empty states in HTML so only dynamic list shows
    const results = $(".results");
    if (!results) return;

    // hide the original sample cards and panels inside .results except .results-head and our #dynamic-list
    $$(".results > .card, .results > .panel", results).forEach(el => {
      // keep skeletons when loading; skeletons are toggled separately
      if (el.classList.contains("skeletons")) return;
      el.style.display = "none";
    });
  }

  function updateMetaPill(total, found, { shown = found } = {}) {
    const metaPill = $(".meta-row .meta-pill");
    const t = I18N[state.prefs.uiLang] || I18N.en;
    if (!metaPill) return;

    metaPill.innerHTML = `
      <span class="dot"></span>
      <strong>${escapeHTML(String(found))}</strong>&nbsp;${escapeHTML(t.meta.found)}
      <span class="muted"> • ${escapeHTML(String(shown))} ${escapeHTML(t.meta.shown)}</span>
    `;
  }

  /* ------------------------------
     Filtering / Search
  ------------------------------ */
  function filterData({ q, prophet, topic, source, favoritesOnly }) {
    const nq = normalize(q);
    const np = normalize(prophet);
    const nt = normalize(topic);
    const ns = normalize(source);

    const favSet = new Set(state.prefs.favorites || []);

    // Efficient scan through INDEX, returning IDs
    const out = [];
    for (let i = 0; i < INDEX.length; i++) {
      const it = INDEX[i];

      if (favoritesOnly && !favSet.has(it.id)) continue;

      if (np && normalize(it.prophetKey) !== np) continue;
      if (nt && !it.topics.has(topic)) {
        // also allow normalized match for topics that differ by case
        let ok = false;
        for (const t of it.topics) {
          if (normalize(t) === nt) { ok = true; break; }
        }
        if (!ok) continue;
      }
      if (ns && normalize(it.sourceType) !== ns) continue;

      if (nq && !it.search.includes(nq)) continue;

      out.push(it.id);
    }

    // Stable ordering: keep dataset order; could add sorting later.
    return out;
  }

  /* ------------------------------
     Highlighting
  ------------------------------ */
  function highlightHTML(text, query) {
    const q = normalize(query);
    if (!q) return escapeHTML(text);

    // For display we do a simple case-insensitive highlight for Latin scripts.
    // For Arabic, the match may not align after normalization, so we fallback to no highlight.
    const raw = safeText(text);
    const nraw = normalize(raw);

    // if normalization loses positions (Arabic), skip highlight
    // heuristic: if raw contains Arabic range, skip highlight
    if (/[\u0600-\u06FF]/.test(raw)) return escapeHTML(raw);

    // Find occurrences in normalized string and map to raw by best-effort:
    // We'll do a simple lowercase search on raw for the query (de-accented query used).
    const rawLower = raw.toLowerCase();
    const qLower = q; // already normalized, but may not match rawLower for diacritics

    // Try direct includes; if fails, no highlight.
    if (!normalize(rawLower).includes(qLower)) return escapeHTML(raw);

    // Best effort: highlight using regex with escaped query on normalized version won't map safely.
    // We'll instead highlight direct occurrences of the query as typed by user (not normalized).
    // This is safer and more predictable. If user typed "forg", it will highlight those.
    const typed = safeText(query).trim();
    if (typed.length < 2) return escapeHTML(raw);

    const re = new RegExp(escapeRegExp(typed), "ig");
    return escapeHTML(raw).replace(re, (m) => `<mark class="hl">${escapeHTML(m)}</mark>`);
  }

  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /* ------------------------------
     Cards HTML
  ------------------------------ */
  function cardHTML(p, { featured = false, highlight = "" } = {}) {
    const t = I18N[state.prefs.uiLang] || I18N.en;

    const id = safeText(p.id);
    const prophetName = safeText(p?.prophet?.en) || safeText(p?.prophet?.tr) || safeText(p?.prophet?.ar) || "Unknown";
    const srcType = safeText(p?.source?.type) || "Other";
    const srcRef = safeText(p?.source?.reference);
    const srcBook = safeText(p?.source?.book);
    const srcGrade = safeText(p?.source?.grade);

    const fav = (state.prefs.favorites || []).includes(id);

    const tags = Array.isArray(p.topics) ? p.topics.slice(0, 8) : [];

    const showArabic = !!state.prefs.showArabic;
    const showTranslit = !!state.prefs.showTranslit;
    const showEN = !!state.prefs.showEN;
    const showTR = !!state.prefs.showTR;

    const arabicBlock = showArabic ? `
      <p class="arabic" lang="ar" dir="rtl">${escapeHTML(p.arabic || "")}</p>
    ` : "";

    const translitBlock = showTranslit ? `
      <div class="block">
        <div class="label">${escapeHTML(t.labels.translit)}</div>
        <p>${highlightHTML(p.transliteration || "", highlight)}</p>
      </div>
    ` : "";

    const enBlock = showEN ? `
      <div class="block">
        <div class="label">${escapeHTML(t.labels.english)}</div>
        <p>${highlightHTML(p.english || "", highlight)}</p>
      </div>
    ` : "";

    const trBlock = showTR ? `
      <div class="block">
        <div class="label">${escapeHTML(t.labels.turkish)}</div>
        <p>${highlightHTML(p.turkish || "", highlight)}</p>
      </div>
    ` : "";

    const tagsBlock = `
      <div class="block">
        <div class="label">${escapeHTML(t.labels.tags)}</div>
        <div class="tags">
          ${tags.map(tag => `<span class="tag">${escapeHTML(tag)}</span>`).join("")}
        </div>
      </div>
    `;

    const reflection = safeText(p.reflection || p.context || p.notes);
    const reflectionBlock = reflection ? `
      <details class="accordion">
        <summary aria-label="${escapeHTML(t.labels.reflection)}">
          <span>${escapeHTML(t.labels.reflection)}</span>
          <span class="chev" aria-hidden="true">⌄</span>
        </summary>
        <div class="accordion-body">
          <p class="muted">${highlightHTML(reflection, highlight)}</p>
          ${renderSourcesInline(p)}
        </div>
      </details>
    ` : "";

    const refLine = [srcType, srcRef].filter(Boolean).join(" • ")
      + (srcBook ? ` • ${srcBook}` : "")
      + (srcGrade ? ` • ${srcGrade}` : "");

    return `
      <article class="card" data-card-id="${escapeHTML(id)}" tabindex="0" role="button" aria-label="Open dua: ${escapeHTML(prophetName)}">
        <div class="card-top">
          <div class="card-title">
            <h3>${highlightHTML(prophetName, highlight)}</h3>
            <p class="ref">${highlightHTML(refLine, highlight)}</p>
          </div>

          <div class="card-controls" aria-label="Card actions">
            <button class="icon-btn" type="button" data-action="fav" data-id="${escapeHTML(id)}" aria-label="${fav ? "Unsave" : "Save"}" aria-pressed="${fav ? "true" : "false"}">${fav ? "★" : "☆"}</button>
            <button class="icon-btn" type="button" data-action="share" data-id="${escapeHTML(id)}" aria-label="Share">↗</button>
          </div>
        </div>

        <div class="card-body">
          ${featured ? `<div class="reading-top"><span class="badge">${escapeHTML(state.prefs.uiLang === "tr" ? "Öne Çıkan" : "Featured")}</span><span class="badge ghost">${escapeHTML(srcType)}</span></div>` : ""}

          ${arabicBlock}

          <div class="grid-2">
            ${translitBlock}
            ${enBlock}
            ${trBlock}
            ${tagsBlock}
          </div>

          <div class="card-actions">
            <button class="pill-btn" type="button" data-action="copyArabic" data-id="${escapeHTML(id)}">${escapeHTML(t.actions.copyArabic)}</button>
            <button class="pill-btn" type="button" data-action="copyFull" data-id="${escapeHTML(id)}">${escapeHTML(t.actions.copyFull)}</button>
            <button class="pill-btn ghost" type="button" data-action="share" data-id="${escapeHTML(id)}">${escapeHTML(t.actions.share)}</button>
            <button class="pill-btn ghost" type="button" data-action="fav" data-id="${escapeHTML(id)}">${escapeHTML(fav ? t.actions.saved : t.actions.save)}</button>
            <button class="pill-btn ghost" type="button" data-action="open" data-id="${escapeHTML(id)}">${escapeHTML(state.prefs.uiLang === "tr" ? "Aç" : "Open")}</button>
          </div>

          ${reflectionBlock}
        </div>
      </article>
    `;
  }

  function miniCardHTML(p) {
    const id = safeText(p.id);
    const prophetName = safeText(p?.prophet?.en) || safeText(p?.prophet?.tr) || safeText(p?.prophet?.ar) || "Unknown";
    const ref = safeText(p?.source?.reference) || "";

    return `
      <div class="mini-card" style="border:1px solid var(--line-2); border-radius:16px; padding:12px; background: color-mix(in srgb, var(--panel-2) 90%, transparent);">
        <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start;">
          <div>
            <div style="font-weight:700; letter-spacing:-.01em;">${escapeHTML(prophetName)}</div>
            <div class="muted" style="font-size:12px; margin-top:4px;">${escapeHTML(ref)}</div>
          </div>
          <button class="pill-btn ghost" type="button" data-mini-open="${escapeHTML(id)}" style="min-height:34px; padding:7px 10px;">${escapeHTML((I18N[state.prefs.uiLang] || I18N.en).home.open)}</button>
        </div>
      </div>
    `;
  }

  function renderSourcesInline(p) {
    const sources = Array.isArray(p.sources) ? p.sources.filter(Boolean) : [];
    if (!sources.length) return "";
    // Keep it minimal; avoid clickable links if desired, but we can show them as text.
    const title = state.prefs.uiLang === "tr" ? "Kaynaklar" : "Sources";
    return `
      <div style="margin-top:10px;">
        <div class="label">${escapeHTML(title)}</div>
        <div class="muted" style="font-size:12px; line-height:1.5;">
          ${sources.slice(0,3).map(u => `<div>${escapeHTML(u)}</div>`).join("")}
        </div>
      </div>
    `;
  }

  function buildFullCopy(p) {
    const prophetName = safeText(p?.prophet?.en) || safeText(p?.prophet?.tr) || safeText(p?.prophet?.ar) || "Unknown";
    const srcType = safeText(p?.source?.type) || "Other";
    const srcRef = safeText(p?.source?.reference);

    const parts = [
      `${prophetName}`,
      `${srcType}${srcRef ? " • " + srcRef : ""}`,
      p.arabic ? safeText(p.arabic) : "",
      p.transliteration ? safeText(p.transliteration) : "",
      p.english ? safeText(p.english) : "",
      p.turkish ? safeText(p.turkish) : "",
    ].filter(Boolean);

    return parts.join("\n\n");
  }

  /* ------------------------------
     Side Sheet / Detail View
  ------------------------------ */
  let lastFocusEl = null;

  function updateSideSheetVisibility() {
    const sheet = $(".side-sheet");
    if (!sheet) return;
    // It’s always visible on desktop per CSS. We just keep content in it updated.
  }

  function openDua(id, { pushRecent = false, focus = true, updateHash = false } = {}) {
    const entry = findById(id);
    if (!entry) return;

    if (pushRecent) pushRecentId(id);

    const sheet = $(".side-sheet");
    if (!sheet) {
      // fallback: scroll to card
      const card = document.querySelector(`[data-card-id="${CSS.escape(id)}"]`);
      if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // Remember focus for restore
    if (focus) lastFocusEl = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    // Populate sheet content
    const inner = $(".sheet-body", sheet);
    if (inner) inner.innerHTML = detailHTML(entry);

    // Wire internal buttons (they bubble to document click anyway)
    // Focus management: focus close button then title
    const closeBtn = $(".sheet-head .icon-btn", sheet);
    if (focus && closeBtn) closeBtn.focus();

    // Mark route
    state.route = "dua";
    state.routeParam = id;

    if (updateHash) {
      setHashFromState({ route: "dua", dua: id });
    }
  }

  function closeSideSheet({ restoreFocus = false } = {}) {
    const sheet = $(".side-sheet");
    if (!sheet) return;

    const inner = $(".sheet-body", sheet);
    if (inner) {
      // Keep a calm placeholder instead of empty
      inner.innerHTML = detailPlaceholderHTML();
    }

    // When closing, return to previous section route (home by default)
    if (state.route === "dua") {
      const backRoute = inferBackRoute();
      state.route = backRoute;
      state.routeParam = null;
      setHashFromState({ route: backRoute });
    }

    if (restoreFocus && lastFocusEl) {
      try { lastFocusEl.focus(); } catch { /* ignore */ }
      lastFocusEl = null;
    }
  }

  function inferBackRoute() {
    // If user had favoritesOnly filter etc, keep current route if valid.
    const parsed = parseHash();
    if (parsed.route && parsed.route !== "dua") return parsed.route;
    return "home";
  }

  function detailPlaceholderHTML() {
    const t = I18N[state.prefs.uiLang] || I18N.en;
    return `
      <div class="reading-mode" style="padding:16px;">
        <div class="muted">${escapeHTML(t.states.loadingDesc)}</div>
      </div>
    `;
  }

  function detailHTML(p) {
    const t = I18N[state.prefs.uiLang] || I18N.en;

    const id = safeText(p.id);
    const prophetName = safeText(p?.prophet?.en) || safeText(p?.prophet?.tr) || safeText(p?.prophet?.ar) || "Unknown";
    const srcType = safeText(p?.source?.type) || "Other";
    const srcRef = safeText(p?.source?.reference);
    const srcBook = safeText(p?.source?.book);
    const srcGrade = safeText(p?.source?.grade);
    const fav = (state.prefs.favorites || []).includes(id);

    const showArabic = !!state.prefs.showArabic;
    const showTranslit = !!state.prefs.showTranslit;
    const showEN = !!state.prefs.showEN;
    const showTR = !!state.prefs.showTR;

    const refLine = [srcType, srcRef].filter(Boolean).join(" • ")
      + (srcBook ? ` • ${srcBook}` : "")
      + (srcGrade ? ` • ${srcGrade}` : "");

    const reflection = safeText(p.reflection || p.context || p.notes);

    return `
      <div class="reading-mode" style="padding:16px;">
        <div class="reading-top">
          <span class="badge">${escapeHTML(state.prefs.uiLang === "tr" ? "Detay" : "Detail")}</span>
          <span class="badge ghost">${escapeHTML(srcType)}</span>
        </div>

        <h3 class="reading-title">${escapeHTML(prophetName)}</h3>
        <p class="ref">${escapeHTML(refLine)}</p>

        ${showArabic ? `<p class="arabic big" lang="ar" dir="rtl">${escapeHTML(p.arabic || "")}</p>` : ""}

        ${showTranslit ? `
          <div class="reading-block">
            <div class="label">${escapeHTML(t.labels.translit)}</div>
            <p class="muted" style="margin:0;">${escapeHTML(p.transliteration || "")}</p>
          </div>` : ""}

        ${showEN ? `
          <div class="reading-block">
            <div class="label">${escapeHTML(t.labels.english)}</div>
            <p style="margin:0;">${escapeHTML(p.english || "")}</p>
          </div>` : ""}

        ${showTR ? `
          <div class="reading-block">
            <div class="label">${escapeHTML(t.labels.turkish)}</div>
            <p style="margin:0;">${escapeHTML(p.turkish || "")}</p>
          </div>` : ""}

        ${reflection ? `
          <div class="reading-block">
            <div class="label">${escapeHTML(t.labels.reflection)}</div>
            <p class="muted" style="margin:0;">${escapeHTML(reflection)}</p>
            ${renderSourcesInline(p)}
          </div>` : ""}

        <div class="card-actions" style="margin-top:14px;">
          <button class="pill-btn" type="button" data-action="copyArabic" data-id="${escapeHTML(id)}">${escapeHTML(t.actions.copyArabic)}</button>
          <button class="pill-btn" type="button" data-action="copyFull" data-id="${escapeHTML(id)}">${escapeHTML(t.actions.copyFull)}</button>
          <button class="pill-btn ghost" type="button" data-action="share" data-id="${escapeHTML(id)}">${escapeHTML(t.actions.share)}</button>
          <button class="pill-btn ghost" type="button" data-action="fav" data-id="${escapeHTML(id)}">${escapeHTML(fav ? t.actions.saved : t.actions.save)}</button>
        </div>
      </div>
    `;
  }

  function findById(id) {
    // For 500 entries, linear scan is ok but we’ll build a map lazily.
    if (!findById.map) {
      findById.map = new Map(DATA.map(x => [safeText(x.id), x]));
    }
    return findById.map.get(id) || null;
  }

  /* ------------------------------
     Favorites + Recent
  ------------------------------ */
  function toggleFavorite(id) {
    const fav = new Set(state.prefs.favorites || []);
    if (fav.has(id)) fav.delete(id);
    else fav.add(id);
    setPref("favorites", Array.from(fav));
  }

  function updateFavoriteButtons(id) {
    // Update all buttons that refer to this id
    const fav = (state.prefs.favorites || []).includes(id);
    document.querySelectorAll(`[data-action="fav"][data-id="${CSS.escape(id)}"]`).forEach(btn => {
      btn.setAttribute("aria-pressed", fav ? "true" : "false");
      // icon-btn uses ☆/★
      if (btn.classList.contains("icon-btn")) btn.textContent = fav ? "★" : "☆";
      else btn.textContent = fav
        ? (I18N[state.prefs.uiLang] || I18N.en).actions.saved
        : (I18N[state.prefs.uiLang] || I18N.en).actions.save;
    });
  }

  function pushRecentId(id) {
    const rec = Array.isArray(state.prefs.recent) ? state.prefs.recent.slice() : [];
    const next = [id, ...rec.filter(x => x !== id)].slice(0, 20);
    setPref("recent", next);
  }

  function renderIfRouteFavorites() {
    if (state.route === "favorites") {
      renderResults({ favoritesOnly: true });
    }
  }

  /* ------------------------------
     Daily Dua (deterministic)
  ------------------------------ */
  function getDailyDua() {
    if (!DATA.length) return null;
    // deterministic by local date (year-day)
    const d = new Date();
    const seed = Number(`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`);
    const idx = seededIndex(seed, DATA.length);
    return DATA[idx] || null;
  }

  function seededIndex(seed, mod) {
    // simple LCG
    let x = seed % 2147483647;
    x = (x * 48271) % 2147483647;
    return x % mod;
  }

  /* ------------------------------
     Share links
  ------------------------------ */
  function makeShareLink({ dua }) {
    const params = new URLSearchParams();
    params.set("route", "dua");
    params.set("dua", dua);
    // preserve current ui lang? keep it simple
    const base = `${location.origin}${location.pathname}`;
    return `${base}#${params.toString()}`;
  }

  /* ------------------------------
     Init
  ------------------------------ */
  function init() {
    applyTheme();
    applyFontSizes();
    bindUI();

    // If there is no script tag in HTML, app.js won't run. This file assumes it is included.
    // We continue regardless.

    // Parse hash initially (or restore last route)
    if (!location.hash && state.prefs.lastRoute) {
      // keep it minimal: if user previously had a route, restore it
      location.hash = state.prefs.lastRoute;
    } else {
      const parsed = parseHash();
      state.route = parsed.route || "home";
      state.routeParam = parsed.dua || null;
      state.q = parsed.q || "";
      state.prophet = parsed.prophet || "";
      state.topic = parsed.topic || "";
      state.source = parsed.source || "";
    }

    // Load data
    fetchData();

    // Listen hash changes
    window.addEventListener("hashchange", handleRouteChange);
  }

  /* ------------------------------
     Utilities: Meta + styling extras
  ------------------------------ */
  function renderResultsTitle(title) {
    const el = $(".results-title");
    if (el) el.textContent = title;
  }

  /* ------------------------------
     Results helpers
  ------------------------------ */
  function showOnlySection(name) {
    // Not strictly needed; the app is single page; we adapt content instead.
  }

  /* ------------------------------
     Soft enhancements: mark highlights
  ------------------------------ */
  function injectHighlightCSSOnce() {
    if ($("#hl-style")) return;
    const style = document.createElement("style");
    style.id = "hl-style";
    style.textContent = `
      mark.hl{
        background: color-mix(in srgb, var(--accent-2) 85%, transparent);
        color: inherit;
        border-radius: 8px;
        padding: 0 3px;
      }
    `;
    document.head.appendChild(style);
  }

  /* ------------------------------
     Minimal: Handle missing elements gracefully
  ------------------------------ */
  function ensureAppScriptIsIncluded() {
    // Not possible here; only warn if common elements missing.
  }

  // Kick off
  injectHighlightCSSOnce();
  init();

})();
