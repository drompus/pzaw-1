import ApplicationError from "./ApplicationError.js";

export default class InvalidInputError extends ApplicationError {
    
    constructor(message, reasons = [], view = null) {
        super(message, 422, reasons, view);
        this.reasons = reasons;
        this.view = view;
    }
}