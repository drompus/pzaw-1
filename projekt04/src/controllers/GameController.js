import BadRequestError from "../errors/BadRequestError.js";

export default class GameController {

    #gameService
    constructor(gameService) {
        this.#gameService = gameService;
        this.postStart = this.postStart.bind(this);
        this.postGuess = this.postGuess.bind(this);
        this.postFinish = this.postFinish.bind(this);
        this.postRestart = this.postRestart.bind(this);
    }

    postStart(req, res) {
        const difficulty = req.body?.difficulty || "easy";
        let mode = req.body?.mode || "public";

        if (!req.user && mode === "private") {
            mode = "public";
        }

        this.#gameService.validateDifficulty(difficulty);
        this.#gameService.validateMode(mode, req.user?.id);

        const starting_word = this.#gameService.getRandomWord(mode, req.user?.id);
        if (!starting_word) {
            throw new BadRequestError("Nie udało się rozpocząć gry. Brak dostępnych słów!")
        }

        req.session.game_state = {
            ...this.#gameService.getDefaultState(),
            is_active: true,
            difficulty,
            mode,
            user_id: req.user?.id,
            excluded_words_ids: [],
            current_word: this.#gameService.buildWordState(starting_word, difficulty)
        };
        res.redirect("/");
    }

    postGuess(req, res) {
        if (!req.session?.game_state?.is_active) {
            res.redirect("/");
            return;
        }

        const guess = req.body.guess?.trim().toLowerCase();

        if (!guess) {
            res.redirect("/");
            return;
        }

        const result = this.#gameService.processGuess(req.session.game_state, guess);
        req.session.game_state = result.game_state;

        if (result.game_finished) {
            res.render("game_summary", {
                title: "Zgadywanka - Wygrałeś!",
                game_won: true,
                score: result.game_state.score
            });
            return;
        }

        res.redirect("/");
    }

    postFinish(req, res) {
        req.session.game_state.is_active = false;
        res.render("game_summary", {
            title: "Zgadywanka - Podsumowanie gry",
            game_won: false,
            score: req.session.game_state.score
        });
    }

    postRestart(req, res) {
        req.session.game_state = this.#gameService.getDefaultState();
        res.redirect("/");
    }
}