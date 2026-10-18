# Study Cards

Aplikacja do nauki z fiszek i powtórek SRS, w stylu Duolingo. Przedmioty: **Academic English** (formalne słownictwo do Academic Writing, IB Pre-DP) i **Biology**; kolejne dodaje się w kodzie (sekcja *Przedmioty*).
Dawniej *Academic Words*; adres strony i repozytorium zostały bez zmian, żeby zainstalowane aplikacje działały dalej.
Statyczna strona (HTML + CSS + vanilla JS), bez backendu i bez build stepu. Postęp zapisuje się w `localStorage`. Działa offline i można ją zainstalować na telefonie (PWA).

## Co jest w środku

| Plik | Rola |
|---|---|
| `index.html` | szkielet strony |
| `style.css` | wygląd (jasny/ciemny motyw, mobile-first) |
| `app.js` | cała logika: ćwiczenia, powtórki SM-2, widoki |
| `ai-import.js` | import z czatu AI: prompt do skopiowania i parser odpowiedzi (`window.AW_AI`) |
| `vocabulary.json` | słownictwo Academic English (704 wpisy) |
| `data/biology.json` | karty bazowe z biologii IB (132: pytania i zdania z luką, 109 z numerem `pp`) |
| `data/angielski-7.json`, `data/biologia-7.json` | karty bazowe dla 7 klasy (113 słówek, 102 karty z biologii po polsku; większość z `pp`) |
| `data/*-7.json` (matematyka, chemia, fizyka, polski, historia, geografia, informatyka, niemiecki, edukacja-zdrowotna) | karty bazowe 7 klasy z podstawy programowej (znaczek 📘, pole `pp`), ok. 90–125 na przedmiot |
| `data/chemistry.json`, `physics.json`, `mathematics.json`, `history.json`, `historia-polski.json`, `geography.json`, `polski.json`, `edukacja-obywatelska.json`, `computer-science.json`, `english.json`, `psychology.json`, `german.json` | karty bazowe IB Pre-DP 1 z podstawy programowej liceum (klasa 1) i przewodników IB, ok. 85–120 na przedmiot |
| `manifest.json`, `sw.js`, `icons/` | PWA: instalacja i tryb offline |

**Starter pack (`vocabulary.json`):**
- 36 zamian informal → formal (handout „Academic Style”: wyrażenia, phrasal verbs, łączniki)
- 41 czasowników akademickich w 4 funkcjach (claim / agreement / disagreement / recommendation)
- 7 reguł stylu, 12 przykładów hedgingu (4 techniki)
- 570 słów z Academic Word List (grupy 1–10), wszystkie z polskim tłumaczeniem i zdaniem przykładowym

**Tryby nauki:** fiszki (ze swipe), quiz (4 odpowiedzi), wpisywanie (tolerancja literówek), dopasowywanie par, uzupełnianie luk.
**Sesje:** szybka (10–15 słów, mix ćwiczeń) albo inteligentne powtórki (algorytm SM-2 + limit nowych słów dziennie).

## Przedmioty

Przedmioty są pogrupowane w **ścieżki** (`LEVELS` w `app.js`), a konto widzi tylko przedmioty swojej ścieżki:

| Ścieżka | Przedmioty |
|---|---|
| IB Pre-DP (`ib`) | Academic English, Biology, English, Mathematics, Chemistry, Physics, History, Geography, Computer Science, Psychology (karty po angielsku); History of Poland, Polish, Edukacja obywatelska (po polsku); German B (słówka DE↔PL) |
| 7 klasa szkoły podstawowej (`sp7`) | Angielski (słówka EN↔PL), Niemiecki (słówka DE↔PL), Biologia, Matematyka, Polski, Chemia, Fizyka, Historia, Geografia, Informatyka, Edukacja zdrowotna (karty po polsku) |

