import words from "../models/words.js";
import { distortWord } from "../models/word_distortion.js";
import { getDefaultGameState } from "../models/game_values.js";

export function startGameHandler(req, res) {
    const game_difficulty = req.body.difficulty;

    if (!(["easy", "medium", "hard"].includes(game_difficulty))) {
        res.status(400);
        res.render("partials/errors/game_start", { title: "Zgadywanka - błąd formularza" });
        return;
    }

    const starting_word = words.getRandomWord();
    if (!starting_word) {
        return res.render("partials/errors/game_start", { title: "Zgadywanka - brak dostępnych słów!" });
    }

    req.session.game_state = {
        ...getDefaultGameState(),
        is_active: true,
        difficulty: game_difficulty,
        current_word: {
            name: starting_word.name,
            category: starting_word.category,
            distorted_name: distortWord(starting_word.name, game_difficulty)
        }
    };
    res.redirect("/");
}

export function guessGameHandler(req, res) {
    if (!req.session.game_state.is_active) {
        res.redirect("/");
        return;
    }

    const guess = req.body.guess?.trim().toLowerCase();
    const current_word = req.session.game_state.current_word;

    if (!guess || !current_word) {
        res.redirect("/");
        return;
    }

    if (guess === current_word.name) {
        req.session.game_state.score++;
        req.session.game_state.previous_words_names.push(current_word.name);

        const new_word = words.getRandomWord(req.session.game_state.previous_words_names);
        if (!new_word) {
            req.session.game_state.is_active = false;
            req.session.game_state.current_word = null;
            res.render("game_won", { title: "Zgadywanka - Wygrałeś!" });
            return;
        } else {
            req.session.game_state.current_word = {
                name: new_word.name,
                category: new_word.category,
                distorted_name: distortWord(new_word.name, req.session.game_state.difficulty)
            };
        }
    }

    res.redirect("/");
}

export function finishGameHandler(req, res) {
    req.session.game_state.is_active = false;
    res.render("game_summary", {
        title: "Zgadywanka - Podsumowanie gry",
        score: req.session.game_state.score
    });
}

export function restartGameHandler(req, res) {
    req.session.game_state = getDefaultGameState();
    res.redirect("/");
}