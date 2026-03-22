import express from "express";
import session from "express-session";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { SECRET, PORT } from "../config.js";

import { createDBTables } from "./database/createDatabase.js";
import WordModel from "./models/WordModel.js";
import UserModel from "./models/UserModel.js";
import WordService from "./services/WordService.js";
import GameService from "./services/GameService.js";
import WordRouter from "./routers/WordRouter.js";
import GameRouter from "./routers/GameRouter.js";
import HomeController from "./controllers/HomeController.js";
import createGameSession from "./middlewares/gameSession.js";
import setGameState from "./middlewares/gameState.js";
import preventPostParamsError from "./middlewares/postParamsEmpty.js";
import ErrorHandler from "./middlewares/errorHandler.js";

const wordModel = new WordModel();
const userModel = new UserModel();

const wordService = new WordService(wordModel);
const gameService = new GameService(wordService);
const wordRouter = new WordRouter(wordService).getRouter();
const gameRouter = new GameRouter(gameService).getRouter();
const homeHandler = new HomeController(wordService).get;

createDBTables();
userModel.init();
wordModel.init();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));


app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));


// Middlewares - config
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'assets', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
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
app.use("/game", gameRouter);
app.use("/word", wordRouter);


// Endpoints
app.get("/", homeHandler);
app.use(ErrorHandler.handleNotFound);
app.use(ErrorHandler.handleError);

// Start application
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});