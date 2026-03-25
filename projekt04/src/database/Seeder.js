import argon2 from "argon2";
import { createDBTables } from "./createDatabase.js";
import { PEPPER } from "../../config.js";

export default class DatabaseSeeder {

    #db;
    #pepper;
    constructor(db) {
        this.#db = db;
        this.#pepper = PEPPER || "test_pepper@123";
        createDBTables();
    }

    async run(rolesData, usersData, wordsCategoriesData) {
        await this.#seedRoles(rolesData);
        await this.#seedUsers(usersData);
        await this.#seedWords(wordsCategoriesData);
    }

    async #seedRoles(data) {
        console.log("Seeding roles...");
        data.forEach(role => {
            if (this.#db.prepare(`SELECT id FROM roles WHERE name = ?`).get(role)) {
                console.log(`\tRole ${role} already exists, skipping...`);
                return; // same as continue
            }
            this.#db.prepare(`INSERT INTO roles (name) VALUES (?)`).run(role);
            console.log(`\tAdded role: ${role}!`);
        });
        console.log("Done seeding roles!\n");
    }

    async #seedUsers(data) {
        console.log("Seeding users...");
        for (const user of data) { // NOT using foreach here because of async hashing

            if (this.#db.prepare(`SELECT id FROM users WHERE username = ?`).get(user.username)) {
                console.log(`\tUser ${user.username} already exists, skipping...`);
                continue;
            }

            const role_id = this.#db.prepare(`SELECT id FROM roles WHERE name = ?`).get(user.role)?.id;

            if (!role_id) {
                console.log(`\tRole ${user.role} does not exist, skipping ${user.username}...`);
                continue;
            }

            const passhash = await argon2.hash(user.password, {
                secret: Buffer.from(this.#pepper)
            });

            this.#db.prepare(
                `INSERT INTO users (username, passhash, role_id) VALUES (?, ?, ?)`
            ).run(user.username, passhash, role_id);
            console.log(`\tAdded user: ${user.username}!`);
        }
        console.log("Done seeding users!\n");
    }

    async #seedWords(data) {
        console.log("Seeding words and categories...");
        for (const [dev_category_name, other_data] of Object.entries(data)) {
            if (![0, 1].includes(other_data.is_public)) {
                console.log(`\tInvalid is_public value was given for category ${dev_category_name}, skipping...`);
                continue;
            }

            console.log(`\tCreating category: ${dev_category_name}`);

            const author_id = this.#db.prepare(`SELECT id FROM users WHERE username = ?`).get(other_data.author_username)?.id;

            if (!author_id) {
                console.log(`\tAuthor ${other_data.author_username} does not exist, skipping ${dev_category_name}...`);
                continue;
            }

            const category_id = this.#db.prepare(`INSERT INTO categories (name, author_id, is_public) VALUES (?, ?, ?) RETURNING id`).get(other_data.name, author_id, other_data.is_public)?.id;

            if (!category_id) {
                console.log(`\tCould not create category ${dev_category_name}, skipping...`);
                continue;
            }

            for (let word of other_data.words) {
                word = word.toLowerCase();
                this.#db.prepare(`INSERT INTO words (category_id, name) VALUES (?, ?)`).run(category_id, word);
                console.log(`\t\tAdded word: ${word}`);
            }

            console.log(`\tAdded category: ${dev_category_name} with ${other_data.words.length} words!`);
        }
        console.log("Done seeding words and categories!\n");
    }
}