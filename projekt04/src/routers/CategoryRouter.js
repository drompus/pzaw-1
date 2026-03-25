import express from "express";
import CategoryController from "../controllers/CategoryController.js";

export default class CategoryRouter {

    #categoryController;
    #router;
    constructor(wordService, authService) {
        this.#categoryController = new CategoryController(wordService, authService);
        this.#router = express.Router();
        this.#initRoutes();
    }

    #initRoutes() {
        this.#router.get("/new", this.#categoryController.getNew);
        this.#router.post("/new", this.#categoryController.postNew);
        this.#router.post("/delete", this.#categoryController.postDelete);
    }

    getRouter() {
        return this.#router;
    }
}