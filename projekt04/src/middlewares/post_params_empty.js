export default function preventPostParamsError(req, res, next) {
    if (!req.body) req.body = {};
    next();
}