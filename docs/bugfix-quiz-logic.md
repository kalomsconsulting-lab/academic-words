# Quiz: dobór dystraktorów i jakość kart (wszystkie przedmioty)

Wersja promptu dostosowana do obecnego zakresu aplikacji: 24 przedmioty w dwóch ścieżkach (`LEVELS` w `app.js`),
karty bazowe w `vocabulary.json` (Academic English) i `data/*.json` (pozostałe przedmioty), typy `qa`, `cloze`,
`awl_word` (słówka EN/DE), `academic_verb`, `replacement`, `hedging`, `style_rule`. Wersja pierwotna dotyczyła tylko
`vocabulary.json`; punkty, które już są zrobione, są oznaczone.

## 1. Dystraktory w quizie

### Reguła ogólna (ZROBIONE dla typów Academic English)

Dystraktory pochodzą z tego samego `subject` i tego samego `type` co poprawna odpowiedź; w pierwszej kolejności z tej
samej `category`, potem z reszty przedmiotu (`distractors()` w `app.js`):

- `academic_verb` → inne `academic_verb` z innych `function` (pytanie „Który czasownik służy do …?”), a w kierunkach
  EN↔PL z dowolnej funkcji;
- `replacement` → inne `replacement`; `awl_word` → inne `awl_word` z polskim tłumaczeniem (dla AWL z grup o numerze
  różniącym się o ≤ 2); `hedging` → nazwy pozostałych technik.

### Karty `qa` i `cloze` (DO ZROBIENIA)

Dystraktory to odpowiedzi innych kart `qa` i luki innych kart `cloze` z tego samego przedmiotu (oba typy razem, bo
obie dają krótką odpowiedź). Wymagania:

1. **Rodzaj odpowiedzi** (ZROBIONE, `answerKind()` w `app.js`). Dystraktor ma ten sam rodzaj co poprawna odpowiedź:
   `year` (rok, zakres lat, wiek), `number` (wartość, także z jednostką i liczebniki słowne), `formula` (wzór
   z `=` lub zmiennymi), `chem` (wzór sumaryczny: `NH3`, `Ca(OH)2`), `symbol` (`Fe`, `V`, `II`), `person`
   (pytanie „Kto…”, „Który władca…”, „Who…”), `place` („Gdzie…”, „Które państwo…”, odpowiedź z przyimkiem
   i wielką literą), `proper` (inna nazwa własna) albo `term` (pojęcie). Nad rodzajem ogólnym stoi **szczegółowy tag `kind`** z pliku (ZROBIONE dla 21 plików `qa`/`cloze`):
   każdy plik ma słownik `kinds` (8–16 tagów, np. historia: władca, dowódca, polityk, bitwa, miasto, traktat, rok;
   biologia: narząd, substancja, choroba, hormon), a każda karta pole `kind`; dystraktory biorą najpierw karty
   z tym samym tagiem, a przy małej puli schodzą do rodzaju ogólnego. Kolejność wyboru: ta sama kategoria, rodzaj i typ (`qa`/`cloze`) → ten sam rodzaj i typ → ten sam rodzaj
   → ta sama kategoria → reszta przedmiotu. Karty z `quiz_suitable: false` nie są dystraktorami.
2. **Autorskie dystraktory** (ZROBIONE: kod oraz ok. 180 kart `cloze` z luką przeciwstawną w 21 plikach). Opcjonalne pole `distractors: [...]`
   (do 3 błędnych odpowiedzi) jest używane w pierwszej kolejności, a brakujące opcje dobiera pula. To jedyny sposób
   na naprawdę trudny quiz tam, gdzie rodzaj odpowiedzi nie wystarcza: luki z przeciwieństwem („niskiej / wysokiej”,
   „rosną / maleją”), pojęcia z tej samej rodziny (rodzaje tkanek, gatunki literackie, typy reakcji), bliskie daty.
   Zadanie dla wykonawców (jeden przedmiot na wykonawcę): dla każdej karty `cloze` i każdej karty `qa` z odpowiedzią
   rodzaju `term`/`proper` dopisać 3 dystraktory, które są prawdziwymi pojęciami z tego przedmiotu, tego samego
   rodzaju gramatycznego i podobnej długości, ale jednoznacznie błędne dla tego pytania.
3. **Bez kolizji.** Dystraktor nie może być równy (po normalizacji: małe litery, bez polskich znaków i znaków
   specjalnych) żadnej z odpowiedzi akceptowanych w karcie (`answer`, `accept`, warianty luki po `/`). Dwa pytania
   z tą samą odpowiedzią w jednej kategorii (np. „increases”, „180°”) są dopuszczalne.
