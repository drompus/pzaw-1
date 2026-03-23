export default class ApplicationError extends Error {

    constructor(message, status, reasons, view = null) {
        super(message);
        this.status = status;
        this.reasons = reasons;
        this.view = view;
    }
}