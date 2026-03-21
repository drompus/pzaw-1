export default class WordService {

    #wordModel;
    constructor(wordModel) {
        this.#wordModel = wordModel;
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
        return this.#wordModel.getWordById(wordId);
    }

    addWord(categoryId, wordName) {
        const formattedWord = wordName.trim().toLowerCase();
        return this.#wordModel.addWordToCategory(categoryId, formattedWord);
    }

    deleteWord(wordId) {
        return this.#wordModel.deleteWordById(wordId);
    }

    updateWord(wordId, newWordName) {
        const formattedWord = newWordName.trim().toLowerCase();
        return this.#wordModel.updateWordById(wordId, formattedWord);
    }

    validateWordName(word_name) {
        const errors = {};
        const word_errors = [];

        if (typeof word_name != "string") {
            word_errors.push("Słowo musi być tekstem!");
        } else {
            word_name = word_name.trim().toLowerCase();

            if (word_name === "") {
                word_errors.push("Słowo nie może być puste!");
            } else {
                if (word_name.length < 3) word_errors.push("Słowo jest za krótkie! (min 3 znaki)");
                else if (word_name.length > 100) word_errors.push("Słowo jest za długie! (max 100 znaków)");

                const allowed_chars = "abcdefghijklmnopqrstuvwxyząćęłńóśźż -";
                for (let char of word_name) {
                    if (!allowed_chars.includes(char)) {
                        word_errors.push("Słowo zawiera niedozwolone znaki!");
                        break;
                    }
                }
            }
        }

        if (word_errors.length > 0) {
            errors.word_name = word_errors;
            errors.word_name_value = word_name;
        }
        errors.is_valid = word_errors.length === 0;;

        return errors;
    }

    getRandomWord(excludedWords = []) {
        return this.#wordModel.getRandomWord(excludedWords);
    }
}