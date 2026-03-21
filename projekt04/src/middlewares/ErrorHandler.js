import NotFoundError from "../errors/NotFoundError.js";

export default class ErrorHandler {

    // eslint-disable-next-line no-unused-vars
    static handleError(error, req, res, next) {

        const errorTitleMap = {
            400: "Błąd żądania",
            401: "Brak autoryzacji",
            403: "Brak dostępu",
            404: "Nie znaleziono strony",
            500: "Błąd serwera"
        };

        const status = error.status || 500;
        const message = error.message || "Wystąpił błąd serwera.";

        res.status(status);
        res.render("error", {
            title: errorTitleMap[status] || "Nieznany błąd",
            error_message: message,
            errors: error.reasons || []
        });
    }

    static handleNotFound(req, res, next) {
        next(new NotFoundError("Strona o podanym url nie istnieje"));
    }
}