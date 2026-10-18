# Prompt: reported speech (Angielski, 7 klasa, poziom B1+)

Prompt do wklejenia w nową sesję Claude Code w repozytorium `C:\Dev\Vocabulary` (aplikacja Study Cards).
Na końcu jest krótszy wariant do zwykłego czatu (Copilot / Claude / ChatGPT), bez repozytorium.

---

## Zadanie

Moja córka jest w 7 klasie szkoły podstawowej (ścieżka `sp7`, przedmiot **Angielski**, `english_sp7`) i zna
angielski na poziomie **B1+**. Przygotowuje się do testu z **reported speech (mowy zależnej)**. Zbuduj do aplikacji
Study Cards komplet kart do tego tematu: fiszki, quiz z dobrymi dystraktorami, wpisywanie i luki. Karty mają być
na jej poziomie: ani szkolne minimum z klasy 7, ani materiał z FCE.

## Zanim zaczniesz

1. Przeczytaj `README.md` (sekcje *Dodawanie nowego słownictwa* i *Format wpisów*), `docs/bugfix-quiz-logic.md`
   (dystraktory, pole `kind` i `distractors`), a w `app.js`: `CATEGORIES` (klucze `en7_*`), wpis `english_sp7`
   w `SUBJECTS`, `itemErrors()`, `prepareItem()`, `isShort()` i `distractors()`. Obejrzyj `data/angielski-7.json`
   (113 kart: słówka `awl_word` i kilka `cloze` z gramatyki w `en7_other`).
2. Sprawdź `git status`: w tym repo pracują równolegle inne sesje. Nie nadpisuj cudzych zmian, nie ruszaj
   istniejących kart (od `id` zależy postęp w SRS) i nie pushuj bez mojej zgody: push na `main` publikuje
   aplikację uczniom.
3. Zapytaj mnie o trzy rzeczy i poczekaj na odpowiedź, zanim zaczniesz generować karty:
   - z jakiego podręcznika i rozdziału jest ten dział (albo poproś o zdjęcie notatek / zadań z lekcji);
   - kiedy jest test;
   - czy karty mają być wbudowane w aplikację (plik w `data/`, dla wszystkich; tak jak dotychczas) czy tylko
     jako plik JSON do importu *Dodaj materiały → Plik JSON* (prywatnie). Domyślnie: wbudowane.
   Jeśli nie odpowiem albo nie znam podręcznika, przyjmij zakres z kroku 2 w całości.

## Krok 1: materiały na poziomie B1+

Wyszukaj w sieci (WebSearch / WebFetch) materiały do reported speech dla poziomu **B1 / B1+** i nastolatków i ustal
na ich podstawie, co dokładnie obejmuje ten temat na tym poziomie oraz jakie typy zadań są typowe na teście.
Sprawdź w pierwszej kolejności:

- British Council LearnEnglish Teens i LearnEnglish (grammar: reported speech, B1);
- Cambridge English: zakres gramatyki dla B1 Preliminary (for Schools) oraz English Grammar in Use (units
  o reported speech);
- test-english.com, perfect-english-grammar.com, BBC Learning English (B1 reported speech, reported questions,
  reporting verbs);
- polskie podręczniki do klas 7–8 i repetytoria ósmoklasisty (Pearson, Macmillan, Oxford, Nowa Era): spis treści
  i opisy działów o mowie zależnej, żeby trafić w to, czego uczy polska szkoła (np. które czasowniki relacjonujące
  i które zmiany okoliczników czasu). Podręcznik, który podam w punkcie 3, ma pierwszeństwo.

Zasady korzystania z materiałów:

- Z materiałów bierzesz **zakres, reguły, typowe pułapki i formaty zadań**. Zdania do kart piszesz **własne**:
  nie kopiuj przykładów z podręczników ani stron (prawa autorskie; poza tym nie chcemy, żeby test wyglądał jak
  nasze karty).
- Zapisz w `docs/reported-speech.md` listę użytych źródeł (adres, poziom, co z nich wzięto) oraz wynikową listę
  zagadnień z kroku 2 z zaznaczeniem, które źródła potwierdzają je jako B1/B1+.
- Jeśli jakieś zagadnienie występuje tylko w materiałach B2 (np. mieszane okresy warunkowe w mowie zależnej,
  rzadkie czasowniki relacjonujące), nie rób z niego kart albo oznacz je `difficulty: 3` i wypisz w raporcie.

## Krok 2: zakres tematu (lista kontrolna)

Każdy punkt ma mieć co najmniej 3 karty, chyba że podręcznik go nie obejmuje (wtedy napisz to w raporcie):

