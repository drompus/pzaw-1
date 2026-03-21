import ApplicationError from "./ApplicationError.js";

export default class ForbiddenError extends ApplicationError {

    constructor(message, reasons = []) {
        super(message, 403);
        this.reasons = reasons;
    }
};