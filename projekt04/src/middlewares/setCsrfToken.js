export default function setCsrfToken(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
}