1. **Zdania twierdzące, następstwo czasów (backshift)**: Present Simple → Past Simple, Present Continuous → Past
   Continuous, Past Simple → Past Perfect, Present Perfect → Past Perfect, will → would, can → could, may → might,
   must → had to, am/is/are going to → was/were going to. Czasowniki, które się nie zmieniają: would, could, might,
   should, ought to; Past Perfect zostaje.
2. **Brak następstwa czasów**: czasownik relacjonujący w czasie teraźniejszym (*She says that…*), fakty nadal
   prawdziwe / prawdy ogólne (dozwolone obie wersje: w `accept` lub w luce po `/`).
3. **Zmiany zaimków i określników**: I → he/she, we → they, my → his/her, you → I/me/we (zależnie od kontekstu),
   this → that, these → those.
4. **Zmiany okoliczników czasu i miejsca**: now → then / at that time, today → that day, tonight → that night,
   yesterday → the day before / the previous day, tomorrow → the next day / the following day, last week → the
   week before / the previous week, next month → the following month, ago → before, here → there.
5. **say vs tell** (tell + osoba, say (to sb)), `that` opcjonalne.
6. **Pytania zależne**: yes/no z *if / whether*, pytania z wh-, szyk zdania oznajmującego, bez *do/does/did*, bez
   znaku zapytania; czasowniki *ask*, *want to know*, *wonder*.
7. **Polecenia, prośby, zakazy**: tell / ask / order / warn + osoba + (not) to + bezokolicznik; *Don't…* →
   *not to…*; prośby *Could you…?* → asked me to…
8. **Czasowniki relacjonujące na poziomie B1+** i ich wzorce: promise, offer, refuse, agree, threaten (+ to),
   suggest, recommend, admit, deny, apologise for (+ -ing), advise, warn, remind, invite, encourage, beg
   (+ osoba + to), explain, complain, claim (+ that). Dla każdego: znaczenie po polsku i poprawny wzorzec.
9. **Typowe błędy** (do dystraktorów i wyjaśnień): *said me*, *told that* bez osoby, szyk pytania w pytaniu
   zależnym, *if* z pytaniem wh-, brak backshiftu po *said*, *tomorrow* zostawione w mowie zależnej.

Poziom językowy zdań: B1+, tematyka życia nastolatków (szkoła, przyjaciele, rodzina, sport, telefon, wakacje),
zdania 8–14 słów, słownictwo proste, bo sprawdzamy gramatykę, nie słówka.

## Krok 3: karty

### Gdzie

- Wariant „wbudowane”: dopisz karty na końcu `items` w `data/angielski-7.json`, zmień `updated`, dodaj do pliku
  słownik `kinds` (patrz niżej). Dodaj w `CATEGORIES` w `app.js` nową kategorię
  `en7_grammar: { subject: 'english_sp7', label: 'Gramatyka', short: 'Gramatyka', pl: 'grammar', icon: '📝' }`
  i użyj jej dla wszystkich nowych kart (istniejące karty `cloze` w `en7_other` zostaw bez zmian). Podbij wersję
  cache w `sw.js`, bo zmienia się `app.js`.
- Wariant „prywatne”: zapisz `docs/import/reported-speech.json` jako `{ "items": [...] }` bez pola `id`
  i z kategorią `en7_other`; nie ruszaj `app.js`.

### Co

`id` z prefiksem `en7-rs-` i numerem (`en7-rs-001`…), unikalne w całym repo. Typy tylko z `SUBJECTS.english_sp7.types`
(`awl_word`, `qa`, `cloze`). Wszystkie nowe karty mają pole `kind` ze słownika `kinds` dodanego do pliku:

```json
"kinds": ["czas", "forma czasownika", "czasownik modalny", "zaimek", "wyrażenie czasu", "say/tell", "szyk",
          "if/whether", "bezokolicznik", "wzorzec czasownika", "czasownik relacjonujący", "pojęcie"]
```

Rodzaje kart i proporcje (razem ok. 100–130 kart):

