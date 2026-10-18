# Prompt: karty z podstawy programowej (7 klasa i IB Pre-DP 1)

Prompt do wklejenia w nową sesję Claude Code w repozytorium `C:\Dev\Vocabulary` (aplikacja Study Cards).

---

## Zadanie

Przeanalizuj podstawy programowe dla dwóch ścieżek nauki w aplikacji Study Cards i na ich podstawie zbuduj karty
bazowe (fiszki) do każdego przedmiotu. Wszystkie karty z tego zadania mają być widocznie oznaczone jako
**„Podstawa programowa”**.

Ścieżki (`LEVELS` w `app.js`, rok szkolny 2026/27):

- **`sp7`**: 7 klasa szkoły podstawowej (SP 112, klasa 7B): Angielski, Niemiecki, Biologia, Matematyka, Polski,
  Chemia, Fizyka, Historia, Geografia, Informatyka, Edukacja zdrowotna.
- **`ib`**: IB Pre-DP 1 (2. SLO STO, odpowiednik 1 klasy liceum): Academic English, Biology, English, Mathematics,
  Chemistry, Physics, History, History of Poland, Geography, Polish, Edukacja obywatelska, Computer Science,
  German B, Psychology.

## Zanim zaczniesz

1. Przeczytaj `README.md` (sekcje *Przedmioty* i *Format wpisów*), `docs/plan-inne-przedmioty.md`, a w `app.js`:
   `CATEGORIES`, `SUBJECTS`, `LEVELS`, `itemErrors()`, `prepareItem()` oraz miejsce, gdzie wczytywane są pliki
   z `SUBJECTS[*].file`. Sprawdź też `sw.js` (lista `ASSETS` i wersja cache).
2. Sprawdź `git status`: w tym repo pracują równolegle inne sesje. Nie nadpisuj cudzych zmian, commituj małymi
   porcjami (jeden przedmiot = jeden commit).
3. Nie zmieniaj kategorii ani identyfikatorów istniejących kart: od `id` zależy postęp uczniów w SRS.

## Krok 1: ustal właściwe podstawy programowe

Korzystaj wyłącznie ze źródeł oficjalnych (podstawaprogramowa.pl, gov.pl/web/edukacja, isap.sejm.gov.pl / Dziennik
Ustaw, CKE, ibo.org). Dla każdego przedmiotu zapisz, z którego dokumentu korzystasz (rozporządzenie, data, zakres).

- **7 klasa**: podstawa programowa kształcenia ogólnego dla szkoły podstawowej, w wersji obowiązującej w 2026/27
  (z uwzględnieniem zmian z 2024 r. ograniczających treści). Edukacja zdrowotna ma osobną podstawę (przedmiot od
  2025/26). Języki obce: wariant II.2 (pierwszy język, angielski) i II.2 lub odpowiedni dla drugiego języka
  (niemiecki). Bierz tylko wymagania przypisane do klasy 7 (dla przedmiotów, które podstawa opisuje dla klas 7–8
  łącznie, oprzyj się na typowym rozkładzie materiału na klasę 7 i zaznacz to w raporcie).
- **IB Pre-DP 1**: Pre-DP to rok przygotowawczy w polskim liceum, więc:
  - przedmioty po polsku (Polish, History of Poland, Edukacja obywatelska) → podstawa programowa liceum, klasa 1;
  - przedmioty po angielsku (Biology, Chemistry, Physics, Mathematics, History, Geography, Computer Science,
    Psychology, English) → podstawa programowa liceum, klasa 1, uzupełniona o zagadnienia wprowadzające do
    przewodników IB DP (subject guides), jeśli są publicznie dostępne. Karty piszesz po angielsku;
  - German B → podstawa liceum dla drugiego języka obcego + poziom wejściowy IB Language B;
  - Academic English → nie ma podstawy programowej; pomiń go albo dołóż tylko karty, które odpowiadają wymaganiom
    pisania formalnego z podstawy języka angielskiego w liceum.
- **Uwaga na reformę**: od 1.09.2026 część klas (m.in. 1 klasa liceum) może mieć nową podstawę programową
  (reforma „Kompas Jutra”). Sprawdź, która wersja obowiązuje dla 1 klasy liceum w 2026/27 i dla 7 klasy SP,
  i napisz to wprost w raporcie. Jeśli czegoś nie da się potwierdzić w oficjalnym źródle, zaznacz to, zamiast
  zgadywać.

Wynik kroku 1 zapisz w `docs/podstawa-programowa.md`: dla każdego przedmiotu tabela
*wymaganie (numer i krótki opis) → kategoria w aplikacji (`CATEGORIES`) → liczba kart*. Pokaż mi ten plik
i zatrzymaj się, zanim zaczniesz generować karty, jeśli zauważysz, że brakuje kategorii albo podstawa jest
niejednoznaczna.

## Krok 2: oznaczenie „Podstawa programowa” w aplikacji

Karty z tego zadania są wbudowane w aplikację (pliki w `data/`), dla wszystkich użytkowników. Każda karta dostaje:

```json
"source": "Podstawa programowa",
"pp": "VI.3.2"
```

gdzie `pp` to numer wymagania z podstawy (np. „VI.3.2” albo „XII.4”), a dla treści z przewodnika IB np.
„IB A2.1”.

