import BadRequestError from "../errors/BadRequestError.js";
import ForbiddenError from "../errors/ForbiddenError.js";
import NotFoundError from "../errors/NotFoundError.js";
import { AUTH_REQUIREMENTS } from "../utils/defaultValues.js";

export default class WordService {

    #wordModel;
    constructor(wordModel) {
        this.#wordModel = wordModel;
    }

    formatWord(rawWord) {
        return rawWord.trim().toLowerCase();
    }

    formatCategory(rawCategory) {
        return rawCategory.trim().toLowerCase();
    }

    hasCategoryId(categoryId) {
        return this.#wordModel.hasCategoryId(categoryId);
    }

    getPublicCategories() {
        return this.#wordModel.getPublicCategories();
    }

    getCategoryById(categoryId) {
        return this.#wordModel.getCategoryById(categoryId);
    }

    getAllCategories() {
        return this.#wordModel.getAllCategories();
    }

    addCategory(name, authorId, isPublic) {
        const formattedWord = this.formatCategory(name);
        const categoryNameValidation = this.validateCategoryName(formattedWord);
        const validationErrors = categoryNameValidation?.errors;
        if (!categoryNameValidation.is_valid || typeof authorId != 'number' || typeof isPublic !== 'boolean') {
            throw new BadRequestError(`Przesłano nieprawidłową nazwę kategorii (${name})`, validationErrors);
        }
        this.#wordModel.addCategory(name, authorId, isPublic == true ? 1 : 0);
    }

    deleteCategory(categoryId, user, adminRoleId) {
        const category = this.#wordModel.getCategoryById(categoryId);
        if (!category) {
            throw new BadRequestError("Taka kategoria nie istnieje.");
        }

        const isAdmin = user.role_id === adminRoleId;

        if (category.is_public && !isAdmin) {
            throw new ForbiddenError("Nie masz uprawnień do usunięcia kategorii publicznej.");
        }

        if (!category.is_public && category.author_id !== user.id) {
            throw new ForbiddenError("Nie możesz usunąć kategorii, która nie należy do Ciebie.");
        }

        this.#wordModel.deleteCategory(categoryId);
        return category;
    }


    getCategoriesForUser(authorId, isAdmin) {
        const publicCategories = isAdmin == true ? this.#wordModel.getPublicCategories() : [];
        return {
            public: publicCategories,
            private: this.#wordModel.getCategoriesByAuthorId(authorId)
        }
    }

    getPublicWordsCount() {
        return this.#wordModel.getPublicWordsCount();
    }

    getPrivateWordsCount(userId) {
        return this.#wordModel.getPrivateWordsCount(userId);
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

    deleteWord(wordId, user, adminRoleId) {
        const word = this.getWord(wordId); // if word doesn't exists error is throwed
        const category = this.checkWordPermissions(word, user, adminRoleId);

        this.#wordModel.deleteWordById(wordId);

        return category;
    }

    updateWord(wordId, newWordName, newCategoryId, user, adminRoleId) {
        const word = this.getWord(wordId); // if word doesn't exists - error is thrown
        const oldCategory = this.checkWordPermissions(word, user, adminRoleId);

        const formattedWord = this.formatWord(newWordName);
        const validation = this.validateWordName(formattedWord);

        if (!validation.is_valid) {
            throw new BadRequestError(
                `Przesłano nieprawidłowe słowo (${newWordName})`, validation.word_name);
        }

        const isSameName = formattedWord === word.name;
        const isSameCategory = Number(newCategoryId) === Number(word.category_id);

        if (isSameName && isSameCategory) {
            return oldCategory;
        }

        if (!isSameCategory) {
            if (!this.#wordModel.hasCategoryId(newCategoryId)) {
                throw new BadRequestError("Nieprawidłowy ID kategorii.");
            }
            this.#wordModel.updateWordCategoryById(wordId, newCategoryId);
        }

        if (!isSameName) {
            this.#wordModel.updateWordById(wordId, formattedWord);
        }

        const finalCategoryId = isSameCategory ? oldCategory.id : newCategoryId;
        const finalCategory = this.getCategoryById(finalCategoryId);

        return finalCategory;
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
                const minLength = AUTH_REQUIREMENTS.word_name.length.min;
                const maxLength = AUTH_REQUIREMENTS.word_name.length.max
                if (formattedWordName.length < minLength) word_errors.push(`Słowo jest za krótkie! (minimum ${minLength} znaki)`);
                else if (formattedWordName.length > maxLength) word_errors.push(`Słowo jest za długie! (maksimum ${maxLength} znaków)`);

                if (!AUTH_REQUIREMENTS.word_name.pattern.test(formattedWordName)) word_errors.push("Słowo zawiera niedozwolone znaki!");

            }
        }

        if (word_errors.length > 0) {
            errors.word_name = word_errors;
        }
        errors.is_valid = word_errors.length === 0;;

        return errors;
    }

    validateCategoryName(formattedCategoryName) {
        const errors = {};
        const name_errors = [];

        if (typeof formattedCategoryName != "string") {
            name_errors.push("Nazwa kategorii musi być tekstem!");
        } else {
            if (formattedCategoryName === "") {
                name_errors.push("Nazwa kategorii nie może być pusta!");
            } else {
                const minLength = AUTH_REQUIREMENTS.category_name.length.min;
                const maxLength = AUTH_REQUIREMENTS.category_name.length.max
                if (formattedCategoryName.length < minLength) name_errors.push(`Nazwa kategorii jest za krótka! (minimum ${minLength} znaki)`);
                else if (formattedCategoryName.length > maxLength) name_errors.push(`Nazwa kategorii jest za długa! (maksimum ${maxLength} znaków)`);

                if (!AUTH_REQUIREMENTS.category_name.pattern.test(formattedCategoryName)) name_errors.push("Nazwa kategorii zawiera niedozwolone znaki!");
            }
        }

        if (name_errors.length > 0) {
            errors.errors = name_errors;
        }
        errors.is_valid = name_errors.length === 0;
        return errors;
    }

    checkWordPermissions(word, user, adminRoleId) {
        const category = this.getCategoryById(word.category_id);
        this.checkCategoryPermissions(category, user, adminRoleId);
        return category;
    }


    checkCategoryPermissions(category, user, adminRoleId) {
        const isAdmin = user.role_id === adminRoleId;

        if (category.is_public && !isAdmin) {
            throw new ForbiddenError("Nie masz uprawnień do modyfikowania kategorii publicznej.");
        }

        if (!category.is_public && category.author_id !== user.id) {
            throw new ForbiddenError("Nie możesz modyfikować kategorii, która nie należy do Ciebie.");
        }
    }

    getRandomWord(mode, userId, excludedIds = []) {
        return this.#wordModel.getRandomWord(mode, userId, excludedIds);
    }
}