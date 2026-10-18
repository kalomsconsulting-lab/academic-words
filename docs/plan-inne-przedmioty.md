# Plan: rozszerzenie aplikacji na inne przedmioty

> **Status (2026-10-18):** etapy 1–4 zrobione; aplikacja nazywa się Study Cards i ma 24 przedmioty w dwóch ścieżkach
> z kartami bazowymi z podstaw programowych ([podstawa-programowa.md](podstawa-programowa.md)). Z sekcji *Później*
> zrobione są wszystkie cztery punkty: wzory w KaTeX (`$$…$$`), obrazki (pole `image`, pliki w `images/` albo URL;
> Supabase Storage nieużywane), typ `order` (ułóż w kolejności) i typ `apply` (który wzór / zasada pasuje); format
> w README, sekcja *Format wpisów*. **Otwarty zostaje etap 5**: karty z prawdziwych handoutów z lekcji i 2–3 tygodnie
> używania — wymaga materiałów od uczniów, nie da się go zrobić z repozytorium.

Cel: ta sama mechanika (SM-2, tryby ćwiczeń, import z czatu AI, synchronizacja), ale dla dowolnego przedmiotu,
bez psucia obecnego postępu z Academic English.

## Decyzje do podjęcia przed startem

1. **Jedna aplikacja z wyborem przedmiotu czy osobna kopia na każdy przedmiot?**
   Rekomendacja: jedna aplikacja. Wspólny kod, jedno konto i synchronizacja, jedna ikona na telefonie.
2. **Pierwszy przedmiot pilotażowy.** Najlepiej taki, w którym dużo jest do zapamiętania (np. Biology, Chemistry).
3. **Język kart.** IB uczy po angielsku, więc pytania i odpowiedzi po angielsku, a polski tylko jako opcjonalna podpowiedź?

## Etap 1: model danych (przedmioty)

- Rejestr `SUBJECTS` w `app.js`: `id`, nazwa, ikona, plik danych, lista kategorii, prompt AI.
- Pole `subject` na każdym wpisie. Brak pola = `academic_english`, więc obecne dane i postęp działają bez migracji.
- Dane bazowe per przedmiot: `data/<subject>.json`. `vocabulary.json` zostaje jako Academic English.
- Identyfikatory z prefiksem przedmiotu (`bio-001`), żeby nie kolidowały w `state.progress`.
- Kategorie per przedmiot zamiast jednej globalnej listy `CATEGORIES`. Walidacja (`itemErrors`) sprawdza kategorię w obrębie przedmiotu.
- `STORAGE_KEY` i układ stanu bez zmian; nowe ustawienie `settings.subject`.

## Etap 2: ogólne typy wpisów

Obecne typy (`awl_word`, `replacement`, `academic_verb`, `hedging`, `style_rule`) zostają. Dochodzą dwa uniwersalne:

| Typ | Pola | Ćwiczenia |
|---|---|---|
| `qa` | `question`, `answer`, `accept[]` (inne poprawne odpowiedzi), `explanation`, `difficulty` | fiszka, quiz (dystraktory = odpowiedzi z tej samej kategorii), wpisywanie (gdy odpowiedź jest krótka), dopasowywanie |
| `cloze` | `text` z luką w `{{…}}`, `hint`, `explanation` | luki, wpisywanie, fiszka |

Oba typy mapują się na istniejące pola pomocnicze (`_label`, `_answer`, `_answers`, `_gap`), więc większość
logiki sesji, SM-2 i statystyk działa bez zmian. Trzeba dopisać gałęzie w: `prepareItem`, warunkach dostępności
ćwiczeń, generatorze quizu (dystraktory), widoku karty w słowniczku i nowy wariant w `MATCH` („pytanie → odpowiedź”).

## Etap 3: interfejs

- Przełącznik przedmiotu w nagłówku lub na panelu. Wszystkie pule (sesje, powtórki, statystyki, słowniczek) filtrowane po przedmiocie.
- Limit nowych słów dziennie: osobny dla każdego przedmiotu (żeby biologia nie „zjadała” limitu angielskiego).
- Panel: krótkie podsumowanie wszystkich przedmiotów (ile powtórek dziś w każdym).
- Własne materiały: wybór przedmiotu; nowe formaty wklejania:
  - `qa`: pytanie ; odpowiedź ; wyjaśnienie
  - `cloze`: zdanie z `{{luką}}` ; podpowiedź
- Nazwa aplikacji w `manifest.json` i `index.html` bardziej ogólna (np. „Study Cards”), jeśli to ma być jedna aplikacja.

## Etap 4: import z czatu AI

- Prompt budowany z szablonu dla wybranego przedmiotu: lista dozwolonych kategorii + zasady dobrych kart:
  jedna informacja na kartę, krótkie odpowiedzi (do ~5 słów, żeby dało się je wpisać), luka w cloze na kluczowym
  pojęciu, a nie na słowie typu „the”, wyjaśnienie w 1 zdaniu.
- Parser (`AW_AI.parseReply`) bez zmian; walidacja i podgląd już obsłużą nowe typy po etapie 2.

## Etap 5: pilot z treścią

- Starter pack dla pierwszego przedmiotu (~100–150 kart) wygenerowany z prawdziwych handoutów przez import AI,
  przejrzany ręcznie, zapisany w `data/<subject>.json`.
- 2–3 tygodnie używania, potem decyzja, czy dokładać kolejne przedmioty.

## Później (opcjonalnie) — ZROBIONE 2026-10-18

- Wzory w KaTeX (chemia, fizyka, matematyka): `$$…$$` w dowolnym tekście karty, biblioteka z CDN (jsdelivr, wersja
  przypięta), cache przez `sw.js`; pojedynczy `$` zostaje zwykłym znakiem.
- Obrazki w pytaniach (diagramy, mapy): pole `image` (ścieżka w repo albo URL) na `qa`, `cloze`, `order`, `apply`.
- Typ `order` „ułóż w kolejności” (etapy procesów, chronologia): własne ćwiczenie i fiszka.
- Typ `apply` „który wzór / która zasada pasuje do sytuacji”: quiz z autorskimi błędnymi opcjami i fiszka.
- Prompt czatu AI opisuje oba nowe typy (z limitem ok. 15% kart) i notację wzorów. Żadna karta bazowa jeszcze ich nie
  używa; pierwsze powstaną z importu albo przy kolejnym przebiegu nad podstawą programową.

## Ryzyka

- **Utrata postępu obecnego użytkownika:** nie zmieniać istniejących `id`, `STORAGE_KEY` ani struktury `progress`; przetestować na kopii stanu z `localStorage`.
- **Wpisywanie długich odpowiedzi:** tolerancja literówek nie wystarczy na zdania; dla długich odpowiedzi tylko fiszka i quiz.
- **Słabe dystraktory w quizie:** brać odpowiedzi z tej samej kategorii, a przy małej kategorii wyłączyć quiz dla danej karty.
- **Rozmiar stanu w Supabase:** cały stan to jeden wiersz JSON; przy kilku przedmiotach nadal OK (kilkaset KB), ale warto to obserwować.

## Kolejność prac i skala

Etapy 1–4 to głównie zmiany w `app.js` i `ai-import.js`, bez nowych zależności i bez build stepu; realnie
1–2 sesje pracy. Etap 5 zależy od materiałów z lekcji.
