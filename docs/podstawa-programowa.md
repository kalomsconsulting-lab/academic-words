# Karty z podstawy programowej: źródła i mapowanie (rok szkolny 2026/27)

Raport z kroku 1 zadania opisanego w [prompt-podstawa-programowa.md](prompt-podstawa-programowa.md): które podstawy
programowe obowiązują obie ścieżki nauki w 2026/27 i jak ich wymagania mapują się na działy aplikacji (`CATEGORIES`
w `app.js`). Liczby kart to propozycje (ok. 60–120 na przedmiot); dla przedmiotu pilotażowego (Matematyka 7) podano
liczby rzeczywiste.

Oznaczenie w danych: każda karta z tego zadania ma `"source": "Podstawa programowa"` i `"pp"` z numerem wymagania
(np. `"VIII.7"`, dla treści z przewodników IB np. `"IB A2.1"`); w aplikacji dostaje znaczek 📘 i filtr. Identyfikatory:
`<przedmiot>-pp-<nr>`.

**Stan (2026-10-18):** zrobione wszystkie 24 przedmioty (łącznie 2604 kart z `pp` w 24 plikach `data/`, w tym 128 kart `order` i `apply` z 18 października 2026), każdy w osobnym
commicie. Rzeczywiste liczby i odstępstwa od tabel poniżej są w sekcji *Wynik* na końcu. Tabele przedmiotów zostawiono
w wersji z kroku 1 (plan); tam, gdzie wykonawca ustalił inne numery wymagań, jest to opisane w *Wyniku*.

## Które podstawy obowiązują w 2026/27