1. **Transformacja w luce (`cloze`, ok. 50%)**: zdanie w mowie niezależnej + początek zdania w mowie zależnej,
   luka na zmienianym elemencie. Dokładnie jedna luka, odpowiedź do 4 słów, w luce inne poprawne formy po `/`.
   `hint` = reguła w 2–4 słowach, `explanation` = jedno zdanie po polsku z nazwą reguły, `distractors` = 3 formy,
   które uczeń naprawdę myli (ta sama kategoria gramatyczna, podobna długość):

   ```json
   { "id": "en7-rs-001", "type": "cloze",
     "text": "Tom: 'I am tired.' → Tom said that he {{was}} tired.",
     "hint": "Present Simple → ?", "explanation": "Po said w czasie przeszłym Present Simple zmienia się na Past Simple.",
     "category": "en7_grammar", "difficulty": 1, "kind": "forma czasownika", "distractors": ["is", "had been", "has been"] }

   { "id": "en7-rs-040", "type": "cloze",
     "text": "Mum: 'Where are you going?' → Mum asked me where {{I was going}}.",
     "hint": "szyk zdania oznajmującego", "explanation": "W pytaniu zależnym podmiot stoi przed czasownikiem i nie ma inwersji.",
     "category": "en7_grammar", "difficulty": 2, "kind": "szyk", "distractors": ["was I going", "am I going", "I am going"] }

   { "id": "en7-rs-060", "type": "cloze",
     "text": "Teacher: 'Don't use your phones.' → The teacher told us {{not to use}} our phones.",
     "hint": "zakaz", "explanation": "Polecenia relacjonujemy przez tell + osoba + (not) to + bezokolicznik.",
     "category": "en7_grammar", "difficulty": 1, "kind": "bezokolicznik", "distractors": ["to not use", "don't use", "not using"] }
   ```

2. **Reguły i zamiany (`qa`, ok. 25%)**: pytanie po polsku, krótka odpowiedź po angielsku (do 4 słów), `accept`
   z innymi poprawnymi formami, `distractors` z tej samej rodziny:

   ```json
   { "id": "en7-rs-070", "type": "qa",
     "question": "Na jaki czas zmienia się Present Perfect w mowie zależnej?", "answer": "Past Perfect",
     "accept": ["past perfect", "had + III forma"], "explanation": "'I have finished' → she said she had finished.",
     "category": "en7_grammar", "difficulty": 1, "kind": "czas", "distractors": ["Past Simple", "Past Continuous", "Present Perfect"] }

   { "id": "en7-rs-085", "type": "qa",
     "question": "Jak zmienia się 'yesterday' w mowie zależnej?", "answer": "the day before",
     "accept": ["the previous day"], "explanation": "Okoliczniki czasu przesuwają się razem z czasem relacji.",
     "category": "en7_grammar", "difficulty": 1, "kind": "wyrażenie czasu", "distractors": ["the next day", "that day", "the week before"] }
   ```

3. **Czasowniki relacjonujące (`awl_word`, ok. 15%)**: słówko ze wzorcem, polskie znaczenie, przykład w mowie
   zależnej, który zawiera to słowo:

   ```json
   { "id": "en7-rs-100", "type": "awl_word", "word": "refuse to do sth", "polish": ["odmówić zrobienia czegoś"],
     "example": "Jake refused to lend me his bike.", "category": "en7_grammar", "difficulty": 2, "kind": "czasownik relacjonujący" }
   ```

   Do każdego czasownika z punktu 8 zakresu dołóż jedną kartę `cloze` na wzorzec
   (`She apologised {{for being}} late.`, dystraktory: `to be`, `that she was`, `being`), `kind: "wzorzec czasownika"`.

4. **Zdanie w mowie niezależnej → cała wersja zależna (`qa`, ok. 10%)**: pytanie „Przekształć: *Anna: 'I will call
   you tomorrow.'*”, odpowiedź pełnym zdaniem. Odpowiedź jest długa, więc karta działa tylko jako fiszka
   (sprawdź `isShort()`); to celowe: to jest format zadania z testu. Daj `quiz_suitable: false`.

Zasady jakości:

- `difficulty`: 1 = pojedyncza zmiana czasu lub okolicznika, 2 = pytanie zależne, polecenie, dwie zmiany naraz,
  3 = czasownik relacjonujący z wzorcem albo brak backshiftu.
- Każda reguła ma karty w obu kierunkach: „co się zmienia” (qa) i „zmień to w zdaniu” (cloze).
- Dystraktory muszą być **błędne dla tej karty**, ale **poprawne gramatycznie gdzie indziej** (np. `had been`
  jako dystraktor do `was`, nie `beed`). Nie dawaj dystraktora, który w jakiejś interpretacji też jest poprawny
  (np. gdy `was going` i `went` są oba akceptowalne, drugi musi być w luce po `/`, nie w `distractors`).
- Cudzysłowy wewnątrz `text` jako apostrofy `'…'`, żeby nie łamać JSON; strzałka `→` jak w przykładach.
- `explanation` po polsku, jedno zdanie, zawsze z nazwą reguły albo czasu po angielsku.
- Zdania bez przemocy, polityki i treści nieodpowiednich dla 13-latki.

## Krok 4: weryfikacja

1. Walidacja: skrypt w katalogu tymczasowym (nie w repo), który odtwarza `itemErrors()` i sprawdza: brak błędów,
   unikalne `id`, kategorie przedmiotu, dokładnie jedna luka w każdym `cloze`, `kind` ze słownika, `distractors`
   bez poprawnej odpowiedzi i bez powtórek, krótkie odpowiedzi (`isShort()`) wszędzie poza kartami z punktu 4.
