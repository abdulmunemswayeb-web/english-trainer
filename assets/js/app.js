/* ==========================================================================
   واجهة التطبيق: التنقل بين الشاشات وعرض الجلسات
   ========================================================================== */
(function () {
  'use strict';

  const view = document.getElementById('view');
  const toastEl = document.getElementById('toast');
  const dueBadge = document.getElementById('dueBadge');

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1800);
  }

  const LEVEL_NAMES = { A1: 'مبتدئ', A2: 'أساسي', B1: 'ما قبل المتوسط', B2: 'فوق المتوسط', PH: 'محادثة' };
  const STAGE_NAMES = { new: 'جديدة', learning: 'قيد التعلم', known: 'معروفة', mastered: 'متقنة' };

  /* --------------------------- تنسيق موعد المراجعة --------------------------- */
  function dueText(p) {
    if (!p || !p.seen) return 'لم تُدرس بعد';
    const diff = p.due - Date.now();
    if (diff <= 0) return 'مستحقة الآن';
    const days = Math.round(diff / ET.DAY);
    if (days >= 1) return 'بعد ' + days + (days === 1 ? ' يوم' : days === 2 ? ' يومين' : days <= 10 ? ' أيام' : ' يوماً');
    const mins = Math.max(1, Math.round(diff / 60000));
    return mins < 60 ? 'بعد ' + mins + ' دقيقة' : 'بعد ' + Math.round(mins / 60) + ' ساعة';
  }

  /* -------------------------------- التنقل -------------------------------- */
  let route = 'home';
  const routes = {};

  function go(name) {
    route = name;
    document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t.dataset.route === name));
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    render();
  }

  function render() {
    (routes[route] || routes.home)();
    refreshBadge();
  }

  function refreshBadge() {
    const n = ET.dueCards().length;
    dueBadge.textContent = n > 99 ? '99+' : n;
    dueBadge.classList.toggle('hidden', n === 0);
  }

  document.querySelectorAll('.tab').forEach((t) =>
    t.addEventListener('click', () => go(t.dataset.route)));

  /* ============================== الشاشة الرئيسية ============================== */
  routes.home = function () {
    const s = ET.summary();
    const pct = s.total ? Math.round(((s.counts.known + s.counts.mastered) / s.total) * 100) : 0;
    const goal = ET.settings.dailyGoal;
    const goalPct = Math.min(100, Math.round((s.today / goal) * 100));

    view.innerHTML = `
      <section class="section">
        <div class="card" style="background:linear-gradient(150deg,var(--card),var(--bg-soft))">
          <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
            <div style="flex:1;min-width:200px">
              <div class="muted small">هدف اليوم</div>
              <div style="font-size:1.7rem;font-weight:700">${s.today} <span class="muted" style="font-size:1rem">/ ${goal} مراجعة</span></div>
            </div>
            <div style="text-align:center">
              <div style="font-size:1.7rem;font-weight:700">🔥 ${s.streak}</div>
              <div class="muted small">يوم متتالٍ</div>
            </div>
          </div>
          <div class="progress-bar" style="margin-top:12px"><i style="width:${goalPct}%"></i></div>
          <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">
            <button class="btn btn-primary btn-lg" style="flex:1;min-width:180px" id="startBtn">
              ${s.due > 0 ? `ابدأ المراجعة (${s.due} مستحقة)` : 'تعلّم كلمات جديدة'}
            </button>
            <button class="btn btn-lg" id="quizBtn">اختبار سريع</button>
          </div>
        </div>
      </section>

      <section class="section">
        <h2>تقدّمك</h2>
        <div class="card">
          <div class="bar" style="margin-bottom:12px">
            <i style="width:${(s.counts.mastered / s.total) * 100}%;background:var(--green)"></i>
            <i style="width:${(s.counts.known / s.total) * 100}%;background:var(--accent)"></i>
            <i style="width:${(s.counts.learning / s.total) * 100}%;background:var(--amber)"></i>
          </div>
          <div class="grid grid-4">
            <div class="stat"><div class="num" style="color:var(--green)">${s.counts.mastered}</div><div class="lbl">متقنة</div></div>
            <div class="stat"><div class="num" style="color:var(--accent)">${s.counts.known}</div><div class="lbl">معروفة</div></div>
            <div class="stat"><div class="num" style="color:var(--amber)">${s.counts.learning}</div><div class="lbl">قيد التعلم</div></div>
            <div class="stat"><div class="num muted">${s.counts.new}</div><div class="lbl">جديدة</div></div>
          </div>
          <div class="muted small" style="text-align:center;margin-top:12px">
            أتقنتَ ${pct}% من أصل ${s.total} بطاقة · إجمالي المراجعات ${s.totalReviews}
          </div>
        </div>
      </section>

      <section class="section">
        <h2>أدلة المحادثة</h2>
        <div class="grid grid-2">
          ${window.PHRASEBOOK.map((g) => `
            <button class="card" data-topic="${g.id}" style="cursor:pointer;text-align:start;font-family:inherit;color:inherit">
              <div style="font-size:1.6rem">${g.icon}</div>
              <div style="font-weight:600;margin-top:4px">${esc(g.titleAr)}</div>
              <div class="muted small">${g.phrases.length} جملة جاهزة</div>
            </button>`).join('')}
        </div>
      </section>

      <section class="section">
        <button class="btn btn-block" id="statsBtn">📈 الإحصائيات التفصيلية</button>
      </section>`;

    document.getElementById('startBtn').onclick = () => go('review');
    document.getElementById('quizBtn').onclick = () => go('quiz');
    document.getElementById('statsBtn').onclick = () => go('stats');
    view.querySelectorAll('[data-topic]').forEach((b) =>
      b.onclick = () => { phrasesTopic = b.dataset.topic; go('phrases'); });
  };

  /* ================================ المراجعة ================================ */
  let session = null;

  function startSession() {
    const cards = ET.buildSession();
    session = cards.length ? { cards, i: 0, revealed: false, done: 0, right: 0 } : null;
  }

  routes.review = function () {
    if (!session || session.i >= session.cards.length) {
      if (session && session.i >= session.cards.length) return renderSessionDone();
      startSession();
      if (!session) return renderNothingDue();
    }
    renderCard();
  };

  function renderNothingDue() {
    const next = ET.activeCards()
      .map((c) => ET.progressOf(c.id))
      .filter((p) => p && p.seen)
      .sort((a, b) => a.due - b.due)[0];
    view.innerHTML = `
      <div class="empty">
        <div class="big">🎉</div>
        <h2>لا توجد بطاقات مستحقة الآن</h2>
        <p class="muted" style="margin-top:8px">
          ${next ? 'المراجعة القادمة ' + dueText(next) + '.' : 'اختر مستويات أكثر من الإعدادات لتبدأ.'}
        </p>
        <div style="display:flex;gap:10px;justify-content:center;margin-top:20px;flex-wrap:wrap">
          <button class="btn btn-primary" id="quizNow">جرّب اختباراً</button>
          <button class="btn" id="browseNow">تصفّح المفردات</button>
        </div>
      </div>`;
    document.getElementById('quizNow').onclick = () => go('quiz');
    document.getElementById('browseNow').onclick = () => go('browse');
  }

  function renderSessionDone() {
    const { done, right } = session;
    const acc = done ? Math.round((right / done) * 100) : 0;
    session = null;
    view.innerHTML = `
      <div class="empty">
        <div class="big">✅</div>
        <h2>انتهت الجلسة</h2>
        <p class="muted" style="margin-top:8px">راجعتَ ${done} بطاقة بدقة ${acc}%.</p>
        <div style="display:flex;gap:10px;justify-content:center;margin-top:20px;flex-wrap:wrap">
          <button class="btn btn-primary" id="again">جلسة أخرى</button>
          <button class="btn" id="homeNow">العودة للرئيسية</button>
        </div>
      </div>`;
    document.getElementById('again').onclick = () => { startSession(); render(); };
    document.getElementById('homeNow').onclick = () => go('home');
  }

  function askEnglishFirst() {
    const d = ET.settings.direction;
    if (d === 'en2ar') return true;
    if (d === 'ar2en') return false;
    return Math.random() < 0.5;
  }

  function renderCard() {
    const card = session.cards[session.i];
    if (session.dirFor !== session.i) { session.showEn = askEnglishFirst(); session.dirFor = session.i; }
    const showEn = session.showEn;
    const prompt = showEn ? card.en : card.ar;
    const answer = showEn ? card.ar : card.en;
    const p = ET.progressOf(card.id);
    const pct = Math.round((session.i / session.cards.length) * 100);

    view.innerHTML = `
      <section class="section">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <span class="muted small">${session.i + 1} من ${session.cards.length}</span>
          <span class="muted small">${p && p.seen ? 'مراجعة' : 'بطاقة جديدة'} · ${esc(card.categoryAr)}</span>
        </div>
        <div class="progress-bar" style="margin-bottom:16px"><i style="width:${pct}%"></i></div>

        <div class="flash" id="flash">
          <span class="tag">${LEVEL_NAMES[card.level]} ${card.icon}</span>
          <div class="prompt ${showEn ? 'en' : ''}">${esc(prompt)}</div>
          ${session.revealed ? `
            <div class="divider"></div>
            <div class="answer ${showEn ? '' : 'en'}">${esc(answer)}</div>
            ${card.type === 'phrase' && card.words.length ? `
              <div style="width:100%;max-width:430px;margin-top:6px;text-align:start">
                ${card.words.map((w) => `<div class="wbw-row"><span class="w-en en">${esc(w.en)}</span><span class="w-ar">${esc(w.ar)}</span></div>`).join('')}
              </div>` : ''}
          ` : '<div class="hint">اضغط على البطاقة لكشف الإجابة</div>'}
        </div>

        ${session.revealed ? `
          <div class="rate">
            <button class="r0" data-g="0">نسيت<span>&lt; 10 د</span></button>
            <button class="r3" data-g="3">صعب<span>قريباً</span></button>
            <button class="r4" data-g="4">جيد<span>معتاد</span></button>
            <button class="r5" data-g="5">سهل<span>لاحقاً</span></button>
          </div>` : `
          <button class="btn btn-primary btn-block btn-lg" style="margin-top:14px" id="revealBtn">اكشف الإجابة</button>`}

        <div style="display:flex;gap:8px;justify-content:center;margin-top:14px">
          <button class="btn" id="speakBtn">🔊 استمع</button>
          <button class="btn" id="skipBtn">تخطّي</button>
        </div>
        <p class="muted small" style="text-align:center;margin-top:12px">
          <span class="kbd">مسافة</span> كشف · <span class="kbd">1</span>-<span class="kbd">4</span> تقييم · <span class="kbd">S</span> استماع
        </p>
      </section>`;

    const reveal = () => { if (!session.revealed) { session.revealed = true; renderCard(); if (ET.settings.autoSpeak) ET.speech.say(card.en); } };
    document.getElementById('flash').onclick = reveal;
    const rb = document.getElementById('revealBtn');
    if (rb) rb.onclick = reveal;
    document.getElementById('speakBtn').onclick = (e) => { e.stopPropagation(); ET.speech.say(card.en); };
    document.getElementById('skipBtn').onclick = () => { session.i++; session.revealed = false; render(); };
    view.querySelectorAll('.rate button').forEach((b) =>
      b.onclick = () => answerCard(+b.dataset.g));
  }

  function answerCard(g) {
    const card = session.cards[session.i];
    ET.grade(card.id, g);
    session.done++;
    if (g >= 3) session.right++;
    else session.cards.push(card); // البطاقة المنسية تعود في نهاية الجلسة
    session.i++;
    session.revealed = false;
    render();
  }

  /* ================================= الاختبار ================================= */
  let quiz = null;
  const QUIZ_LEN = 10;

  function buildQuiz() {
    const pool = ET.activeCards().filter((c) => c.type === 'word');
    const source = pool.length >= 4 ? pool : ET.activeCards();
    const picked = source.slice().sort(() => Math.random() - 0.5).slice(0, Math.min(QUIZ_LEN, source.length));
    quiz = {
      qs: picked.map((c) => {
        const wrong = source.filter((x) => x.id !== c.id && x.ar !== c.ar)
          .sort(() => Math.random() - 0.5).slice(0, 3);
        return { card: c, options: [c, ...wrong].sort(() => Math.random() - 0.5) };
      }),
      i: 0, score: 0, answered: false, picked: null
    };
  }

  routes.quiz = function () {
    if (!quiz) buildQuiz();
    if (!quiz.qs.length) {
      view.innerHTML = '<div class="empty"><div class="big">🤔</div><h2>لا توجد بطاقات كافية</h2><p class="muted">فعّل مستويات أكثر من الإعدادات.</p></div>';
      return;
    }
    if (quiz.i >= quiz.qs.length) return renderQuizDone();

    const q = quiz.qs[quiz.i];
    view.innerHTML = `
      <section class="section">
        <div style="display:flex;justify-content:space-between;margin-bottom:10px">
          <span class="muted small">سؤال ${quiz.i + 1} من ${quiz.qs.length}</span>
          <span class="muted small">النتيجة ${quiz.score}</span>
        </div>
        <div class="progress-bar" style="margin-bottom:18px"><i style="width:${(quiz.i / quiz.qs.length) * 100}%"></i></div>
        <div class="card" style="text-align:center;padding:26px 18px">
          <div class="muted small">ما معنى</div>
          <div class="en" style="font-size:1.8rem;font-weight:700;margin:6px 0">${esc(q.card.en)}</div>
          <button class="btn" id="qSpeak">🔊 استمع</button>
        </div>
        <div style="margin-top:16px" id="opts">
          ${q.options.map((o, idx) => `<button class="quiz-opt" data-i="${idx}">${esc(o.ar)}</button>`).join('')}
        </div>
        <div id="qNext" class="hidden" style="margin-top:12px">
          <button class="btn btn-primary btn-block btn-lg" id="nextBtn">التالي</button>
        </div>
      </section>`;

    document.getElementById('qSpeak').onclick = () => ET.speech.say(q.card.en);
    if (ET.settings.autoSpeak) ET.speech.say(q.card.en);

    view.querySelectorAll('.quiz-opt').forEach((btn) => {
      btn.onclick = () => {
        if (quiz.answered) return;
        quiz.answered = true;
        const chosen = q.options[+btn.dataset.i];
        const ok = chosen.id === q.card.id;
        if (ok) quiz.score++;
        ET.grade(q.card.id, ok ? 4 : 0);
        view.querySelectorAll('.quiz-opt').forEach((b, i) => {
          b.disabled = true;
          if (q.options[i].id === q.card.id) b.classList.add('correct');
          else if (b === btn) b.classList.add('wrong');
        });
        document.getElementById('qNext').classList.remove('hidden');
        document.getElementById('nextBtn').onclick = () => { quiz.i++; quiz.answered = false; render(); };
        refreshBadge();
      };
    });
  };

  function renderQuizDone() {
    const total = quiz.qs.length;
    const score = quiz.score;
    const pct = Math.round((score / total) * 100);
    const st = ET.state.quiz;
    st.played++;
    if (pct > st.best) st.best = pct;
    ET.save();
    quiz = null;
    view.innerHTML = `
      <div class="empty">
        <div class="big">${pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📖'}</div>
        <h2>${score} من ${total} (${pct}%)</h2>
        <p class="muted" style="margin-top:8px">أفضل نتيجة لك: ${st.best}% · عدد الاختبارات: ${st.played}</p>
        <div style="display:flex;gap:10px;justify-content:center;margin-top:20px;flex-wrap:wrap">
          <button class="btn btn-primary" id="qAgain">اختبار جديد</button>
          <button class="btn" id="qHome">الرئيسية</button>
        </div>
      </div>`;
    document.getElementById('qAgain').onclick = () => { buildQuiz(); render(); };
    document.getElementById('qHome').onclick = () => go('home');
  }

  /* =============================== دليل المحادثة =============================== */
  let phrasesTopic = window.PHRASEBOOK[0].id;

  routes.phrases = function () {
    const group = window.PHRASEBOOK.find((g) => g.id === phrasesTopic) || window.PHRASEBOOK[0];
    view.innerHTML = `
      <section class="section">
        <div class="chips" style="margin-bottom:14px">
          ${window.PHRASEBOOK.map((g) => `<button class="chip ${g.id === group.id ? 'on' : ''}" data-t="${g.id}">${g.icon} ${esc(g.titleAr)}</button>`).join('')}
        </div>
        <h2>${group.icon} دليل المحادثة: ${esc(group.titleAr)}</h2>
        <p class="muted small" style="margin-bottom:14px">اضغط على أي جملة لعرض تفكيكها كلمة بكلمة.</p>
        ${group.phrases.map((p, i) => {
          const id = 'p:' + group.id + ':' + i;
          const st = ET.stage(id);
          return `
          <div class="phrase" data-id="${id}">
            <div style="display:flex;align-items:flex-start;gap:10px">
              <span class="dot ${st}" title="${STAGE_NAMES[st]}" style="margin-top:9px"></span>
              <div style="flex:1;min-width:0">
                <div class="p-en en">${esc(p.en)}</div>
                <div class="p-ar">${esc(p.ar)}</div>
              </div>
            </div>
            <div class="p-actions">
              <button class="chip" data-act="speak">🔊 استمع</button>
              ${p.words.length ? '<button class="chip" data-act="toggle">🔍 كلمة بكلمة</button>' : ''}
              <span class="muted small" style="margin-inline-start:auto">${dueText(ET.progressOf(id))}</span>
            </div>
            ${p.words.length ? `
              <div class="wbw">
                <h4>Word by word</h4>
                ${p.words.map((w) => `<div class="wbw-row"><span class="w-en en">${esc(w.en)}</span><span class="w-ar">${esc(w.ar)}</span></div>`).join('')}
              </div>` : ''}
          </div>`;
        }).join('')}
      </section>`;

    view.querySelectorAll('.chip[data-t]').forEach((c) =>
      c.onclick = () => { phrasesTopic = c.dataset.t; render(); });

    view.querySelectorAll('.phrase').forEach((el) => {
      const card = ET.CARD_BY_ID.get(el.dataset.id);
      el.onclick = (e) => {
        const act = e.target.dataset && e.target.dataset.act;
        if (act === 'speak') { e.stopPropagation(); ET.speech.say(card.en); return; }
        el.classList.toggle('open');
      };
    });
  };

  /* ============================== تصفّح المفردات ============================== */
  let browseLevel = 'all';
  let browseQuery = '';

  routes.browse = function () {
    const q = browseQuery.trim().toLowerCase();
    const groups = window.VOCAB_GROUPS
      .filter((g) => browseLevel === 'all' || g.level === browseLevel)
      .map((g) => ({
        g,
        items: g.items.filter((it) => !q || it.en.toLowerCase().includes(q) || it.ar.includes(browseQuery.trim()))
      }))
      .filter((x) => x.items.length);

    const found = groups.reduce((s, x) => s + x.items.length, 0);

    view.innerHTML = `
      <section class="section">
        <input class="search" id="q" placeholder="ابحث بالإنجليزية أو العربية…" value="${esc(browseQuery)}">
        <div class="chips" style="margin:12px 0">
          <button class="chip ${browseLevel === 'all' ? 'on' : ''}" data-l="all">الكل</button>
          ${window.VOCAB_LEVELS.map((l) => `<button class="chip ${browseLevel === l.id ? 'on' : ''}" data-l="${l.id}">${l.id} · ${esc(l.nameAr)}</button>`).join('')}
        </div>
        <p class="muted small">${found} كلمة في ${groups.length} مجموعة</p>
      </section>
      <section class="section">
        ${groups.length ? groups.map(({ g, items }) => `
          <details class="group" ${q ? 'open' : ''}>
            <summary><span>${g.icon}</span><span>${esc(g.categoryAr)}</span>
              <span class="lvl">${g.level}</span>
              <span class="muted small">${items.length}</span></summary>
            <div class="group-body">
              ${items.map((it) => {
                const id = 'v:' + g.level.toLowerCase() + ':' + ET.slug(g.category) + ':' + ET.slug(it.en);
                const st = ET.stage(id);
                return `<div class="row">
                  <span class="dot ${st}" title="${STAGE_NAMES[st]}"></span>
                  <div class="main">
                    <div class="word en">${esc(it.en)}</div>
                    <div class="trans">${esc(it.ar)}</div>
                  </div>
                  <button class="icon-btn" data-say="${esc(it.en)}" title="استمع">🔊</button>
                </div>`;
              }).join('')}
            </div>
          </details>`).join('')
        : '<div class="empty"><div class="big">🔍</div><p>لا توجد نتائج مطابقة</p></div>'}
      </section>`;

    const input = document.getElementById('q');
    input.oninput = (e) => {
      browseQuery = e.target.value;
      const pos = e.target.selectionStart;
      render();
      const ni = document.getElementById('q');
      ni.focus();
      ni.setSelectionRange(pos, pos);
    };
    view.querySelectorAll('.chip[data-l]').forEach((c) =>
      c.onclick = () => { browseLevel = c.dataset.l; render(); });
    view.querySelectorAll('[data-say]').forEach((b) =>
      b.onclick = () => ET.speech.say(b.dataset.say));
  };

  /* ================================ الإحصائيات ================================ */
  routes.stats = function () {
    const s = ET.summary();
    const days = ET.lastDays(14);
    const max = Math.max(1, ...days.map((d) => d.count));

    // توقّع المراجعات للأيام السبعة القادمة
    const forecast = [0, 0, 0, 0, 0, 0, 0];
    ET.activeCards().forEach((c) => {
      const p = ET.progressOf(c.id);
      if (!p || !p.seen) return;
      const d = Math.floor((p.due - Date.now()) / ET.DAY);
      if (d < 0) forecast[0]++;
      else if (d < 7) forecast[d]++;
    });

    const byLevel = window.VOCAB_LEVELS.map((l) => {
      const cards = ET.CARDS.filter((c) => c.level === l.id);
      const done = cards.filter((c) => ['known', 'mastered'].includes(ET.stage(c.id))).length;
      return { l, total: cards.length, done };
    });
    const phraseCards = ET.CARDS.filter((c) => c.level === 'PH');
    byLevel.push({
      l: { id: 'PH', nameAr: 'جمل المحادثة', color: '#f472b6' },
      total: phraseCards.length,
      done: phraseCards.filter((c) => ['known', 'mastered'].includes(ET.stage(c.id))).length
    });

    view.innerHTML = `
      <section class="section">
        <h2>📈 الإحصائيات</h2>
        <div class="grid grid-4">
          <div class="stat"><div class="num">${s.totalReviews}</div><div class="lbl">مراجعة إجمالاً</div></div>
          <div class="stat"><div class="num">🔥 ${s.streak}</div><div class="lbl">أيام متتالية</div></div>
          <div class="stat"><div class="num">${s.due}</div><div class="lbl">مستحقة الآن</div></div>
          <div class="stat"><div class="num">${ET.state.quiz.best}%</div><div class="lbl">أفضل اختبار</div></div>
        </div>
      </section>

      <section class="section">
        <h2>آخر ١٤ يوماً</h2>
        <div class="card">
          <div class="heat">
            ${days.map((d) => `<div class="${d.count ? 'has' : ''}" style="height:${Math.max(6, (d.count / max) * 100)}%" title="${d.key}: ${d.count} مراجعة"></div>`).join('')}
          </div>
          <div class="muted small" style="display:flex;justify-content:space-between;margin-top:8px">
            <span>قبل ١٤ يوماً</span><span>اليوم</span>
          </div>
        </div>
      </section>

      <section class="section">
        <h2>المستحق خلال ٧ أيام</h2>
        <div class="card">
          <div class="heat">
            ${forecast.map((n, i) => `<div class="${n ? 'has' : ''}" style="height:${Math.max(6, (n / Math.max(1, ...forecast)) * 100)}%" title="${i === 0 ? 'اليوم' : 'بعد ' + i + ' يوم'}: ${n}"></div>`).join('')}
          </div>
          <div class="muted small" style="display:flex;justify-content:space-between;margin-top:8px">
            <span>اليوم</span><span>بعد ٦ أيام</span>
          </div>
        </div>
      </section>

      <section class="section">
        <h2>التقدّم حسب المستوى</h2>
        <div class="card">
          ${byLevel.map((b) => `
            <div style="margin-bottom:14px">
              <div style="display:flex;justify-content:space-between;font-size:.9rem;margin-bottom:5px">
                <span>${b.l.id} · ${esc(b.l.nameAr)}</span>
                <span class="muted">${b.done} / ${b.total}</span>
              </div>
              <div class="bar"><i style="width:${b.total ? (b.done / b.total) * 100 : 0}%;background:${b.l.color}"></i></div>
            </div>`).join('')}
        </div>
      </section>

      <section class="section">
        <button class="btn btn-block" id="toSettings">⚙️ الإعدادات وإدارة البيانات</button>
      </section>`;

    document.getElementById('toSettings').onclick = () => go('settings');
  };

  /* ================================= الإعدادات ================================= */
  routes.settings = function () {
    const st = ET.settings;
    view.innerHTML = `
      <section class="section">
        <h2>⚙️ الإعدادات</h2>
        <div class="card">
          <label class="switch">
            <span>اتجاه السؤال</span>
            <select class="sel" id="dir">
              <option value="ar2en" ${st.direction === 'ar2en' ? 'selected' : ''}>عربي ← إنجليزي</option>
              <option value="en2ar" ${st.direction === 'en2ar' ? 'selected' : ''}>إنجليزي ← عربي</option>
              <option value="mixed" ${st.direction === 'mixed' ? 'selected' : ''}>مختلط</option>
            </select>
          </label>
          <label class="switch">
            <span>هدف المراجعة اليومي</span>
            <input class="num" id="goal" type="number" min="5" max="200" step="5" value="${st.dailyGoal}" style="width:90px">
          </label>
          <label class="switch">
            <span>بطاقات جديدة في اليوم</span>
            <input class="num" id="newpd" type="number" min="0" max="100" step="5" value="${st.newPerDay}" style="width:90px">
          </label>
          <label class="switch">
            <span>النطق التلقائي عند كشف الإجابة</span>
            <input type="checkbox" id="autoSpeak" ${st.autoSpeak ? 'checked' : ''}>
          </label>
          ${ET.speech.supported ? '' : '<p class="muted small">⚠️ متصفحك لا يدعم النطق الصوتي.</p>'}
        </div>
      </section>

      <section class="section">
        <h2>المستويات المُفعّلة</h2>
        <div class="chips">
          ${window.VOCAB_LEVELS.map((l) => `<button class="chip ${st.levels.includes(l.id) ? 'on' : ''}" data-lv="${l.id}">${l.id} · ${esc(l.nameAr)}</button>`).join('')}
          <button class="chip ${st.levels.includes('PH') ? 'on' : ''}" data-lv="PH">💬 جمل المحادثة</button>
        </div>
      </section>

      <section class="section">
        <h2>البيانات</h2>
        <div class="grid grid-2">
          <button class="btn" id="exportBtn">⬇️ تصدير التقدّم</button>
          <button class="btn" id="importBtn">⬆️ استيراد ملف</button>
        </div>
        <input type="file" id="importFile" accept="application/json" class="hidden">
        <button class="btn btn-block" style="margin-top:10px;border-color:var(--red);color:var(--red)" id="resetBtn">
          🗑️ مسح كل التقدّم
        </button>
        <p class="muted small" style="margin-top:10px">
          يُحفظ تقدّمك داخل متصفحك فقط (localStorage). صدّر نسخة قبل مسح بيانات المتصفح.
        </p>
      </section>`;

    document.getElementById('dir').onchange = (e) => { st.direction = e.target.value; ET.save(); };
    document.getElementById('goal').onchange = (e) => { st.dailyGoal = Math.max(5, +e.target.value || 20); ET.save(); };
    document.getElementById('newpd').onchange = (e) => { st.newPerDay = Math.max(0, +e.target.value || 0); ET.save(); };
    document.getElementById('autoSpeak').onchange = (e) => { st.autoSpeak = e.target.checked; ET.save(); };

    view.querySelectorAll('.chip[data-lv]').forEach((c) => {
      c.onclick = () => {
        const id = c.dataset.lv;
        const i = st.levels.indexOf(id);
        if (i >= 0) { if (st.levels.length === 1) return toast('يجب إبقاء مستوى واحد على الأقل'); st.levels.splice(i, 1); }
        else st.levels.push(id);
        ET.save(); session = null; quiz = null; render();
      };
    });

    document.getElementById('exportBtn').onclick = () => {
      const blob = new Blob([ET.exportState()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'english-trainer-' + ET.todayKey() + '.json';
      a.click();
      URL.revokeObjectURL(a.href);
      toast('تم تصدير ملف التقدّم');
    };

    const file = document.getElementById('importFile');
    document.getElementById('importBtn').onclick = () => file.click();
    file.onchange = () => {
      const f = file.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        try { ET.importState(reader.result); session = null; quiz = null; toast('تم استيراد التقدّم'); render(); }
        catch (err) { toast('تعذّر قراءة الملف'); }
      };
      reader.readAsText(f);
    };

    document.getElementById('resetBtn').onclick = () => {
      if (confirm('سيتم مسح كل تقدّمك ولا يمكن التراجع. هل أنت متأكد؟')) {
        ET.resetProgress(); session = null; quiz = null; toast('تم مسح التقدّم'); render();
      }
    };
  };

  /* ============================ المظهر ولوحة المفاتيح ============================ */
  const themeBtn = document.getElementById('themeBtn');
  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    themeBtn.textContent = t === 'dark' ? '🌙' : '☀️';
    try { localStorage.setItem('english-trainer.theme', t); } catch (e) {}
  }
  let savedTheme = 'dark';
  try { savedTheme = localStorage.getItem('english-trainer.theme') || 'dark'; } catch (e) {}
  applyTheme(savedTheme);
  themeBtn.onclick = () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  document.getElementById('settingsBtn').onclick = () => go('settings');

  document.addEventListener('keydown', (e) => {
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (route !== 'review' || !session) return;
    const card = session.cards[session.i];
    if (!card) return;
    if (e.code === 'Space' || e.key === 'Enter') {
      e.preventDefault();
      if (!session.revealed) { session.revealed = true; renderCard(); if (ET.settings.autoSpeak) ET.speech.say(card.en); }
    } else if (session.revealed && ['1', '2', '3', '4'].includes(e.key)) {
      answerCard([0, 3, 4, 5][+e.key - 1]);
    } else if (e.key.toLowerCase() === 's') {
      ET.speech.say(card.en);
    }
  });

  go('home');
})();
