# Academic Words

Aplikacja do nauki formalnego słownictwa do **Academic Writing** (IB Pre-DP), w stylu Duolingo.
Statyczna strona (HTML + CSS + vanilla JS), bez backendu i bez build stepu. Postęp zapisuje się w `localStorage`. Działa offline i można ją zainstalować na telefonie (PWA).

## Co jest w środku

| Plik | Rola |
|---|---|
| `index.html` | szkielet strony |
| `style.css` | wygląd (jasny/ciemny motyw, mobile-first) |
| `app.js` | cała logika: ćwiczenia, powtórki SM-2, widoki |
| `ai-import.js` | import z czatu AI: prompt do skopiowania i parser odpowiedzi (`window.AW_AI`) |
| `vocabulary.json` | słownictwo (704 wpisy) |
| `manifest.json`, `sw.js`, `icons/` | PWA: instalacja i tryb offline |

**Starter pack (`vocabulary.json`):**
- 36 zamian informal → formal (handout „Academic Style”: wyrażenia, phrasal verbs, łączniki)
- 41 czasowników akademickich w 4 funkcjach (claim / agreement / disagreement / recommendation)
- 7 reguł stylu, 12 przykładów hedgingu (4 techniki)
- 570 słów z Academic Word List (grupy 1–10), wszystkie z polskim tłumaczeniem i zdaniem przykładowym

**Tryby nauki:** fiszki (ze swipe), quiz (4 odpowiedzi), wpisywanie (tolerancja literówek), dopasowywanie par, uzupełnianie luk.
**Sesje:** szybka (10–15 słów, mix ćwiczeń) albo inteligentne powtórki (algorytm SM-2 + limit nowych słów dziennie).

## Uruchomienie lokalnie

Przeglądarka nie wczyta `vocabulary.json` z pliku otwartego bezpośrednio (`file://`), potrzebny jest prosty serwer:

```bash
python -m http.server 8765
```

Potem otwórz http://localhost:8765.

## Publikacja (GitHub Pages)

Aplikacja: **https://kalomsconsulting-lab.github.io/academic-words/**
Repozytorium: https://github.com/kalomsconsulting-lab/academic-words (Pages: gałąź `main`, folder `/ (root)`).

Każdy `git push` na `main` publikuje nową wersję po 1–2 minutach. Zainstalowana aplikacja pobierze ją przy następnym uruchomieniu z internetem.

```bash
git push
```

**Instalacja na telefonie:** otwórz adres w Chrome (Android) → menu → *Zainstaluj aplikację* / *Dodaj do ekranu głównego*. Na iPhonie: Safari → *Udostępnij* → *Do ekranu początkowego*.

## Dodawanie nowego słownictwa

Są dwie drogi:

- **W aplikacji** (bez edytowania plików i bez pusha): *Ustawienia → Moje materiały* albo *Panel → Dodaj własne materiały*. Słowa trafiają do Twojego postępu i synchronizują się między urządzeniami.
- **Przez `vocabulary.json`**: słowa trafiają do wszystkich użytkowników aplikacji.

### W aplikacji (własne materiały)

Cztery sposoby dodawania:

1. **Z czatu AI (Copilot), polecane**:
   1. *Skopiuj prompt i otwórz Copilota*: prompt trafia do schowka, a Copilot otwiera się w nowej karcie. Gdy schowek jest niedostępny, prompt pojawia się zaznaczony w polu tekstowym (*Pokaż prompt*) do ręcznego skopiowania.
   2. W czacie wklej prompt i dołącz handout (zdjęcie, PDF, Word albo tekst).
   3. Skopiuj całą odpowiedź czatu i wklej ją w pole *Wklej odpowiedź czatu* (albo przyciskiem *Wklej ze schowka*). Parser (`AW_AI.parseReply`) sam wyłuska JSON z tekstu i bloków kodu, naprawi „inteligentne” cudzysłowy i końcowe przecinki, a błędne lub ucięte wpisy pokaże w podglądzie.

   Gdy czat odpowie „CIĄG DALSZY”, poproś o resztę i kliknij *Dodaj kolejną część*: kolejne wklejenia dopisują wpisy do bieżącego podglądu (z wykrywaniem duplikatów między częściami), zamiast go zastępować. Prompt działa też w ChatGPT czy Claude.
