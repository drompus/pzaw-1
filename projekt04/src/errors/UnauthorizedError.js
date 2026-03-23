import ApplicationError from "./ApplicationError.js";

export default class UnauthorizedError extends ApplicationError {
    
    constructor(message, reasons = []) {
        super(message, 401);
        this.reasons = reasons;
    }
}