import { db } from "../database/db.js";

const db_operations = {
    get_categories: db.prepare(`SELECT id, dev_name, name FROM categories`),
    get_category_by_id: db.prepare(`SELECT id, dev_name, name FROM categories WHERE id = ?`),
    get_words_by_category_id: db.prepare(`SELECT name FROM words WHERE category_id = ?`),
    add_word_by_category_id: db.prepare(`INSERT INTO words (category_id, name) VALUES (?, ?)`)
};

export function getAllCategories() {
    return db_operations.get_categories.all();
}

export function getWordsByCategoryId(category_id) {
    return db_operations.get_words_by_category_id.all(category_id);
}

export function addWordToCategory(category_id, word_name) {
    const formatted_word = word_name.trim().toLowerCase();
    return db_operations.add_word_by_category_id.run(category_id, formatted_word);
}

export function hasCategoryId(category_id) {
    return db_operations.get_category_by_id.all(category_id).length > 0;
}

export function validateWordName(word_name) {
    var errors = {};
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


export default {
    getAllCategories,
    getWordsByCategoryId,
    addWordToCategory,
    hasCategoryId,
    validateWordName
}