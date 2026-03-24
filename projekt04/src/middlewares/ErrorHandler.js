import InvalidInputError from "../errors/InvalidInputError.js";
import NotFoundError from "../errors/NotFoundError.js";

export default class ErrorHandler {

    // eslint-disable-next-line no-unused-vars
    static handleError(error, req, res, next) {

        if (!error.status) {
            console.error(error);
            error.message = "Wystąpił nieoczekiwany błąd serwera.";
        }

        const status = error.status || 500;
        const message = error.message || "Wystąpił nieoczekiwanybłąd serwera.";
        const errorTitleMap = {
            422: "Niepoprawne dane",
            401: "Brak autoryzacji",
            403: "Brak dostępu",
            400: "Błąd żądania",
            404: "Nie znaleziono strony",
            500: "Błąd serwera"
        };

        if (error instanceof InvalidInputError && error.view) {
            res.status(status);
            res.render(error.view, {
                title: "Zgadywanka - " + (errorTitleMap[status] || "Nieznany błąd"),
                error_message: message,
                errors: error.reasons || []
            });
            return;
        }


        res.status(status);
        res.render("error", {
            title: "Zgadywanka - " + (errorTitleMap[status] || "Nieznany błąd"),
            error_message: message,
            errors: error.reasons || []
        });
    }

    static handleNotFound(req, res, next) {
        next(new NotFoundError("Błąd 404! Strona o podanym adresie URL nie istnieje."));
    }
}