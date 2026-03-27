import InvalidInputError from "../InvalidInputError.js";

export default class LoginError extends InvalidInputError {

    constructor(message, reasons = []) {
        const view = "auth/login";
        super(message, reasons, view);
        this.reasons = reasons;
        this.view = view;
    }
}