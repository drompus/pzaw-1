import { db } from "../database/db.js";

class WordsModel {

    // CRUD fields
    #get_categories;
    #get_category_by_id;
    #get_word_by_id;
    #get_words_by_category_id;
    #get_all_words_count;
    #add_word_by_category_id;
    #update_word_by_id;
    #delete_word_by_id;

    init() {
        this.#get_categories = db.prepare(`SELECT id, dev_name, name FROM categories`);
        this.#get_category_by_id = db.prepare(`SELECT id, dev_name, name FROM categories WHERE id = ?`);
        this.#get_word_by_id = db.prepare(`
            SELECT words.id AS id, words.name AS name, words.category_id AS category_id, categories.name AS category_name
            FROM words
            JOIN categories ON words.category_id = categories.id
            WHERE words.id = ?
        `);
        this.#get_words_by_category_id = db.prepare(`SELECT name, id FROM words WHERE category_id = ?`);
        this.#get_all_words_count = db.prepare(`SELECT COUNT(*) as total FROM words`);
        this.#add_word_by_category_id = db.prepare(`INSERT INTO words (category_id, name) VALUES (?, ?)`);
        this.#update_word_by_id = db.prepare(`UPDATE words SET name = ? WHERE id = ?`);
        this.#delete_word_by_id = db.prepare(`DELETE FROM words WHERE id = ?`);
    }

    // Database CRUD

    getWordById(word_id) {
        return this.#get_word_by_id.get(word_id);
    }

    getAllCategories() {
        return this.#get_categories.all();
    }

    getWordsByCategoryId(category_id) {
        return this.#get_words_by_category_id.all(category_id);
    }

    addWordToCategory(category_id, word_name) {
        const formatted_word = word_name.trim().toLowerCase();
        return this.#add_word_by_category_id.run(category_id, formatted_word);
    }

    hasWordId(word_id) {
        return this.#get_word_by_id.all(word_id).length > 0;
    }

    hasCategoryId(category_id) {
        return this.#get_category_by_id.all(category_id).length > 0;
    }

    getWordsCount() {
        return this.#get_all_words_count.get().total;
    }

    updateWordById(word_id, new_word_name) {
        const formatted_word = new_word_name.trim().toLowerCase();        
        return this.#update_word_by_id.run(new_word_name, word_id);
    }

    deleteWordById(word_id) {
        return this.#delete_word_by_id.run(word_id);
    }

    // Helper functions

    validateWordName(word_name) {
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

    getRandomWord(excluded_words = []) {
        let query = `
        SELECT words.name AS name, categories.name AS category
        FROM words
        JOIN categories ON words.category_id = categories.id`;

        if (excluded_words.length > 0) {
            const chars_for_values = excluded_words.map(() => '?').join(',');
            query += ` WHERE words.name NOT IN (${chars_for_values})`;
        }

        query += ` ORDER BY RANDOM() LIMIT 1`;

        return db.prepare(query).get(...excluded_words);
    }
}

export const word_manager = new WordsModel();