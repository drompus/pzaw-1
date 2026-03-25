import { db } from "../database/createDatabase.js";

export default class WordModel {

    // CRUD fields
    #get_categories;
    #get_category_by_id;
    #get_word_by_id;
    #get_words_by_category_id;
    #get_all_words_count;
    #get_private_words_count;
    #get_public_words_count;
    #add_word_by_category_id;
    #update_word_by_id;
    #update_word_category_by_id;
    #delete_word_by_id;
    #add_category;
    #get_categories_by_author_id;
    #get_public_categories;
    #delete_category_by_id;


    init() {
        this.#get_categories = db.prepare(`SELECT id, name FROM categories`);
        this.#get_category_by_id = db.prepare(`SELECT id, name FROM categories WHERE id = ?`);
        this.#get_word_by_id = db.prepare(`
            SELECT words.id AS id, words.name AS name, words.category_id AS category_id, 
            categories.name AS category_name, categories.author_id AS author_id, categories.is_public AS is_public FROM words
            JOIN categories ON words.category_id = categories.id
            WHERE words.id = ?`);
        this.#get_words_by_category_id = db.prepare(`SELECT name, id FROM words WHERE category_id = ?`);
        this.#get_all_words_count = db.prepare(`SELECT COUNT(*) as total FROM words`);
        this.#add_word_by_category_id = db.prepare(`INSERT INTO words (category_id, name) VALUES (?, ?)`);
        this.#update_word_by_id = db.prepare(`UPDATE words SET name = ? WHERE id = ?`);
        this.#update_word_category_by_id = db.prepare(`UPDATE words SET category_id = ? WHERE id = ?`);
        this.#delete_word_by_id = db.prepare(`DELETE FROM words WHERE id = ?`);
        this.#add_category = db.prepare(`INSERT INTO categories (name, author_id, is_public) VALUES (?, ?, ?)`);
        this.#get_categories_by_author_id = db.prepare(`SELECT id, name FROM categories WHERE author_id = ? AND is_public != 1`);
        this.#get_public_categories = db.prepare(`SELECT id, name FROM categories WHERE is_public = 1`);
        this.#delete_category_by_id = db.prepare(`DELETE FROM categories WHERE id = ?`);
        this.#get_category_by_id = db.prepare(`SELECT id, name, author_id, is_public FROM categories WHERE id = ?`);
        this.#get_public_words_count = db.prepare(`
            SELECT COUNT(*) AS total FROM words
            JOIN categories ON words.category_id = categories.id
            WHERE categories.is_public = 1`);
        this.#get_private_words_count = db.prepare(`
            SELECT COUNT(*) AS total FROM words
            JOIN categories ON words.category_id = categories.id
            WHERE categories.is_public = 0
            AND categories.author_id = ?`);


    }

    // Database CRUD

    getWordById(word_id) {
        return this.#get_word_by_id.get(word_id);
    }

    getAllCategories() {
        return this.#get_categories.all();
    }

    addCategory(name, author_id, is_public) {
        return this.#add_category.run(name, author_id, is_public);
    }

    deleteCategory(category_id) {
        return this.#delete_category_by_id.run(category_id);
    }

    getCategoriesByAuthorId(author_id) {
        return this.#get_categories_by_author_id.all(author_id);
    }

    getPublicCategories() {
        return this.#get_public_categories.all();
    }

    getWordsByCategoryId(category_id) {
        return this.#get_words_by_category_id.all(category_id);
    }

    addWordToCategory(category_id, word_name) {
        return this.#add_word_by_category_id.run(category_id, word_name);
    }

    getCategoryById(id) {
        return this.#get_category_by_id.get(id);
    }

    hasCategoryId(category_id) {
        return this.#get_category_by_id.all(category_id).length > 0;
    }

    getWordsCount() {
        return this.#get_all_words_count.get().total;
    }

    getPublicWordsCount() {
        return this.#get_public_words_count.get().total;
    }

    getPrivateWordsCount(userId) {
        return this.#get_private_words_count.get(userId).total;
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

    getRandomWord(mode, userId, excludedIds = []) {
        let query = `
        SELECT 
            words.id AS id,
            words.name AS name,
            categories.name AS category_name,
            categories.id AS category_id
        FROM words
        JOIN categories ON words.category_id = categories.id`;

        const queryConditions = [];
        const params = [];

        if (mode === "public") {
            queryConditions.push("categories.is_public = 1");
        } else if (mode === "private") {
            queryConditions.push("categories.is_public = 0");
            queryConditions.push("categories.author_id = ?");
            params.push(userId);
        }

        if (excludedIds.length > 0) {
            const placeholders = excludedIds.map(() => "?").join(",");
            queryConditions.push(`words.id NOT IN (${placeholders})`);
            params.push(...excludedIds);
        }

        if (queryConditions.length > 0) {
            query += " WHERE " + queryConditions.join(" AND ");
        }

        query += " ORDER BY RANDOM() LIMIT 1";

        return db.prepare(query).get(...params);
    }

}