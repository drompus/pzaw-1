import { DatabaseSync } from "node:sqlite";
import { DB_PATH } from "../config.js";

export const db = new DatabaseSync(DB_PATH);

export function createDBTables() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            dev_name TEXT NOT NULL,
            name TEXT NOT NULL
        
        ) STRICT;

        CREATE TABLE IF NOT EXISTS words (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
            name TEXT NOT NULL
        ) STRICT;

    `);
}

export default {
    db,
    createDBTables
};