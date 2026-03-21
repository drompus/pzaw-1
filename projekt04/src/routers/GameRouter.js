import express from "express";
import GameController from "../controllers/GameController.js";

export default class GameRouter {

    #gameController;
    #router;
    constructor(gameService) {
        this.#gameController = new GameController(gameService);
        this.#router = express.Router();
        this.#initRoutes();
    }

    #initRoutes() {
        this.#router.post("/start", this.#gameController.postStart);
        this.#router.post("/guess", this.#gameController.postGuess);
        this.#router.post("/finish", this.#gameController.postFinish);
        this.#router.post("/restart", this.#gameController.postRestart);
    }

    getRouter() {
        return this.#router;
    }
}