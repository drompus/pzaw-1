import express from "express";
import session from "express-session";

import { SECRET } from "./config.js";
import { createDBTables } from "./database/db.js";
import { getDefaultGameState } from "./models/game_values.js";
import { distortWord } from "./models/word_distortion.js";
import words from "./models/words.js";
import createGameSession from "./middlewares/game_session.js";

createDBTables();

const port = 8000;
const app = express();
app.use('/favicon.ico', express.static('public/assets/favicon.ico'));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded());
app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(createGameSession);

app.use((req, res, next) => { // used to prevent error when post without parameters is passed
    if (!req.body) req.body = {};
    next();
});

app.get("/", (req, res) => {
    res.render("index", { title: "Zgadywanka - Strona główna", words_count: words.getWordsCount() });
});

app.post("/", (req, res) => {
    const action = req.body.game_action;

    if (typeof action != "string") {
        res.status(400);
        res.render("partials/errors/game_start", { title: "Zgadywanka - błąd formularza" })
        return;
    }

    switch (action) {
        case "start":
            const game_difficulty = req.body.difficulty;

            if (!(["easy", "medium", "hard"].includes(game_difficulty))) {
                res.status(400);
                res.render("partials/errors/game_start", { title: "Zgadywanka - błąd formularza" });
                return;
            }

            const starting_word = words.getRandomWord();
            if (!starting_word) {
                return res.render("partials/errors/game_start", { title: "Zgadywanka - brak dostępnych słów!" });
            }

            req.session.game_state = {
                ...getDefaultGameState(),
                is_active: true,
                difficulty: game_difficulty,
                current_word: {
                    name: starting_word.name,
                    category: starting_word.category,
                    distorted_name: distortWord(starting_word.name, game_difficulty)
                }
            };
            res.redirect("/");
            break;
        case "guess":
            if (!req.session.game_state.is_active) {
                res.redirect("/");
                return;
            }

            const guess = req.body.guess?.trim().toLowerCase();
            const current_word = req.session.game_state.current_word;

            if (!guess || !current_word) {
                res.redirect("/");
                return;
            }

            if (guess === current_word.name) {
                req.session.game_state.score++;
                req.session.game_state.previous_words_names.push(current_word.name);

                const new_word = words.getRandomWord(req.session.game_state.previous_words_names);
                if (!new_word) {
                    req.session.game_state.is_active = false;
                    req.session.game_state.current_word = null;
                    res.render("game_won", { title: "Zgadywanka - Wygrałeś!" });
                    return;
                } else {
                    req.session.game_state.current_word = {
                        name: new_word.name,
                        category: new_word.category,
                        distorted_name: distortWord(new_word.name, req.session.game_state.difficulty)
                    };
                }
            }

            res.redirect("/");
            break;

        case "finish":
            req.session.game_state.is_active = false;
            res.render("game_summary", {
                title: "Zgadywanka - Podsumowanie gry",
                score: req.session.game_state.score
            });
            break;
        case "restart":
            req.session.game_state = getDefaultGameState();
            res.redirect("/");
            break;
        default:
            res.status(400);
            res.render("partials/errors/game_start", { title: "Zgadywanka - błąd formularza" });
    }

});

app.get("/word_list", (req, res) => {
    const categories = words.getAllCategories();
    categories.forEach(category => {
        category.words = words.getWordsByCategoryId(category.id);
    });

    res.render("word_list", { title: "Zgadywanka - Lista słów", categories: categories });
});

app.get("/add_word", (req, res) => {
    res.render("add_word", { title: "Zgadywanka - Dodaj słowo", categories: words.getAllCategories() });
});

app.post("/add_word", (req, res) => {
    const category_id = req.body.category_id;
    const word_name = req.body.word_name;

    if (!words.hasCategoryId(category_id)) return res.status(404).send("Nieprawidłowe ID kategorii.");
    else {
        var word_validation = words.validateWordName(word_name);
        const word_validation_errors = word_validation.word_name;

        if (!word_validation.is_valid) {
            res.status(400);
            res.render("partials/errors/new_word", { title: "Zgadywanka - błąd w słowie", errors: word_validation_errors, word_name: word_name });
        } else {
            words.addWordToCategory(category_id, word_name);
            res.redirect("/word_list");
        }
    }

});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});