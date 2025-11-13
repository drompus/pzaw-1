# Zgadywanka

## Instalacja

1. Sklonuj repozytorium i przejdź do folderu `projekt02`: cd projekt02

2. Zainstaluj zależności:
  - wykonaj w konsoli polecenie: npm install

3. Plik konfiguracyjny (opcjonalne):
  - domyślnie nie trzeba niczego zmieniać
  - plik można edytować aby ustalić ścieżkę bazy danych albo ustawić tzw. secret, służący do podpisywania ciasteczek używanych przez express-session

5. Uruchom aplikację:
Wykonaj polecenie w konsoli: node index.js

6. Wypełnienie bazy danych (zalecane):
  - plik używany do wypełnienia danymi bazę danych. Przed wykonaniem, baza danych powinna mieć utworzoną strukturę, którą m. in. tworzy pierwsze uruchomienie aplikacji (patrz 5.)
  - wykonaj w konsoli polecenie: node database/populate_db.js

## Działanie
  - aplikację włączamy poprzez uruchomienie polecenia we właściwym folderze (`projekt02`)
  - polecenie: node index.js
