import ForbiddenError from "../errors/ForbiddenError.js";

export default class AuthController {

    #authService;
    constructor(authService) {
        this.#authService = authService;
        this.getLogin = this.getLogin.bind(this);
        this.postLogin = this.postLogin.bind(this);
    }

    getLogin(req, res) {
        if (req.user) {
            res.redirect("/");
            return;
        }

        if (req.session.game_state.is_active) throw new ForbiddenError("Nie można zalogować się w trakcie gry!");
        res.render("auth/login", {
            title: "Zgadywanka - Logowanie"
        });
    }

    postLogin(req, res) {
        if (req.user) {
            res.redirect("/");
            return;
        }

    }
}