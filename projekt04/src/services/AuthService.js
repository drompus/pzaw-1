import argon2 from "argon2";
import { PEPPER } from "../../config.js";
import LoginError from "../errors/LoginError.js";
import RegisterError from "../errors/RegisterError.js";
import { AUTH_REQUIREMENTS } from "../utils/defaultValues.js";

const INVALID_USERNAME_LENGTH_MESSAGE = `Nazwa użytkownika powinna zawierać od ${AUTH_REQUIREMENTS.username.length.min} do ${AUTH_REQUIREMENTS.username.length.max} znaków`;
const INVALID_PASSWORD_LENGTH_MESSAGE = `Hasło powinno zawierać od ${AUTH_REQUIREMENTS.password.length.min} do ${AUTH_REQUIREMENTS.password.length.max} znaków`;
const INVALID_CREDENTIALS_MESSAGE = "Niepoprawna nazwa użytkownika lub hasło";

export default class AuthService {

    #userModel;
    constructor(userModel) {
        this.#userModel = userModel;
    }

    #validateUsername(username) {
        const reasons = [];
        if (username.length < AUTH_REQUIREMENTS.username.length.min || username.length > AUTH_REQUIREMENTS.username.length.max) {
            reasons.push(INVALID_USERNAME_LENGTH_MESSAGE);
        }

        const invalidChars = [...new Set( // using set to avoid duplicate values
            username
            .split('')
            .filter(char => !AUTH_REQUIREMENTS.username.allowedChars.test(char))
        )];

        if (invalidChars.length > 0) {
            let message = "Nazwa użytkownika zawiera niedozwolone znaki:";
            invalidChars.forEach(char => {
                message += ` ${char}`;
            });
            reasons.push(message);
        }

        if (reasons.length > 0) {
            return {
                isValid: false,
                reasons: reasons
            }
        } else {
            return {
                isValid: true
            }
        }
    }

    #validatePassword(password) {
        if (password.length < AUTH_REQUIREMENTS.password.length.min ||
            password.length > AUTH_REQUIREMENTS.password.length.max) {
            return {
                isValid: false,
                reasons: [INVALID_PASSWORD_LENGTH_MESSAGE]
            }
        } else {
            return {
                isValid: true
            }
        }
    }

    async authenticateUser(username, password) {

        const errors = [];

        if (!this.#validateUsername(username).isValid || !this.#validatePassword(password).isValid) { // basic validation
            // on login page user doesn't need to know about the requirements, so we send the same message as for nonexistent password or username
            errors.push(INVALID_CREDENTIALS_MESSAGE);
            throw new LoginError("Niepoprawne dane logowania", errors);
        }

        const user = this.#userModel.getUserByUsername(username);
        if (!user) {
            errors.push(INVALID_CREDENTIALS_MESSAGE);
            throw new LoginError("Niepoprawne dane logowania", errors);
        }

        if (!await argon2.verify(user.passhash, password, { secret: Buffer.from(PEPPER) })) {
            errors.push(INVALID_CREDENTIALS_MESSAGE);
            throw new LoginError("Niepoprawne dane logowania", errors);
        }

        return user;
    }

    async registerUser(username, password) {
        const errors = [];
        const usernameValidation = this.#validateUsername(username);
        const passwordValidation = this.#validatePassword(password);

        if (!usernameValidation.isValid || !passwordValidation.isValid) {
            errors.push(...usernameValidation.reasons, ...passwordValidation.reasons);
            throw new RegisterError("Niepoprawne dane rejestracji", errors);
        }

        if (this.#userModel.getUserByUsername(username)) {
            errors.push("Nazwa użytkownika jest już zajęta");
            throw new RegisterError("Niepoprawne dane rejestracji", errors);
        }

        const passhash = await argon2.hash(password, { secret: Buffer.from(PEPPER) });
        this.#userModel.addUser(username, passhash, this.#userModel.getDefaultRoleId());
    }


}