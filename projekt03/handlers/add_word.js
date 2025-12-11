import { word_manager } from "../models/words.js";

export function addWordHandler(req, res) {
    const category_id = req.body.category_id;
    const word_name = req.body.word_name;

    if (!word_manager.hasCategoryId(category_id)) return res.status(404).send("Nieprawidłowe ID kategorii.");
    else {
        var word_validation = word_manager.validateWordName(word_name);
        const word_validation_errors = word_validation.word_name;

        if (!word_validation.is_valid) {
            res.status(400);
            res.render("partials/errors/new_word", { title: "Zgadywanka - błąd w słowie", errors: word_validation_errors, word_name: word_name });
        } else {
            word_manager.addWordToCategory(category_id, word_name);
            res.redirect("/word_list");
        }
    }
}