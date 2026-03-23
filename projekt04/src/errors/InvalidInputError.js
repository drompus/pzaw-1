import ApplicationError from "./ApplicationError.js";

export default class InvalidInputError extends ApplicationError {
    
    constructor(message, reasons = [], view = null) {
        super(message, 200, reasons, view);
        this.reasons = reasons;
        this.view = view;
    }
}