Lista przedmiotów pochodzi z planów lekcji (Pre-DP1 R w 2. SLO STO i 7B w SP 112, rok 2026/27). Pominięte są przedmioty bez treści do zapamiętania: WF, basen, godzina wychowawcza / Homeroom, religia, etyka, muzyka, plastyka, dziedzictwo kulturowe, Art. Electives idą trymestrami: teraz Psychology, a Philosophy (`philosophy_ib`) i Business & Management (`business_ib`) mają gotowe działy i trzeba je tylko dopisać do `LEVELS.ib.subjects`, gdy się zaczną. Każdy przedmiot ma własne działy (`CATEGORIES` z polem `subject`). Karty bazowe (plik w `data/`) mają wszystkie przedmioty z planów lekcji (łącznie ok. 2500 kart z podstaw programowych); tylko electives Philosophy i Business & Management nie mają pola `file` i zapełniłyby się z importu AI i wspólnych materiałów.

Nowe konto przy pierwszym uruchomieniu wybiera ścieżkę (można ją zmienić w *Ustawieniach*). Ścieżka zapisuje się w `settings.level` i synchronizuje z kontem. Stan sprzed wprowadzenia ścieżek, który ma już postęp, jest automatycznie przypisany do IB. Prompt czatu AI dostaje poziom ucznia i język kart z przedmiotu (`lang`), a przedmiot językowy (`vocab: true`) dostaje prompt na słówka.

Menu boczne (na komputerze) ma listę przedmiotów z liczbą kart do zrobienia dziś, a pod nią sekcję wybranego przedmiotu: *Dziś*, *Własna sesja*, *Karty*, *Dodaj materiały*; *Ustawienia* są na dole. Na telefonie przedmiot zmienia się przyciskiem w górnym pasku, a dolny pasek ma te same pozycje. Panel *Dziś* przypomina o kartach czekających w innych przedmiotach.

- Każdy przedmiot ma własne kategorie, statystyki i dzienny limit nowych kart (ustawienie *Nowe słowa dziennie* działa osobno w każdym przedmiocie). Powtórki SRS i sesje biorą karty tylko z wybranego przedmiotu.
- Rejestr przedmiotów to `SUBJECTS` w `app.js` (plik z kartami bazowymi, dozwolone typy, domyślna kategoria). Kategorie przedmiotu to wpisy w `CATEGORIES` z polem `subject` (Academic English ich nie podaje, to przedmiot domyślny).
- Nowy przedmiot: dopisz go do `SUBJECTS`, dodaj jego kategorie do `CATEGORIES` (klucze z prefiksem, np. `chem_…`), utwórz plik `data/<przedmiot>.json` i dodaj go do listy `ASSETS` w `sw.js` (z podbiciem wersji cache). Prompt czatu AI zbuduje się sam z nazwy i kategorii; przykładowe karty dla promptu można dopisać w `EXAMPLES` w `ai-import.js`.
- Wpisy bez pola `subject` należą do przedmiotu wynikającego z kategorii, a bez kategorii do Academic English, więc dotychczasowe słownictwo i postęp działają bez migracji.

**Kategorie Biology (IB):** `bio_cells` (Cells), `bio_molecules` (Molecules & metabolism), `bio_genetics` (Genetics & evolution), `bio_human` (Human physiology), `bio_plants` (Plants), `bio_ecology` (Ecology), `bio_skills` (Skills & experiments), `bio_general` (Other, domyślna).

**Kategorie Angielskiego (7 klasa):** tematy z podstawy programowej z prefiksem `en7_` (`people`, `home`, `school`, `work`, `family`, `food`, `shopping`, `travel`, `culture`, `sport`, `health`, `science`, `nature`, `society`, `other`). Typ `awl_word` wyświetla się tu jako *Słówko*. Gramatyka ma osobną kategorię na każde zagadnienie, żeby dało się zawęzić sesję do jednego tematu: `en7_reported` (*Mowa zależna*, karty `en7-rs-001`…, zakres i źródła w [docs/reported-speech.md](docs/reported-speech.md), ściąga w [docs/reported-speech-sciaga.md](docs/reported-speech-sciaga.md)); kolejne tematy dostają własne kategorie `en7_<temat>` i prefiksy `id`.

