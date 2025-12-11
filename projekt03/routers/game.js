import express from "express";

import * as game_handlers from "../handlers/game.js";

const router = express.Router();

router.post("/start", game_handlers.startGameHandler);
router.post("/guess", game_handlers.guessGameHandler);
router.post("/finish", game_handlers.finishGameHandler);
router.post("/restart", game_handlers.restartGameHandler);

export default router;