| Ścieżka | Co obowiązuje | Źródło |
|---|---|---|
| **7 klasa SP** (wszystkie przedmioty poza edukacją zdrowotną) | **Dotychczasowa** podstawa dla szkoły podstawowej: rozporządzenie MEN z 14 lutego 2017 r. (Dz.U. 2017 poz. 356) w brzmieniu po „odchudzeniu” z 28 czerwca 2024 r. (Dz.U. 2024 poz. 996, od 1.09.2024). Nowa podstawa (reforma „Kompas Jutra”, rozporządzenie z 11 marca 2026 r., Dz.U. 2026 poz. 378, zm. Dz.U. 2026 poz. 958) wchodzi od 1.09.2026 tylko w klasach I i IV SP, a w kolejnych latach w kolejnych klasach. | [reforma26.men.gov.pl](https://reforma26.men.gov.pl/najczesciej-zadawane-pytania/), [ORE](https://ore.edu.pl/2026/03/nowe-podstawy-programowe-rozporzadzenia-podpisane/), [ELI Dz.U. 2024 poz. 996](https://eli.gov.pl/api/acts/DU/2024/996/text.html) |
| **7 klasa SP: edukacja zdrowotna** | **Nowa** podstawa: zał. do rozp. z 11 marca 2026 r. (Dz.U. 2026 poz. 378) w brzmieniu z rozp. z 8 lipca 2026 r. (Dz.U. 2026 poz. 958); § 4 ust. 2 stosuje ją w klasach V–VIII już od 2026/27. Osobny przedmiot „zdrowie seksualne” (Dz.U. 2026 poz. 966) pominięty. Numery Dz.U. 2025 poz. 378 / 1052 z briefu dotyczą wcześniejszych rozporządzeń i nie są tu właściwe (ustalenie agenta, do potwierdzenia w ISAP). | [ELI Dz.U. 2026 poz. 958](https://eli.gov.pl/api/acts/DU/2026/958/text/O/D20260958.pdf) |
| **IB Pre-DP 1 (= 1 klasa liceum)** | **Dotychczasowa** podstawa dla liceum: rozporządzenie MEN z 30 stycznia 2018 r. (Dz.U. 2018 poz. 467) w brzmieniu po zmianach z 28 czerwca 2024 r. (Dz.U. 2024 poz. 1019). Nowa podstawa dla klas 1 szkół ponadpodstawowych dopiero od 1.09.2027. Edukacja obywatelska (Dz.U. 2025 poz. 382) wg § 2 ust. 2 jest realizowana od klasy II (2025/26) i III (2026/27), więc **formalnie klasa 1 w 2026/27 jej nie ma**; w planie lekcji Pre-DP 1 jednak jest, patrz uwagi niżej. | [reforma26.men.gov.pl](https://reforma26.men.gov.pl/o-reformie/), [ELI Dz.U. 2024 poz. 1019](https://eli.gov.pl/eli/DU/2024/1019/ogl), [Dz.U. 2025 poz. 382](https://api.sejm.gov.pl/eli/acts/DU/2025/382/text.pdf) |

Ustalenia metodyczne:

- Podstawa opisuje większość przedmiotów łącznie dla klas VII–VIII (SP) albo dla całego liceum bez podziału na klasy.
  Rozkład na klasę 7 / klasę 1 jest w takich wypadkach **założeniem wg typowych podręczników** i jest oznaczony przy
  każdym przedmiocie.
- Języki obce w SP: pierwszy język (angielski) to wariant **II.1**, drugi język (niemiecki, od klasy VII) to wariant
  **II.2**. Brief podawał II.2 dla angielskiego, to nieścisłość.
- Numeracja wymagań: rzymski dział, punkt, ewentualnie podpunkt (np. `VIII.7`, `I.2.3`). Tam, gdzie agent czytał
  tekst przez streszczenie (nie dosłownie), numeracja jest orientacyjna i wymaga sprawdzenia w ISAP przed generowaniem
  kart; takie przedmioty są oznaczone „numeracja do weryfikacji”.
- Wymagania czysto umiejętnościowe (doświadczenia, projekty, „redaguje”, „wygłasza”) dostają 0 kart i są wypisane jako
  pominięte.

Stopień weryfikacji źródeł (ważne przed generowaniem kart):

| Grupa | Jak czytano źródła |
|---|---|
| Matematyka 7 | pełny tekst podstawy pobrany z podstawaprogramowa.pl (brzmienie po Dz.U. 2024 poz. 996) + rozkład GWO dla klasy VIII, patrz niżej |
| Chemia, fizyka, biologia, geografia, informatyka 7 | tekst wymagań ze stron zpe.gov.pl (wersja 2025/26), numery działów zweryfikowane |
| Polski, historia, angielski, niemiecki 7 | zpe.gov.pl przez streszczenia; numeracja punktów orientacyjna |
| Edukacja zdrowotna 7 | pełny PDF Dz.U. 2026 poz. 958 |
| Polish, History of Poland (IB) | zestawienia GWO zmian 2024 (nieoficjalne); numeracja do weryfikacji |
| Edukacja obywatelska (IB) | pełny PDF Dz.U. 2025 poz. 382 |
| Biology, Chemistry, Physics, Mathematics, History, Geography, CS, English, Psychology, German B (IB) | **bez pobrania źródeł** (wiedza ogólna agenta): struktura prawdopodobnie poprawna, ale numery wymagań, slugi zpe.gov.pl i nazwy tematów IB (zwłaszcza CS 2027 i Psychology 2027) **muszą być potwierdzone** przed pracą |

---

# Ścieżka `sp7`: 7 klasa szkoły podstawowej

## Matematyka (7 klasa), przedmiot pilotażowy, ZROBIONE

**Źródło:** podstawa programowa kształcenia ogólnego dla szkoły podstawowej, matematyka, klasy VII i VIII (15 działów
I–XV), brzmienie po rozporządzeniu z 28 czerwca 2024 r. (Dz.U. 2024 poz. 996), pobrane z
[podstawaprogramowa.pl](https://podstawaprogramowa.pl/Szkola-podstawowa-IV-VIII-1/Matematyka) (zgodne z
[zpe.gov.pl](https://zpe.gov.pl/podstawa-programowa/szkola-podstawowa/matematyka)). Podstawa nie dzieli działów na klasy;
jedyna oficjalna uwaga: dział XV (symetrie) może być realizowany po egzaminie ósmoklasisty.

**Przyjęty rozkład na klasę 7** (wg rozkładu materiału GWO „Matematyka z plusem” dla klasy VIII, z którego wynika, co
zostaje w klasie 7; zbieżny z działami w `CATEGORIES`):

- klasa 7: I potęgi, II pierwiastki, III–IV wyrażenia algebraiczne, V procenty, VI równania, VII proporcjonalność,
  VIII.1–6 własności figur, IX wielokąty, X.1–3 oś liczbowa i układ współrzędnych, XI.1–2 graniastosłupy,
  XII kombinatoryka i prawdopodobieństwo (wstęp), XIII statystyka;
- klasa 8 (bez kart): VIII.8 dowody, X.4–6 odcinki w układzie współrzędnych, XI.3 ostrosłupy, XIV koło, XV symetrie;
- **VIII.7 twierdzenie Pitagorasa**: GWO ma je w klasie 8, Nowa Era („Matematyka z kluczem”) w klasie 7. Dodane
  (5 kart), bo podręcznik klasy 7B nie jest znany; łatwo usunąć (`pp: "VIII.7"`).

| Wymaganie | Kategoria | Kart |
|---|---|---|
| I.1 potęga o wykładniku naturalnym (podstawa, wykładnik, obliczanie) | mat7_numbers | 5 |
| I.2 mnożenie i dzielenie potęg o tej samej podstawie | mat7_numbers | 3 |
| I.3 mnożenie potęg o jednakowych wykładnikach | mat7_numbers | 1 |
| I.4 potęgowanie potęgi | mat7_numbers | 1 |
| I.5 notacja wykładnicza | mat7_numbers | 4 |
| II.1 pierwiastki kwadratowe i sześcienne | mat7_numbers | 4 |
| II.2 szacowanie pierwiastków | mat7_numbers | 2 |
| II.3 porównywanie z liczbą wymierną | mat7_numbers | 1 |
| II.4 pierwiastek z iloczynu, wyłączanie i włączanie czynnika | mat7_numbers | 3 |
| II.5 mnożenie i dzielenie pierwiastków | mat7_numbers | 1 |
| III.1 zapis działań jako wyrażeń | mat7_algebra | 2 |
| III.2 wartość liczbowa wyrażenia | mat7_algebra | 2 |
| III.3 zależności z zadań jako wyrażenia | mat7_algebra | 2 |
| III.4 rozwiązania zadań jako wyrażenia | mat7_algebra | 1 |
| IV.1 jednomiany, jednomiany podobne | mat7_algebra | 4 |
| IV.2 dodawanie i odejmowanie sum algebraicznych | mat7_algebra | 3 |
| IV.3 mnożenie sumy przez jednomian | mat7_algebra | 2 |
| IV.4 mnożenie dwumianu przez dwumian | mat7_algebra | 2 |
| V.1 część jako procent | mat7_percent | 3 |
| V.2 p% liczby | mat7_percent | 1 |
| V.3 jaki procent | mat7_percent | 1 |
| V.4 liczba z danego procentu | mat7_percent | 1 |
| V.5 obliczenia praktyczne, podwyżki i obniżki | mat7_percent | 3 |
| VI.1 sprawdzanie rozwiązania | mat7_equations | 2 |
| VI.2 równania pierwszego stopnia, równania równoważne | mat7_equations | 4 |
| VI.3 równania po przekształceniach, sprzeczne i tożsamościowe | mat7_equations | 3 |
| VI.4 zadania tekstowe (w tym z procentami) | mat7_equations | 3 |
| VI.5 przekształcanie wzorów | mat7_equations | 2 |
| VII.1 wielkości wprost proporcjonalne | mat7_percent | 2 |
| VII.2 wyznaczanie wartości | mat7_percent | 2 |
| VII.3 podział proporcjonalny | mat7_percent | 2 |
| VIII.1 kąty wierzchołkowe i przyległe | mat7_geometry | 2 |
| VIII.2 proste równoległe i prostopadłe | mat7_geometry | 2 |
| VIII.3 kąty przy prostych równoległych | mat7_geometry | 1 |
| VIII.4 cechy przystawania trójkątów | mat7_geometry | 2 |
| VIII.5 nierówność trójkąta | mat7_geometry | 2 |
| VIII.6 suma kątów trójkąta, trójkąt równoramienny | mat7_geometry | 3 |
| VIII.7 twierdzenie Pitagorasa (patrz uwaga) | mat7_geometry | 4 |
| IX.1 wielokąt foremny | mat7_geometry | 1 |
| IX.2 wzory na pola figur | mat7_geometry | 7 |
| X.1 zbiory na osi liczbowej | mat7_geometry | 1 |
| X.2 współrzędne punktów kratowych | mat7_geometry | 3 |
| X.3 rysowanie punktów, ćwiartki | mat7_geometry | 1 |
| XI.1 rozpoznawanie graniastosłupów i ostrosłupów | mat7_solids | 6 |
| XI.2 objętość i pole graniastosłupa | mat7_solids | 6 |
| XII.1 zliczanie obiektów | mat7_stats | 1 |
| XII.2 proste doświadczenia losowe, prawdopodobieństwo | mat7_stats | 5 |
| XIII.1 interpretacja tabel i diagramów | mat7_stats | 2 |
| XIII.2 tworzenie diagramów i wykresów | mat7_stats | 2 |
| XIII.3 średnia arytmetyczna | mat7_stats | 3 |

**Pominięte (0 kart):** VIII.8 (dowody geometryczne, umiejętność; klasa 8), X.4–6, XI.3, XIV, XV (klasa 8).
Kategoria `mat7_other` nieużyta.
**Razem: 124 karty** (numbers 24, algebra 18, percent 15, equations 14, geometry 28, solids 12, stats 13);
96 `qa`, 28 `cloze`; trudność 1: 52, 2: 52, 3: 20.

## Chemia (7 klasa)

**Źródło:** [zpe.gov.pl, chemia](https://zpe.gov.pl/podstawa-programowa/szkola-podstawowa/chemia) (Dz.U. 2017 poz. 356,
zm. Dz.U. 2024 poz. 996). Podstawa łączy klasy VII–VIII. **Założenie:** klasa 7 = działy I–V, dział VI (wodorotlenki
i kwasy) i dalsze = klasa 8. II.13 (tlenki) przypisane do `chem7_bonding` (alternatywnie `chem7_air`).

| Wymaganie | Kategoria | Kart |
|---|---|---|
| I.1 właściwości substancji codziennych | chem7_substances | 2 |
| I.2 piktogramy, BHP | chem7_lab | 3 |
| I.3 stany skupienia | chem7_substances | 2 |
| I.4 dyfuzja, rozpuszczanie, zmiany stanu | chem7_substances | 3 |
| I.5 mieszaniny jednorodne i niejednorodne | chem7_substances | 3 |
| I.6 metody rozdzielania mieszanin | chem7_substances | 3 |
| I.7 mieszanina, związek, pierwiastek | chem7_substances | 2 |
| I.8 metale i niemetale | chem7_substances | 2 |
| I.9 symbole pierwiastków | chem7_substances | 3 |
| I.10 masa, gęstość, objętość | chem7_substances | 2 |
| II.1 pierwiastek a liczba atomowa | chem7_atoms | 2 |
| II.2 powłoki, elektrony walencyjne | chem7_atoms | 2 |
| II.3 protony, neutrony, elektrony, zapis A/Z | chem7_atoms | 3 |
| II.4 izotopy | chem7_atoms | 2 |
| II.5 dane z układu okresowego | chem7_atoms | 2 |
| II.6 tendencje w grupach i okresach | chem7_atoms | 2 |
| II.7 atom a cząsteczka, zapisy H2, 2H, 2H2 | chem7_atoms | 2 |
| II.8 elektroujemność, wiązanie jonowe i kowalencyjne | chem7_bonding | 3 |
| II.9 wzory sumaryczne i strukturalne | chem7_bonding | 3 |
| II.10 kationy i aniony | chem7_bonding | 3 |
| II.11 związki kowalencyjne a jonowe | chem7_bonding | 2 |
| II.12 wartościowość | chem7_bonding | 2 |
| II.13 nazwy i wzory tlenków | chem7_bonding | 2 |
| III.1 zjawisko fizyczne a reakcja chemiczna | chem7_reactions | 3 |
| III.2 równania reakcji, bilansowanie | chem7_reactions | 3 |
| III.3 reakcje egzo- i endotermiczne | chem7_reactions | 2 |
| III.4 katalizator | chem7_reactions | 1 |
| IV.1 tlen | chem7_air | 2 |
| IV.2 tlenki, ozon, korozja | chem7_air | 3 |
| IV.3 dwutlenek węgla | chem7_air | 3 |
| IV.4 wodór; NH3, HCl, H2S | chem7_air | 2 |
| IV.5 skład powietrza | chem7_air | 3 |
| IV.6 gazy szlachetne | chem7_air | 2 |
| IV.7 zanieczyszczenia powietrza | chem7_air | 2 |
| V.1 cząsteczka wody, koloidy, zawiesiny | chem7_water | 2 |
| V.2 rozpuszczalność, skład mineralny wód | chem7_water | 1 |
| V.3 szybkość rozpuszczania | chem7_water | 1 |
| V.4 roztwór nasycony i nienasycony | chem7_water | 3 |
| V.5 odczyt rozpuszczalności z wykresu | chem7_water | 2 |
| V.6 stężenie procentowe | chem7_water | 3 |

**Pominięte:** doświadczenia (28 propozycji), działy VI–X. **Brak kategorii:** dział VI, gdyby trafił do klasy 7.
**Suma: 93.**

## Fizyka (7 klasa)

**Źródło:** [zpe.gov.pl, fizyka](https://zpe.gov.pl/podstawa-programowa/szkola-podstawowa/fizyka). Klasy VII–VIII łącznie.
**Założenie:** klasa 7 = działy I–V (I wymagania przekrojowe, II ruch i siły, III energia, IV zjawiska cieplne,
V właściwości materii z hydrostatyką); VI elektryczność i dalsze = klasa 8. Część podręczników przenosi dział V do klasy 8.

| Wymaganie | Kategoria | Kart |
|---|---|---|
| I.5 niepewność pomiaru | fiz7_intro | 2 |
| I.6 cyfry znaczące | fiz7_intro | 1 |
| I.7 przedrostki i jednostki | fiz7_intro | 3 |
| I.8 proporcjonalność | fiz7_intro | 2 |
| II.1 ruch względny | fiz7_motion | 2 |
| II.2 tor a droga | fiz7_motion | 2 |
| II.3 jednostki czasu | fiz7_motion | 1 |
| II.4 prędkość | fiz7_motion | 4 |
| II.5 ruch jednostajny | fiz7_motion | 2 |
| II.6 wykresy ruchu jednostajnego | fiz7_motion | 3 |
| II.7 ruch jednostajnie przyspieszony i opóźniony | fiz7_motion | 2 |
| II.8 przyspieszenie | fiz7_motion | 4 |
| II.9 przyspieszenie z wykresu v(t) | fiz7_motion | 2 |
| II.10 siła jako wektor | fiz7_forces | 3 |
| II.11 rodzaje sił | fiz7_forces | 3 |
| II.12 siła wypadkowa | fiz7_forces | 3 |
| II.13 III zasada dynamiki | fiz7_forces | 2 |
| II.14 I zasada dynamiki | fiz7_forces | 2 |
| II.15 bezwładność, II zasada dynamiki | fiz7_forces | 4 |
| II.16 spadek swobodny | fiz7_forces | 2 |
| II.17 ciężar i masa | fiz7_forces | 3 |
| III.1 praca | fiz7_energy | 3 |
| III.2 moc | fiz7_energy | 3 |
| III.3 rodzaje energii | fiz7_energy | 4 |
| III.4 zmiany energii | fiz7_energy | 3 |
| III.5 zasada zachowania energii | fiz7_energy | 3 |
| IV.1 temperatura, równowaga termiczna | fiz7_heat | 2 |
| IV.2 skale Celsjusza i Kelvina | fiz7_heat | 2 |
| IV.3 energia wewnętrzna | fiz7_heat | 2 |
| IV.4 temperatura a energia cząsteczek | fiz7_heat | 2 |
| IV.5 przewodnictwo cieplne, izolacja | fiz7_heat | 3 |
| IV.6 konwekcja | fiz7_heat | 2 |
| IV.7 przemiany fazowe | fiz7_heat | 4 |
| V.1 gęstość, budowa mikroskopowa | fiz7_matter | 2 |
| V.2 obliczenia z gęstością | fiz7_matter | 2 |
| V.3 parcie i ciśnienie | fiz7_pressure | 3 |
| V.4 ciśnienie atmosferyczne | fiz7_pressure | 2 |
| V.5 prawo Pascala | fiz7_pressure | 2 |
| V.6 ciśnienie hydrostatyczne | fiz7_pressure | 3 |
| V.7 siła wyporu, prawo Archimedesa | fiz7_pressure | 4 |
| V.8 siły międzycząsteczkowe, napięcie powierzchniowe | fiz7_matter | 2 |

**Pominięte:** I.1–I.4, I.9, II.18, IV.8, V.9 (doświadczenia i BHP), działy VI–IX (klasa 8). **Suma: 105** (do
przycięcia do ok. 100).

## Biologia (7 klasa)

**Źródło:** [zpe.gov.pl, biologia](https://zpe.gov.pl/podstawa-programowa/szkola-podstawowa/biologia). Klasa 7 = dział
**III „Organizm człowieka”** (III.1–III.11); dział IV „Homeostaza” przyjęty jako klasa 8. Plik `data/biologia-7.json`
ma już 51 kart: istniejącym kartom pokrywającym wymaganie dopisać tylko `pp`, nowe dopisać na końcu.

| Wymaganie | Kategoria | Kart |
|---|---|---|
| III.1 skóra | bio7_skin | 8 |
| III.2 układ ruchu | bio7_movement | 9 |
| III.3 układ pokarmowy i odżywianie | bio7_digestion | 12 |
| III.4 układ krążenia | bio7_circulation | 11 |
| III.5 układ odpornościowy | bio7_immune | 8 |
| III.6 układ oddechowy | bio7_breathing | 9 |
| III.7 układ moczowy | bio7_excretion | 6 |
| III.8 układ nerwowy | bio7_nervous | 7 |
| III.8 (część) używki, doping | bio7_health | 4 |
| III.9 narządy zmysłów | bio7_senses | 7 |
| III.10 układ dokrewny | bio7_hormones | 5 |
| III.11 rozmnażanie i rozwój | bio7_reproduction | 8 |
| III.11 (część) choroby przenoszone drogą płciową | bio7_health | 2 |

**Pominięte:** doświadczenia (CO2 w wydychanym powietrzu, odruch kolanowy, receptory dotyku), działy I–II i IV–VIII.
**Uwaga:** `bio7_body` (tkanki, narządy) nie ma wymagania w dziale III (to treść działu I z klasy 5); istniejące karty
w tej kategorii zostają bez `pp`. **Suma: 96** (łącznie z istniejącymi, które dostaną `pp`).

## Geografia (7 klasa)

**Źródło:** [zpe.gov.pl, geografia](https://zpe.gov.pl/podstawa-programowa/szkola-podstawowa/geografia). **Założenie:**
klasa 7 = działy IX–XIII (geografia Polski; „Planeta Nowa 7” zaczyna od Polski), XIV–XVIII (kontynenty) = klasa 8.
W części podręczników XI–XIII mogą być w klasie 8.

| Wymaganie | Kategoria | Kart |
|---|---|---|
| IX.1 położenie i granice | geo7_location | 3 |
| IX.2 współrzędne geograficzne Polski | geo7_location | 2 |
| IX.3 skrajne punkty | geo7_location | 3 |
| IX.4 województwa i stolice | geo7_location | 4 |
| IX.5 orogenezy i zlodowacenia | geo7_nature | 3 |
| IX.6 czynniki klimatu | geo7_nature | 3 |
| IX.7 elementy klimatu | geo7_nature | 2 |
| IX.8 prognozy i zmiany klimatu | geo7_nature | 2 |
| IX.9 Bałtyk | geo7_nature | 3 |
| IX.10 Wisła i Odra | geo7_nature | 3 |
| IX.11 gleby | geo7_nature | 2 |
| IX.12 lasy | geo7_nature | 2 |
| IX.13 formy ochrony przyrody | geo7_nature | 3 |
| IX.14 argumenty za ochroną przyrody | geo7_nature | 0 |
| IX.15 surowce mineralne | geo7_industry | 3 |
| X.1 gęstość zaludnienia | geo7_population | 2 |
| X.2 zmiany liczby ludności po 1945 | geo7_population | 3 |
| X.3 piramida wieku i płci | geo7_population | 2 |
| X.4 przyrost naturalny i rzeczywisty | geo7_population | 2 |
| X.5 migracje zewnętrzne | geo7_population | 2 |
| X.6 zróżnicowanie etniczne, narodowe, wyznaniowe | geo7_population | 2 |
| X.7 sektory gospodarki | geo7_services | 2 |
| X.8 urbanizacja | geo7_population | 3 |
| X.9 warunki rolnictwa | geo7_farming | 3 |
| X.10 uprawy i chów zwierząt | geo7_farming | 3 |
| X.11 struktura przemysłu | geo7_industry | 3 |
| X.12 rodzaje usług | geo7_services | 3 |
| X.13 turystyka, obiekty UNESCO | geo7_services | 3 |
| X.14 osiągnięcia Polaków, polskie firmy | geo7_other | 1 |
| XI.1 ochrona przed powodzią | geo7_regions | 2 |
| XI.2 energetyka | geo7_industry | 2 |
| XI.3 duże miasta a strefa podmiejska | geo7_population | 2 |
| XI.4 migracje a struktura wieku | geo7_population | 2 |
| XI.5 zmiany gospodarcze po 1989 | geo7_industry | 2 |
| XI.6 transport morski, Trójmiasto | geo7_services | 2 |
| XI.7 turystyka w regionach | geo7_regions | 2 |
| XII.1 położenie własnego regionu | geo7_regions | 2 |

**Pominięte:** IX.14, XII.2–6, XIII.1–4 (umiejętności i projekty), działy I–VIII i XIV–XVIII. **Suma: 87.**

## Informatyka (7 klasa)

**Źródło:** [zpe.gov.pl, informatyka](https://zpe.gov.pl/podstawa-programowa/szkola-podstawowa/informatyka). Blok klas
VII–VIII, działy I–V, bez podziału na klasy; podział jest niejednoznaczny (I.2b, I.3, II.2, II.3a i II.3d bywają w klasie 8;
karty dla I.2b i I.3 oznaczone * jako opcjonalne).

| Wymaganie | Kategoria | Kart |
|---|---|---|
| I.1 specyfikacja problemu, zapis algorytmu | inf7_algorithms | 4 |
| I.2a algorytmy na liczbach, algorytm Euklidesa | inf7_algorithms | 5 |
| I.2b wyszukiwanie i sortowanie * | inf7_algorithms | 3 |
| I.3 kod binarny, ASCII, wartości logiczne * | inf7_computer | 3 |
| II.1 programowanie: zmienne, warunki, pętle, funkcje, tablice | inf7_programming | 12 |
| II.3a edycja zdjęć i filmów | inf7_media | 4 |
| II.3b dokumenty tekstowe | inf7_office | 8 |
| II.3c arkusz kalkulacyjny | inf7_office | 10 |
| II.3d prezentacja i strona WWW | inf7_media | 5 |
| II.4 formaty zapisu, wydruk | inf7_office | 3 |
| II.5 wyszukiwanie informacji w internecie | inf7_other | 2 |
| III.1 sieci komputerowe i internet | inf7_computer | 10 |
| III.3 terminologia informatyczna | inf7_computer | 4 |
| IV.2 ocena wiarygodności źródeł | inf7_safety | 4 |
| V.1 etyka, prywatność, własność intelektualna | inf7_safety | 5 |
| V.3 licencje | inf7_safety | 5 |

**Pominięte:** II.2 (robot), III.2, IV.1, V.2 (umiejętności i postawy). **Suma: 87** (81 bez kart opcjonalnych).

## Język polski (7 klasa), numeracja do weryfikacji

**Źródło:** [zpe.gov.pl, język polski](https://zpe.gov.pl/podstawa-programowa/szkola-podstawowa/jezyk-polski), wymagania
klas VII–VIII (plus IV–VI). Rozkład na klasę 7 to założenie.

**Lektury obowiązkowe klas VII–VIII (po zmianach 2024):** Dickens *Opowieść wigilijna*; Fredro *Zemsta*; Kamiński
*Kamienie na szaniec*; Mickiewicz *Dziady* cz. II, *Reduta Ordona*, *Świtezianka*, *Pan Tadeusz* (ks. I, II, IV, X, XI,
XII); Saint-Exupéry *Mały Książę*; Słowacki *Balladyna*; Kochanowski (fraszki, pieśń, treny VII i VIII); Mrożek
*Artysta*; Sienkiewicz *Latarnik*, *Quo vadis* (fragm.); Żeromski *Syzyfowe prace* (fragm.); wiersze Baczyńskiego,
Herberta, Leśmiana, Miłosza, Różewicza, Szymborskiej; aforyzmy Leca. Typowo w klasie 7: *Opowieść wigilijna*, *Zemsta*,
*Balladyna*, *Mały Książę*, Kochanowski, ballady, *Latarnik*, *Kamienie na szaniec*; reszta w klasie 8 (konwencja
podręcznikowa). **Propozycja:** karty dla całej listy VII–VIII, z `pp` wskazującym lekturę.

| Wymaganie | Kategoria | Kart |
|---|---|---|
| lektury (11 pozycji listy VII–VIII, 3–6 kart na lekturę) | pol7_books | 53 |
| I.1.1 rodzaje literackie | pol7_theory | 3 |
| I.1.2 gatunki: komedia, fraszka, pieśń, tren, ballada, epopeja, tragedia | pol7_theory | 6 |
| I.1.3 budowa dramatu: akt, scena, didaskalia | pol7_theory | 4 |
| I.1.4 neologizm, apostrofa, symbol, alegoria | pol7_theory | 4 |
| I.1.5 komizm, ironia | pol7_theory | 2 |
| I.2 reportaż, wywiad, artykuł; teksty naukowe i publicystyczne | pol7_theory | 3 |
| II.1.1 upodobnienia fonetyczne | pol7_grammar | 2 |
| II.1.2 słowotwórstwo: rdzeń, formant, rodzina wyrazów | pol7_grammar | 4 |
| II.1.3 imiesłowy, równoważniki zdań | pol7_grammar | 4 |
| II.1.4 zdania wielokrotnie złożone, mowa zależna i niezależna | pol7_grammar | 4 |
| II.1.5 akcent, odmiana nazw własnych | pol7_grammar | 3 |
| II.2 archaizmy, kolokwializmy, zapożyczenia, homonimy, style | pol7_grammar | 3 |
| II.4 ortografia (ó/u, rz/ż, ch/h, „nie”) | pol7_spelling | 5 |
| II.4 interpunkcja przy cytowaniu | pol7_spelling | 3 |
| III.2 formy: recenzja, rozprawka, podanie, CV, list motywacyjny, przemówienie, wywiad | pol7_writing | 7 |
| III.1 teza, hipoteza, argument a przykład | pol7_writing | 2 |

**Pominięte:** interpretacja w kontekstach, dyskusja, streszczanie, redagowanie, recytacja, normy grzecznościowe.
**Suma: 112.**

## Historia (7 klasa), numeracja działów do weryfikacji

**Źródło:** [zpe.gov.pl, historia](https://zpe.gov.pl/podstawa-programowa/szkola-podstawowa/historia). ZPE podaje
zalecany (nieobowiązkowy) podział: klasa VII = działy XIX–XXX, klasa VIII = XXXI–XLI. Dział napoleoński jest w tekście ZPE
zapisany „XVIIII” (prawdopodobnie XVIII), więc numery XVIII/XIX trzeba sprawdzić w ISAP.

| Wymaganie | Kategoria | Kart |
|---|---|---|
| XVIII.1 przemiany za Napoleona, Kodeks Napoleona | his7_napoleon | 4 |
| XVIII.2 Legiony, Księstwo Warszawskie | his7_napoleon | 5 |
| XIX.1 kongres wiedeński | his7_vienna | 5 |
| XIX.2 rewolucja przemysłowa | his7_industry | 5 |
| XX.1 Królestwo Polskie 1815–1830 | his7_partitions | 5 |
| XX.2 powstanie listopadowe | his7_uprisings | 6 |
| XX.3 Polacy w zaborach, Rzeczpospolita Krakowska | his7_partitions | 3 |
| XX.4 Wielka Emigracja | his7_uprisings | 3 |
| XXI.1–4 powstanie styczniowe | his7_uprisings | 8 |
| XXII.1 zjednoczenie Włoch i Niemiec | his7_vienna | 3 |
| XXII.2 wojna secesyjna | his7_vienna | 3 |
| XXII.3 ekspansja kolonialna | his7_industry | 3 |
| XXII.4 nowe idee, kultura masowa | his7_industry | 4 |
| XXIII.1 rusyfikacja, germanizacja, autonomia galicyjska | his7_partitions | 5 |
| XXIII.2 trójlojalizm, praca organiczna | his7_partitions | 4 |
| XXIII.3–4 ruchy polityczne na ziemiach polskich | his7_partitions | 4 |
| XXIII.5 rewolucja 1905–1907 | his7_partitions | 3 |
| XXIV.1–3 I wojna światowa | his7_ww1 | 6 |
| XXIV.4 rewolucje w Rosji | his7_ww1 | 2 |
| XXV.1–2 sprawa polska w I wojnie | his7_ww1 | 4 |
| XXVI.1–2 ład wersalski | his7_interwar | 4 |
| XXVI.3 totalitaryzmy | his7_interwar | 3 |
| XXVII.1–2 odrodzenie państwa, granice, powstania, plebiscyty | his7_ii_rp | 6 |
| XXVII.3 wojna polsko-bolszewicka | his7_ii_rp | 3 |
| XXVIII.1–5 II RP: konstytucja marcowa, przewrót majowy, polityka zagraniczna | his7_ii_rp | 7 |
| XXIX.1–3 społeczeństwo i gospodarka II RP | his7_ii_rp | 5 |
| XXX.1–2 droga do wojny | his7_interwar | 3 |
| XXX.3 pakt Ribbentrop–Mołotow | his7_interwar | 2 |

**Pominięte:** oceny i porównania bez faktografii, działy XXXI–XLI (klasa 8). **Brak dobrej kategorii:** zjednoczenia
Włoch i Niemiec, wojna secesyjna (dano `his7_vienna`). **Suma: 118** (do przycięcia).

## Język angielski, wariant II.1 (7 klasa)

**Źródło:** [zpe.gov.pl, język obcy nowożytny](https://zpe.gov.pl/podstawa-programowa/szkola-podstawowa/jezyk-obcy-nowozytny),
wariant II.1 (pierwszy język, klasy IV–VIII, bez podziału na klasy). ZPE pokazuje 13 tematów leksykalnych w wymaganiu I
(brief zakładał 14; „życie społeczne” do sprawdzenia w ISAP). Plik `data/angielski-7.json` ma 52 słówka; nowe karty
`awl_word` dopisać na końcu, istniejącym dopisać `pp` tematu. Gramatyka jako `cloze` w `en7_other`.

| Wymaganie | Kategoria | Kart |
|---|---|---|
| I.1 człowiek | en7_people | 10 |
| I.2 miejsce zamieszkania | en7_home | 9 |
| I.3 edukacja | en7_school | 8 |
| I.4 praca | en7_work | 7 |
| I.5 życie prywatne | en7_family | 9 |
| I.6 żywienie | en7_food | 8 |
| I.7 zakupy i usługi | en7_shopping | 8 |
| I.8 podróżowanie i turystyka | en7_travel | 9 |
| I.9 kultura | en7_culture | 7 |
| I.10 sport | en7_sport | 7 |
| I.11 zdrowie | en7_health | 8 |
| I.12 nauka i technika | en7_science | 7 |
| I.13 świat przyrody | en7_nature | 8 |
| I.14? życie społeczne (brak w tekście ZPE, do weryfikacji) | en7_society | 0 |
| środki językowe: czasy, Present Perfect, stopniowanie, tryby warunkowe, strona bierna (cloze) | en7_other | 6 |

**Pominięte:** II–XIV (sprawności). **Suma: 111.**

## Język niemiecki, wariant II.2 (7 klasa)

**Źródło:** jak wyżej, wariant II.2 (drugi język, klasy VII–VIII od podstaw, poziom ok. A1, 12 tematów bez „nauki
i techniki”). Wspólne dla klas VII–VIII; cały zakres jako klasa 7 (założenie). Gramatyki podstawa nie wylicza,
`de7_grammar` to dodatek.

| Wymaganie | Kategoria | Kart |
|---|---|---|
| I.1 człowiek | de7_people | 10 |
| I.5 życie prywatne: rodzina, święta | de7_family | 8 |
| I.2 miejsce zamieszkania | de7_home | 8 |
| I.3 edukacja | de7_school | 8 |
| I.6 żywienie | de7_food | 8 |
| I.7 zakupy i usługi | de7_shopping | 7 |
| I.5 / I.10 czas wolny, określanie czasu, sport | de7_free_time | 9 |
| I.8 podróżowanie | de7_travel | 7 |
| I.11 zdrowie | de7_health | 6 |
| I.12 świat przyrody: pogoda, zwierzęta | de7_nature | 8 |
| I.4 praca | de7_other | 4 |
| I.9 kultura | de7_other | 3 |
| gramatyka A1: rodzajniki, sein/haben, szyk, przeczenie, liczby, zaimki (cloze) | de7_grammar | 12 |

**Pominięte:** II–XIV. **Brak kategorii:** praca, kultura. **Suma: 98.**

## Edukacja zdrowotna (7 klasa)

**Źródło:** nowa podstawa (Dz.U. 2026 poz. 378 w brzmieniu Dz.U. 2026 poz. 958, część „Edukacja zdrowotna”), blok
„Klasy VII i VIII” (podział na klasę 7 i 8 nie jest określony). Dziewięć działów: 1 wartości i postawy, 2 zdrowie
fizyczne, 3 aktywność fizyczna, 4 odżywianie, 5 zdrowie psychiczne, 6 zdrowie społeczne, 7 dojrzewanie, 8 zdrowie
środowiskowe, 9 internet i profilaktyka uzależnień. Wymagania „do wyboru” oznaczone `w`. Numeracja `dział.punkt`.

| Wymaganie | Kategoria | Kart |
|---|---|---|
| 1.1–1.3 godność, akceptacja, zdrowie jako wartość | ez7_other | 1 |
| 1.5 prospołeczność: krwiodawstwo, szczepienia, wolontariat | ez7_system | 3 |
| 2.1 czynniki wpływające na zdrowie | ez7_physical | 2 |
| 2.2 choroby zakaźne, drogi przenoszenia, sepsa | ez7_physical | 5 |
| 2.3 profilaktyka, epidemia i pandemia | ez7_physical | 3 |
| 2.4 szczepienia obowiązkowe i zalecane, dezinformacja | ez7_system | 5 |
| 2.5 modyfikowalne czynniki ryzyka | ez7_physical | 4 |
| 2.6 bariery dla osób z niepełnosprawnością | ez7_social | 1 |
| 2.w1 choroby odzwierzęce, kleszcze | ez7_physical | 2 |
| 2.w2 choroby przewlekłe i cywilizacyjne | ez7_physical | 5 |
| 3.1–3.2 aktywność, 24-godzinny plan dnia | ez7_activity | 4 |
| 3.3 postawa ciała | ez7_activity | 3 |
| 3.4 aktywny transport | ez7_activity | 3 |
| 3.5 hartowanie | ez7_activity | 3 |
| 3.w1–w2 korzyści i bariery aktywności | ez7_activity | 3 |
| 4.1 talerz zdrowego żywienia | ez7_nutrition | 5 |
| 4.2 napoje izotoniczne, posiłki a wysiłek | ez7_nutrition | 2 |
| 4.3 celiakia, cukrzyca typu 1, Hashimoto, alergie | ez7_nutrition | 5 |
| 4.4 diety, suplementy, napoje energetyzujące | ez7_nutrition | 4 |
| 5.1–5.2 emocje, poczucie własnej wartości | ez7_mental | 4 |
| 5.3 obraz ciała a media społecznościowe | ez7_mental | 3 |
| 5.4 pierwsza pomoc emocjonalna | ez7_mental | 3 |
| 5.w2 depresja, lęk, zaburzenia odżywiania | ez7_mental | 4 |
| 6.1 zakochanie, miłość | ez7_social | 4 |
| 6.2 relacje w rodzinie | ez7_social | 1 |
| 6.3 manipulacja, asertywność | ez7_social | 3 |
| 6.4 konflikty, mediacje | ez7_social | 3 |
| 7.1 etapy życia | ez7_puberty | 2 |
| 7.2 rozwój płciowy, urazy | ez7_puberty | 3 |
| 7.3 produkty menstruacyjne | ez7_puberty | 3 |
| 8.1 klimat i środowisko a zdrowie | ez7_environment | 5 |
| 8.2 bioróżnorodność a zdrowie | ez7_environment | 2 |
| 9.1 relacje cyfrowe, dane osobowe, patostreaming | ez7_addictions | 4 |
| 9.2 cyberprzemoc, hejt, uzależnienie od gier | ez7_addictions | 4 |
| 9.3 substancje psychoaktywne | ez7_addictions | 6 |
| 9.4 presja, asertywność, higiena cyfrowa | ez7_addictions | 3 |

**Pominięte:** 1.4, 5.w1, 8.3, działania praktyczne (debata, kampania, wywiad). **Słabe dopasowanie:** `ez7_system`
(podstawa nie ma działu „ochrona zdrowia”). **Suma: 120.**

---

# Ścieżka `ib`: IB Pre-DP 1

Wspólne źródło dla przedmiotów polskiej podstawy: Dz.U. 2018 poz. 467 po zmianach Dz.U. 2024 poz. 1019, zakres
podstawowy; strony `zpe.gov.pl/podstawa-programowa/liceum-technikum/<przedmiot>` (część slugów dała 404, do sprawdzenia).
Podstawa nie dzieli treści na klasy: wszystkie rozkłady na klasę 1 są założeniem wg podręczników.

## Język polski, Polish (IB Pre-DP 1), numeracja do weryfikacji

**Założenie klasy 1:** Biblia, antyk, średniowiecze, renesans, barok, początek oświecenia (lektury poz. 1–18 wykazu);
poz. 19+ (od Mickiewicza) to klasy 2–4. Po 2024 część lektur przeniesiono do uzupełniających (Odyseja w całości,
Platon, Arystoteles, Eneida, Hamlet, Treny jako cykl).

Lektury klasy 1: Biblia (Rdz, Hiob, Koh, PnP, Psalmy, Apokalipsa); Parandowski *Mitologia* cz. I; Homer *Iliada*
i *Odyseja* (fragm.); Sofokles *Antygona*; Horacy; *Bogurodzica*, *Lament świętokrzyski*, *Legenda o św. Aleksym*,
*Rozmowa Mistrza Polikarpa ze Śmiercią*; *Kwiatki św. Franciszka*; *Pieśń o Rolandzie*; Gall Anonim; Dante (fragm.);
Kochanowski (pieśni, psalmy, treny IX–XI, XIX, *Odprawa posłów greckich*); Skarga *Kazania sejmowe*; Naborowski,
Morsztyn, Sęp Szarzyński; Pasek; Szekspir *Makbet*, *Romeo i Julia*; Molier *Skąpiec*; Krasicki; Karpiński.

| Wymaganie | Kategoria | Kart |
|---|---|---|
| I.1.7 lektury antyczne i biblijne (Biblia 6, Mitologia 5, Homer 4, Antygona 4, Horacy 3) | plib_antiquity | 22 |
| I.1.10 motywy i toposy biblijne i antyczne | plib_antiquity | 4 |
| I.2.4 teatr grecki, katharsis; nurty filozoficzne | plib_antiquity | 5 |
| I.1.7 lektury średniowieczne (Bogurodzica i in., Kwiatki, Roland, Gall, Dante) | plib_medieval | 13 |
| I.1.7 Kochanowski, Skarga, Szekspir | plib_renaissance | 14 |
| I.1.7 Naborowski, Morsztyn, Sęp Szarzyński, Pasek, Molier | plib_baroque | 8 |
| I.1.7 Krasicki, Karpiński | plib_enlight | 5 |
| I.1.1 periodyzacja | plib_theory | 3 |
| I.1.2 konwencje literackie | plib_theory | 3 |
| I.1.3 gatunki: epos, oda, tragedia, psalm, sonet, kronika, satyra, sielanka | plib_theory | 7 |
| I.1.4 środki wyrazu | plib_theory | 5 |
| I.1.5–6 alegoria, symbol, ironia, komizm, tragizm, patos | plib_theory | 4 |
| I.1.9 świat przedstawiony, narracja, sytuacja liryczna | plib_theory | 2 |
| II.1.1–4 gramatyka | plib_language | 4 |
| II.2.1–3,6 style, stylizacje, biblizmy, mitologizmy | plib_language | 5 |
| II.3.1–3,8 znak, akt komunikacji, funkcje tekstu, manipulacja | plib_language | 5 |
| II.4.1 ortografia i interpunkcja | plib_language | 4 |
| III.1.1–5 retoryka (brak kategorii) | plib_other | 3 |

**Pominięte:** I.1.8, I.1.11–15, I.2.1–3,5–6, II.2.4–5,7, II.3.4–7,9–10, III.2, IV. **Suma: 118** (do przycięcia).

## History of Poland (IB Pre-DP 1), numeracja do weryfikacji

**Założenie klasy 1:** działy I–XIII (starożytność i średniowiecze); z nich historia Polski to IX (Polska
wczesnopiastowska), X (rozbicie dzielnicowe), XII (Polska XIV–XV w.) i część XIII (kultura). Jagiellonowie
w całości, Rzeczpospolita Obojga Narodów, zabory, II RP, wojna, PRL, III RP to klasy 2–4 (0 kart).

| Wymaganie | Kategoria | Kart |
|---|---|---|
| IX.1 narodziny państwa, chrzest, zjazd gnieźnieński | hpl_piast | 6 |
| IX.2 zmiany terytorialne X–XII w. | hpl_piast | 4 |
| IX.3 Krzywousty, statut 1138 | hpl_piast | 4 |
| IX.4 Polska a Europa | hpl_piast | 3 |
| X.1 przyczyny i skutki rozbicia dzielnicowego | hpl_piast | 5 |
| X.2 Brandenburgia, Krzyżacy, Mongołowie | hpl_piast | 4 |
| X.3 kolonizacja na prawie niemieckim | hpl_piast | 5 |
| X.4 przezwyciężanie rozbicia | hpl_piast | 4 |
| X.5 zestawienie wydarzeń | hpl_piast | 2 |
| XII.1 zjednoczenie, Kazimierz Wielki | hpl_piast | 7 |
| XII.2 monarchia stanowa, przywileje | hpl_jagiellon | 7 |
| XII.3 unie z Węgrami i Litwą | hpl_jagiellon | 6 |
| XII.4 Grunwald, pokój toruński | hpl_jagiellon | 6 |
| XII.5 zestawienie wydarzeń | hpl_jagiellon | 2 |
| XIII.2–4 kultura polskiego średniowiecza (brak kategorii) | hpl_other | 5 |

**Pominięte:** historia powszechna (I–VIII, XI, XIV, XIII.1), działy klas 2–4. **Suma: 70.**

## Edukacja obywatelska (IB Pre-DP 1)

**Źródło:** Dz.U. 2025 poz. 382 (pełny tekst). **Uwaga formalna:** wg § 2 ust. 2 przedmiot jest realizowany od klasy II
(2025/26) i III (2026/27); klasa 1 nie jest objęta, a od 2027 wchodzi nowa podstawa. Skoro w planie Pre-DP 1 jest, szkoła
realizuje go po swojemu: **do decyzji, czy robić karty**. Siedem działów: I ja i społeczeństwo, II szkoła, III społeczność
lokalna, IV demokracja i prawo, V Polska (władza, polityka), VI Polska w Europie, VII świat. Założenie: pierwszy rok =
działy I–IV (ok. 64 karty). Wymagania fakultatywne oznaczone `F`.

| Wymaganie | Kategoria | Kart |
|---|---|---|
| I.1–5, I.F4–6 patriotyzm, obywatel, grupy, współpraca | eo_society | 11 |
| II.1, II.3, II.F3 reguły szkolne, samorząd uczniowski, mediacje | eo_society | 6 |
| III.1–6, III.F2 gmina, powiat, województwo, budżet obywatelski, młodzieżowe rady | eo_local | 15 |
| IV.1–2 ustrój po 1945, zmiana ustroju 1989 | eo_state | 6 |
| IV.3 Konstytucja RP | eo_state | 5 |
| IV.4–5, IV.F1 zagrożenia demokracji, wybory | eo_state | 6 |
| IV.7–8 prawa człowieka | eo_rights | 7 |
| IV.6, IV.9, IV.F2,F5,F6 prawo, źródła prawa, stosunek pracy | eo_law | 11 |
| V.1–7, V.9–10, V.13 proces ustawodawczy, Sejm, Senat, Prezydent, rząd, sądy, partie | eo_state | 23 |
| V.11–12, V.F5 media | eo_media | 8 |
| VI.1–3, VI.F1–2 Unia Europejska | eo_world | 8 |
| VII.1–5, VII.F4 zależności globalne | eo_world | 9 |

**Pominięte:** II.2, V.8, działania obywatelskie i projekt. **Suma: 115** (pierwszy rok ok. 64).

## Przedmioty IB po angielsku (bez weryfikacji źródeł online)

Poniższe mapowania pochodzą z wiedzy ogólnej agenta bez pobrania tekstów (zpe.gov.pl, ibo.org). Struktura jest
prawdopodobnie poprawna, ale **numery wymagań nie są podane** (agent nie miał tekstu) i przed generowaniem kart trzeba
pobrać właściwy dział podstawy i uzupełnić `pp`. Nazwy tematów IB: Biology 2025 (A–D), Chemistry 2025 (Structure 1–3,
Reactivity 1–3), Physics 2025 (A–E), Maths AA/AI (1–5), Language B (5 tematów) są pewne; CS (pierwszy egzamin 2027)
i Psychology (2027) do sprawdzenia na ibo.org.

### Biology (IB Pre-DP 1)

Klasa 1 (założenie): metodyka, chemizm życia, komórka, metabolizm i enzymy, podziały komórkowe. Plik `data/biology.json`
ma 56 kart (istniejącym dopisać `pp`).

| Wymaganie | Kategoria | Kart |
|---|---|---|
| skład chemiczny organizmów, woda | bio_molecules | 8 |
| węglowodany, lipidy, białka, kwasy nukleinowe | bio_molecules | 14 |
| komórka pro- i eukariotyczna, organelle | bio_cells | 14 |
| błona, transport (dyfuzja, osmoza, transport aktywny) | bio_cells | 8 |
| mikroskop, preparaty | bio_skills | 4 |
| enzymy | bio_molecules | 8 |
| metabolizm, ATP, fotosynteza i oddychanie (ogólnie) | bio_molecules | 12 |
| cykl komórkowy, mitoza, mejoza | bio_cells | 10 |
| metodyka badań: hipoteza, próba kontrolna, zmienne | bio_skills | 6 |
| IB D1 replikacja, transkrypcja, translacja (słownictwo) | bio_genetics | 6 |
| słownictwo ogólne: taksonomia, homeostaza | bio_general | 6 |

**Suma: ~96.** Nieużywane w klasie 1: bio_human, bio_plants, bio_ecology.

### Chemistry (IB Pre-DP 1)

Klasa 1 (założenie): atom, układ okresowy, wiązania, mol i stechiometria, roztwory. Kwasy i zasady, redoks, organiczna
to klasy 2–3.

| Wymaganie | Kategoria | Kart |
|---|---|---|
| budowa atomu, liczba atomowa i masowa, izotopy | chemib_atoms | 10 |
| konfiguracja elektronowa | chemib_atoms | 6 |
| układ okresowy: grupy, okresy, tendencje | chemib_periodic | 12 |
| wiązania jonowe, kowalencyjne, metaliczne, polarność | chemib_bonding | 12 |
| oddziaływania międzycząsteczkowe | chemib_bonding | 6 |
| mol, masa molowa, objętość molowa | chemib_mole | 10 |
| stechiometria, wzory empiryczne, wydajność | chemib_mole | 10 |
| roztwory, stężenia (brak kategorii „roztwory”) | chemib_mole | 8 |
| rodzaje reakcji, równania | chemib_reactions | 8 |
| IB Structure 3 (wstęp), grupy funkcyjne | chemib_periodic / chemib_organic | 4 |
| sprzęt i BHP | chemib_skills | 6 |

**Suma: ~92.**

### Physics (IB Pre-DP 1)

Klasa 1 (założenie): wymagania przekrojowe, kinematyka, dynamika, energia, grawitacja.

| Wymaganie | Kategoria | Kart |
|---|---|---|
| wielkości, jednostki SI, niepewność, przedrostki | physib_measure | 10 |
| kinematyka: droga, prędkość, przyspieszenie, spadek swobodny | physib_motion | 16 |
| dynamika: zasady Newtona, siła, masa, tarcie | physib_motion | 14 |
| pęd i jego zachowanie | physib_motion | 6 |
| praca, moc, energia, zasada zachowania energii | physib_energy | 14 |
| grawitacja (brak kategorii; dano physib_motion) | physib_motion | 8 |
| IB B.1 thermal energy transfers (wstęp) | physib_thermal | 6 |
| IB C/D/E nazwy tematów jako słownik | physib_waves / electric / nuclear | 6 |

**Suma: ~80.**

### Mathematics (IB Pre-DP 1)

Klasa 1 (założenie): liczby rzeczywiste, wyrażenia algebraiczne, równania i nierówności, funkcje, funkcja liniowa,
układy równań, planimetria.

| Wymaganie | Kategoria | Kart |
|---|---|---|
| liczby rzeczywiste: zbiory, wartość bezwzględna, potęgi, pierwiastki, procenty | mathib_number | 14 |
| wzory skróconego mnożenia, rozkład na czynniki | mathib_number | 10 |
| równania i nierówności, układy równań | mathib_number | 12 |
| funkcje: dziedzina, zbiór wartości, miejsce zerowe, monotoniczność | mathib_functions | 14 |
| funkcja liniowa | mathib_functions | 8 |
| planimetria: kąty, trójkąty, Pitagoras, Tales, okrąg, pola | mathib_geometry | 16 |
| IB 2 (domain, range, composite, inverse) | mathib_functions | 6 |
| IB 3 trygonometria w trójkącie prostokątnym | mathib_geometry | 6 |
| IB 4 mean, median, quartile | mathib_stats | 6 |

**Suma: ~92.** Calculus: 0.

### History (IB Pre-DP 1)

Klasa 1 (założenie): starożytność i średniowiecze (historia powszechna).

| Wymaganie | Kategoria | Kart |
|---|---|---|
| Mezopotamia, Egipt, Fenicjanie, Żydzi | histib_early | 10 |
| Grecja: polis, Ateny i Sparta, wojny perskie, Aleksander | histib_early | 14 |
| Rzym: republika, cesarstwo, prawo, chrześcijaństwo | histib_early | 14 |
| Bizancjum, islam, Frankowie, Karol Wielki | histib_early | 10 |
| feudalizm, Kościół, krucjaty, miasta | histib_early | 12 |
| Polska w średniowieczu | histib_early | 8 |
| późne średniowiecze: wojna stuletnia, czarna śmierć | histib_early | 8 |
| IB: analiza źródeł (origin, purpose, value, limitations) | histib_skills | 8 |
| IB prescribed subjects (nazwy) | histib_states / histib_coldwar | 4 |

**Suma: ~88.**

### Geography (IB Pre-DP 1)

Klasa 1 (założenie): mapa, Ziemia we wszechświecie, atmosfera, hydrosfera, litosfera.

| Wymaganie | Kategoria | Kart |
|---|---|---|
| mapa: skala, siatka, odwzorowania, GIS | geoib_skills | 14 |
| Ziemia we wszechświecie, ruchy Ziemi, strefy czasowe | geoib_global | 12 |
| atmosfera: skład, ciśnienie, wiatry, strefy klimatyczne | geoib_climate | 18 |
| pogoda i klimat, zmiany klimatu | geoib_climate | 8 |
| hydrosfera | geoib_water | 14 |
| litosfera: płyty, trzęsienia, wulkany | geoib_landforms | 14 |
| wietrzenie, erozja | geoib_landforms | 10 |
| IB core (population, global climate) słownik | geoib_population / geoib_climate | 6 |

**Suma: ~96.**

### Computer Science (IB Pre-DP 1)

| Wymaganie | Kategoria | Kart |
|---|---|---|
| sprzęt, system operacyjny | csib_systems | 12 |
| reprezentacja danych: binarny, szesnastkowy, kodowanie | csib_data | 12 |
| sieci, internet, protokoły | csib_networks | 12 |
| algorytmy: sortowanie, wyszukiwanie, złożoność | csib_algorithms | 14 |
| programowanie: zmienne, warunki, pętle, funkcje, tablice | csib_programming | 16 |
| arkusze i bazy danych | csib_databases | 8 |
| prawo, etyka, ochrona danych, AI | csib_impacts | 10 |

**Suma: ~84.**

### English (IB Pre-DP 1)

Polska podstawa języka obcego (III.1.P) nie zawiera treści literackich; karty tylko z pojęć IB English A:
Language and Literature (`pp` w formie „IB …”).

| Wymaganie | Kategoria | Kart |
|---|---|---|
| literary devices | enib_devices | 20 |
| poetry: stanza, rhyme scheme, meter, sonnet | enib_poetry | 12 |
| prose: narrator, point of view, plot, characterisation | enib_prose | 12 |
| drama: act, scene, soliloquy | enib_drama | 8 |
| non-literary text types | enib_nonlit | 10 |
| rhetoric: ethos, pathos, logos | enib_rhetoric | 10 |
| analysis language | enib_analysis | 8 |
| text types and register | enib_texts | 8 |

**Suma: ~88.**

### Psychology (IB Pre-DP 1)

Brak w polskiej podstawie; wyłącznie IB DP Psychology (nowy guide 2027, nazwy do sprawdzenia).

| Wymaganie | Kategoria | Kart |
|---|---|---|
| research methods, sampling, ethics, validity | psyib_methods | 16 |
| biological approach | psyib_biological | 12 |
| cognitive approach: schema, memory models | psyib_cognitive | 12 |
| sociocultural approach | psyib_social | 12 |
| developmental (wstęp) | psyib_development | 8 |
| health (wstęp) | psyib_health | 6 |
| classic studies (Milgram, Asch, Loftus, Bandura) | psyib_studies | 12 |

**Suma: ~78.**

### German B (IB Pre-DP 1)

Podstawa liceum dla drugiego języka: wariant **III.2** (kontynuacja po SP) albo **III.2.0** (od zera); **do ustalenia**,
który dotyczy klasy. Plus 5 tematów IB Language B.

| Wymaganie | Kategoria | Kart |
|---|---|---|
| człowiek, rodzina, życie towarzyskie; IB Identities | deib_identities | 18 |
| podróże, kultura; IB Experiences | deib_experiences | 14 |
| nauka i technika, media; IB Human ingenuity | deib_ingenuity | 12 |
| praca, szkoła, zdrowie; IB Social organization | deib_social | 14 |
| przyroda, środowisko; IB Sharing the planet | deib_planet | 12 |
| gramatyka: rodzajniki, czasowniki nieregularne, szyk, Perfekt | deib_grammar | 16 |
| frazy komunikacyjne, liczby, daty | deib_other | 8 |

**Suma: ~94.**

### Academic English

Brak podstawy. Najbliższy zapis: podstawa języka angielskiego LO (III.1.P / III.1.R), tworzenie wypowiedzi pisemnych
(list formalny, rozprawka, recenzja, rejestr formalny, spójniki). `vocabulary.json` ma 704 wpisy; **propozycja: pominąć**
w tym zadaniu.

---

# Podsumowanie i pytania przed dalszą pracą

| Ścieżka | Przedmiot | Kart (plan) | Stan |
|---|---|---|---|
| sp7 | Matematyka | 124 | zrobione |
| sp7 | Chemia / Fizyka / Biologia / Geografia / Informatyka | 93 / 105 / 96 / 87 / 87 | źródła zweryfikowane |
| sp7 | Polski / Historia / Angielski / Niemiecki | 112 / 118 / 111 / 98 | numeracja do weryfikacji |
| sp7 | Edukacja zdrowotna | 120 | źródło zweryfikowane (nowa podstawa) |
| ib | Polish / History of Poland | 118 / 70 | numeracja do weryfikacji |
| ib | Edukacja obywatelska | 115 (64 w pierwszym roku) | formalnie nie w klasie 1 |
| ib | Biology / Chemistry / Physics / Mathematics / History / Geography / CS / English / Psychology / German B | ok. 890 łącznie | bez weryfikacji źródeł |

Do decyzji:

1. Twierdzenie Pitagorasa w Matematyce 7 (zależy od podręcznika): zostawić czy usunąć 5 kart `VIII.7`?
2. Edukacja obywatelska: robić karty mimo że podstawa nie przewiduje przedmiotu w klasie 1?
3. German B: wariant III.2 czy III.2.0?
4. Brakujące kategorie: chemia LO „roztwory”, fizyka LO „grawitacja”, historia LO i SP „Europa XIX w.”, polski
   „retoryka”, niemiecki SP „praca”, „kultura”. Dodać działy czy zostawić w `*_other` / najbliższej kategorii?
5. Dla przedmiotów IB po angielsku potrzebny jest drugi przebieg researchu z pobraniem tekstów podstawy (numery `pp`).

---

# Wynik (po wygenerowaniu kart)

| Ścieżka | Przedmiot | Plik | Kart z `pp` (w pliku) | Źródło zweryfikowane |
|---|---|---|---|---|
| sp7 | Matematyka | matematyka-7.json | 140 (w tym 8 `order`, 8 `apply`) | podstawaprogramowa.pl + rozkład GWO |
| sp7 | Biologia | biologia-7.json | 112 (118; w tym 8 `order`, 8 `apply`) | zpe.gov.pl; 45 istniejących kart dostało `pp`, 51 nowych |
| sp7 | Angielski II.1 | angielski-7.json | 111 (113) | zpe.gov.pl; 13 tematów (brak „życia społecznego” w bieżącym tekście); 50 istniejących z `pp`, 61 nowych |
| sp7 | Niemiecki II.2 | niemiecki-7.json | 98 | zpe.gov.pl; 12 tematów, gramatyka `pp: "I"` |
| sp7 | Chemia | chemia-7.json | 118 (w tym 8 `order`, 8 `apply`) | zpe.gov.pl, działy I–V |
| sp7 | Fizyka | fizyka-7.json | 120 (w tym 8 `order`, 8 `apply`) | zpe.gov.pl, działy I–V |
| sp7 | Geografia | geografia-7.json | 102 | zpe.gov.pl, działy IX–XIII |
| sp7 | Informatyka | informatyka-7.json | 87 | zpe.gov.pl, działy I–V (klasy VII–VIII) |
| sp7 | Polski | polski-7.json | 123 | zpe.gov.pl; numery poprawione (patrz niżej) |
| sp7 | Historia | historia-7.json | 112 | zpe.gov.pl; „XVIIII” to literówka = XVIII, numery z tabeli poprawne |
| sp7 | Edukacja zdrowotna | edukacja-zdrowotna-7.json | 111 | PDF Dz.U. 2026 poz. 958, numeracja zgodna |
| ib | Biology | biology.json | 125 (148; w tym 8 `order`, 8 `apply`) | zpe.gov.pl/szkola-ponadpodstawowa; 33 istniejące z `pp`, 76 nowych |
| ib | Chemistry | chemistry.json | 131 (w tym 8 `order`, 8 `apply`) | zpe.gov.pl/szkola-ponadpodstawowa |
| ib | Physics | physics.json | 106 (w tym 8 `order`, 8 `apply`) | zpe.gov.pl/szkola-ponadpodstawowa |
| ib | Mathematics | mathematics.json | 112 (w tym 8 `order`, 8 `apply`) | zpe.gov.pl/szkola-ponadpodstawowa |
| ib | History | history.json | 98 | zpe.gov.pl/szkola-ponadpodstawowa (działy I–XIII) |
| ib | History of Poland | historia-polski.json | 84 | zpe.gov.pl/szkola-ponadpodstawowa; numery po 2024 inne niż w tabeli (niżej) |
| ib | Geography | geography.json | 98 | podstawaprogramowa.pl (ZP I–V) |
| ib | Polish | polski.json | 111 | zpe.gov.pl/szkola-ponadpodstawowa; lista lektur po 2024 inna niż w tabeli (niżej) |
| ib | Edukacja obywatelska | edukacja-obywatelska.json | 119 | PDF Dz.U. 2025 poz. 382, cały zakres I–VII |
| ib | Computer Science | computer-science.json | 96 | zpe.gov.pl/szkola-ponadpodstawowa |
| ib | English | english.json | 105 | tylko IB English A LangLit (obszary + pojęcia) |
| ib | Psychology | psychology.json | 89 | IB DP Psychology guide 2027 (struktura z TSM) |
| ib | German B | german.json | 96 | podstawaprogramowa.pl, wariant III.2 (14 tematów) |
| ib | Academic English | vocabulary.json | 0 | pominięty zgodnie z planem |

**Karty `order` i `apply` (2026-10-18):** matematyka, fizyka, chemia i biologia w obu ścieżkach dostały po 8 kart „ułóż
w kolejności” (etapy procesów, algorytmy rozwiązywania, doświadczenia) i 8 kart „który wzór lub zasada pasuje” (sytuacja →
wzór w `$$…$$` albo zasada; `wrong` to prawdziwe wzory z tego samego działu). Identyfikatory kontynuują numerację pliku
(`mat7-pp-125`…`140`, `fiz7-pp-105`…`120`, `chem7-pp-103`…`118`, `bio7-pp-052`…`067`, `mathib-pp-097`…`112`,
`physib-pp-091`…`106`, `chemib-pp-116`…`131`, `bio-pp-077`…`092`); `pp` wskazuje wymaganie, którego dotyczy proces lub wzór.

Właściwe adresy ZPE dla liceum: `https://zpe.gov.pl/podstawa-programowa/szkola-ponadpodstawowa/<przedmiot>` (slug
`liceum-technikum` z tabel wyżej daje 404).

## Ustalenia wykonawców, które zmieniają tabele z kroku 1

- **Polski 7:** I.1.4 = neologizm, inwokacja, symbol, alegoria; komizm I.1.5, ironia I.1.6; gatunki dziennikarskie I.2.5;
  wyrazy złożone II.1.3, imiesłowy II.1.4, zdania wielokrotnie złożone II.1.5, mowa zależna II.1.6, akcent II.1.7; odmiana
  nazw własnych II.2.2; ortografia II.4.1 (wymiany), II.4.2 (cytowanie), II.4.4 („nie”); formy wypowiedzi III.2.1,
  teza/hipoteza III.1.4, argument a przykład III.1.5.
- **History of Poland (po cięciach 2024):** IX ma tylko punkty 1–2 (brak IX.3–4), X ma 1–3 (brak osobnego punktu
  o zagrożeniach zewnętrznych), XII ma 1–4 (brak XII.5), XIII.1 dotyczy też Polski (christianitas).
- **Polish (lektury obowiązkowe ZP po 2024, klasa 1):** Mitologia, Antygona, Makbet, Skąpiec, Biblia, Iliada (fragm.),
  Lament świętokrzyski, Rozmowa Mistrza Polikarpa, Pieśń o Rolandzie, Horacy, Bogurodzica, Kochanowski (pieśni, treny
  IX–XI), wybrane wiersze baroku, Krasicki (Hymn, satyra). Poza listą obowiązkową (bez kart `lektura:`): Odyseja, Dante,
  Legenda o św. Aleksym, Kwiatki, Gall Anonim, Pasek, Karpiński, Odprawa posłów greckich, Skarga, Romeo i Julia.
  Użyto też I.1.8 (cechy epok).
- **Angielski 7:** w bieżącym tekście ZPE wariant II.1 ma 13 tematów; `en7_society` zostaje bez `pp`.
- **Biology / Chemistry / Physics / CS (zakres podstawowy liceum)** nie zawierają części treści z tabel: organelle poza
  jądrem i mitochondriami, fotosynteza, replikacja/transkrypcja, taksonomia (Biology); cząstki atomu, izotopy, masa atomowa,
  wydajność (Chemistry); pęd (Physics); sprzęt, reprezentacja danych, LAN/WAN, złożoność, SQL, AI (CS). Takie karty mają
  `pp` w formie `IB …` (np. `IB A2.2`, `IB S1.2`, `IB A.2`, `IB A1`). Jeśli klasa realizuje zakres rozszerzony, można je
  przemapować na numery ZR.
- **Mathematics:** trygonometria w trójkącie prostokątnym (VII.1–2, VII.4), średnia i mediana (XII.2) są w polskiej
  podstawie; `IB` dostały tylko funkcje złożone/odwrotne, notacja sigma, kwartyle i IQR.
- **Geography:** skala i odwzorowania nie występują wprost w ZP liceum (przypisane do I.2–I.3); Ziemia we wszechświecie
  w `geoib_global` pasuje słabo do etykiety kategorii.
- **Psychology (guide 2027):** nazwy obszarów to „research methodology”, „human development”, „health and well-being”;
  pominięte konteksty „human relationships” i „learning and cognition” (brak kategorii).
- **German B:** przyjęto wariant III.2; tematy I.2, I.6, I.10 bez kart (nie mają odpowiednika w 5 tematach IB).
- **Edukacja obywatelska:** mimo że podstawa formalnie przewiduje przedmiot od klasy II, zrobiono cały zakres I–VII (119 kart),
  bo jest w planie Pre-DP 1.

## Kategorie, których brakuje (karty trafiły do `*_other` lub najbliższej)

chemia LO „roztwory” (→ `chemib_mole`), fizyka LO „grawitacja” (→ `physib_motion`), historia SP „Europa XIX w.”
(→ `his7_vienna`), polski LO „retoryka” (→ `plib_other`), historia Polski „kultura średniowiecza” (→ `hpl_other`),
niemiecki SP „praca”, „kultura” (→ `de7_other`), informatyka SP „wyszukiwanie w sieci” (→ `inf7_other`), geografia SP
„osiągnięcia Polaków” (→ `geo7_other`), edukacja zdrowotna „ochrona zdrowia” (`ez7_system` użyte dla szczepień
i krwiodawstwa), psychologia „koncepcje i IA” (→ `psyib_other`).