**Kategorie Biologii (7 klasa):** działy z prefiksem `bio7_` (`body`, `skin`, `movement`, `digestion`, `circulation`, `immune`, `breathing`, `excretion`, `nervous`, `senses`, `hormones`, `reproduction`, `health`, `other`).

**Karty z podstawy programowej:** karty bazowe wygenerowane z oficjalnej podstawy programowej mają `"source": "Podstawa programowa"` i `"pp"` z numerem wymagania (np. `"VIII.7"`; dla treści z przewodnika IB np. `"IB A2.1"`). W aplikacji dostają znaczek **📘 Podstawa programowa** (numer wymagania w podpowiedzi) i własny filtr 📘 na panelu *Dziś*, we *Własnej sesji* i w *Kartach*. Poza tym zachowują się jak zwykłe karty bazowe: nie liczą się do *Dodanych materiałów* i nie da się ich usunąć. Identyfikatory: `<przedmiot>-pp-<nr>`, np. `mat7-pp-001`. Źródła, mapowanie wymagań na działy i liczby kart są w [docs/podstawa-programowa.md](docs/podstawa-programowa.md).

**Polskie znaki w odpowiedziach:** odpowiedź wpisana bez polskich liter (np. „zoladek” zamiast „żołądek”) jest zaliczana z przypomnieniem; wyszukiwanie też ich nie wymaga.

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

- **W aplikacji** (bez edytowania plików i bez pusha): *Dodaj materiały* w menu. Przed zapisem wybierasz, dla kogo są karty:
  - **🔒 Tylko dla mnie**: trafiają do Twojego konta i synchronizują się między Twoimi urządzeniami;
  - **👥 Dla wszystkich**: widzą je wszyscy zalogowani użytkownicy aplikacji (w swoich ścieżkach nauki). Wymaga zalogowania i jednorazowego założenia tabeli [`supabase/shared.sql`](supabase/shared.sql) (sekcja *Wspólne materiały* niżej).
- **Przez `vocabulary.json`** (i pliki w `data/`): karty wbudowane w aplikację, dla wszystkich, zmiana wymaga pusha.

### W aplikacji (własne materiały)

Na górze widoku wybiera się przedmiot, do którego trafią karty. Cztery sposoby dodawania:

1. **Z czatu AI (Copilot), polecane**:
   1. *Skopiuj prompt i otwórz Copilota*: prompt zależy od wybranego przedmiotu (dla Academic English wyciąga słownictwo, dla pozostałych przygotowuje pytania i zdania z luką). Prompt trafia do schowka, a Copilot otwiera się w nowej karcie. Gdy schowek jest niedostępny, prompt pojawia się zaznaczony w polu tekstowym (*Pokaż prompt*) do ręcznego skopiowania.
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
   | `qa` | pytanie ; odpowiedź ; wyjaśnienie |
   | `cloze` | zdanie z `{{luką}}` ; podpowiedź ; wyjaśnienie |

   Kilka tłumaczeń oddziela się przecinkiem. Linie puste i zaczynające się od `#` są pomijane.
4. **Formularz** do pojedynczego słowa, z polami zależnymi od typu.

Każdy import kończy się **podglądem**: wpisy z błędami (brak wymaganego pola, nieznany typ, kategoria, funkcja lub technika) są zablokowane, a duplikaty (to samo słowo już jest w kartach, we własnych lub wspólnych materiałach albo dwa razy w imporcie) są domyślnie odznaczone. Pod listą wybiera się *Dla kogo?* (🔒 / 👥), a dopiero przycisk *Dodaj* zapisuje zaznaczone wpisy.

