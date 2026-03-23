import BadRequestError from "../errors/BadRequestError.js";
import NotFoundError from "../errors/NotFoundError.js";

export default class WordService {

    #wordModel;
    constructor(wordModel) {
        this.#wordModel = wordModel;
    }

    formatWord(rawWord) {
        return rawWord.trim().toLowerCase();
    }

    hasCategoryId(categoryId) {
        return this.#wordModel.hasCategoryId(categoryId);
    }

    getAllCategories() {
        return this.#wordModel.getAllCategories();
    }

    getWordsCount() {
        return this.#wordModel.getWordsCount();
    }

    getWordsByCategory(categoryId) {
        return this.#wordModel.getWordsByCategoryId(categoryId);
    }

    getWord(wordId) {
        const word = this.#wordModel.getWordById(wordId);
        if (!word) {
            throw new NotFoundError("Słowo o podanym ID nie istnieje.");
        }

        return word;
    }

    addWord(categoryId, wordName) {
        const formattedWord = this.formatWord(wordName);
        if (!this.hasCategoryId(categoryId)) throw new BadRequestError("Nieprawidłowe ID kategorii.");

        const word_validation = this.validateWordName(formattedWord);
        const word_validation_errors = word_validation.word_name;
        if (!word_validation.is_valid) {
            throw new BadRequestError(`Przesłano nieprawidłowe słowo (${wordName})`, word_validation_errors);
        }
        return this.#wordModel.addWordToCategory(categoryId, formattedWord);
    }

    deleteWord(wordId) {
        this.getWord(wordId); // check if word exists
        return this.#wordModel.deleteWordById(wordId);
    }

    updateWord(wordId, newWordName, newCategoryId = null) {
        const formattedWord = this.formatWord(newWordName);

        this.getWord(wordId); // check if word exists
        const word_validation = this.validateWordName(formattedWord);
        if (!word_validation.is_valid) {
            throw new BadRequestError(`Przesłano nieprawidłowe słowo (${newWordName})`, word_validation.word_name);
        }

        if (newCategoryId) {
            if (!this.#wordModel.hasCategoryId(newCategoryId)) throw new BadRequestError("Nieprawidłowy ID kategorii.");
            this.#wordModel.updateWordCategoryById(wordId, newCategoryId);
        }

        return this.#wordModel.updateWordById(wordId, formattedWord);
    }

    validateWordName(formattedWordName) {
        const errors = {};
        const word_errors = [];

        if (typeof formattedWordName != "string") {
            word_errors.push("Słowo musi być tekstem!");
        } else {
            if (formattedWordName === "") {
                word_errors.push("Słowo nie może być puste!");
            } else {
                if (formattedWordName.length < 3) word_errors.push("Słowo jest za krótkie! (min 3 znaki)");
                else if (formattedWordName.length > 100) word_errors.push("Słowo jest za długie! (max 100 znaków)");

                const allowed_chars = "abcdefghijklmnopqrstuvwxyząćęłńóśźż -";
                for (let char of formattedWordName) {
                    if (!allowed_chars.includes(char)) {
                        word_errors.push("Słowo zawiera niedozwolone znaki!");
                        break;
                    }
                }
            }
        }

        if (word_errors.length > 0) {
            errors.word_name = word_errors;
            errors.word_name_value = formattedWordName;
        }
        errors.is_valid = word_errors.length === 0;;

        return errors;
    }

    getRandomWord(excludedWords = []) {
        return this.#wordModel.getRandomWord(excludedWords);
    }
}