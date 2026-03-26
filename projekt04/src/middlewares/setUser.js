export default function setUser(userModel) {
    return function setUser(req, res, next) {
        req.user = req.session?.user_id ? userModel.getUserById(req.session.user_id) : null; // not sure about the performance of this (database access every time middleware fires)
        res.locals.user = req.user; // keep in mind this is also set in ErrorHandler.js (see comment there)
        next();
    }
}