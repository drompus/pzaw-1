import { word_manager } from "../models/words.js";

export default function wordListHandler(req, res) {
    
    if (req.is_game_active) {
        return res.render("word_list", { title: "Zgadywanka - Lista słów", is_game_active: true });
    }

    const categories = word_manager.getAllCategories();
    categories.forEach(category => {
        category.words = word_manager.getWordsByCategoryId(category.id);
    });

    return res.render("word_list", { title: "Zgadywanka - Lista słów", categories: categories, is_game_active: false });

}