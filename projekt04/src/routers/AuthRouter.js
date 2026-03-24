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
        
        this.#router.get("/register", this.#authController.getRegister);
        this.#router.post("/register", this.#authController.postRegister);

        this.#router.post("/logout", this.#authController.postLogout);
    }

    getRouter() {
        return this.#router;
    }
}