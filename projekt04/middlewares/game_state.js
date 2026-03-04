export default function setGameState(req, res, next) {
    req.is_game_active = req.session?.game_state?.is_active || false;
    next();
}