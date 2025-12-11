import { getDefaultGameState } from "../models/game_values.js";

export default function createGameSession(req, res, next) {
    if (!req.session.game_state) {
        req.session.game_state = getDefaultGameState();
    }

    res.locals.game_state = req.session.game_state; // for easier reference to states in ejs

    next();
}