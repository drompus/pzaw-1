import session from "express-session";

export default class SqliteSessionStore extends session.Store {

    #db;
    constructor(database) {
        super();
        this.#db = database;

        // cleanup to delete expired sessions
        setInterval(() => {
            try {
                this.#db.prepare(`DELETE FROM sessions WHERE expires IS NOT NULL AND expires < ?`).run(Date.now());
            } catch (error) {
                console.error(error);
            }
        }, 1000 * 60 * 5);
    }

    destroy(sid, callback) {
        try {
            this.#db.prepare(`DELETE FROM sessions WHERE id = ?`).run(sid);
            callback(null);
        } catch (error) {
            callback(error);
        }
    }

    get(sid, callback) {
        try {
            const session = this.#db.prepare(`SELECT data, expires FROM sessions WHERE id = ? LIMIT 1`).get(sid);
            if (!session) return callback(null, null);

            if (session.expires && session.expires < Date.now()) {
                this.destroy(sid, () => { });
                return callback(null, null);
            }

            callback(null, JSON.parse(session.data));
        } catch (error) {
            callback(error, null);
        }
    }

    set(sid, session, callback) {
        try {
            const expires = session.cookie.expires ? new Date(session.cookie.expires).getTime() : null;
            this.#db.prepare(`INSERT INTO sessions (id, data, expires) VALUES (?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET data = excluded.data, expires = excluded.expires`).run(sid, JSON.stringify(session), expires);
            callback(null);
        } catch (error) {
            callback(error);
        }
    }

    touch(sid, session, callback) {
        try {
            const expireDate = session.cookie.expires ? new Date(session.cookie.expires).getTime() : null;
            this.#db.prepare(`UPDATE sessions SET expires = ? WHERE id = ?`).run(expireDate, sid);
            callback(null);
        } catch (error) {
            callback(error);
        }
    }
}