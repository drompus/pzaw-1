import ForbiddenError from "../errors/ForbiddenError.js";
import LoginError from "../errors/LoginError.js";
import RegisterError from "../errors/RegisterError.js";

export default class AuthController {

    #authService;
    constructor(authService) {
        this.#authService = authService;
        this.getLogin = this.getLogin.bind(this);
        this.postLogin = this.postLogin.bind(this);
        this.getRegister = this.getRegister.bind(this);
        this.postRegister = this.postRegister.bind(this);
        this.postLogout = this.postLogout.bind(this);
    }

    getLogin(req, res) {
        if (req.user) {
            res.redirect("/");
            return;
        }

        if (req.session.game_state.is_active) throw new ForbiddenError("Nie można zalogować się w trakcie gry!");
        res.render("auth/login", {
            title: "Zgadywanka - Logowanie",
        });
    }

    async postLogin(req, res) {
        if (req.user) {
            res.redirect("/");
            return;
        }

        if (req.session.game_state.is_active) throw new ForbiddenError("Nie można się zalogować w trakcie gry!");

        const errors = [];

        if (!req.body?.username) errors.push("Nie podano nazwy użytkownika!");
        if (!req.body?.password) errors.push("Nie podano hasła!");
        if (errors.length > 0) throw new LoginError("Wystąpił błąd logowania", errors);
        const user = await this.#authService.authenticateUser(req.body.username, req.body.password); // no need to check whether user exists - error is thrown if it doesn't

        req.session.regenerate(err => {
            if (err) throw err;
            req.session.user_id = user.id;
            res.redirect("/");
        });
    }

    getRegister(req, res) {
        if (req.user) {
            res.redirect("/");
            return;
        }

        if (req.session.game_state.is_active) throw new ForbiddenError("Nie można rejestrować się w trakcie gry!");
        res.render("auth/register", {
            title: "Zgadywanka - Rejestracja"
        });
    }

    async postRegister(req, res) {
        if (req.user) {
            res.redirect("/");
            return;
        }

        const errors = [];

        if (req.session.game_state.is_active) throw new ForbiddenError("Nie można się zarejestrować w trakcie gry!");
        if (!req.body?.username) errors.push("Nie podano nazwy użytkownika!");
        if (!req.body?.password) errors.push("Nie podano hasła!");
        if (!req.body?.confirm_password || req.body.confirm_password !== req.body?.password) errors.push("Hasła nie są identyczne!");
        let user = null;
        try {
            user = await this.#authService.registerUser(req.body.username, req.body.password);
        } catch (error) {
            if (error instanceof RegisterError && error.reasons && error.reasons.length > 0) {
                errors.push(...error.reasons);
            }
        }
        if (errors.length > 0) throw new RegisterError("Wystąpił błąd rejestracji", errors);
        if (!user) throw new RegisterError("Wystąpił błąd podczas rejestracji", ["Wystąpił błąd podczas rejestracji, spróbuj ponownie"]);
        req.session.user_id = user.id; // no need to check whether user exists - error is throwed if it doesn't
        res.redirect("/");
    }

    postLogout(req, res) {
        if (req.user) {
            req.session.destroy(() => {
                res.redirect("/");
            });
            return;
        }

        res.redirect("/");
    }
}