Szczegóły techniczne:
- Prywatne wpisy trafiają do `state.customItems` z `id` `c-<znacznik czasu>-<nr>`, wspólne do tabeli `shared_items` z `id` `s-…` (plus `author_name`, `author_id`). Oba rodzaje mają pole `source` (nazwa pliku, nazwa paczki albo „ręcznie”) i datę dodania, i przechodzą tę samą walidację co `vocabulary.json` (`itemErrors()` / `prepareItem()` w `app.js`).
- Nowe karty od razu są w Kartach, sesjach i statystykach kategorii. Powtórki SRS wprowadzają je jako *nowe* przed resztą (w ramach dziennego limitu nowych słów). Filtr *⭐ Dodane materiały* (prywatne i wspólne) jest we Własnej sesji, Kartach i na panelu *Dziś*; wspólne karty mają znaczek *👥 Wspólne*.
- *Dodane materiały* grupują wpisy według źródła: 🔒 Twoje prywatne, 👥 Twoje wspólne i 👥 wspólne innych osób (z ich ścieżki nauki). Usuwać można własne paczki i wpisy; cudzych wspólnych nie. Usunięcie kasuje też postęp tych słów i zapisuje id w `state.deletedCustom` (tombstones), więc synchronizacja nie przywróci ich z innego urządzenia. Usunięcie wspólnej paczki znika u wszystkich przy ich następnym otwarciu aplikacji (postęp innych osób dla tych kart zostaje w ich danych, ale nigdzie się nie liczy).

### Przez vocabulary.json

1. Wrzuć handout (.doc/.docx lub zdjęcie) do Claude z prośbą: *„Wyciągnij słownictwo do vocabulary.json w formacie appki Study Cards”* i dołącz przykładowy wpis z sekcji niżej.
2. Dopisz nowe wpisy na końcu tablicy `items` w `vocabulary.json`. Każdy `id` musi być unikalny (np. kolejny `r037`, `av042`, `awl571`, `sr008`, `h013`).
3. Zmień pole `updated` na dzisiejszą datę, zrób commit i push — GitHub Pages odświeży stronę, a nowe słowa pojawią się w aplikacji (postęp nauki zostaje).

### Format wpisów

Wspólne pola: `id`, `type`, `category`, `difficulty` (1–3), opcjonalnie `subject` (`academic_english`, `biology`). Opcjonalne `quiz_suitable: false` wyłącza kartę jako poprawną odpowiedź w quizie (np. pytania tak/nie albo „X czy Y?”, czasowniki mylące bez kontekstu); fiszki, wpisywanie i luki działają bez zmian, a karta może być nadal dystraktorem. Dystraktory w quizie pochodzą z tego samego przedmiotu i typu, a dla `qa`/`cloze` mają też ten sam rodzaj odpowiedzi (rok, liczba, wzór, wzór sumaryczny, osoba, miejsce, nazwa własna, pojęcie; a nad nim szczegółowy tag `kind` ze słownika `kinds` danego pliku, np. `władca`, `bitwa`, `hormon`); opcjonalne pole `distractors` (lista błędnych odpowiedzi) jest używane w pierwszej kolejności; zasady i audyt: [docs/bugfix-quiz-logic.md](docs/bugfix-quiz-logic.md).
Kategorie Academic English: `phrasal_verbs`, `informal_phrases`, `academic_verbs`, `connectors`, `hedging`, `awl`, `style_rules`, `noun_phrases`. Kategorie biologii: sekcja *Przedmioty*.

Typy ogólne, dostępne w każdym przedmiocie (w biologii tylko te dwa):

```json
{ "id": "bio-001", "type": "qa", "question": "Which organelle is the site of aerobic respiration?",
  "answer": "mitochondrion", "accept": ["mitochondria"],
  "explanation": "Most of the ATP in a eukaryotic cell is produced in the mitochondria.",
  "category": "bio_cells", "difficulty": 1 }

{ "id": "bio-002", "type": "cloze", "text": "Enzymes speed up reactions by lowering the {{activation energy}}.",
  "hint": "energy", "explanation": "The enzyme stabilises the transition state.",
  "category": "bio_molecules", "difficulty": 1 }
```