Dopilnuj w kodzie (`app.js`), żeby:

- `prepareItem()` ustawiał np. `it._pp = it.source === 'Podstawa programowa'` i nie gubił pól `source`, `pp`;
- karta pokazywała znaczek **📘 Podstawa programowa** (obok istniejących *👥 Wspólne* / *⭐ Moje*, ten sam styl
  `badge`), z numerem wymagania w `title`;
- we Własnej sesji i w Kartach był filtr **📘 Podstawa programowa** (obok *⭐ Dodane materiały*);
- karty z podstawy nie trafiały do *Dodanych materiałów* ani nie dało się ich usunąć jak paczki użytkownika;
- wykrywanie duplikatów przy imporcie (`buildPending`) traktowało je jak karty bazowe („już jest w kartach”).

## Krok 3: pliki z kartami

- Przedmioty, które **mają** plik (`vocabulary.json`, `data/biology.json`, `data/angielski-7.json`,
  `data/biologia-7.json`): dopisz nowe karty na końcu `items`, nie ruszaj istniejących. Jeśli istniejąca karta
  pokrywa wymaganie z podstawy, nie duplikuj jej: dopisz jej tylko `pp` (bez zmiany `id`, `source` zostaw puste,
  albo ustaw „Podstawa programowa”, jeśli w całości z niej wynika).
- Przedmioty **bez pliku**: utwórz `data/<nazwa>.json` w tym samym formacie (`version`, `subject`, `updated`,
  `items`), dopisz pole `file` w `SUBJECTS`, dodaj plik do `ASSETS` w `sw.js` i podbij wersję cache.
- `id`: prefiks przedmiotu + `pp` + numer, np. `mat7-pp-001`, `chemib-pp-001`. Sprawdź unikalność w całym repo.
- Typy i język zgodne z `SUBJECTS[*].types` i `lang`:
  - przedmioty sp7 i polskojęzyczne IB → `qa` / `cloze` po polsku;
  - przedmioty IB po angielsku → `qa` / `cloze` po angielsku;
  - Angielski, Niemiecki, German B (`vocab: true`) → głównie `awl_word` (słówko ; po polsku ; zdanie
    przykładowe), z tematów leksykalnych podstawy; gramatyka jako `cloze`.
- Kategorie wyłącznie z `CATEGORIES` danego przedmiotu; `*_other` tylko gdy nic nie pasuje.
- Zasady dobrych kart: jedna informacja na kartę; krótka odpowiedź (do ok. 5 słów, żeby dało się ją wpisać);
  w `accept` inne poprawne formy; luka w `cloze` na kluczowym pojęciu; `explanation` w jednym zdaniu;
  `difficulty` 1–3 zgodnie z wymaganiem (1 = definicja, 3 = zastosowanie / zależność). Wzory i jednostki
  w zwykłym tekście (np. `v = s / t`, `m/s`), bez LaTeX-a. Daty i postacie historyczne tylko te, które podstawa
  wymienia. Lektury tylko z listy obowiązkowej dla danej klasy.
- Skala: ok. 60–120 kart na przedmiot, proporcjonalnie do liczby wymagań; każde wymaganie z podstawy dla tej
  klasy ma co najmniej jedną kartę, o ile da się je sprawdzić fiszką (wymagania czysto umiejętnościowe, np.
  „przeprowadza doświadczenie”, wypisz w raporcie jako pominięte).

## Krok 4: weryfikacja

1. Każdy plik przechodzi walidację aplikacji: napisz krótki skrypt (w katalogu tymczasowym, nie w repo), który
   ładuje `app.js`-owe reguły albo odtwarza `itemErrors()`, i sprawdź, że żadna karta nie ma błędów, `id` są
   unikalne, a kategorie należą do przedmiotu.
2. Uruchom podgląd (`.claude/launch.json`, port 8765 lub 8777), przełącz się na obie ścieżki i sprawdź w
   przeglądarce: liczby kart w przedmiotach, znaczek 📘, filtr, quiz i wpisywanie na kilku kartach, brak błędów
   w konsoli. Zrób zrzut ekranu.
3. Przejrzyj merytorycznie po 10 losowych kart z każdego przedmiotu: poprawność faktów, zgodność z wymaganiem
   `pp`, język właściwy dla przedmiotu.

## Krok 5: dokumentacja i commit

- `README.md`: tabela plików w `data/`, opis oznaczenia „Podstawa programowa” i pola `pp`.
- `docs/podstawa-programowa.md`: źródła, mapowanie wymagań, liczby kart, lista pominiętych wymagań.
- Commit na przedmiot (komunikat po angielsku, jak w historii repo). Nie pushuj bez mojej zgody: push na `main`
  publikuje aplikację uczniom.

## Kolejność pracy

Zacznij od jednego przedmiotu pilotażowego (Matematyka 7), pokaż mi wynik (plik, liczbę kart, 10 przykładów,
zrzut ekranu ze znaczkiem), a dopiero po akceptacji rób resztę. Przedmioty są niezależne, więc po pilocie można
je generować równolegle (osobne sesje lub subagenci, jeden przedmiot na wykonawcę, każdy w swoim pliku `data/`);
zmiany w `app.js` i `sw.js` scal na końcu w jednym miejscu.
