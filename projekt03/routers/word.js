import express from "express";

import * as word_handlers from "../handlers/word.js";

const router = express.Router();

router.get("/new", word_handlers.getNewHandler);
router.post("/new", word_handlers.postNewHandler);

router.get("/edit/:id", word_handlers.getEditHandler);
router.post("/edit", word_handlers.postEditHandler);

router.post("/delete", word_handlers.postDeleteHandler);

export default router;