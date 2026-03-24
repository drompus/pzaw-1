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
        console.log(req.body);
        if (req.user) {
            res.redirect("/");
            return;
        }

        if (req.session.game_state.is_active) throw new ForbiddenError("Nie można się zalogować w trakcie gry!");

        const errors = [];

        if (!req.body?.username) errors.push("Nie podano nazwy użytkownika!");
        if (!req.body?.password) errors.push("Nie podano hasła!");
        console.log(errors);
        if (errors.length > 0) throw new LoginError("Wystąpił błąd logowania", errors);
        const user = await this.#authService.authenticateUser(req.body.username, req.body.password);
        req.session.user_id = user.id; // no need to check whether user exists - error is throwed if it doesn't
        console.log(user);

        res.redirect("/");
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
        
        if (req.session.game_state.is_active) throw new ForbiddenError("Nie można się zalogować w trakcie gry!");
        if (!req.body?.username) errors.push("Nie podano nazwy użytkownika!");
        if (!req.body?.password) errors.push("Nie podano hasła!");
        if (!req.body?.confirm_password || req.body.confirm_password !== req.body?.password) errors.push("Hasła nie są identyczne!");
        console.log(errors);
        if (errors.length > 0) throw new RegisterError("Wystąpił błąd rejestracji", errors);
        const user = await this.#authService.registerUser(req.body.username, req.body.password);
        req.session.user_id = user.id; // no need to check whether user exists - error is throwed if it doesn't
        console.log(user);

        res.redirect("/");

    }
}