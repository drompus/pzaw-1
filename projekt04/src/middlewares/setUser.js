export default function setUser(userModel) {
    return function setUser(req, res, next) {
        req.user = req.session?.user_id ? userModel.getUserById(req.session.user_id) : null;
        res.locals.user = req.user;
        next();
    }
}