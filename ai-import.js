/* Academic Words — import materiałów przez zewnętrzny czat AI (Copilot, ChatGPT, Claude…).
 * Samodzielny moduł bez zależności: prompt do skopiowania + tolerancyjny parser odpowiedzi.
 * Użycie w aplikacji: window.AW_AI.prompt, window.AW_AI.copilotUrl, window.AW_AI.parseReply(text). */
'use strict';
(function (root) {

  const COPILOT_URL = 'https://copilot.microsoft.com/';

  // Kategorie i typy muszą zgadzać się z CATEGORIES / prepareItem() w app.js.
  const PROMPT = `Wyciągnij z załączonego materiału słownictwo do nauki i zwróć je jako JSON w bloku kodu.

Format: tablica obiektów. Użyj tych typów:

1. Pojedyncze słowo akademickie:
{ "type": "awl_word", "word": "significant", "polish": ["istotny"], "example": "The results were statistically significant.", "category": "awl", "difficulty": 1 }

2. Zamiana wyrażenia potocznego na formalne (także łączniki i phrasal verbs):
{ "type": "replacement", "informal": "find out", "formal": ["investigate", "determine"], "polish": ["zbadać", "ustalić"], "example_informal": "We need to find out what happened.", "example_formal": "Further research is needed to determine the cause.", "category": "phrasal_verbs", "difficulty": 1 }

3. Czasownik akademicki:
{ "type": "academic_verb", "word": "advocate", "polish": ["popierać"], "function": "recommendation", "example": "Several researchers advocate a more cautious approach.", "category": "academic_verbs", "difficulty": 2 }

Zasady:
- Dozwolone kategorie: phrasal_verbs, informal_phrases, academic_verbs, connectors, hedging, awl, style_rules, noun_phrases.
- "function" tylko: claim, agreement, disagreement, recommendation.
- "difficulty": 1 (łatwe), 2 (średnie), 3 (trudne).
- Każde słowo musi mieć polskie tłumaczenie i jedno zdanie przykładowe po angielsku, które zawiera to słowo.
- Nie dodawaj pola "id".
- Używaj zwykłych cudzysłowów ", bez przecinka po ostatnim elemencie.
- Jeśli wpisów jest więcej niż 25, zwróć pierwsze 25 i napisz "CIĄG DALSZY", a resztę podaj, gdy poproszę.`;

  // -------------------------------------------------------------------
  // Parser odpowiedzi
  // -------------------------------------------------------------------
  // Przyjmuje całą skopiowaną odpowiedź czatu: tekst przed/po, bloki ```json, kilka bloków naraz
  // (kolejne części „CIĄG DALSZY”), ucięty koniec, przecinki na końcu, „inteligentne” cudzysłowy.
  // Zwraca { items: [...], errors: ['…'] } — błędny wpis nie blokuje pozostałych.

  function codeBlocks(text) {
    const blocks = [];
    const re = /```[a-zA-Z]*\s*\n?([\s\S]*?)```/g;
    let m;
    while ((m = re.exec(text))) blocks.push(m[1]);
    // Niezamknięty ostatni blok (odpowiedź ucięta w połowie).
    const opens = (text.match(/```/g) || []).length;
    if (opens % 2 === 1) blocks.push(text.slice(text.lastIndexOf('```') + 3).replace(/^[a-zA-Z]*\s*\n?/, ''));
    return blocks.length ? blocks : [text];
  }

  function repair(src) {
    return src
      .replace(/[“”„‟″]/g, '"')   // “ ” „ jako ograniczniki stringów
      .replace(/,\s*([}\]])/g, '$1');                        // przecinek przed } lub ]
  }

  function tryParse(src) {
    try { return { ok: true, value: JSON.parse(src) }; } catch (e) { /* dalej */ }
    try { return { ok: true, value: JSON.parse(repair(src)) }; } catch (e) { return { ok: false, error: e.message }; }
  }

  function flatten(value, out) {
    if (Array.isArray(value)) { for (const v of value) flatten(v, out); return; }
    if (value && typeof value === 'object') {
      if (Array.isArray(value.items)) flatten(value.items, out);
      else out.push(value);
    }
  }

  // Wycina z tekstu obiekty najwyższego poziomu (lub elementy tablicy najwyższego poziomu),
  // z uwzględnieniem stringów — działa też, gdy całość nie jest poprawnym JSON-em.
  function scanObjects(text) {
    const objs = [];
    const stack = [];
    let inStr = false, esc = false, start = -1;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inStr) {
        if (esc) esc = false;
        else if (c === '\\') esc = true;
        else if (c === '"' || c === '”') inStr = false;
        continue;
      }
      if (c === '"' || c === '“' || c === '„') { if (stack.length) inStr = true; continue; }
      if (c === '{' || c === '[') {
        if (c === '{' && (stack.length === 0 || (stack.length === 1 && stack[0] === '['))) start = i;
        stack.push(c);
      } else if (c === '}' || c === ']') {
        if (!stack.length) continue;
        stack.pop();
        if (c === '}' && start >= 0 && (stack.length === 0 || (stack.length === 1 && stack[0] === '['))) {
          objs.push(text.slice(start, i + 1));
          start = -1;
        }
      }
    }
    return { objs, truncated: stack.length > 0 && start >= 0 };
  }

  function parseReply(text) {
    const items = [];
    const errors = [];
    if (!text || !String(text).trim()) return { items, errors: ['Pusty tekst.'] };

    for (const block of codeBlocks(String(text))) {
      const trimmed = block.trim();
      if (!trimmed) continue;
      const first = trimmed.search(/[[{]/);
      const whole = first >= 0 ? tryParse(trimmed.slice(first, Math.max(trimmed.lastIndexOf(']'), trimmed.lastIndexOf('}')) + 1)) : null;
      if (whole && whole.ok) { flatten(whole.value, items); continue; }

      // Całość nie parsuje się — ratujemy wpis po wpisie.
      const { objs, truncated } = scanObjects(trimmed);
      objs.forEach((src, n) => {
        const r = tryParse(src);
        if (r.ok) flatten(r.value, items);
        else errors.push(`Wpis ${n + 1}: niepoprawny JSON (${src.slice(0, 40).replace(/\s+/g, ' ')}…)`);
      });
      if (truncated) errors.push('Ostatni wpis jest ucięty — poproś czat o dokończenie („CIĄG DALSZY”).');
      if (!objs.length && !truncated) errors.push('Nie znaleziono wpisów w formacie JSON.');
    }
    return { items, errors };
  }

  const api = { prompt: PROMPT, copilotUrl: COPILOT_URL, parseReply };
  root.AW_AI = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
