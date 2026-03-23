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
        const game_difficulty = req.body.difficulty;

        this.#gameService.validateDifficulty(game_difficulty);

        const starting_word = this.#gameService.getRandomWord();
        if (!starting_word) {
            return res.render("partials/errors/game_start", { title: "Zgadywanka - brak dostępnych słów!" });
        }

        req.session.game_state = {
            ...this.#gameService.getDefaultState(),
            is_active: true,
            difficulty: game_difficulty,
            current_word: this.#gameService.buildWordState(starting_word, game_difficulty)
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