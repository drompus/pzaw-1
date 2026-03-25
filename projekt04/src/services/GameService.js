import BadRequestError from "../errors/BadRequestError.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";
import { DEFAULT_GAME_STATE } from "../utils/defaultValues.js";
import { distortWord } from "./WordDistortion.js";

export default class GameService {

    #wordService;
    constructor(wordService) {
        this.#wordService = wordService;
    }

    processGuess(gameState, guess) {
        const current = gameState.current_word;

        if (guess === current.name) {
            gameState.score++;
            gameState.excluded_words_ids.push(current.id);
            const newWord = this.#wordService.getRandomWord(
                gameState.mode,
                gameState.user_id,
                gameState.excluded_words_ids
            );

            if (!newWord) {
                gameState.is_active = false;
                gameState.current_word = null;
                return {
                    game_won: true,
                    game_finished: true,
                    game_state: gameState
                };
            }

            gameState.current_word = this.buildWordState(newWord, gameState.difficulty);

            return {
                game_won: false,
                game_finished: false,
                game_state: gameState
            };
        }

        return {
            game_won: false,
            game_finished: false,
            game_state: gameState
        };
    }

    validateDifficulty(difficulty) {
        const allowedDifficulties = ["easy", "medium", "hard"];
        if (!allowedDifficulties.includes(difficulty)) {
            throw new BadRequestError("Przesłano nieprawidłowy poziom trudności!");
        }
    }

    validateMode(mode, userId) {
        const allowedModes = ["public", "private"];
        if (!allowedModes.includes(mode)) {
            throw new BadRequestError("Przesłano nieprawidłowy tryb gry!");
        }

        if (mode === "private") {
            if (!userId) {
                throw new UnauthorizedError("Tryb prywatny wymaga zalogowania.");
            }
            if (this.#wordService.getPrivateWordsCount(userId) === 0) {
                throw new BadRequestError("Nie masz żadnych prywatnych słów do gry.");
            }
        }

        if (mode === "public") {
            if (this.#wordService.getPublicWordsCount() === 0) {
                throw new BadRequestError("Brak publicznych słów do gry.");
            }
        }
    }
    
    buildWordState(word, difficulty) {
        return {
            id: word.id,
            name: word.name,
            category: word.category_name,
            distorted_name: distortWord(this.#wordService.formatWord(word.name), difficulty)
        };
    }

    getRandomWord(mode, userId, excludedIds = []) {
        return this.#wordService.getRandomWord(mode, userId, excludedIds);
    }

    getDefaultState() {
        return { ...DEFAULT_GAME_STATE };
    }
}