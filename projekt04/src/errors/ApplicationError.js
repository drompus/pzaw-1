export default class ApplicationError extends Error {

    constructor(message, status, reasons) {
        super(message);
        this.status = status;
        this.reasons = reasons;
    }
}