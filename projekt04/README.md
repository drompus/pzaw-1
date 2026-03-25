# Zgadywanka

Jest to gra słowna skupiająca się na odgadywaniu przez użytkowników zniekształconych słów. Można grać na globalnych słowach lub własnych - po zalogowaniu.

## Instalacja i uruchamianie:
Po sklonowaniu repozytorium i przejściu do folderu `projekt04` należy uruchomić komendę:
```bash
npm install
```

Uruchamianie aplikacji:
```bash
npm run dev
```

## Konfiguracja
Dla ułatwienia konfiguracja znajduje się w pliku: config.js.
Domyślne wartości:
```bash
PORT = 8000;
SECRET = "haslo123@dev";
PEPPER = "pepper123@dev";
DB_PATH = "./db.sqlite";
```
Możliwa jest również konfiguracja dozwolonych wartości/limitów długości znaków dla różnych funkcjonaności w pliku: utils/defaultValues.js

## Seedowanie bazy danych
Przed pierwszym uruchomieniem (lub po usunięciu bazy) w celu wypełnienia bazy danych danymi testowymi wykonaj polecenie:
```bash
npm run seed_db
```

**UWAGA**: domyślnie, baza danych jest pusta i rejestracja nie będzie działać z powodu braku ról w tabeli roles
