import express from "express";
import WordController from "../controllers/WordController.js";

export default class WordRouter {

    #wordController;
    #router;
    constructor(wordService) {
        this.#wordController = new WordController(wordService);
        this.#router = express.Router();
        this.#initRoutes();
    }

    #initRoutes() {
        this.#router.get("/new", this.#wordController.getNew);
        this.#router.post("/new", this.#wordController.postNew);

        this.#router.get("/edit/:id", this.#wordController.getEdit);
        this.#router.post("/edit", this.#wordController.postEdit);

        this.#router.post("/delete", this.#wordController.postDelete);

        this.#router.get("/list", this.#wordController.getList);
    }

    getRouter() {
        return this.#router;
    }
}