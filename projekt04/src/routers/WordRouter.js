import express from "express";
import WordController from "../controllers/WordController.js";

export default class WordRouter {

    #wordController;
    #router;
    constructor(wordService, authService) {
        this.#wordController = new WordController(wordService, authService);
        this.#router = express.Router();
        this.#initRoutes();
    }

    #initRoutes() {
        this.#router.get("/new", this.#wordController.getNew);
        this.#router.post("/new", this.#wordController.postNew);

        this.#router.get("/edit/:id", this.#wordController.getEdit);
        this.#router.post("/edit", this.#wordController.postEdit);

        this.#router.post("/delete", this.#wordController.postDelete);

        this.#router.get("/list/private", this.#wordController.getList);
        this.#router.get("/list/public", this.#wordController.getPublicList);
    }

    getRouter() {
        return this.#router;
    }
}