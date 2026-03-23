import InvalidInputError from "./InvalidInputError.js";

export default class RegisterError extends InvalidInputError {

    constructor(message, reasons = []) {
        const view = "auth/register";
        super(message, reasons, view);
        this.reasons = reasons;
        this.view = view;
    }
}