2. **Plik JSON**: tablica wpisów albo obiekt `{ "items": [...] }` w formacie z sekcji niżej. Pola `id` nie trzeba podawać. Brak `category` oznacza kategorię domyślną dla typu.
3. **Wklejony tekst**: jeden wpis w linii, kolumny oddzielone `;` lub tabulatorem (wklejka z Excela działa). Typ i kategorię wybiera się z listy, domyślnie *Słowo AWL*:
   | Typ | Kolumny |
   |---|---|
   | `awl_word` | słowo ; po polsku ; zdanie przykładowe |
   | `academic_verb` | czasownik ; po polsku ; funkcja ; zdanie przykładowe |
   | `replacement` | nieformalnie ; formalnie (kilka przez `/`) ; po polsku ; przykład formalny |
   | `hedging` | zdanie zbyt pewne ; wersja ostrożna ; technika ; opis |
   | `style_rule` | reguła ; błędnie ; poprawnie |

   Kilka tłumaczeń oddziela się przecinkiem. Linie puste i zaczynające się od `#` są pomijane.
4. **Formularz** do pojedynczego słowa, z polami zależnymi od typu.

Każdy import kończy się **podglądem**: wpisy z błędami (brak wymaganego pola, nieznany typ, kategoria, funkcja lub technika) są zablokowane, a duplikaty (to samo słowo już jest w słowniku, we własnych materiałach albo dwa razy w imporcie) są domyślnie odznaczone. Dopiero przycisk *Dodaj* zapisuje zaznaczone wpisy.

Szczegóły techniczne:
- Wpisy trafiają do `state.customItems` z `id` `c-<znacznik czasu>-<nr>`, polem `source` (nazwa pliku, nazwa paczki albo „ręcznie”) i `addedAt`. Przechodzą tę samą walidację co `vocabulary.json` (`itemErrors()` / `prepareItem()` w `app.js`).
- Nowe słowa od razu są w słowniku, sesjach i statystykach kategorii. Powtórki SRS wprowadzają je jako *nowe* przed resztą słownika (w ramach dziennego limitu nowych słów). Filtr *⭐ Moje materiały* jest w Nauce, Słowniku i na Panelu.
- *Moje materiały* grupują wpisy według źródła. Można usunąć pojedynczy wpis albo całą paczkę. Usunięcie kasuje też postęp tych słów i zapisuje id w `state.deletedCustom` (tombstones), więc synchronizacja nie przywróci ich z innego urządzenia.

### Przez vocabulary.json

1. Wrzuć handout (.doc/.docx lub zdjęcie) do Claude z prośbą: *„Wyciągnij słownictwo do vocabulary.json w formacie appki Academic Words”* i dołącz przykładowy wpis z sekcji niżej.
2. Dopisz nowe wpisy na końcu tablicy `items` w `vocabulary.json`. Każdy `id` musi być unikalny (np. kolejny `r037`, `av042`, `awl571`, `sr008`, `h013`).
3. Zmień pole `updated` na dzisiejszą datę, zrób commit i push — GitHub Pages odświeży stronę, a nowe słowa pojawią się w aplikacji (postęp nauki zostaje).

### Format wpisów

Wspólne pola: `id`, `type`, `category`, `difficulty` (1–3).
Kategorie: `phrasal_verbs`, `informal_phrases`, `academic_verbs`, `connectors`, `hedging`, `awl`, `style_rules`, `noun_phrases`.