- `qa`: fiszka, quiz (dystraktory to odpowiedzi z innych kart tego przedmiotu), wpisywanie i dopasowywanie par, gdy odpowiedź jest krótka (do 4 słów i 40 znaków). Długa odpowiedź działa tylko jako fiszka. `accept` to inne poprawne formy.
- `cloze`: luka w `{{…}}`, warianty odpowiedzi oddzielone `/` (`{{mitosis / mitotic division}}`). Ukrywana jest pierwsza luka, kolejne `{{…}}` pokazują się jako zwykły tekst. Ćwiczenia: luka (także w trybie *Wpisywanie*), quiz, fiszka.

Typy Academic English:

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
   <h2>Study Cards</h2>
   <p>Twój kod logowania: <strong>{{ .Token }}</strong></p>
   ```
3. **Adres strony:** *Authentication → URL Configuration* → *Site URL* = `https://kalomsconsulting-lab.github.io/academic-words/`; ten sam adres dodaj w *Redirect URLs* (oraz `http://localhost:8765` do testów).
4. **Konta tylko na zaproszenie** (zalecane): uruchom [`supabase/invites.sql`](supabase/invites.sql) i włącz hook — opis w sekcji *Zaproszenia* niżej. *Allow new users to sign up* zostaje wtedy włączone (o dostępie decyduje hook).

Adres projektu i klucz `publishable` są w [`config.js`](config.js). Klucz jest publiczny z założenia, a dane chronią reguły RLS (każdy widzi tylko swój wiersz). Pusty klucz oznacza, że aplikacja działa wyłącznie lokalnie.

Warto wiedzieć:
- Wbudowany serwer pocztowy Supabase wysyła tylko kilka maili na godzinę, więc przy testach nie prosi się o kod co chwilę.
- Darmowy projekt jest wstrzymywany po ok. tygodniu bez ruchu. Aplikacja działa wtedy dalej lokalnie, a projekt wznawia się przyciskiem *Restore* w panelu Supabase.
- Łączenie danych: dla każdego słowa wygrywa nowszy wpis, więc nauka na dwóch urządzeniach się nie nadpisuje. *Resetuj postęp* czyści też dane w chmurze.
- Własne materiały są sumowane z obu urządzeń, a usunięte (tombstones w `deletedCustom`) wygrywają z kopią z drugiego urządzenia.

## Wspólne materiały

Materiały dodane z opcją *👥 Dla wszystkich* są w osobnej tabeli `shared_items`. Konfiguracja jednorazowa: *SQL Editor → New query* → wklej [`supabase/shared.sql`](supabase/shared.sql) → *Run*. Do tego czasu opcja *Dla wszystkich* zgłosi błąd, a reszta aplikacji działa normalnie.

- Czytać i dodawać może każdy zalogowany, usuwać tylko autor (reguły RLS w `shared.sql`). Edycji nie ma: poprawka to usunięcie i ponowne dodanie.
- Aplikacja pobiera wspólne materiały przy starcie i po powrocie do aplikacji, a ostatnią listę trzyma w `localStorage` (`awv:shared`), więc działają offline.
- Autor jest podpisany imieniem z *Ustawień* (albo początkiem adresu e-mail).
- **Uwaga:** przy włączonej rejestracji każdy, kto zaloguje się e-mailem, może publikować dla wszystkich. Dlatego warto włączyć konta tylko na zaproszenie (sekcja *Zaproszenia*). Treści nieodpowiednie usuniesz w panelu Supabase: *Table Editor → shared_items*.

## Zaproszenia (konta tylko dla zaproszonych)

Administrator zaprasza osoby z poziomu aplikacji: *Ustawienia → ✉️ Zaproszenia* (karta widoczna tylko dla administratora). Konto może założyć wyłącznie adres z listy; obce adresy dostają komunikat „Ten adres nie ma zaproszenia…”. Istniejące konta logują się bez zmian.

Konfiguracja jednorazowa w panelu Supabase:

