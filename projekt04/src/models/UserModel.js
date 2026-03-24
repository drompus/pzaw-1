import { db } from "../database/createDatabase.js";

const DEFAULT_ROLE = "user";

export default class UserModel {

    // CRUD fields
    #get_user_by_id;
    #get_user_by_username;
    #get_users_by_role_id;
    #add_user;
    #delete_user_by_id;
    #get_default_role_id;

    init() {
        this.#get_user_by_id = db.prepare(`SELECT username, passhash, role_id FROM users WHERE id = ?`);
        this.#get_user_by_username = db.prepare(`SELECT id, passhash, role_id FROM users WHERE username = ?`);
        this.#get_users_by_role_id = db.prepare(`SELECT id, username FROM users WHERE role_id = ?`);
        this.#add_user = db.prepare(`INSERT INTO users (username, passhash, role_id) VALUES (?, ?, ?) RETURNING username, role_id, id`);
        this.#delete_user_by_id = db.prepare(`DELETE FROM users WHERE id = ?`);
        this.#get_default_role_id = db.prepare(`SELECT id FROM roles WHERE name = ?`);
    }

    // Database CRUD
    getUserById(userId) {
        return this.#get_user_by_id.get(userId);
    }

    getUserByUsername(username) {
        return this.#get_user_by_username.get(username);
    }

    getUsersByRoleId(roleId) {
        return this.#get_users_by_role_id.all(roleId);
    }

    getDefaultRoleId() {
        return this.#get_default_role_id.get(DEFAULT_ROLE).id;
    }

    addAndGetUser(username, passhash, roleId) {
        return this.#add_user.get(username, passhash, roleId);
    }

    deleteUserById(userId) {
        return this.#delete_user_by_id.run(userId);
    }
}