/* Academic Words — nauka formalnego słownictwa do Academic Writing.
 * Vanilla JS, bez build stepu. Postęp w localStorage. */
'use strict';
(function () {

  // ===================================================================
  // Stałe
  // ===================================================================
  const STORAGE_KEY = 'awv:v1';

  const CATEGORIES = {
    phrasal_verbs:    { label: 'Czasowniki frazowe', short: 'Phrasal verbs', icon: '🔗' },
    informal_phrases: { label: 'Wyrażenia nieformalne', short: 'Wyrażenia', icon: '💬' },
    academic_verbs:   { label: 'Czasowniki akademickie', short: 'Academic verbs', icon: '🎓' },
    connectors:       { label: 'Łączniki i spójniki', short: 'Łączniki', icon: '➕' },
    hedging:          { label: 'Język ostrożny (hedging)', short: 'Hedging', icon: '🌫️' },
    awl:              { label: 'Academic Word List', short: 'AWL', icon: '📚' },
    style_rules:      { label: 'Reguły stylu', short: 'Styl', icon: '✍️' },
    noun_phrases:     { label: 'Frazy rzeczownikowe', short: 'Frazy rzecz.', icon: '🧩' },
  };

  const TYPES = {
    replacement: 'Zamiana informal → formal',
    academic_verb: 'Czasownik akademicki',
    awl_word: 'Słowo AWL',
    style_rule: 'Reguła stylu',
    hedging: 'Hedging',
  };

  const FUNCTION_LABELS = {
    claim: 'Twierdzenie (claim)',
    agreement: 'Zgoda (agreement)',
    disagreement: 'Niezgoda / kwestionowanie',
    recommendation: 'Rekomendacja',
  };
  const FUNCTION_Q = {
    claim: 'formułowania twierdzenia (claim)',
    agreement: 'wyrażania zgody',
    disagreement: 'kwestionowania lub wyrażania niezgody',
    recommendation: 'wyrażania rekomendacji',
  };

  const TECHNIQUES = {
    removing_questions: 'Usuwanie pytań retorycznych',
    modal_verbs: 'Czasowniki modalne',
    adverbs: 'Przysłówki',
    impersonal_constructions: 'Konstrukcje bezosobowe',
    tentative_verbs: 'Czasowniki osłabiające (seem, appear, tend, suggest)',
    probability: 'Wyrażenia prawdopodobieństwa (likely, possible)',
  };

  const DIFFICULTY = { 1: 'Podstawowy', 2: 'Średni', 3: 'Zaawansowany' };

  const EXERCISES = {
    mix: 'Mix',
    flashcard: 'Fiszki',
    mc: 'Quiz',
    typing: 'Wpisywanie',
    matching: 'Dopasowywanie',
    gap: 'Luki',
  };

  const STATUS_LABELS = { new: 'Nowe', learning: 'W nauce', mastered: 'Opanowane' };

  // Warianty ćwiczenia "dopasuj pary".
  const MATCH = {
    inf_formal: {
      label: 'Nieformalne → formalne',
      filter: (i) => i.type === 'replacement',
      left: (i) => i.informal, right: (i) => i.formal[0],
    },
    phrasal: {
      label: 'Phrasal verb → formalny odpowiednik',
      filter: (i) => i.type === 'replacement' && i.category === 'phrasal_verbs',
      left: (i) => i.informal, right: (i) => i.formal[0],
    },
    verb_function: {
      label: 'Czasownik → jego funkcja',
      filter: (i) => i.type === 'academic_verb',
      left: (i) => i.word, right: (i) => FUNCTION_LABELS[i.function],
    },
    en_pl: {
      label: 'Angielski → polski',
      filter: (i) => (i.type === 'awl_word' || i.type === 'academic_verb') && i.polish.length > 0,
      left: (i) => i.word, right: (i) => i.polish[0],
    },
  };

  // ===================================================================
  // Narzędzia
  // ===================================================================
  function h(tag, props, ...children) {
    const el = document.createElement(tag);
    let value;
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'value') value = v;
        else if (k === 'dataset') Object.assign(el.dataset, v);
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
        else if (typeof v === 'boolean') el[k] = v;
        else el.setAttribute(k, v);
      }
    }
    for (const c of children.flat(Infinity)) {
      if (c == null || c === false) continue;
      el.append(c instanceof Node ? c : String(c));
    }
    if (value !== undefined) el.value = value;
    return el;
  }

  // append() bez null/false (natywne append zamienia null na tekst "null")
  const put = (root, ...kids) => root.append(...kids.flat(Infinity).filter((k) => k != null && k !== false));

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const uniq = (arr) => [...new Set(arr)];
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  function weightedPick(weights) {
    const entries = Object.entries(weights).filter(([, w]) => w > 0);
    let r = Math.random() * entries.reduce((s, [, w]) => s + w, 0);
    for (const [k, w] of entries) { if ((r -= w) < 0) return k; }
    return entries[entries.length - 1][0];
  }

  function dayStr(d = new Date()) {
    const z = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
  }
  function addDays(str, n) {
    const [y, m, d] = str.split('-').map(Number);
    return dayStr(new Date(y, m - 1, d + n));
  }
  const today = () => dayStr();

  function plural(n, one, few, many) {
    if (n === 1) return one;
    const d = n % 10, t = n % 100;
    return d >= 2 && d <= 4 && (t < 12 || t > 14) ? few : many;
  }

  let toastTimer;
  function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  // ===================================================================
  // Stan i zapis (localStorage)
  // ===================================================================
  function defaultState() {
    return {
      version: 1,
      progress: {},       // id -> { ef, interval, reps, due, attempts, correct, hist[], last }
      daily: {},          // 'YYYY-MM-DD' -> { answers, newItems }
      customItems: [],    // miejsce na słowa dodane ręcznie w przyszłości
      settings: {
        theme: 'system',
        name: '',
        newPerDay: 10,
        sessionSize: 12,
        lastConfig: { mode: 'quick', category: 'all', difficulty: 'all', exercise: 'mix' },
      },
    };
  }

  function loadState() {
    const base = defaultState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return base;
      const s = JSON.parse(raw);
      return {
        ...base, ...s,
        settings: { ...base.settings, ...(s.settings || {}), lastConfig: { ...base.settings.lastConfig, ...((s.settings || {}).lastConfig || {}) } },
        progress: s.progress || {},
        daily: s.daily || {},
        customItems: s.customItems || [],
      };
    } catch (e) {
      return base;
    }
  }

  let state = loadState();

  // Odcisk ustawień (bez motywu, który jest per urządzenie) — wykrywa zmianę ustawień do synchronizacji.
  const settingsFp = () => JSON.stringify({ ...state.settings, theme: null });
  let lastSettingsFp = settingsFp();

  function saveLocal() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (e) { toast('Nie udało się zapisać postępu (pamięć przeglądarki niedostępna).'); }
  }
  function save() {
    const fp = settingsFp();
    if (fp !== lastSettingsFp) { state.settingsTs = Date.now(); lastSettingsFp = fp; }
    saveLocal();
    scheduleSync();
  }

  function dayLog(d = today()) {
    return (state.daily[d] = state.daily[d] || { answers: 0, newItems: 0 });
  }

  function applyTheme() {
    const t = state.settings.theme;
    if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
    else delete document.documentElement.dataset.theme;
    const dark = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.querySelector('meta[name="theme-color"]').setAttribute('content', dark ? '#171c27' : '#16a34a');
  }

  // ===================================================================
  // Słownictwo
  // ===================================================================
  let VOCAB = [];
  let VOCAB_META = {};
  const BY_ID = new Map();

  const toArr = (v) => (Array.isArray(v) ? v : v ? [v] : []).map(String).filter(Boolean);

  function norm(s) {
    return String(s).toLowerCase()
      .replace(/[’‘`]/g, "'")
      .replace(/[^a-z0-9'\- ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  const words = (s) => norm(s).split(' ').filter(Boolean);

  // Część formalnego wariantu, która faktycznie się różni ("Research demonstrates" vs "Research shows" -> "demonstrates").
  function coreOf(formal, informal) {
    const f = words(formal), i = words(informal);
    let a = 0;
    while (a < f.length && a < i.length && f[a] === i[a]) a++;
    let b = 0;
    while (b < f.length - a && b < i.length - a && f[f.length - 1 - b] === i[i.length - 1 - b]) b++;
    if (a === 0 && b === 0) return null;
    const core = f.slice(a, f.length - b);
    return core.length ? core.join(' ') : null;
  }

  // Szuka w zdaniu wyrażenia do ukrycia (dokładnie, potem po rdzeniu słowa: analyse -> analysed).
  function findGap(sentence, candidates) {
    if (!sentence) return null;
    const split = (m) => ({ before: sentence.slice(0, m.index), hidden: m[0], after: sentence.slice(m.index + m[0].length) });
    for (const c of candidates) {
      const m = sentence.match(new RegExp(`(?<![A-Za-z])${escRe(c)}(?![A-Za-z])`, 'i'));
      if (m) return split(m);
    }
    for (const c of candidates) {
      if (/\s/.test(c)) continue;
      let stem = c.toLowerCase();
      if (stem.length >= 4 && /[ey]$/.test(stem)) stem = stem.slice(0, -1);
      const m = sentence.match(new RegExp(`(?<![A-Za-z])${escRe(stem)}[a-z]*`, 'i'));
      if (m) return split(m);
    }
    return null;
  }

  function prepareItem(raw) {
    if (!raw || !raw.id || !TYPES[raw.type]) return null;
    const it = { ...raw, difficulty: Number(raw.difficulty) || 1 };
    if (!CATEGORIES[it.category]) it.category = 'informal_phrases';
    switch (it.type) {
      case 'replacement': {
        it.formal = toArr(it.formal);
        it.polish = toArr(it.polish);
        const cores = it.formal.map((f) => coreOf(f, it.informal)).filter(Boolean);
        it._answers = uniq([...it.formal, ...cores]);
        it._gap = findGap(it.example_formal, uniq([...it.formal, ...cores]));
        it._label = it.informal;
        it._answer = it.formal.join(' / ');
        break;
      }
      case 'academic_verb':
      case 'awl_word':
        it.polish = toArr(it.polish);
        it._answers = [it.word];
        it._gap = it.polish.length ? findGap(it.example, [it.word]) : null;
        it._label = it.word;
        it._answer = it.polish.join(', ') || '—';
        break;
      case 'style_rule':
        it._label = it.incorrect;
        it._answer = it.correct;
        it._gap = null;
        break;
      case 'hedging':
        it._label = it.informal;
        it._answer = it.formal;
        it._gap = null;
        break;
    }
    it._search = [it.informal, it.word, it.rule, it.incorrect, it.correct, it.example, it.example_formal,
      ...(Array.isArray(it.formal) ? it.formal : [it.formal]), ...(Array.isArray(it.polish) ? it.polish : [it.polish])]
      .filter(Boolean).join(' ').toLowerCase();
    return it;
  }

  async function loadVocab() {
    const res = await fetch('vocabulary.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const items = Array.isArray(data) ? data : data.items;
    VOCAB_META = Array.isArray(data) ? {} : data;
    VOCAB = [...items, ...state.customItems].map(prepareItem).filter(Boolean);
    BY_ID.clear();
    for (const it of VOCAB) BY_ID.set(it.id, it);
  }

  // ===================================================================
  // Postęp i powtórki (SM-2)
  // ===================================================================
  function statusOf(it) {
    const p = state.progress[it.id];
    if (!p || !p.hist || !p.hist.length) return 'new';
    const acc = p.hist.reduce((s, x) => s + x, 0) / p.hist.length;
    if (acc > 0.9 && p.hist.length >= 3) return 'mastered';
    if (acc >= 0.6) return 'learning';
    return 'new';
  }

  // quality: 0–5 (SM-2). <3 = błędna odpowiedź.
  function record(it, correct, quality) {
    const t = today();
    let p = state.progress[it.id];
    const log = dayLog(t);
    if (!p) {
      p = state.progress[it.id] = { ef: 2.5, interval: 0, reps: 0, due: t, attempts: 0, correct: 0, hist: [] };
      log.newItems++;
    }
    p.attempts++;
    if (correct) p.correct++;
    p.hist = [...p.hist, correct ? 1 : 0].slice(-10);
    p.last = t;
    p.ts = Date.now();
    log.answers++;

    const q = Math.max(0, Math.min(5, quality));
    if (q < 3) {
      p.reps = 0;
      p.interval = 1;
    } else {
      p.reps++;
      p.interval = p.reps === 1 ? 1 : p.reps === 2 ? 6 : Math.round(p.interval * p.ef);
    }
    p.ef = Math.max(1.3, p.ef + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    p.due = addDays(t, p.interval);
    save();
  }

  const isDue = (it) => { const p = state.progress[it.id]; return !!p && p.due <= today(); };

  function srsCounts(pool = VOCAB) {
    const due = pool.filter(isDue).length;
    const newLeft = Math.max(0, state.settings.newPerDay - dayLog().newItems);
    const unseen = pool.filter((it) => !state.progress[it.id]).length;
    return { due, newToday: Math.min(newLeft, unseen) };
  }

  function streak() {
    let n = 0;
    let d = today();
    if (!(state.daily[d] && state.daily[d].answers)) d = addDays(d, -1);
    while (state.daily[d] && state.daily[d].answers) { n++; d = addDays(d, -1); }
    return n;
  }

  // ===================================================================
  // Budowanie sesji
  // ===================================================================
  function filterPool(cfg) {
    return VOCAB.filter((it) =>
      (cfg.category === 'all' || it.category === cfg.category) &&
      (cfg.difficulty === 'all' || String(it.difficulty) === String(cfg.difficulty)));
  }

  function quickItems(pool, size) {
    // losowo, ale opanowane słowa trafiają do sesji dopiero na końcu
    const mastered = (it) => (statusOf(it) === 'mastered' ? 1 : 0);
    return shuffle(pool)
      .map((it, i) => ({ it, m: mastered(it), i }))
      .sort((a, b) => a.m - b.m || a.i - b.i)
      .slice(0, size)
      .map((x) => x.it);
  }

  function srsItems(pool) {
    const due = pool.filter(isDue).sort((a, b) => state.progress[a.id].due.localeCompare(state.progress[b.id].due)).slice(0, 30);
    const { newToday } = srsCounts(pool);
    const fresh = pool.filter((it) => !state.progress[it.id])
      .sort((a, b) => a.difficulty - b.difficulty || (a.awl_group || 0) - (b.awl_group || 0))
      .slice(0, newToday);
    return shuffle([...due, ...fresh]);
  }

  function eligible(kind, it) {
    switch (kind) {
      case 'flashcard': return true;
      case 'mc':
        if (it.type === 'style_rule') return false;
        if (it.type === 'awl_word') return it.polish.length > 0;
        return true;
      case 'typing':
        if (it.type === 'replacement') return true;
        return (it.type === 'academic_verb' || it.type === 'awl_word') && it.polish.length > 0;
      case 'gap': return !!it._gap;
      default: return false;
    }
  }

  function chooseKind(it, exercise) {
    const kinds = exercise === 'mix' || exercise === 'matching' ? ['flashcard', 'mc', 'typing', 'gap'] : [exercise];
    const ok = kinds.filter((k) => eligible(k, it));
    if (!ok.length) return eligible('mc', it) ? 'mc' : 'flashcard';
    if (ok.length === 1) return ok[0];
    const fresh = !state.progress[it.id];
    const w = fresh ? { flashcard: 3, mc: 3, typing: 1, gap: 1 } : { flashcard: 1, mc: 3, typing: 2, gap: 2 };
    const weights = {};
    for (const k of ok) weights[k] = w[k];
    return weightedPick(weights);
  }

  function preferredVariant(it) {
    if (it.type === 'replacement') return it.category === 'phrasal_verbs' ? 'phrasal' : 'inf_formal';
    if (it.type === 'academic_verb') return 'verb_function';
    if (it.type === 'awl_word' && it.polish.length) return 'en_pl';
    return null;
  }

  function buildSteps(items, exercise, pool) {
    const steps = [];
    let rest = items.slice();

    if (exercise === 'matching') {
      const buckets = {};
      for (const it of rest) {
        const v = preferredVariant(it);
        if (v) (buckets[v] = buckets[v] || []).push(it);
        else steps.push({ kind: chooseKind(it, 'mix'), items: [it] });
      }
      for (const [variant, list] of Object.entries(buckets)) {
        for (let i = 0; i < list.length; i += 6) {
          let chunk = list.slice(i, i + 6);
          if (chunk.length < 4) {
            // dopełnij parami spoza sesji, żeby było co dopasowywać
            const extra = shuffle(pool.filter((o) => MATCH[variant].filter(o) && !items.includes(o))).slice(0, 4 - chunk.length);
            chunk = chunk.concat(extra);
          }
          if (chunk.length < 2) { chunk.forEach((it) => steps.push({ kind: chooseKind(it, 'mix'), items: [it] })); continue; }
          const v = variant === 'verb_function' && Math.random() < 0.4 ? 'en_pl' : variant;
          steps.push({ kind: 'matching', variant: v, items: chunk });
        }
      }
      return shuffle(steps);
    }

    if (exercise === 'mix' && rest.length >= 8) {
      for (const variant of shuffle(Object.keys(MATCH))) {
        const cand = rest.filter(MATCH[variant].filter);
        if (cand.length >= 5) {
          const chunk = shuffle(cand).slice(0, 5);
          rest = rest.filter((it) => !chunk.includes(it));
          steps.push({ kind: 'matching', variant, items: chunk });
          break;
        }
      }
    }
    for (const it of rest) steps.push({ kind: chooseKind(it, exercise), items: [it] });
    const shuffled = shuffle(steps);
    // dopasowywanie nie na sam początek
    const mi = shuffled.findIndex((s) => s.kind === 'matching');
    if (mi === 0 && shuffled.length > 2) shuffled.splice(2, 0, shuffled.shift());
    return shuffled;
  }

  let session = null;
  let lastSummary = null;

  function startSession(cfg) {
    const pool = filterPool(cfg);
    let items;
    if (cfg.items) items = cfg.items;
    else if (cfg.mode === 'srs') items = srsItems(pool);
    else items = quickItems(pool, cfg.size || state.settings.sessionSize);
    if (!items.length) {
      toast(cfg.mode === 'srs' ? 'Na dziś nie ma nic do powtórki 🎉' : 'Brak słów dla wybranych filtrów.');
      return;
    }
    session = {
      cfg,
      steps: buildSteps(items, cfg.exercise || 'mix', pool),
      index: 0,
      results: [],
      requeued: new Set(),
    };
    if (location.hash === '#/session') route(); else location.hash = '#/session';
  }

  // ===================================================================
  // Ćwiczenia — wspólne
  // ===================================================================
  const OK_TITLES = ['Świetnie!', 'Dobrze!', 'Brawo!', 'Tak jest!', 'Super!'];

  function kindLabel(text) { return h('div', { class: 'step-kind' }, text); }

  function exampleBlock(it) {
    if (it.type === 'replacement') return it.example_formal;
    if (it.type === 'academic_verb' || it.type === 'awl_word') return it.example;
    if (it.type === 'hedging') return it.formal;
    return '';
  }

  function checkTyped(input, accepted) {
    const n = norm(input);
    if (!n) return { ok: false };
    let best = null;
    for (const a of accepted) {
      const na = norm(a);
      if (n === na) return { ok: true, exact: true, match: a };
      const tol = na.length <= 3 ? 0 : na.length <= 6 ? 1 : 2; // max 2 literówki
      const d = levenshtein(n, na);
      if (d <= tol && (!best || d < best.d)) best = { d, a };
    }
    return best ? { ok: true, exact: false, match: best.a } : { ok: false };
  }

  function levenshtein(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      for (let j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[b.length];
  }

  // Dystraktory: najpierw ta sama kategoria, potem reszta tego samego typu.
  function distractors(it, getText, filterFn, exclude, n = 3) {
    const excl = new Set(exclude.map((x) => String(x).toLowerCase()));
    const cands = VOCAB.filter((o) => o !== it && filterFn(o));
    const same = shuffle(cands.filter((o) => o.category === it.category && (!it.awl_group || Math.abs((o.awl_group || 0) - it.awl_group) <= 2)));
    const other = shuffle(cands);
    const out = [];
    for (const o of [...same, ...other]) {
      const t = getText(o);
      if (!t) continue;
      const k = t.toLowerCase();
      if (excl.has(k)) continue;
      excl.add(k);
      out.push(t);
      if (out.length === n) break;
    }
    return out;
  }

  function buildMC(it) {
    const opts = (correct, wrong) => shuffle([{ text: correct, correct: true }, ...wrong.map((t) => ({ text: t, correct: false }))]);
    if (it.type === 'replacement') {
      const dir = weightedPick({ inf_formal: 2, formal_pl: 1, pl_formal: 1 });
      const sameType = (o) => o.type === 'replacement';
      if (dir === 'formal_pl') {
        return { instruction: 'Co to znaczy po polsku?', prompt: pick(it.formal), answer: it.polish[0],
          options: opts(it.polish[0], distractors(it, (o) => o.polish[0], sameType, it.polish)) };
      }
      if (dir === 'pl_formal') {
        return { instruction: 'Jak to napisać formalnie po angielsku?', prompt: it.polish.join(', '), answer: it.formal[0],
          options: opts(it.formal[0], distractors(it, (o) => o.formal[0], sameType, it.formal)) };
      }
      const correct = pick(it.formal);
      return { instruction: 'Wybierz formalny odpowiednik', prompt: it.informal, context: it.example_informal, answer: correct,
        options: opts(correct, distractors(it, (o) => o.formal[0], sameType, it.formal)) };
    }
    if (it.type === 'academic_verb') {
      const dir = weightedPick({ fn: 2, en_pl: 1, pl_en: 1 });
      if (dir === 'fn') {
        return { instruction: 'Wybierz czasownik', prompt: `Który czasownik służy do ${FUNCTION_Q[it.function]}?`, sentence: true, answer: it.word,
          options: opts(it.word, distractors(it, (o) => o.word, (o) => o.type === 'academic_verb' && o.function !== it.function, [it.word])) };
      }
      const sameType = (o) => o.type === 'academic_verb';
      if (dir === 'en_pl') {
        return { instruction: 'Co to znaczy po polsku?', prompt: it.word, context: it.example, answer: it.polish[0],
          options: opts(it.polish[0], distractors(it, (o) => o.polish[0], sameType, it.polish)) };
      }
      return { instruction: 'Który czasownik to oznacza?', prompt: it.polish.join(', '), answer: it.word,
        options: opts(it.word, distractors(it, (o) => o.word, sameType, [it.word])) };
    }
    if (it.type === 'awl_word') {
      const sameType = (o) => o.type === 'awl_word' && o.polish.length > 0;
      if (Math.random() < 0.5) {
        return { instruction: 'Co to znaczy po polsku?', prompt: it.word, context: it.example, answer: it.polish[0],
          options: opts(it.polish[0], distractors(it, (o) => o.polish[0], sameType, it.polish)) };
      }
      return { instruction: 'Które słowo AWL to oznacza?', prompt: it.polish.join(', '), answer: it.word,
        options: opts(it.word, distractors(it, (o) => o.word, sameType, [it.word])) };
    }
    if (it.type === 'hedging') {
      const correct = TECHNIQUES[it.technique] || it.technique;
      return { instruction: 'Jaką technikę hedgingu zastosowano?', prompt: `„${it.informal}”`, sentence: true,
        context: `→ „${it.formal}”`, answer: correct,
        options: opts(correct, shuffle(Object.values(TECHNIQUES).filter((t) => t !== correct)).slice(0, 3)) };
    }
    return null;
  }

  // ===================================================================
  // Ćwiczenia — renderery
  // ===================================================================
  function flashFaces(it) {
    const kv = (rows) => h('dl', { class: 'kv' }, rows.filter((r) => r[1]).map(([k, v]) => [h('dt', null, k), h('dd', null, v)]));
    const ex = (cls, mark, text) => text ? h('div', { class: 'ex ' + cls }, mark + ' ' + text) : null;
    switch (it.type) {
      case 'replacement': {
        const side = it.polish.length ? pick(['informal', 'informal', 'formal', 'polish']) : pick(['informal', 'formal']);
        const fronts = {
          informal: ['Nieformalnie → jak napisać formalnie?', it.informal],
          formal: ['Formalnie → co to znaczy?', it.formal.join(' / ')],
          polish: ['Po polsku → jak napisać formalnie?', it.polish.join(', ')],
        };
        const [label, text] = fronts[side];
        return {
          label, text,
          expected: side === 'formal' ? `${it.informal} (${it.polish.join(', ')})` : it.formal.join(' / '),
          back: [kv([['Nieformalnie', it.informal], ['Formalnie', it.formal.join(' / ')], ['Po polsku', it.polish.join(', ')]]),
            ex('bad', '✗', it.example_informal), ex('good', '✓', it.example_formal)],
        };
      }
      case 'academic_verb':
        return {
          label: 'Czasownik akademicki', text: it.word, expected: `${FUNCTION_LABELS[it.function]} — ${it.polish.join(', ')}`,
          back: [h('div', { class: 'main' }, it.word), kv([['Funkcja', FUNCTION_LABELS[it.function]], ['Po polsku', it.polish.join(', ')]]), ex('good', '✓', it.example)],
        };
      case 'awl_word':
        return {
          label: `AWL · grupa ${it.awl_group}`, text: it.word, expected: it.polish.join(', ') || '—',
          back: [h('div', { class: 'main' }, it.word), kv([['Po polsku', it.polish.join(', ') || '(brak tłumaczenia)']]), ex('good', '✓', it.example)],
        };
      case 'style_rule':
        return {
          label: 'Co jest nie tak w tym zdaniu?', text: it.incorrect, sentence: true, expected: it.correct,
          back: [h('div', { class: 'side-label' }, 'Reguła'), h('div', { style: 'font-weight:700' }, it.rule),
            ex('bad', '✗', it.incorrect), ex('good', '✓', it.correct)],
        };
      case 'hedging':
        return {
          label: 'Jak napisać to ostrożniej (hedging)?', text: it.informal, sentence: true, expected: it.formal,
          back: [ex('bad', '✗', it.informal), ex('good', '✓', it.formal),
            kv([['Technika', TECHNIQUES[it.technique] || it.technique], ['Opis', it.polish]])],
        };
    }
  }

  function renderFlashcard(step, root, ctx) {
    const it = step.items[0];
    const f = flashFaces(it);
    const tagL = h('div', { class: 'swipe-tag left' }, 'NIE ZNAM');
    const tagR = h('div', { class: 'swipe-tag right' }, 'ZNAM');
    const card = h('div', { class: 'flash', role: 'button', tabindex: '0', 'aria-label': 'Karta — kliknij, aby odwrócić' },
      h('div', { class: 'flash-face flash-front' },
        h('div', { class: 'side-label' }, f.label),
        h('div', { class: 'main' + (f.sentence ? ' sentence' : '') }, f.text),
        h('div', { class: 'tap-hint' }, 'Dotknij, aby odwrócić')),
      h('div', { class: 'flash-face flash-back' }, f.back));
    let flipped = false;
    let done = false;
    const flip = () => { flipped = !flipped; card.classList.toggle('flipped', flipped); };
    const rate = (q) => {
      if (done) return;
      done = true;
      ctx.finish([{ item: it, correct: q >= 3, quality: q, prompt: f.text, expected: f.expected, given: q < 3 ? 'Nie znam' : null }],
        null, q >= 3 ? 'ok' : 'bad');
    };

    // Swipe (dotyk i mysz)
    let sx = null, dx = 0, moved = false;
    const resetDrag = () => {
      card.classList.remove('dragging');
      card.style.transform = '';
      tagL.style.opacity = tagR.style.opacity = 0;
      sx = null;
    };
    card.addEventListener('pointerdown', (e) => {
      sx = e.clientX; dx = 0; moved = false;
      card.setPointerCapture(e.pointerId);
    });
    card.addEventListener('pointermove', (e) => {
      if (sx == null) return;
      dx = e.clientX - sx;
      if (Math.abs(dx) > 6) { moved = true; card.classList.add('dragging'); }
      if (!moved) return;
      card.style.transform = `translateX(${dx}px) rotate(${dx / 25}deg)${flipped ? ' rotateY(180deg)' : ''}`;
      tagL.style.opacity = dx < -20 ? Math.min(1, -dx / 110) : 0;
      tagR.style.opacity = dx > 20 ? Math.min(1, dx / 110) : 0;
    });
    card.addEventListener('pointerup', () => {
      if (sx == null) return;
      const d = dx;
      const wasMoved = moved;
      if (Math.abs(d) > 90) {
        card.style.transition = 'transform .25s ease';
        card.style.transform = `translateX(${d > 0 ? 600 : -600}px) rotate(${d > 0 ? 25 : -25}deg)${flipped ? ' rotateY(180deg)' : ''}`;
        sx = null;
        rate(d > 0 ? 5 : 1);
        return;
      }
      resetDrag();
      if (!wasMoved) flip();
    });
    card.addEventListener('pointercancel', resetDrag);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); flip(); } });

    put(root,
      kindLabel('Fiszka'),
      h('div', { class: 'flash-wrap' }, tagL, tagR, card),
      h('div', { class: 'rate-row' },
        h('button', { class: 'btn btn-no', onClick: () => rate(1) }, '✗ Nie znam'),
        h('button', { class: 'btn btn-almost', onClick: () => rate(3) }, '≈ Prawie'),
        h('button', { class: 'btn btn-yes', onClick: () => rate(5) }, '✓ Znam')),
      h('p', { class: 'muted small', style: 'text-align:center;margin-top:12px' },
        'Przesuń kartę w prawo = znam, w lewo = nie znam. Klawisze: spacja, 1 / 2 / 3.'));

    ctx.onKey((e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
      else if (e.key === '1' || e.key === 'ArrowLeft') rate(1);
      else if (e.key === '2') rate(3);
      else if (e.key === '3' || e.key === 'ArrowRight') rate(5);
    });
  }

  function renderMC(step, root, ctx) {
    const it = step.items[0];
    const q = buildMC(it);
    let answered = false;
    const buttons = q.options.map((o, i) => h('button', { class: 'opt', onClick: () => choose(i) },
      h('span', { class: 'key' }, String(i + 1)), h('span', null, o.text)));
    function choose(i) {
      if (answered) return;
      answered = true;
      const o = q.options[i];
      buttons.forEach((b, j) => {
        b.disabled = true;
        if (q.options[j].correct) b.classList.add('ok');
      });
      if (!o.correct) buttons[i].classList.add('bad');
      ctx.finish([{ item: it, correct: o.correct, quality: o.correct ? 4 : 1, prompt: q.prompt, expected: q.answer, given: o.text }],
        o.correct
          ? { ok: true, title: pick(OK_TITLES), detail: exampleBlock(it) }
          : { ok: false, title: 'Niestety…', detail: `Poprawna odpowiedź: ${q.answer}` });
    }
    put(root,
      kindLabel('Quiz'),
      h('div', { class: 'muted' }, q.instruction),
      h('div', { class: 'prompt' + (q.sentence ? ' sentence' : '') }, q.prompt),
      q.context ? h('div', { class: 'context' }, q.context) : null,
      h('div', { class: 'options' }, buttons));
    ctx.onKey((e) => {
      const n = Number(e.key);
      if (n >= 1 && n <= buttons.length) choose(n - 1);
    });
  }

  function typingPrompt(it) {
    if (it.type === 'replacement') {
      return { instruction: 'Napisz formalny odpowiednik', prompt: it.informal, context: it.example_informal,
        accepted: it._answers, expected: it.formal.join(' / ') };
    }
    const hint = `Podpowiedź: zaczyna się na „${it.word[0]}”, ${it.word.length} ${plural(it.word.length, 'znak', 'znaki', 'znaków')}`;
    if (it.type === 'academic_verb') {
      return { instruction: 'Napisz angielski czasownik akademicki', prompt: it.polish.join(', '),
        context: `Funkcja: ${FUNCTION_LABELS[it.function]}. ${hint}`, accepted: [it.word], expected: it.word };
    }
    return { instruction: 'Napisz angielskie słowo z AWL', prompt: it.polish.join(', '), context: hint, accepted: [it.word], expected: it.word };
  }

  function answerFeedback(res, expected, accepted, it) {
    if (res.ok && res.exact) {
      const others = accepted.filter((a) => norm(a) !== norm(res.match) && !norm(res.match).includes(norm(a)) && !norm(a).includes(norm(res.match)));
      return { ok: true, title: pick(OK_TITLES), detail: others.length ? `Inne poprawne: ${others.join(' / ')}` : exampleBlock(it) };
    }
    if (res.ok) return { ok: true, title: 'Prawie idealnie — mała literówka', detail: `Poprawnie: ${res.match}` };
    return { ok: false, title: 'Niestety…', detail: `Poprawna odpowiedź: ${expected}` };
  }

  function answerInput(onSubmit) {
    const input = h('input', { type: 'text', class: 'answer', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false',
      placeholder: 'Wpisz odpowiedź…', 'aria-label': 'Twoja odpowiedź' });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); onSubmit(); }
    });
    return input;
  }

  function renderTyping(step, root, ctx) {
    const it = step.items[0];
    const p = typingPrompt(it);
    let answered = false;
    const input = answerInput(submit);
    function submit(giveUp) {
      if (answered) return;
      if (!giveUp && !input.value.trim()) { input.focus(); return; }
      answered = true;
      const res = giveUp ? { ok: false } : checkTyped(input.value, p.accepted);
      input.disabled = true;
      input.classList.add(res.ok ? 'ok' : 'bad');
      ctx.finish([{ item: it, correct: res.ok, quality: res.ok ? (res.exact ? 4 : 3) : 1, prompt: p.prompt, expected: p.expected, given: input.value || '(nie wiem)' }],
        answerFeedback(res, p.expected, p.accepted, it));
    }
    put(root,
      kindLabel('Wpisywanie'),
      h('div', { class: 'muted' }, p.instruction),
      h('div', { class: 'prompt' }, p.prompt),
      p.context ? h('div', { class: 'context' }, p.context) : null,
      h('div', { class: 'field' }, input),
      h('div', { class: 'row' },
        h('button', { class: 'btn btn-ghost', onClick: () => submit(true) }, 'Nie wiem'),
        h('div', { class: 'spacer' }),
        h('button', { class: 'btn btn-primary', onClick: () => submit(false) }, 'Sprawdź')));
    setTimeout(() => input.focus(), 50);
  }

  function renderGap(step, root, ctx) {
    const it = step.items[0];
    const g = it._gap;
    const hint = it.type === 'replacement' ? `(${it.informal})` : `(${it.polish[0]})`;
    const accepted = uniq([g.hidden, ...(it._answers || [])]);
    const line = h('span', { class: 'gap-line' }, ' '.repeat(10));
    let answered = false;
    const input = answerInput(submit);
    function submit(giveUp) {
      if (answered) return;
      if (!giveUp && !input.value.trim()) { input.focus(); return; }
      answered = true;
      const res = giveUp ? { ok: false } : checkTyped(input.value, accepted);
      input.disabled = true;
      input.classList.add(res.ok ? 'ok' : 'bad');
      line.textContent = g.hidden;
      line.classList.add(res.ok ? 'ok' : 'bad');
      ctx.finish([{ item: it, correct: res.ok, quality: res.ok ? (res.exact ? 4 : 3) : 1,
        prompt: `${g.before}___${g.after}`, expected: g.hidden, given: input.value || '(nie wiem)' }],
        res.ok ? { ok: true, title: res.exact ? pick(OK_TITLES) : 'Prawie idealnie — mała literówka', detail: `${g.before}${g.hidden}${g.after}` }
          : { ok: false, title: 'Niestety…', detail: `Poprawnie: ${g.hidden}` });
    }
    put(root,
      kindLabel('Uzupełnij lukę'),
      h('div', { class: 'muted', style: 'margin-bottom:10px' },
        it.type === 'replacement' ? 'Wpisz formalne wyrażenie zamiast nieformalnego z nawiasu.' : 'Wpisz brakujące słowo (podpowiedź po polsku).'),
      h('div', { class: 'gap-sentence card' },
        g.before,
        h('span', { class: 'gap-slot' }, h('span', { class: 'gap-hint' }, hint), line),
        g.after),
      h('div', { class: 'field' }, input),
      h('div', { class: 'row' },
        h('button', { class: 'btn btn-ghost', onClick: () => submit(true) }, 'Nie wiem'),
        h('div', { class: 'spacer' }),
        h('button', { class: 'btn btn-primary', onClick: () => submit(false) }, 'Sprawdź')));
    setTimeout(() => input.focus(), 50);
  }

  function renderMatching(step, root, ctx) {
    const def = MATCH[step.variant];
    const pairs = shuffle(step.items).map((it) => ({ it, l: def.left(it), r: def.right(it) }));
    const rights = shuffle(pairs.map((p) => p.r));
    const erred = new Set();
    let sel = null; // { side: 'l'|'r', i }
    let matched = 0;

    const leftEls = pairs.map((p, i) => h('button', { class: 'match-item', draggable: 'true', dataset: { i } }, p.l));
    const rightEls = rights.map((r, i) => h('button', { class: 'match-item', dataset: { i } }, r));

    const clearSel = () => { leftEls.concat(rightEls).forEach((e) => e.classList.remove('sel')); sel = null; };

    function attempt(li, ri) {
      const L = leftEls[li], R = rightEls[ri];
      clearSel();
      if (pairs[li].r === rights[ri]) {
        [L, R].forEach((e) => { e.classList.remove('wrong'); e.classList.add('done'); });
        L.disabled = R.disabled = true;
        matched++;
        if (matched === pairs.length) finish();
      } else {
        erred.add(pairs[li].it.id);
        [L, R].forEach((e) => {
          e.classList.remove('wrong');
          void e.offsetWidth;
          e.classList.add('wrong');
          setTimeout(() => e.classList.remove('wrong'), 450);
        });
      }
    }
    function tap(side, i) {
      const el = (side === 'l' ? leftEls : rightEls)[i];
      if (el.disabled) return;
      if (sel && sel.side !== side) {
        attempt(side === 'l' ? i : sel.i, side === 'r' ? i : sel.i);
      } else {
        clearSel();
        sel = { side, i };
        el.classList.add('sel');
      }
    }
    function finish() {
      const n = erred.size;
      ctx.finish(pairs.map((p) => ({ item: p.it, correct: !erred.has(p.it.id), quality: erred.has(p.it.id) ? 2 : 4,
        prompt: p.l, expected: p.r, given: erred.has(p.it.id) ? 'błędne dopasowanie' : null })),
        n === 0 ? { ok: true, title: 'Perfekcyjnie! Wszystkie pary bez błędu.', detail: '' }
          : { ok: false, title: `Gotowe — ${n} ${plural(n, 'para', 'pary', 'par')} z błędem`, detail: 'Te słowa wrócą w powtórkach.' });
    }

    leftEls.forEach((el, i) => {
      el.addEventListener('click', () => tap('l', i));
      el.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', String(i)); e.dataTransfer.effectAllowed = 'move'; clearSel(); });
    });
    rightEls.forEach((el, i) => {
      el.addEventListener('click', () => tap('r', i));
      el.addEventListener('dragover', (e) => { if (!el.disabled) { e.preventDefault(); el.classList.add('drop-over'); } });
      el.addEventListener('dragleave', () => el.classList.remove('drop-over'));
      el.addEventListener('drop', (e) => {
        e.preventDefault();
        el.classList.remove('drop-over');
        const li = Number(e.dataTransfer.getData('text/plain'));
        if (!Number.isNaN(li) && !leftEls[li].disabled && !el.disabled) attempt(li, i);
      });
    });

    put(root,
      kindLabel('Dopasuj pary'),
      h('div', { class: 'muted' }, `${def.label}. Kliknij element z lewej, potem z prawej (lub przeciągnij).`),
      h('div', { class: 'match-grid' }, h('div', { class: 'match-col' }, leftEls), h('div', { class: 'match-col' }, rightEls)));
  }

  const RENDERERS = { flashcard: renderFlashcard, mc: renderMC, typing: renderTyping, gap: renderGap, matching: renderMatching };

  // ===================================================================
  // Sesja — kontroler
  // ===================================================================
  let keyHandler = null;
  let feedbackAt = 0;
  let feedbackContinue = null;

  function feedbackEl() {
    let fb = document.getElementById('feedback');
    if (!fb) {
      fb = h('div', { id: 'feedback', class: 'feedback', role: 'status', 'aria-live': 'polite' });
      document.body.append(fb);
    }
    return fb;
  }
  function hideFeedback() {
    const fb = document.getElementById('feedback');
    if (fb) fb.className = 'feedback';
    feedbackContinue = null;
  }
  function showFeedback(f, onContinue) {
    const fb = feedbackEl();
    const btn = h('button', { class: 'btn ' + (f.ok ? 'btn-primary' : 'btn-danger'), onClick: () => onContinue() }, 'Dalej');
    fb.replaceChildren(h('div', { class: 'feedback-inner' },
      h('div', { class: 'fb-icon', 'aria-hidden': 'true' }, f.ok ? '✓' : '✗'),
      h('div', { class: 'fb-text' }, h('div', { class: 'fb-title' }, f.title), f.detail ? h('div', { class: 'fb-detail' }, f.detail) : null),
      btn));
    fb.className = 'feedback show ' + (f.ok ? 'ok' : 'bad');
    feedbackAt = Date.now();
    feedbackContinue = onContinue;
    setTimeout(() => btn.focus({ preventScroll: true }), 30);
  }

  function renderSessionView(view) {
    if (!session) { location.hash = '#/dashboard'; return; }
    const s = session;
    const step = s.steps[s.index];
    const total = s.steps.length;
    const pct = Math.round((s.index / total) * 100);

    const stepRoot = h('div', { class: 'step' });
    let finished = false;
    const ctx = {
      onKey: (fn) => { keyHandler = fn; },
      finish(results, fb, tone) {
        if (finished) return;
        finished = true;
        keyHandler = null;
        for (const r of results) {
          r.kind = step.kind;
          r.retry = !!step.retry;
          if (!r.skipped) record(r.item, r.correct, r.quality);
          s.results.push(r);
          if (s.cfg.mode === 'srs' && !r.correct && !r.skipped && !s.requeued.has(r.item.id)) {
            s.requeued.add(r.item.id);
            s.steps.push({ kind: chooseKind(r.item, 'mix'), items: [r.item], retry: true });
          }
        }
        const ok = fb ? fb.ok : tone === 'ok';
        view.classList.remove('flash-ok', 'flash-bad');
        void view.offsetWidth;
        view.classList.add(ok ? 'flash-ok' : 'flash-bad');
        if (fb) showFeedback(fb, advance);
        else setTimeout(advance, 280);
      },
    };

    function advance() {
      hideFeedback();
      s.index++;
      if (s.index >= s.steps.length) finishSession();
      else renderSessionView(view);
    }

    function skip() {
      if (finished) return;
      finished = true;
      for (const it of step.items) {
        s.results.push({ item: it, correct: false, skipped: true, kind: step.kind, retry: !!step.retry, prompt: it._label, expected: it._answer, given: 'pominięte' });
      }
      advance();
    }

    view.replaceChildren(
      h('div', { class: 'session-top' },
        h('button', { class: 'icon-btn', 'aria-label': 'Zakończ sesję', title: 'Zakończ sesję', onClick: quitSession }, '✕'),
        h('div', { class: 'bar', role: 'progressbar', 'aria-valuenow': String(s.index), 'aria-valuemax': String(total) },
          h('span', { class: 'p', style: `width:${pct}%` })),
        h('div', { class: 'count' }, `${s.index + 1}/${total}`)),
      stepRoot,
      h('div', { class: 'session-actions' },
        h('span', { class: 'muted small' }, step.retry ? '🔁 Powtórka błędu' : ''),
        h('button', { class: 'btn btn-ghost', onClick: skip }, 'Pomiń ⏭')));
    keyHandler = null;
    RENDERERS[step.kind](step, stepRoot, ctx);
  }

  function quitSession() {
    const answered = session ? session.results.length : 0;
    if (answered && !confirm('Zakończyć sesję? Dotychczasowe odpowiedzi są zapisane.')) return;
    if (answered) finishSession();
    else { session = null; location.hash = '#/dashboard'; }
  }

  function finishSession() {
    const s = session;
    const first = s.results.filter((r) => !r.retry);
    lastSummary = {
      cfg: s.cfg,
      total: first.length,
      correct: first.filter((r) => r.correct).length,
      errors: first.filter((r) => !r.correct),
    };
    session = null;
    hideFeedback();
    location.hash = '#/summary';
  }

  // ===================================================================
  // Widoki
  // ===================================================================
  function progressBar(stats, cls = '') {
    const t = stats.total || 1;
    return h('div', { class: 'bar ' + cls },
      h('span', { class: 'm', style: `width:${(stats.mastered / t) * 100}%` }),
      h('span', { class: 'l', style: `width:${(stats.learning / t) * 100}%` }));
  }

  function statsFor(items) {
    const s = { total: items.length, new: 0, learning: 0, mastered: 0 };
    for (const it of items) s[statusOf(it)]++;
    return s;
  }

  function renderDashboard(view) {
    const name = state.settings.name.trim();
    const st = streak();
    const { due, newToday } = srsCounts();
    const overall = statsFor(VOCAB);
    let quickCat = state.settings.lastConfig.category || 'all';

    const chips = h('div', { class: 'chips' });
    const drawChips = () => chips.replaceChildren(
      ...[['all', 'Wszystkie'], ...Object.entries(CATEGORIES).map(([k, c]) => [k, c.icon + ' ' + c.short])].map(([k, label]) =>
        h('button', { class: 'chip' + (quickCat === k ? ' active' : ''), onClick: () => { quickCat = k; drawChips(); } }, label)));
    drawChips();

    const catRows = Object.entries(CATEGORIES).map(([key, c]) => {
      const items = VOCAB.filter((it) => it.category === key);
      if (!items.length) return null;
      const s = statsFor(items);
      return h('button', { class: 'cat-row', onClick: () => startSession({ mode: 'quick', category: key, difficulty: 'all', exercise: 'mix' }) },
        h('span', { class: 'cat-ico' }, c.icon),
        h('span', null,
          h('div', { class: 'cat-name' }, c.label),
          progressBar(s)),
        h('span', { class: 'muted small', style: 'text-align:right' }, `${s.mastered}/${s.total}`, h('br'), `${Math.round((s.mastered / s.total) * 100)}%`));
    });

    view.replaceChildren(
      h('div', { class: 'hero' },
        h('div', null,
          h('h1', null, `Cześć${name ? ', ' + name : ''}! 👋`),
          h('div', { class: 'muted' }, 'Formalny angielski do Academic Writing'),
          sync.client && !sync.user
            ? h('a', { href: '#/settings', class: 'small' }, '☁️ Włącz synchronizację między urządzeniami')
            : null),
        st ? h('div', { class: 'streak', title: 'Dni nauki z rzędu' }, `🔥 ${st} ${plural(st, 'dzień', 'dni', 'dni')}`) : null),
      h('div', { class: 'grid grid-2' },
        h('div', { class: 'card start-card' },
          h('h2', null, '🧠 Inteligentne powtórki'),
          h('div', { class: 'row', style: 'align-items:baseline' },
            h('span', { class: 'big-num' }, String(due)),
            h('span', { class: 'muted' }, `do powtórki dziś${newToday ? ` + ${newToday} ${plural(newToday, 'nowe', 'nowe', 'nowych')}` : ''}`)),
          h('p', { class: 'muted small', style: 'margin-top:8px' }, 'Algorytm SM-2 dobiera słowa, które właśnie zaczynasz zapominać.'),
          h('button', { class: 'btn btn-primary btn-block', disabled: !(due + newToday),
            onClick: () => startSession({ mode: 'srs', category: 'all', difficulty: 'all', exercise: 'mix' }) },
          due + newToday ? 'Rozpocznij powtórki' : 'Na dziś wszystko! 🎉')),
        h('div', { class: 'card start-card' },
          h('h2', null, '⚡ Szybka sesja'),
          h('p', { class: 'muted small' }, `${state.settings.sessionSize} losowych słów, różne typy ćwiczeń.`),
          chips,
          h('button', { class: 'btn btn-accent btn-block', style: 'margin-top:14px',
            onClick: () => { state.settings.lastConfig.category = quickCat; save(); startSession({ mode: 'quick', category: quickCat, difficulty: 'all', exercise: 'mix' }); } },
          'Start'))),
      h('div', { class: 'card' },
        h('h2', null, 'Twój postęp'),
        h('div', { class: 'stat-row' },
          h('div', { class: 'stat' }, h('b', { style: 'color:var(--ok)' }, String(overall.mastered)), h('span', null, 'Opanowane')),
          h('div', { class: 'stat' }, h('b', { style: 'color:var(--warn)' }, String(overall.learning)), h('span', null, 'W nauce')),
          h('div', { class: 'stat' }, h('b', null, String(overall.new)), h('span', null, 'Nowe'))),
        h('div', { style: 'margin-top:12px' }, progressBar(overall)),
        h('div', { class: 'legend' },
          h('span', null, h('i', { style: 'background:var(--ok)' }), 'opanowane (>90%)'),
          h('span', null, h('i', { style: 'background:var(--warn)' }), 'w nauce (60–90%)'),
          h('span', null, h('i', { style: 'background:var(--surface-2);border:1px solid var(--border)' }), 'nowe (<60%)'))),
      h('div', { class: 'card' },
        h('h2', null, 'Kategorie'),
        h('p', { class: 'muted small' }, 'Kliknij kategorię, aby od razu zacząć szybką sesję.'),
        h('div', { class: 'cat-list' }, catRows)));
  }

  function seg(options, value, onChange) {
    const wrap = h('div', { class: 'seg', role: 'group' });
    const draw = (v) => wrap.replaceChildren(...options.map(([k, label]) =>
      h('button', { class: v === k ? 'active' : '', 'aria-pressed': String(v === k), onClick: () => { draw(k); onChange(k); } }, label)));
    draw(value);
    return wrap;
  }

  function renderLearn(view) {
    const cfg = { ...state.settings.lastConfig };
    const persist = () => { state.settings.lastConfig = { ...cfg }; save(); refresh(); };
    const info = h('div', { class: 'muted small', style: 'margin-bottom:14px' });
    const sizeField = h('div', { class: 'field' });

    function refresh() {
      const pool = filterPool(cfg);
      if (cfg.mode === 'srs') {
        const c = srsCounts(pool);
        info.textContent = `W wybranym zakresie: ${c.due} do powtórki + ${c.newToday} nowych na dziś.`;
        sizeField.classList.add('hidden');
      } else {
        info.textContent = `W wybranym zakresie: ${pool.length} ${plural(pool.length, 'wpis', 'wpisy', 'wpisów')}.`;
        sizeField.classList.remove('hidden');
      }
    }

    const catSelect = h('select', { id: 'f-cat', value: cfg.category, onChange: (e) => { cfg.category = e.target.value; persist(); } },
      h('option', { value: 'all' }, 'Wszystkie kategorie'),
      Object.entries(CATEGORIES).map(([k, c]) => h('option', { value: k }, `${c.icon} ${c.label}`)));
    const diffSelect = h('select', { id: 'f-diff', value: String(cfg.difficulty), onChange: (e) => { cfg.difficulty = e.target.value; persist(); } },
      h('option', { value: 'all' }, 'Wszystkie poziomy'),
      Object.entries(DIFFICULTY).map(([k, l]) => h('option', { value: k }, `${k} — ${l}`)));

    sizeField.append(h('span', { class: 'label' }, 'Liczba słów'),
      seg([['10', '10'], ['12', '12'], ['15', '15']], String(state.settings.sessionSize), (v) => { state.settings.sessionSize = Number(v); save(); }));

    const exChips = h('div', { class: 'chips' });
    const drawEx = () => exChips.replaceChildren(...Object.entries(EXERCISES).map(([k, l]) =>
      h('button', { class: 'chip' + (cfg.exercise === k ? ' active' : ''), onClick: () => { cfg.exercise = k; drawEx(); persist(); } }, l)));
    drawEx();

    view.replaceChildren(
      h('h1', null, 'Nauka'),
      h('div', { class: 'card' },
        h('div', { class: 'field' }, h('span', { class: 'label' }, 'Tryb'),
          seg([['quick', '⚡ Szybka sesja'], ['srs', '🧠 Powtórki SRS']], cfg.mode, (v) => { cfg.mode = v; persist(); })),
        h('div', { class: 'grid grid-2', style: 'gap:0 16px' },
          h('div', { class: 'field' }, h('label', { for: 'f-cat' }, 'Kategoria'), catSelect),
          h('div', { class: 'field' }, h('label', { for: 'f-diff' }, 'Poziom'), diffSelect)),
        h('div', { class: 'field' }, h('span', { class: 'label' }, 'Rodzaj ćwiczeń'), exChips),
        sizeField,
        info,
        h('button', { class: 'btn btn-primary btn-lg btn-block', onClick: () => startSession({ ...cfg, size: state.settings.sessionSize }) }, 'Zaczynamy! 🚀')),
      h('div', { class: 'card' },
        h('h2', null, 'Rodzaje ćwiczeń'),
        h('dl', { class: 'kv' },
          h('dt', null, 'Fiszki'), h('dd', null, 'Odwróć kartę i oceń: znam / prawie / nie znam. Na telefonie przesuwaj kartę.'),
          h('dt', null, 'Quiz'), h('dd', null, '4 odpowiedzi do wyboru: informal → formal, EN → PL, PL → EN, funkcje czasowników.'),
          h('dt', null, 'Wpisywanie'), h('dd', null, 'Napisz formalny odpowiednik. Drobne literówki są akceptowane.'),
          h('dt', null, 'Dopasowywanie'), h('dd', null, '5–6 par: informal ↔ formal, phrasal verbs, czasownik ↔ funkcja, EN ↔ PL.'),
          h('dt', null, 'Luki'), h('dd', null, 'Uzupełnij zdanie akademickie brakującym wyrażeniem.'),
          h('dt', null, 'Mix'), h('dd', null, 'Wszystko naraz — najlepsze na co dzień.'))));
    refresh();
  }

  function renderSummary(view) {
    if (!lastSummary) { location.hash = '#/dashboard'; return; }
    const { total, correct, errors, cfg } = lastSummary;
    const pct = total ? correct / total : 0;
    const msg = pct >= 0.9 ? 'Świetnie! 🎉' : pct >= 0.7 ? 'Dobra robota! 👏' : pct >= 0.5 ? 'Nieźle — ćwicz dalej 💪' : 'Nie poddawaj się — powtórz błędy 🔁';
    const R = 64, C = 2 * Math.PI * R;
    const ring = `<svg width="150" height="150" viewBox="0 0 150 150" aria-hidden="true">
      <circle cx="75" cy="75" r="${R}" fill="none" stroke="var(--surface-2)" stroke-width="14"/>
      <circle cx="75" cy="75" r="${R}" fill="none" stroke="${pct >= 0.7 ? 'var(--ok)' : pct >= 0.5 ? 'var(--warn)' : 'var(--bad)'}" stroke-width="14"
        stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}"/></svg>`;
    const ringEl = h('div', { class: 'score-ring' });
    ringEl.innerHTML = ring;
    ringEl.append(h('div', { class: 'val' }, `${correct}/${total}`));

    const errItems = uniq(errors.map((e) => e.item));
    view.replaceChildren(
      h('div', { class: 'card summary-head' },
        h('h1', null, 'Koniec sesji'),
        ringEl,
        h('h2', null, `${correct}/${total} — ${msg}`),
        h('div', { class: 'row', style: 'justify-content:center;margin-top:14px' },
          errItems.length ? h('button', { class: 'btn btn-danger', onClick: () => startSession({ ...cfg, mode: 'quick', items: errItems }) }, `🔁 Powtórz błędy (${errItems.length})`) : null,
          h('button', { class: 'btn btn-primary', onClick: () => startSession({ ...cfg, items: undefined }) }, 'Kolejna sesja'),
          h('a', { class: 'btn', href: '#/dashboard' }, 'Panel'))),
      errors.length ? h('div', { class: 'card' },
        h('h2', null, 'Do przejrzenia'),
        h('div', { class: 'err-list' }, errors.map((e) => h('div', { class: 'err' + (e.skipped ? ' skipped' : '') },
          h('div', { class: 'q' }, e.prompt),
          e.given && !e.skipped ? h('div', { class: 'g' }, e.given) : e.skipped ? h('div', { class: 'muted small' }, 'pominięte') : null,
          h('div', { class: 'a' }, '✓ ' + e.expected))))) : h('div', { class: 'card', style: 'text-align:center' }, 'Bez błędów — tak trzymaj! ⭐'));
  }

  // ----- Słownik
  const browseState = { q: '', category: 'all', type: 'all', sort: 'alpha', limit: 80 };

  function wordCard(it) {
    const st = statusOf(it);
    const badges = h('div', { class: 'word-badges' },
      it.type === 'academic_verb' ? h('span', { class: 'badge' }, FUNCTION_LABELS[it.function]) : null,
      it.type === 'awl_word' ? h('span', { class: 'badge' }, `AWL ${it.awl_group}`) : null,
      it.type === 'hedging' ? h('span', { class: 'badge' }, TECHNIQUES[it.technique] || it.technique) : null,
      h('span', { class: 'badge', title: DIFFICULTY[it.difficulty] }, '●'.repeat(it.difficulty) + '○'.repeat(3 - it.difficulty)),
      h('span', { class: 'badge ' + st }, STATUS_LABELS[st]));
    const ex = (cls, mark, text) => text ? h('div', { class: 'ex ' + cls }, mark + ' ' + text) : null;
    let head, details;
    switch (it.type) {
      case 'replacement':
        head = [h('span', { class: 'word-main' }, it.informal), h('span', { class: 'word-arrow' }, '→'), h('span', { class: 'word-sub' }, it.formal.join(' / '))];
        details = [it.polish.length ? h('div', null, h('b', null, 'PL: '), it.polish.join(', ')) : null, ex('bad', '✗', it.example_informal), ex('good', '✓', it.example_formal)];
        break;
      case 'academic_verb':
      case 'awl_word':
        head = [h('span', { class: 'word-main' }, it.word), h('span', { class: 'word-arrow' }, '—'), h('span', { class: 'muted' }, it.polish.join(', ') || '(brak tłumaczenia)')];
        details = [ex('good', '✓', it.example)];
        break;
      case 'style_rule':
        return h('div', { class: 'word rule-card' },
          h('div', { class: 'word-head' }, h('span', { class: 'word-main' }, '✍️ ' + it.rule), badges),
          h('div', { class: 'word-details' }, ex('bad', '✗', it.incorrect), ex('good', '✓', it.correct)));
      case 'hedging':
        head = [h('span', { class: 'word-main', style: 'font-weight:600' }, it.informal)];
        details = [ex('good', '✓', it.formal), h('div', { class: 'muted small' }, it.polish)];
        break;
    }
    const el = h('div', { class: 'word', tabindex: '0', role: 'button', 'aria-expanded': 'false' },
      h('div', { class: 'word-head' }, head, badges),
      h('div', { class: 'word-details' }, details));
    const toggle = () => { el.classList.toggle('open'); el.setAttribute('aria-expanded', String(el.classList.contains('open'))); };
    el.addEventListener('click', toggle);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    return el;
  }

  function renderBrowse(view) {
    const list = h('div', { class: 'word-list' });
    const countEl = h('div', { class: 'muted small', style: 'margin-bottom:10px' });
    const more = h('div', { class: 'list-more' });
    const bs = browseState;

    function filtered() {
      const q = bs.q.trim().toLowerCase();
      const rank = { new: 0, learning: 1, mastered: 2 };
      const out = VOCAB.filter((it) =>
        (bs.category === 'all' || it.category === bs.category) &&
        (bs.type === 'all' || it.type === bs.type) &&
        (!q || it._search.includes(q)));
      const alpha = (a, b) => a._label.localeCompare(b._label, 'en', { sensitivity: 'base' });
      if (bs.sort === 'alpha') out.sort(alpha);
      else if (bs.sort === 'difficulty') out.sort((a, b) => a.difficulty - b.difficulty || alpha(a, b));
      else if (bs.sort === 'difficulty_desc') out.sort((a, b) => b.difficulty - a.difficulty || alpha(a, b));
      else if (bs.sort === 'status') out.sort((a, b) => rank[statusOf(a)] - rank[statusOf(b)] || alpha(a, b));
      return out;
    }
    function draw() {
      const items = filtered();
      countEl.textContent = `${items.length} ${plural(items.length, 'wpis', 'wpisy', 'wpisów')}`;
      list.replaceChildren(...items.slice(0, bs.limit).map(wordCard));
      more.replaceChildren(items.length > bs.limit
        ? h('button', { class: 'btn', onClick: () => { bs.limit += 120; draw(); } }, `Pokaż więcej (${items.length - bs.limit})`)
        : '');
      if (!items.length) list.append(h('div', { class: 'card muted', style: 'text-align:center' }, 'Nic nie znaleziono.'));
    }
    let t;
    const search = h('input', { type: 'search', placeholder: '🔍 Szukaj (EN lub PL)…', value: bs.q, 'aria-label': 'Szukaj',
      onInput: (e) => { clearTimeout(t); t = setTimeout(() => { bs.q = e.target.value; bs.limit = 80; draw(); }, 150); } });
    const sel = (key, options, label) => h('select', { 'aria-label': label, value: bs[key], onChange: (e) => { bs[key] = e.target.value; bs.limit = 80; draw(); } },
      options.map(([v, l]) => h('option', { value: v }, l)));

    view.replaceChildren(
      h('h1', null, 'Słownik'),
      h('div', { class: 'filters' },
        search,
        sel('category', [['all', 'Wszystkie kategorie'], ...Object.entries(CATEGORIES).map(([k, c]) => [k, c.label])], 'Kategoria'),
        sel('type', [['all', 'Wszystkie typy'], ...Object.entries(TYPES)], 'Typ'),
        sel('sort', [['alpha', 'A → Z'], ['difficulty', 'Poziom ↑'], ['difficulty_desc', 'Poziom ↓'], ['status', 'Status (nowe najpierw)']], 'Sortowanie')),
      countEl, list, more);
    draw();
  }

  // ----- Ustawienia
  function renderSettings(view) {
    const fileInput = h('input', { type: 'file', accept: 'application/json,.json', class: 'hidden', onChange: importProgress });
    const learned = Object.keys(state.progress).length;
    const syncCard = h('div', { class: 'card', id: 'sync-card' });
    renderSyncCard(syncCard);
    view.replaceChildren(
      h('h1', null, 'Ustawienia'),
      h('div', { class: 'card' },
        h('h2', null, 'Ogólne'),
        h('div', { class: 'setting' },
          h('div', { class: 'txt' }, h('b', null, 'Motyw'), h('span', { class: 'muted small' }, 'Jasny, ciemny lub zgodny z systemem')),
          seg([['system', 'Systemowy'], ['light', '☀️ Jasny'], ['dark', '🌙 Ciemny']], state.settings.theme, (v) => { state.settings.theme = v; save(); applyTheme(); })),
        h('div', { class: 'setting' },
          h('div', { class: 'txt' }, h('b', null, 'Imię'), h('span', { class: 'muted small' }, 'Do powitania na panelu')),
          h('input', { type: 'text', value: state.settings.name, maxlength: '30', placeholder: 'np. Tymon', 'aria-label': 'Imię',
            onChange: (e) => { state.settings.name = e.target.value; save(); toast('Zapisano'); } })),
        h('div', { class: 'setting' },
          h('div', { class: 'txt' }, h('b', null, 'Nowe słowa dziennie'), h('span', { class: 'muted small' }, 'Ile nowych słów wprowadzają powtórki SRS')),
          h('select', { 'aria-label': 'Nowe słowa dziennie', value: String(state.settings.newPerDay), onChange: (e) => { state.settings.newPerDay = Number(e.target.value); save(); } },
            [5, 10, 15, 20, 30].map((n) => h('option', { value: String(n) }, String(n))))),
        h('div', { class: 'setting' },
          h('div', { class: 'txt' }, h('b', null, 'Długość szybkiej sesji'), h('span', { class: 'muted small' }, 'Liczba słów w jednej sesji')),
          h('select', { 'aria-label': 'Długość sesji', value: String(state.settings.sessionSize), onChange: (e) => { state.settings.sessionSize = Number(e.target.value); save(); } },
            [10, 12, 15].map((n) => h('option', { value: String(n) }, String(n)))))),
      syncCard,
      h('div', { class: 'card' },
        h('h2', null, 'Dane i postęp'),
        h('p', { class: 'muted small' }, `Postęp na tym urządzeniu: ${learned} ${plural(learned, 'słowo', 'słowa', 'słów')}. Plik eksportu to zapasowa kopia — do przenoszenia między urządzeniami służy synchronizacja.`),
        h('div', { class: 'row' },
          h('button', { class: 'btn btn-primary', onClick: exportProgress }, '⬇️ Eksportuj postęp'),
          h('button', { class: 'btn', onClick: () => fileInput.click() }, '⬆️ Importuj postęp'),
          fileInput,
          h('div', { class: 'spacer' }),
          h('button', { class: 'btn btn-danger', onClick: resetProgress }, 'Resetuj postęp'))),
      h('div', { class: 'card' },
        h('h2', null, 'O aplikacji'),
        h('p', { class: 'muted small' },
          `Słownik: ${VOCAB.length} wpisów${VOCAB_META.updated ? ` (aktualizacja ${VOCAB_META.updated})` : ''}. `,
          'Aplikacja działa offline po pierwszym uruchomieniu i można ją zainstalować na telefonie („Dodaj do ekranu głównego”).'),
        h('dl', { class: 'kv small' }, Object.entries(TYPES).map(([k, l]) => [h('dt', null, l), h('dd', null, String(VOCAB.filter((i) => i.type === k).length))]))));
  }

  function exportProgress() {
    const blob = new Blob([JSON.stringify({ app: 'academic-words', exported: new Date().toISOString(), state }, null, 1)], { type: 'application/json' });
    const a = h('a', { href: URL.createObjectURL(blob), download: `academic-words-postep-${today()}.json` });
    document.body.append(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    toast('Plik z postępem pobrany');
  }

  function importProgress(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const s = data.state || data;
        if (!s || typeof s.progress !== 'object') throw new Error('format');
        if (!confirm('Zaimportować postęp z pliku? Obecny postęp na tym urządzeniu zostanie zastąpiony.')) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
        state = loadState();
        lastSettingsFp = settingsFp();
        save();
        applyTheme();
        toast(`Zaimportowano postęp (${Object.keys(state.progress).length} słów)`);
        route();
      } catch (err) {
        toast('To nie jest poprawny plik z postępem.');
      }
    };
    reader.readAsText(file);
  }

  function resetProgress() {
    if (!confirm('Na pewno usunąć cały postęp nauki? Tej operacji nie można cofnąć (chyba że masz eksport).')) return;
    state.progress = {};
    state.daily = {};
    state.resetAt = Date.now(); // synchronizacja nie przywróci starszych wpisów z chmury
    save();
    toast('Postęp wyczyszczony');
    route();
  }

  // ===================================================================
  // Synchronizacja (Supabase): logowanie kodem z e-maila, jeden wiersz JSON na użytkownika.
  // localStorage pozostaje lokalną kopią — aplikacja działa offline, a zmiany wysyłamy w tle.
  // ===================================================================
  const CFG = window.AW_CONFIG || {};
  const sync = { client: null, user: null, status: 'off', error: '', lastSync: null, timer: null, busy: false, again: false, email: '' };

  // Łączy dwa stany: dla każdego słowa wygrywa nowszy wpis, dni nauki — większa liczba odpowiedzi.
  function mergeStates(local, remote) {
    const resetAt = Math.max(local.resetAt || 0, remote.resetAt || 0);
    const progress = {};
    for (const src of [local.progress || {}, remote.progress || {}]) {
      for (const [id, p] of Object.entries(src)) {
        if (!p || (resetAt && (p.ts || 0) < resetAt)) continue;
        const cur = progress[id];
        if (!cur || (p.ts || 0) > (cur.ts || 0) || ((p.ts || 0) === (cur.ts || 0) && p.attempts > cur.attempts)) progress[id] = p;
      }
    }
    const resetDay = resetAt ? dayStr(new Date(resetAt)) : '';
    const daily = {};
    for (const src of [local.daily || {}, remote.daily || {}]) {
      for (const [d, v] of Object.entries(src)) {
        if (d < resetDay) continue;
        const cur = daily[d] || { answers: 0, newItems: 0 };
        daily[d] = { answers: Math.max(cur.answers, v.answers || 0), newItems: Math.max(cur.newItems, v.newItems || 0) };
      }
    }
    const remoteNewer = (remote.settingsTs || 0) > (local.settingsTs || 0);
    const settings = remoteNewer ? { ...local.settings, ...remote.settings, theme: local.settings.theme } : local.settings;
    const custom = new Map();
    for (const it of [...(remote.customItems || []), ...(local.customItems || [])]) custom.set(it.id, it);
    return {
      ...local, progress, daily, settings, resetAt,
      settingsTs: Math.max(local.settingsTs || 0, remote.settingsTs || 0),
      customItems: [...custom.values()],
    };
  }

  function scheduleSync(delay = 8000) {
    if (!sync.user) return;
    sync.dirty = true;
    clearTimeout(sync.timer);
    sync.timer = setTimeout(() => syncNow(), delay);
  }

  async function syncNow(manual) {
    if (!sync.client || !sync.user) return;
    if (sync.busy) { sync.again = true; return; }
    if (!navigator.onLine) { sync.status = 'offline'; refreshSyncUi(); return; }
    clearTimeout(sync.timer);
    sync.busy = true;
    sync.status = 'syncing';
    refreshSyncUi();
    try {
      const { data, error } = await sync.client.from('progress').select('state').eq('user_id', sync.user.id).maybeSingle();
      if (error) throw error;
      const before = JSON.stringify(state.progress);
      if (data && data.state) {
        state = mergeStates(state, data.state);
        lastSettingsFp = settingsFp();
        saveLocal();
      }
      sync.dirty = false;
      const { error: upErr } = await sync.client.from('progress')
        .upsert({ user_id: sync.user.id, state, updated_at: new Date().toISOString() });
      if (upErr) throw upErr;
      sync.status = 'ok';
      sync.error = '';
      sync.lastSync = new Date();
      if (manual) toast('Zsynchronizowano ☁️');
      // odśwież widok, jeśli z chmury przyszły nowe dane (nie w trakcie sesji)
      if (JSON.stringify(state.progress) !== before && (currentRoute === 'dashboard' || currentRoute === 'browse')) route();
    } catch (e) {
      sync.status = 'error';
      sync.error = (e && e.message) || String(e);
      if (manual) toast('Błąd synchronizacji: ' + sync.error);
    } finally {
      sync.busy = false;
      refreshSyncUi();
      if (sync.again) { sync.again = false; syncNow(); }
    }
  }

  async function initSync() {
    if (!CFG.supabaseUrl || !CFG.supabaseAnonKey) { sync.status = 'off'; return; }
    if (!window.supabase) { sync.status = 'unavailable'; refreshSyncUi(); return; }
    sync.client = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce', storageKey: 'awv:auth' },
    });
    sync.client.auth.onAuthStateChange((event, session) => {
      const prev = sync.user && sync.user.id;
      sync.user = session ? session.user : null;
      sync.status = sync.user ? (sync.status === 'off' || sync.status === 'loggedout' ? 'ok' : sync.status) : 'loggedout';
      // wywołania Supabase poza callbackiem (zalecenie biblioteki)
      if (sync.user && sync.user.id !== prev) setTimeout(() => syncNow(), 0);
      refreshSyncUi();
      if (currentRoute === 'dashboard') route();
    });
    await sync.client.auth.getSession();
    // posprzątaj adres po kliknięciu linku z e-maila (?code=… / ?error=…)
    const qs = new URLSearchParams(location.search);
    if (qs.has('code') || qs.has('error')) {
      if (qs.get('error_description')) toast('Logowanie nieudane: ' + qs.get('error_description'));
      history.replaceState(null, '', location.pathname + location.hash);
    }
    window.addEventListener('online', () => sync.dirty && syncNow());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && sync.dirty) syncNow();
      if (document.visibilityState === 'visible') syncNow(); // nauka mogła się odbyć na innym urządzeniu
    });
  }

  function refreshSyncUi() {
    const card = document.getElementById('sync-card');
    if (card) renderSyncCard(card);
  }

  function syncStatusText() {
    switch (sync.status) {
      case 'syncing': return '⏳ Synchronizuję…';
      case 'offline': return '📴 Brak internetu — zsynchronizuję po połączeniu.';
      case 'error': return '⚠️ Błąd: ' + sync.error;
      default: return sync.lastSync
        ? `✅ Ostatnia synchronizacja: ${sync.lastSync.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`
        : '✅ Połączono';
    }
  }

  function renderSyncCard(card) {
    const title = h('h2', null, '☁️ Synchronizacja');
    if (!CFG.supabaseUrl || !CFG.supabaseAnonKey) {
      card.replaceChildren(title, h('p', { class: 'muted small' }, 'Synchronizacja nie jest jeszcze skonfigurowana (brak klucza Supabase w config.js). Postęp zapisuje się tylko na tym urządzeniu.'));
      return;
    }
    if (!sync.client) {
      card.replaceChildren(title, h('p', { class: 'muted small' }, 'Nie udało się wczytać modułu synchronizacji — sprawdź połączenie z internetem i odśwież stronę.'));
      return;
    }
    if (sync.user) {
      card.replaceChildren(title,
        h('p', null, 'Zalogowano jako ', h('b', null, sync.user.email || '—')),
        h('p', { class: 'muted small' }, syncStatusText()),
        h('p', { class: 'muted small' }, 'Postęp zapisuje się automatycznie po każdej odpowiedzi i łączy z innymi urządzeniami zalogowanymi na ten sam e-mail.'),
        h('div', { class: 'row' },
          h('button', { class: 'btn btn-primary', disabled: sync.busy, onClick: () => syncNow(true) }, '🔄 Synchronizuj teraz'),
          h('div', { class: 'spacer' }),
          h('button', { class: 'btn btn-ghost', onClick: async () => {
            if (sync.dirty) await syncNow();
            await sync.client.auth.signOut();
            toast('Wylogowano — postęp zostaje na tym urządzeniu');
          } }, 'Wyloguj')));
      return;
    }

    const msg = h('div', { class: 'muted small', style: 'min-height:1.5em' });
    const fail = (e) => { msg.textContent = '⚠️ ' + ((e && e.message) || e); };
    if (!sync.email) {
      const email = h('input', { type: 'text', inputmode: 'email', autocomplete: 'email', placeholder: 'adres e-mail', 'aria-label': 'Adres e-mail' });
      const send = async () => {
        const v = email.value.trim();
        if (!/^\S+@\S+\.\S+$/.test(v)) { fail('Podaj poprawny adres e-mail.'); return; }
        msg.textContent = 'Wysyłam kod…';
        const { error } = await sync.client.auth.signInWithOtp({ email: v, options: { shouldCreateUser: true, emailRedirectTo: location.origin + location.pathname } });
        if (error) { fail(error.message); return; }
        sync.email = v;
        renderSyncCard(card);
      };
      email.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
      card.replaceChildren(title,
        h('p', { class: 'muted small' }, 'Zaloguj się tym samym e-mailem na telefonie i komputerze — postęp będzie wspólny. Bez hasła: dostaniesz kod w mailu.'),
        h('div', { class: 'field' }, email),
        h('button', { class: 'btn btn-primary', onClick: send }, 'Wyślij kod'),
        msg);
      return;
    }

    const code = h('input', { type: 'text', inputmode: 'numeric', autocomplete: 'one-time-code', maxlength: '10', placeholder: 'kod z e-maila', 'aria-label': 'Kod z e-maila', class: 'answer' });
    const verify = async () => {
      const token = code.value.replace(/\s/g, '');
      if (!/^\d{6,10}$/.test(token)) { fail('Wpisz kod z e-maila (same cyfry).'); return; }
      msg.textContent = 'Sprawdzam…';
      const { error } = await sync.client.auth.verifyOtp({ email: sync.email, token, type: 'email' });
      if (error) { fail(error.message); return; }
      sync.email = '';
      toast('Zalogowano — synchronizuję postęp ☁️');
    };
    code.addEventListener('keydown', (e) => { if (e.key === 'Enter') verify(); });
    card.replaceChildren(title,
      h('p', { class: 'small' }, 'Wysłaliśmy kod na ', h('b', null, sync.email), '. Wpisz go poniżej (albo kliknij link w mailu na tym urządzeniu).'),
      h('div', { class: 'field' }, code),
      h('div', { class: 'row' },
        h('button', { class: 'btn btn-primary', onClick: verify }, 'Zaloguj'),
        h('button', { class: 'btn btn-ghost', onClick: () => { sync.email = ''; renderSyncCard(card); } }, 'Zmień e-mail')),
      msg);
    setTimeout(() => code.focus(), 30);
  }

  // ===================================================================
  // Router i start
  // ===================================================================
  let currentRoute = '';
  const ROUTES = { dashboard: renderDashboard, learn: renderLearn, browse: renderBrowse, settings: renderSettings, session: renderSessionView, summary: renderSummary };
  const NAV_FOR = { session: 'learn', summary: 'learn' };

  function route() {
    const name = (location.hash.replace(/^#\/?/, '') || 'dashboard').split('?')[0];
    const key = ROUTES[name] ? name : 'dashboard';
    currentRoute = key;
    const view = document.getElementById('view');
    keyHandler = null;
    hideFeedback();
    view.classList.remove('flash-ok', 'flash-bad');
    document.body.classList.toggle('in-session', key === 'session');
    document.querySelectorAll('.nav a').forEach((a) => a.classList.toggle('active', a.dataset.route === (NAV_FOR[key] || key)));
    ROUTES[key](view);
    window.scrollTo(0, 0);
  }

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (feedbackContinue) {
      if ((e.key === 'Enter' || e.key === ' ') && Date.now() - feedbackAt > 250) { e.preventDefault(); feedbackContinue(); }
      return;
    }
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (keyHandler) keyHandler(e);
  });

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

  async function boot() {
    applyTheme();
    try {
      await loadVocab();
    } catch (e) {
      document.getElementById('view').replaceChildren(h('div', { class: 'card' },
        h('h2', null, 'Nie udało się wczytać słownictwa'),
        h('p', null, 'Sprawdź połączenie z internetem i odśwież stronę. Jeśli otwierasz plik lokalnie, uruchom prosty serwer (np. python -m http.server).'),
        h('p', { class: 'muted small' }, String(e))));
      return;
    }
    window.addEventListener('hashchange', route);
    route();
    initSync().catch((e) => { sync.status = 'error'; sync.error = String(e); refreshSyncUi(); });
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  boot();
})();
