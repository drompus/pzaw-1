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
import AuthService from "./services/AuthService.js";
import WordRouter from "./routers/WordRouter.js";
import GameRouter from "./routers/GameRouter.js";
import AuthRouter from "./routers/AuthRouter.js";
import CategoryRouter from "./routers/CategoryRouter.js";
import HomeController from "./controllers/HomeController.js";
import setGameSession from "./middlewares/setGameSession.js";
import setGameState from "./middlewares/setGameState.js";
import preventPostParamsError from "./middlewares/postParamsEmpty.js";
import setUser from "./middlewares/setUser.js";
import ErrorHandler from "./middlewares/ErrorHandler.js";

const wordModel = new WordModel();
const userModel = new UserModel();

const wordService = new WordService(wordModel);
const gameService = new GameService(wordService);
const authService = new AuthService(userModel);
const wordRouter = new WordRouter(wordService, authService).getRouter();
const gameRouter = new GameRouter(gameService).getRouter();
const authRouter = new AuthRouter(authService).getRouter();
const categoryRouter = new CategoryRouter(wordService, authService).getRouter();
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
app.use(setGameSession);
app.use(setGameState)
app.use(setUser(userModel));
app.use(preventPostParamsError); // used to prevent error when post without parameters is passed


// Middlewares - routers
app.use("/game", gameRouter);
app.use("/word", wordRouter);
app.use("/auth", authRouter);
app.use("/category", categoryRouter);


// Endpoints
app.get("/", homeHandler);
app.use(ErrorHandler.handleNotFound);
app.use(ErrorHandler.handleError);

// Start application
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});