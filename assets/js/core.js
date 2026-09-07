/* ==========================================================================
   النواة: بناء البطاقات، التخزين المحلي، خوارزمية المراجعة المتباعدة، النطق
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------ أدوات عامة ------------------------------ */
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const DAY = 86400000;
  const todayKey = (d = new Date()) => {
    const t = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return t.toISOString().slice(0, 10);
  };

  /* --------------------------- بناء مجموعة البطاقات --------------------------- */
  const CARDS = [];
  const CARD_BY_ID = new Map();

  window.VOCAB_GROUPS.forEach((g) => {
    g.items.forEach((it) => {
      const card = {
        id: 'v:' + g.level.toLowerCase() + ':' + slug(g.category) + ':' + slug(it.en),
        type: 'word',
        en: it.en,
        ar: it.ar,
        level: g.level,
        category: g.category,
        categoryAr: g.categoryAr,
        icon: g.icon
      };
      CARDS.push(card);
      CARD_BY_ID.set(card.id, card);
    });
  });

  window.PHRASEBOOK.forEach((g) => {
    g.phrases.forEach((p, i) => {
      const card = {
        id: 'p:' + g.id + ':' + i,
        type: 'phrase',
        en: p.en,
        ar: p.ar,
        words: p.words || [],
        level: 'PH',
        category: g.titleEn,
        categoryAr: g.titleAr,
        topic: g.id,
        icon: g.icon
      };
      CARDS.push(card);
      CARD_BY_ID.set(card.id, card);
    });
  });

  /* -------------------------------- التخزين -------------------------------- */
  const KEY = 'english-trainer.v1';

  const DEFAULT_STATE = {
    cards: {},              // id -> { ef, interval, reps, due, lapses, seen, correct }
    history: {},            // 'YYYY-MM-DD' -> عدد المراجعات
    settings: {
      dailyGoal: 20,
      newPerDay: 10,
      direction: 'ar2en',   // ar2en | en2ar | mixed
      autoSpeak: true,
      levels: ['A1', 'A2', 'B1', 'B2', 'PH']
    },
    quiz: { best: 0, played: 0 },
    createdAt: Date.now()
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return structuredClone(DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      return Object.assign(structuredClone(DEFAULT_STATE), parsed, {
        settings: Object.assign({}, DEFAULT_STATE.settings, parsed.settings || {})
      });
    } catch (e) {
      console.warn('تعذّرت قراءة البيانات المحفوظة، سيتم البدء من جديد.', e);
      return structuredClone(DEFAULT_STATE);
    }
  }

  let state = load();
  let saveTimer = null;

  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { localStorage.setItem(KEY, JSON.stringify(state)); }
      catch (e) { console.warn('تعذّر الحفظ في المتصفح.', e); }
    }, 120);
  }

  /* --------------------- خوارزمية المراجعة المتباعدة SM-2 --------------------- */
  /* التقييمات: 0 = نسيت، 3 = صعب، 4 = جيد، 5 = سهل */
  const LAPSE_DELAY = 10 * 60 * 1000; // 10 دقائق

  function newProgress() {
    return { ef: 2.5, interval: 0, reps: 0, due: 0, lapses: 0, seen: 0, correct: 0 };
  }

  function progressOf(id) {
    return state.cards[id] || null;
  }

  function grade(id, q) {
    const p = state.cards[id] || newProgress();
    const now = Date.now();
    p.seen++;

    if (q < 3) {
      p.lapses++;
      p.reps = 0;
      p.interval = 0;
      p.due = now + LAPSE_DELAY;
    } else {
      p.correct++;
      p.reps++;
      if (p.reps === 1) p.interval = 1;
      else if (p.reps === 2) p.interval = 6;
      else p.interval = Math.max(1, Math.round(p.interval * p.ef));
      p.ef = Math.max(1.3, p.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
      p.due = now + p.interval * DAY;
    }

    p.lastReview = now;
    state.cards[id] = p;

    const k = todayKey();
    state.history[k] = (state.history[k] || 0) + 1;
    save();
    return p;
  }

  /* مرحلة البطاقة: جديدة / قيد التعلم / معروفة / متقنة */
  function stage(id) {
    const p = state.cards[id];
    if (!p || !p.seen) return 'new';
    if (p.interval >= 21) return 'mastered';
    if (p.interval >= 1 && p.reps >= 2) return 'known';
    return 'learning';
  }

  /* -------------------------- اختيار بطاقات الجلسة -------------------------- */
  function activeCards() {
    const lv = state.settings.levels;
    return CARDS.filter((c) => lv.includes(c.level));
  }

  function dueCards(now = Date.now()) {
    return activeCards().filter((c) => {
      const p = state.cards[c.id];
      return p && p.seen > 0 && p.due <= now;
    });
  }

  function newCards() {
    return activeCards().filter((c) => !state.cards[c.id] || !state.cards[c.id].seen);
  }

  /* جلسة = المستحق للمراجعة أولاً، ثم بطاقات جديدة حتى حد اليوم */
  function buildSession(limit) {
    const max = limit || state.settings.dailyGoal;
    const due = dueCards().sort((a, b) => state.cards[a.id].due - state.cards[b.id].due);
    const session = due.slice(0, max);
    if (session.length < max) {
      const fresh = newCards().slice(0, Math.min(state.settings.newPerDay, max - session.length));
      session.push(...fresh);
    }
    return session;
  }

  /* ------------------------------- الإحصائيات ------------------------------- */
  function streak() {
    let n = 0;
    const d = new Date();
    if (!state.history[todayKey(d)]) d.setDate(d.getDate() - 1); // اليوم لم يبدأ بعد
    while (state.history[todayKey(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  function summary() {
    const all = activeCards();
    const counts = { new: 0, learning: 0, known: 0, mastered: 0 };
    all.forEach((c) => counts[stage(c.id)]++);
    return {
      total: all.length,
      counts,
      due: dueCards().length,
      today: state.history[todayKey()] || 0,
      streak: streak(),
      totalReviews: Object.values(state.history).reduce((a, b) => a + b, 0)
    };
  }

  /* لوحة آخر 14 يوماً */
  function lastDays(n) {
    const out = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = todayKey(d);
      out.push({ key: k, day: d, count: state.history[k] || 0 });
    }
    return out;
  }

  /* --------------------------------- النطق --------------------------------- */
  const speech = {
    supported: 'speechSynthesis' in window,
    voice: null,
    pickVoice() {
      if (!this.supported) return null;
      const voices = speechSynthesis.getVoices();
      if (!voices.length) return null;
      this.voice =
        voices.find((v) => /^en-GB/i.test(v.lang)) ||
        voices.find((v) => /^en-US/i.test(v.lang)) ||
        voices.find((v) => /^en/i.test(v.lang)) || null;
      return this.voice;
    },
    say(text, rate) {
      if (!this.supported || !text) return;
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        if (!this.voice) this.pickVoice();
        if (this.voice) u.voice = this.voice;
        u.lang = (this.voice && this.voice.lang) || 'en-US';
        u.rate = rate || 0.92;
        speechSynthesis.speak(u);
      } catch (e) { /* النطق غير متاح */ }
    }
  };
  if (speech.supported) {
    speech.pickVoice();
    speechSynthesis.onvoiceschanged = () => speech.pickVoice();
  }

  /* ------------------------------ إعادة الضبط ------------------------------ */
  function resetProgress() {
    state.cards = {};
    state.history = {};
    state.quiz = { best: 0, played: 0 };
    save();
  }

  function exportState() {
    return JSON.stringify(state, null, 2);
  }

  function importState(json) {
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object' || !('cards' in parsed)) {
      throw new Error('ملف غير صالح');
    }
    state = Object.assign(structuredClone(DEFAULT_STATE), parsed, {
      settings: Object.assign({}, DEFAULT_STATE.settings, parsed.settings || {})
    });
    save();
  }

  /* -------------------------------- التصدير -------------------------------- */
  window.ET = {
    CARDS, CARD_BY_ID, DAY,
    get state() { return state; },
    get settings() { return state.settings; },
    save, slug, todayKey,
    progressOf, grade, stage,
    activeCards, dueCards, newCards, buildSession,
    summary, lastDays, streak,
    speech, resetProgress, exportState, importState
  };
})();