```json
{ "id": "r001", "type": "replacement", "informal": "find out",
  "formal": ["investigate", "determine"], "polish": ["zbadać", "ustalić"],
  "example_informal": "We need to find out what happened.",
  "example_formal": "Further research is needed to determine the cause.",
  "category": "phrasal_verbs", "difficulty": 1 }

{ "id": "av001", "type": "academic_verb", "word": "advocate", "polish": ["popierać"],
  "function": "recommendation", "example": "Several researchers advocate a more cautious approach.",
  "category": "academic_verbs", "difficulty": 2 }

{ "id": "awl001", "type": "awl_word", "word": "significant", "polish": ["istotny"],
  "example": "The results were statistically significant.", "awl_group": 1,
  "category": "awl", "difficulty": 1 }

{ "id": "sr001", "type": "style_rule", "rule": "Nie dziel bezokoliczników",
  "incorrect": "I was told to always keep a good look out.",
  "correct": "I was always told to keep a good look out.",
  "category": "style_rules", "difficulty": 2 }

{ "id": "h001", "type": "hedging", "informal": "This proves that…", "formal": "This may indicate that…",
  "technique": "modal_verbs", "polish": "Czasowniki modalne",
  "category": "hedging", "difficulty": 1 }
```

Wskazówki:
- `function` czasownika: `claim`, `agreement`, `disagreement`, `recommendation`.
- `technique` hedgingu: `removing_questions`, `modal_verbs`, `adverbs`, `impersonal_constructions`, `tentative_verbs` (seem, appear, tend, suggest), `probability` (likely, possible).
- Ćwiczenie „luki” działa, gdy zdanie przykładowe (`example_formal` / `example`) zawiera jedno z formalnych wyrażeń lub słowo (także w odmianie, np. *analyse → analysed*).
- Słowa bez polskiego tłumaczenia pojawiają się tylko jako fiszki.

## Synchronizacja między urządzeniami (Supabase)

Postęp jest zapisywany lokalnie i w tle synchronizowany z Supabase (projekt `academic-words`). Logowanie odbywa się bez hasła, kodem z e-maila. Na każdym urządzeniu loguje się ten sam e-mail: *Ustawienia → Synchronizacja*.

Konfiguracja jednorazowa w panelu Supabase:

1. **Tabela:** *SQL Editor → New query* → wklej [`supabase/schema.sql`](supabase/schema.sql) → *Run*.
2. **Kod w mailu:** *Authentication → Emails* → szablony **Magic Link** i **Confirm signup**: dodaj do treści kod, np.
   ```html
   <h2>Academic Words</h2>
   <p>Twój kod logowania: <strong>{{ .Token }}</strong></p>
   ```
3. **Adres strony:** *Authentication → URL Configuration* → *Site URL* = `https://kalomsconsulting-lab.github.io/academic-words/`; ten sam adres dodaj w *Redirect URLs* (oraz `http://localhost:8765` do testów).
4. *(opcjonalnie)* Gdy wszyscy już się zalogują: *Authentication → Sign In / Providers* → wyłącz *Allow new users to sign up*.

Adres projektu i klucz `publishable` są w [`config.js`](config.js). Klucz jest publiczny z założenia, a dane chronią reguły RLS (każdy widzi tylko swój wiersz). Pusty klucz oznacza, że aplikacja działa wyłącznie lokalnie.

Warto wiedzieć:
- Wbudowany serwer pocztowy Supabase wysyła tylko kilka maili na godzinę, więc przy testach nie prosi się o kod co chwilę.
- Darmowy projekt jest wstrzymywany po ok. tygodniu bez ruchu. Aplikacja działa wtedy dalej lokalnie, a projekt wznawia się przyciskiem *Restore* w panelu Supabase.
- Łączenie danych: dla każdego słowa wygrywa nowszy wpis, więc nauka na dwóch urządzeniach się nie nadpisuje. *Resetuj postęp* czyści też dane w chmurze.
- Własne materiały są sumowane z obu urządzeń, a usunięte (tombstones w `deletedCustom`) wygrywają z kopią z drugiego urządzenia.

## Postęp i dane

- **Status słowa** liczony z 10 ostatnich odpowiedzi: < 60% poprawnych = *nowe*, 60–90% = *w nauce*, > 90% (min. 3 odpowiedzi) = *opanowane*.
- **Przeniesienie na inne urządzenie:** synchronizacja (wyżej). Eksport i import pliku JSON zostają jako zapasowa kopia.

## Rozbudowa (pomysły)

Architektura jest przygotowana pod: edycję własnych wpisów, nowe typy ćwiczeń (rejestr `RENDERERS` w `app.js`), wymowę (Web Speech API), import .docx i OCR.