1. *SQL Editor → New query* → wklej [`supabase/invites.sql`](supabase/invites.sql) → *Run*. (Ostrzeżenie o „destructive operations” dotyczy linii `drop policy if exists` — nie usuwają danych.)
2. *Authentication → Auth Hooks* → *Before User Created* → typ *Postgres* → schemat `public`, funkcja `hook_before_user_created` → zapisz.
3. *Authentication → Sign In / Providers*: *Allow new users to sign up* musi być **włączone**.
4. Nadaj sobie rolę administratora: w *SQL Editor* uruchom (z adresem, którym logujesz się w aplikacji):
   ```sql
   insert into public.app_admins (user_id) select id from auth.users where lower(email) = 'twoj@adres.pl' on conflict do nothing;
   ```
   Po odświeżeniu aplikacji w Ustawieniach pojawi się karta *Zaproszenia*.

Jak zaprosić:
- Wpisz e-mail (i opcjonalnie imię) → *Zaproś*. Potem *✉️ Wyślij e-mail* (otwiera Twoją pocztę z gotową wiadomością), *📤 Udostępnij* (telefon: SMS, WhatsApp…) albo *📋 Kopiuj*.
- Wiadomość zawiera link `…?zaproszenie=<adres>#/settings`: aplikacja otwiera się na logowaniu z wpisanym adresem; wystarczy *Wyślij kod* i wpisać kod z e-maila.
- Lista pokazuje status: ⏳ czeka na pierwsze logowanie / ✅ konto od… (z datą ostatniego logowania). *Wycofaj zaproszenie* blokuje założenie konta; usunięcie z listy osoby, która ma już konto, nie usuwa konta (to robi się w *Authentication → Users*).
- Uwaga: konto dodane ręcznie w *Authentication → Users → Add user* też przechodzi przez hook, więc najpierw dodaj adres do listy zaproszeń.

## Widok rodzica

Rodzic widzi postęp dzieci, a każde dziecko uczy się na własnym koncie (własny e-mail albo alias rodzica, np. `rodzic+zosia@gmail.com`).

Konfiguracja jednorazowa: w panelu Supabase *SQL Editor → New query* → wklej [`supabase/family.sql`](supabase/family.sql) → *Run* (po `schema.sql`). Przy kontach na zaproszenie administrator najpierw zaprasza adres dziecka (np. alias `rodzic+zosia@gmail.com`), potem dziecko loguje się i wpisuje kod rodziny.

Połączenie kont:
1. **Rodzic:** *Ustawienia → Rodzina → Utwórz kod rodziny* (albo przy pierwszym uruchomieniu *Jestem rodzicem*). Pojawia się zakładka **Rodzina**.
2. **Dziecko:** na swoim koncie *Ustawienia → Rodzina* → wpisuje kod → *Połącz*. Może się w każdej chwili odłączyć.

Zakładka *Rodzina* pokazuje dla każdego dziecka: odpowiedzi dziś, serię dni, ostatnią naukę, wykres odpowiedzi z 7 dni, postęp i zaległe powtórki w każdym przedmiocie oraz karty z największą liczbą błędów. Rodzic może zmienić dziecku ścieżkę nauki (zmiana dociera na urządzenie dziecka przy najbliższej synchronizacji) i odłączyć konto. Odpowiedzi dziecka może tylko czytać: dostęp chronią reguły RLS i funkcje `join_family` / `set_child_level` w `family.sql`. Dane są tak aktualne jak ostatnia synchronizacja dziecka.

Konto z kodem rodziny bez własnej ścieżki nauki otwiera się od razu w widoku rodziny.

## Postęp i dane

- **Status słowa** liczony z 10 ostatnich odpowiedzi: < 60% poprawnych = *nowe*, 60–90% = *w nauce*, > 90% (min. 3 odpowiedzi) = *opanowane*.
- **Przeniesienie na inne urządzenie:** synchronizacja (wyżej). Eksport i import pliku JSON zostają jako zapasowa kopia.

## Rozbudowa (pomysły)

Architektura jest przygotowana pod: edycję własnych wpisów, nowe typy ćwiczeń (rejestr `RENDERERS` w `app.js`), wymowę (Web Speech API), import .docx i OCR.