4. **Minimalna pula.** Quiz dla karty jest dostępny, gdy w przedmiocie są co najmniej 4 karty z krótką odpowiedzią
   (`_mc`); kategorie z mniejszą pulą korzystają z całego przedmiotu, więc nie wymagają dopełniania.
5. **Długość odpowiedzi.** „Krótka” odpowiedź (do quizu i wpisywania) to ≤ 40 znaków i ≤ 4 wyrazy, przy czym spacje
   wokół operatorów (`=`, `+`, `-`, `·`, `/`, `^`, nawiasy) nie liczą się jako podział wyrazów, żeby wzory zapisane
   czytelnie (`P = a · h / 2`) nie wypadały z quizu.

## 2. Karty nienadające się na poprawną odpowiedź w quizie

Pole `quiz_suitable: false` (opcjonalne, domyślnie `true`) wyłącza kartę jako **poprawną odpowiedź** w quizie;
fiszki, wpisywanie, luki, dopasowywanie i przeglądarka kart działają bez zmian, a karta nadal może być dystraktorem.

Ustawić `false` dla:

- `academic_verb`: czasowników, które bez kontekstu zdania mylą (np. `admire`, `extol` w *agreement*; `complicate`,
  `disavow` w *disagreement*); przejrzeć wszystkie 41 i zastosować tę samą logikę;
- `qa` z odpowiedzią **tak/nie** (`yes/no`, `True/False`): w quizie z 4 opcjami nie mają sensu, zostają na fiszkach
  i we wpisywaniu;
- `qa`, w których odpowiedź (lub jej rdzeń) jest widoczna w pytaniu, i `cloze`, w których ukryte słowo powtarza się
  w reszcie zdania, chyba że da się przeredagować pytanie (preferowane).

## 3. Audyt wszystkich plików kart

Skrypt poza repozytorium (jak `validate.py` z kroku 4 zadania o podstawie programowej) ma sprawdzić dla
`vocabulary.json` i każdego `data/*.json`:

### Kompletność

1. Wymagane pola dla typu (jak `FIELDS` w `app.js`): `qa` → `question`, `answer`; `cloze` → `text` z jedną luką
   `{{…}}`; `awl_word`/`academic_verb` → `word`, `polish` (lista, niepuste przy `difficulty` 1–2), `example`;
   `replacement` → `informal`, `formal` (lista), `polish`, `example_informal`, `example_formal`; `hedging` → `informal`,
   `formal`, `technique`.
2. `accept` i `polish` są listami; `difficulty` 1–3; `category` należy do `subject`.
3. `id` unikalne w **całym repozytorium** (postęp uczniów w SRS jest po `id`).
4. Karty z podstawy programowej: `source: "Podstawa programowa"` i `pp` (numer wymagania).

### Jakość quizu

5. Dla każdej kategorii: liczba kart z krótką odpowiedzią i rozkład kształtów (liczba / wzór / słowo); kategorie,
   w których jakiś kształt ma < 4 kandydatów, biorą dystraktory z całego przedmiotu (zgodnie z pkt 1.1).
6. Odpowiedzi za długie (> 40 znaków lub > 4 wyrazy po sklejeniu operatorów): wypisać; preferowane przeredagowanie na
   `cloze` z luką na kluczowym pojęciu albo dodanie krótkiej formy w `accept`.
7. `cloze` z więcej niż jedną luką (ukrywana jest tylko pierwsza) i luki dłuższe niż 4 wyrazy.
8. Odpowiedź widoczna w pytaniu, luka widoczna w zdaniu, odpowiedzi tak/nie (patrz sekcja 2).
9. `academic_verb`: każda `function` ma ≥ 4 wpisy z `quiz_suitable !== false`; `replacement`: każda kategoria ≥ 4.

### Duplikaty

10. Ten sam `word` / `informal` (po normalizacji) w jednym typie i przedmiocie: scalić w jeden wpis z połączonymi
    `formal`/`polish`/`accept` (zachowując starsze `id`). Ten sam tekst pytania lub zdania z luką w przedmiocie: usunąć
    nowszy. Kilka `style_rule` z tą samą `rule` to nie duplikaty (jedna reguła, kilka przykładów).

### Raport

Liczba wpisów per typ i kategoria; brakujące pola; duplikaty; kategorie z małą pulą do quizu; odpowiedzi za długie;
karty tak/nie i z odpowiedzią widoczną w pytaniu; wpisy z `quiz_suitable: false`; inne anomalie. Po audycie
zastosować poprawki (kod w `app.js`, dane w plikach), uruchomić `validate.py` na każdym zmienionym pliku, sprawdzić
quiz w podglądzie dla kilku przedmiotów i pokazać diff.
