import InvalidInputError from "../errors/InvalidInputError.js";
import NotFoundError from "../errors/NotFoundError.js";

export default class ErrorHandler {

    // eslint-disable-next-line no-unused-vars
    static handleError(error, req, res, next) {
        
        const status = error.status || 500;
        const message = error.message || "Wystąpił błąd serwera.";
        const errorTitleMap = {
            200: "Niepoprawne dane",
            401: "Brak autoryzacji",
            403: "Brak dostępu",
            400: "Błąd żądania",
            404: "Nie znaleziono strony",
            500: "Błąd serwera"
        };

        if (error instanceof InvalidInputError && error.view) {
            res.status(status);
            res.render(error.view, {
                title: "Zgadywanka - " + (errorTitleMap[status] || "Nieznany błąd") ,
                error_message: message,
                errors: error.reasons || []
            });
            return;
        }


        res.status(status);
        res.render("error", {
            title: "Zgadywanka - " + (errorTitleMap[status] || "Nieznany błąd") ,
            error_message: message,
            errors: error.reasons || []
        });
    }

    static handleNotFound(req, res, next) {
        next(new NotFoundError("Strona o podanym url nie istnieje"));
    }
}