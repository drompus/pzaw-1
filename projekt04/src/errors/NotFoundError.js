import ApplicationError from "./ApplicationError.js";

export default class NotFoundError extends ApplicationError {

    constructor(message, reasons = []) {
        super(message, 404);
        this.reasons = reasons;
    }
}