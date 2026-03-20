import { word_manager } from "../models/words.js";

export default function homeHandler (req, res) {
    res.render("index", { title: "Zgadywanka - Strona główna", words_count: word_manager.getWordsCount() });
}