import ApplicationError from "./ApplicationError.js";

export default class BadRequestError extends ApplicationError {

    constructor(message, reasons = []) {
        super(message, 400);
        this.reasons = reasons;
    }
}