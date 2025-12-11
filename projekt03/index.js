import express from "express";
import session from "express-session";

import { SECRET } from "./config.js";
import { createDBTables } from "./database/db.js";
import * as add_word_handlers from "./handlers/add_word.js";
import game_router from "./routers/game.js";
import { word_manager } from "./models/words.js";
import createGameSession from "./middlewares/game_session.js";

createDBTables();
word_manager.init();

const port = 8000;
const app = express();
app.set("view engine", "ejs");

// Middlewares - config
app.use('/favicon.ico', express.static('public/assets/favicon.ico'));
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

// Middlewares - routers
app.use("/game", game_router);


// Endpoints
app.get("/", (req, res) => {
    res.render("index", { title: "Zgadywanka - Strona główna", words_count: word_manager.getWordsCount() });
});

app.post("/add_word", add_word_handlers.addWordHandler); // req and res are automatically passed

app.get("/add_word", (req, res) => {
    const is_game_active = req.session?.game_state?.is_active || false;

    if (is_game_active) {
        return res.render("add_word", { title: "Zgadywanka - Dodaj słowo", is_game_active: true })
    }
    
    return res.render("add_word", { title: "Zgadywanka - Dodaj słowo", categories: word_manager.getAllCategories(), is_game_active: false });

});

app.get("/word_list", (req, res) => {
    const is_game_active = req.session?.game_state?.is_active || false;

    if (is_game_active) {
        return res.render("word_list", { title: "Zgadywanka - Lista słów", is_game_active: true });
    }

    const categories = word_manager.getAllCategories();
    categories.forEach(category => {
        category.words = word_manager.getWordsByCategoryId(category.id);
    });

    return res.render("word_list", { title: "Zgadywanka - Lista słów", categories: categories, is_game_active: false });

});


app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});