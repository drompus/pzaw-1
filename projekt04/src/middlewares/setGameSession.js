import { DEFAULT_GAME_STATE } from "../utils/defaultValues.js";

export default function setGameSession(req, res, next) {
    if (!req.session.game_state) {
        req.session.game_state = {...DEFAULT_GAME_STATE};
    }

    res.locals.game_state = req.session.game_state; // for easier reference to states in ejs

    next();
}