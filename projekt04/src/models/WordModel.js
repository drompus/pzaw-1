import { db } from "../database/createDatabase.js";

export default class WordModel {

    // CRUD fields
    #get_categories;
    #get_category_by_id;
    #get_word_by_id;
    #get_words_by_category_id;
    #get_all_words_count;
    #add_word_by_category_id;
    #update_word_by_id;
    #update_word_category_by_id;
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
        this.#update_word_category_by_id = db.prepare(`UPDATE words SET category_id = ? WHERE id = ?`);
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
        return this.#add_word_by_category_id.run(category_id, word_name);
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
        return this.#update_word_by_id.run(new_word_name, word_id);
    }

    updateWordCategoryById(word_id, new_category_id) {
        return this.#update_word_category_by_id.run(new_category_id, word_id);
    }

    deleteWordById(word_id) {
        return this.#delete_word_by_id.run(word_id);
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