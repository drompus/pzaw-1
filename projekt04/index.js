import express from "express";
import session from "express-session";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { SECRET } from "./config.js";

import { createDBTables } from "./database/db.js";
import { word_manager } from "./models/words.js";
import word_router from "./routers/word.js";
import game_router from "./routers/game.js";
import createGameSession from "./middlewares/game_session.js";
import setGameState from "./middlewares/game_state.js";
import preventPostParamsError from "./middlewares/post_params_empty.js";
import homeHandler from "./handlers/home.js";
import wordListHandler from "./handlers/word_list.js";


createDBTables();
word_manager.init();


const port = 8000;
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set("view engine", "ejs");


// Middlewares - config
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'assets', 'favicon.ico')));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());
app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(createGameSession);
app.use(setGameState)
app.use(preventPostParamsError); // used to prevent error when post without parameters is passed


// Middlewares - routers
app.use("/game", game_router);
app.use("/word", word_router);


// Endpoints
app.get("/", homeHandler);
app.get("/word_list", wordListHandler);


// Start application
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});