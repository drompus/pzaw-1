export default function authLoginRedirect(req, res, next) {
    if (!req.user) {
        res.redirect("/auth/login");
    }
    next();
}