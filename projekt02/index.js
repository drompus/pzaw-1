import express from "express";
import session from "express-session";

import { SECRET } from "./config.js";
import { createDBTables } from "./database/db.js";
import * as add_word_handlers from "./handlers/add_word.js";
import * as game_handlers from "./handlers/game.js";
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

    switch (action) { // returns are added to avoid further code execution
        case "start": return game_handlers.startGameHandler(req, res);
        case "guess": return game_handlers.guessGameHandler(req, res);
        case "finish": return game_handlers.finishGameHandler(req, res);
        case "restart": return game_handlers.restartGameHandler(req, res);
        default:
            res.status(400);
            res.render("partials/errors/game_start", { title: "Zgadywanka - błąd formularza" });
    }

});

app.post("/add_word", add_word_handlers.addWordHandler); // req and res are automatically passed

app.get("/add_word", (req, res) => {
    res.render("add_word", { title: "Zgadywanka - Dodaj słowo", categories: words.getAllCategories() });
});

app.get("/word_list", (req, res) => {
    const categories = words.getAllCategories();
    categories.forEach(category => {
        category.words = words.getWordsByCategoryId(category.id);
    });

    res.render("word_list", { title: "Zgadywanka - Lista słów", categories: categories });
});


app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});