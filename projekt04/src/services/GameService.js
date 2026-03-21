import { getDefaultGameState } from "../utils/gameValues.js";
import { distortWord } from "./WordDistortion.js";

export default class GameService {

    #wordService;
    constructor(wordService) {
        this.#wordService = wordService;
    }

    processGuess(gameState, guess) {
        const current_word = gameState.current_word;

        if (guess === current_word.name) {
            gameState.score++;
            gameState.previous_words_names.push(current_word.name);

            const new_word = this.getRandomWord(gameState.previous_words_names);

            if (!new_word) {
                gameState.is_active = false
                gameState.current_word = null;
                return {
                    game_won: true,
                    game_finished: true,
                    game_state: gameState
                }
            }

            gameState.current_word = this.buildWordState(new_word, gameState.difficulty);
            return {
                game_won: false,
                game_finished: false,
                game_state: gameState
            }
        }

        return {
            game_won: false,
            game_finished: false,
            game_state: gameState
        };

    }

    isValidDifficulty(difficulty) {
        return ["easy", "medium", "hard"].includes(difficulty);
    }

    buildWordState(word, difficulty) {
        return {
            name: word.name,
            category: word.category,
            distorted_name: distortWord(word.name, difficulty)
        };
    }

    getRandomWord(excluded = []) {
        return this.#wordService.getRandomWord(excluded);
    }

    getDefaultState() {
        return getDefaultGameState();
    }
}