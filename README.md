**TADroid 4LL** to wtyczka do przeglądarki Chrome, która ułatwia korzystanie ze strony **LEGO Coding Canvas** stworzona z myślą o osobach niewidomych i słabowidzących.

Pozwala ona tworzyć kod kompatybilny z zestawem LEGO® CS&AI za pomocą klawiatury i czytnika ekranu, bez konieczności przeciągania bloków myszką.

## Wczytywanie w Chrome

1. Pobierz zip z wtyczką.
2. Otwórz `chrome://extensions`.
3. Włącz **Tryb dewelopera**.
4. Kliknij **Załaduj rozpakowane**.
5. Wybierz pobrany folder: `4ll-main`.
6. Otwórz Coding Canvas pod adresem [code.legoeducation.com](https://code.legoeducation.com/).
7. Otwórz projekt lub utwórz nowy.

## Dwa panele pomocnicze

Po zainstalowaniu wtyczki w rogach ekranu pojawią się dwa przyciski otwierające panele zintegrowane ze stroną:

1. **Lekcje TADroid** (lewy dolny róg) - interaktywny kurs programowania i robotyki
2. **Okno kodu** (prawy dolny róg) - podgląd Twojego programu w formie prostego tekstu, odczyt na głos oraz możliwość wpisywania poleceń z klawiatury.

## Korzystanie z panelu kursu

Otwórz go klikając przycisk w lewym dolnym rogu lub wciskając **Shift+K**. Jego nagłówek pokazuje, w którym module i lekcji aktualnie jesteś. Poniżej znajdziesz dwie zakładki:

### Karta Lekcja
* Zawiera treść kroku.
* **Przycisk „Wstaw przykład”:** Jeśli w danym kroku jest przykładowy kod, kliknij ten przycisk (lub użyj skrótu), a bloki same wskoczą do bieżącego projektu. 
* **Nawigacja:** Przyciski **Poprzedni krok** i **Następny krok** pozwalają swobodnie przechodzić przez kurs.
* **Automatyczny zapis:** Twój postęp zapisuje się na bieżąco w przeglądarce. Możesz zamknąć stronę i wrócić do nauki w dowolnym momencie.

### Karta Konspekt kursu
* **Spis treści:** Pozwala szybko przejść do dowolnej lekcji bez klikania po kolei.
* **Przycisk 🧱 Elementy:**
  * Przy każdym kroku wymagającym fizycznych elementów LEGO znajduje się przycisk z ikoną klocka (skrót: **Shift+Y**).
  * Po jego kliknięciu wyświetli się dokładna lista części potrzebnych do tego zadania: **nazwa klocka, kolor, liczba sztuk, opis dotykowy kształtu oraz zdjęcie**.


## Korzystanie z panelu kodu

Otwórz go klikając przycisk w prawym dolnym rogu lub wciskając **Shift+O**. Zamienia on wizualne bloki na przejrzysty tekst i pozwala kontrolować kod.

### Odczyt kodu na głos
* **Odśwież (Shift+R):** ponownie odczytuje bieżący stan projektu (aktualizuje się też automatycznie po zmianie bloków)
* **Czytaj (Shift+S):** Odczytuje cały program linijka po linijce, podświetlając aktualnie czytany fragment.
* **Wstrzymaj / Wznów (Shift+P) oraz Zatrzymaj (Shift+X):** Kontrola czytania w dowolnym momencie.
* **Poprzednia / Następna linia (Shift+J / Shift+L):** Pozwala wygodnie przejść do interesującego Cię fragmentu kodu.

### Dodawanie i edycja kodu z klawiatury („Narzędzia edycji”)
Rozwiń sekcję edycji na dole panelu (skrót: **Shift+U**), by budować program wpisując polecenia tekstowe:

1. **Wybierz miejsce wstawienia:** Użyj przycisków **Wyżej**, **Niżej** lub **Koniec** (`Shift+Góra`, `Shift+Dół`, `Shift+End`), aby wskazać, gdzie ma pojawić się nowe polecenie.
2. **Wpisz polecenie:**
   Przykłady:
   * `Move forward for 10 steps` – jazda do przodu o 10 kroków
   * `Turn right 90 degrees` – obrót w prawo o 90 stopni
   * `Write "Hello"` – wyświetlenie napisu
   * `Repeat 3 times` – powtórzenie pętli 3 razy
   * `When up key is pressed` – reakcja na wciśnięcie strzałki w górę
3. **Wstaw do projektu:** Kliknij przycisk lub wciśnij **Ctrl+Enter** (na Macu: **Cmd+Enter**).
4. **Poprawianie błędów:**
   * **Usuń poprzedni krok (Shift+Backspace):** Kasuje polecenie tuż przed bieżącym punktem wstawiania.
   * **Usuń cały kod (Shift+D):** Czyści cały projekt (po uprzednim potwierdzeniu).

## Skróty klawiszowe
Wszystkie interakcje posiadają pełne wsparcie klawiatury. Klawiszem modyfikującym jest **Shift** w połączeniu z:
* **Alt** lub **Ctrl** (system Windows / Linux)
* **Command** (system macOS)

| Skrót | Działanie |
| --- | --- |
| Shift+K | Otwórz/zamknij panel lekcji |
| Shift+O | Otwórz/zamknij panel kodu |
| Shift+U | Otwórz/zamknij Narzędzia edycji w panelu kodu |
| Shift+S | Czytaj bieżący projekt na głos |
| Shift+P | Wstrzymaj/wznów czytanie |
| Shift+J | Poprzednia linia |
| Shift+L | Pomiń linię |
| Shift+X | Zatrzymaj czytanie |
| Shift+R | Odśwież panel kodu |
| Shift+Góra / Shift+Dół / Shift+End | Przesuń punkt wstawiania |
| Shift+Backspace | Usuń poprzedni krok |
| Shift+D | Usuń cały kod |
| Shift+Y | Otwórz listę elementów dla bieżącego kroku |
| Command/Control+Enter | Wstaw wpisane polecenie do projektu |
| Escape | Zamknij aktualnie otwarte okno dialogowe |

---
LEGO® is a trademark of the LEGO Group of companies which does not sponsor, authorize or endorse this project.