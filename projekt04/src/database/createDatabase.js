import { DatabaseSync } from "node:sqlite";
import { DB_PATH } from "../../config.js";

export const db = new DatabaseSync(DB_PATH);

export function createDBTables() {
    db.exec(`
            
            CREATE TABLE IF NOT EXISTS roles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            ) STRICT;
                
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                passhash TEXT NOT NULL,` + // used password hash instead of password for security,
        // but this is the only place where the password is stored

        `
                role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE
            ) STRICT;
                    
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                is_public INTEGER NOT NULL CHECK (is_public IN (0, 1))
            ) STRICT;
                
            CREATE TABLE IF NOT EXISTS words (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
                name TEXT NOT NULL
            ) STRICT;

            CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                data TEXT NOT NULL,
                expires INTEGER
            ) STRICT;
            `);

    return db;
}

export default {
    db,
    createDBTables
};