2. Gramatyka: przejrzyj **wszystkie** karty pod kątem poprawności (nie losową próbkę; to jest gramatyka na test,
   jeden błąd uczy błędu). Dla każdej karty `cloze` sprawdź, że zdanie z każdym dystraktorem jest naprawdę błędne.
   Zrób osobną listę kart, przy których miałeś wątpliwość, i pokaż mi ją.
3. Podgląd: `.claude/launch.json` (`academic-words`, port 8765), ścieżka `sp7` → Angielski → kategoria Gramatyka.
   Przejdź po kilka kart w trybach quiz, wpisywanie, luka i fiszka; sprawdź, że quiz pokazuje autorskie
   dystraktory, a konsola jest czysta. Zrób zrzut ekranu quizu i luki.

## Krok 5: dodatki, dokumentacja, commit

- `docs/reported-speech.md`: źródła z kroku 1, lista zagadnień z liczbą kart na każde, pominięte zagadnienia,
  lista kart z wątpliwościami.
- Jednostronicowa ściąga do wydruku `docs/reported-speech-sciaga.md` (po polsku, z przykładami po angielsku):
  tabela zmian czasów, tabela okoliczników, wzory pytań zależnych i poleceń, czasowniki relacjonujące z wzorcami,
  5 najczęstszych błędów. Własne przykłady, nie z kart (żeby ściąga nie zdradzała odpowiedzi).
- `README.md`: dopisz kategorię Gramatyka i prefiks `en7-rs-` w tabeli plików.
- Jeden commit (komunikat po angielsku, jak w historii repo), bez pusha.

## Kolejność pracy

Najpierw pytania z punktu 3 „Zanim zaczniesz”. Potem krok 1 i 2 oraz plik `docs/reported-speech.md` z zakresem:
pokaż mi go i zatrzymaj się. Po akceptacji wygeneruj pilotażowe 15 kart (po 2–3 z każdego rodzaju), pokaż je
w czacie, a po drugiej akceptacji resztę, walidację, podgląd i commit.

---

## Wariant do zwykłego czatu (bez repozytorium)

Do wklejenia w Copilot / Claude / ChatGPT; odpowiedź wkleja się w aplikacji przez *Dodaj materiały → Wklej
odpowiedź czatu* (przedmiot: Angielski). Zakres z kroku 2 wklej razem z promptem.

```text
Przygotuj karty do nauki reported speech (mowy zależnej) dla uczennicy 7 klasy szkoły podstawowej na poziomie B1+.
Zakres: [wklej listę z kroku 2]. Zdania o życiu nastolatków, 8–14 słów, proste słownictwo. Pisz własne zdania,
nie kopiuj z podręczników.

Zwróć JSON w bloku kodu: tablica obiektów trzech typów.

1. Luka z transformacją (około połowa kart), dokładnie jedna luka w {{ }}, inne poprawne formy po "/":
{ "type": "cloze", "text": "Tom: 'I am tired.' → Tom said that he {{was}} tired.", "hint": "Present Simple → ?",
  "explanation": "Po said Present Simple zmienia się na Past Simple.", "category": "en7_other", "difficulty": 1,
  "distractors": ["is", "had been", "has been"] }

2. Reguła (pytanie po polsku, odpowiedź po angielsku do 4 słów):
{ "type": "qa", "question": "Jak zmienia się 'tomorrow' w mowie zależnej?", "answer": "the next day",
  "accept": ["the following day"], "explanation": "Okoliczniki czasu przesuwają się razem z czasem relacji.",
  "category": "en7_other", "difficulty": 1, "distractors": ["the day before", "that day", "then"] }

3. Czasownik relacjonujący ze wzorcem:
{ "type": "awl_word", "word": "refuse to do sth", "polish": ["odmówić zrobienia czegoś"],
  "example": "Jake refused to lend me his bike.", "category": "en7_other", "difficulty": 2 }

Zasady: każde zagadnienie z zakresu ma co najmniej 3 karty; "distractors" to 3 formy, które uczeń naprawdę myli,
błędne w tym zdaniu, ale gramatyczne gdzie indziej; "explanation" po polsku, jedno zdanie z nazwą reguły;
cudzysłowy w zdaniach jako apostrofy; nie dodawaj pola "id"; zwykłe cudzysłowy ", bez przecinka po ostatnim
elemencie. Jeśli kart jest więcej niż 25, zwróć pierwsze 25 i napisz "CIĄG DALSZY", a resztę podaj, gdy poproszę.
```
