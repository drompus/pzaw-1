import express from "express";
import AuthController from "../controllers/AuthController.js";

export default class AuthRouter {

    #authController;
    #router;
    constructor(authService) {
        this.#authController = new AuthController(authService);
        this.#router = express.Router();
        this.#initRoutes();
    }

    #initRoutes() {
        this.#router.get("/login", this.#authController.getLogin);
        this.#router.post("/login", this.#authController.postLogin);
    }

    getRouter() {
        return this.#router;
    }
}