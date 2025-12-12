import { word_manager } from "../models/words.js";

export function postNewHandler(req, res) {
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

export function getNewHandler(req, res) {
    const is_game_active = req.session?.game_state?.is_active || false;

    if (is_game_active) {
        return res.render("add_word", { title: "Zgadywanka - Dodaj słowo", is_game_active: true })
    }

    return res.render("add_word", { title: "Zgadywanka - Dodaj słowo", categories: word_manager.getAllCategories(), is_game_active: false });

};

export function getEditHandler(req, res) {
    const is_game_active = req.session?.game_state?.is_active || false;

    if (is_game_active) {
        return res.status(403).send("Nie można edytować słów w trakcie gry!");
    }

    const word_id = req.params?.id;
    if (!word_id) {
        return res.status(400).send("Nieprawidłowy ID słowa.");
    }

    const word = word_manager.getWordById(word_id);

    if (!word) {
        return res.status(404).send("Słowo o podanym ID nie istnieje.");
    }

    return res.render("edit_word.ejs", {
        title: "Zgadywanka - edytuj słowo",
        word: {
            id: word?.id,
            name: word?.name,
            category_id: word?.category_id,
            category_name: word?.category_name
        }
    });
}

export function postEditHandler(req, res) {

    const is_game_active = req.session?.game_state?.is_active || false;

    if (is_game_active) {
        return res.status(403).send("Nie można edytować słów w trakcie gry!");
    }

    const word_id = req.body?.word_id;
    const word_name = req.body?.word_name;
    
    
    if (!word_id) {
        return res.status(400).send("Nieprawidłowy ID słowa.");
    }
    
    const word = word_manager.getWordById(word_id);
    if (!word) {
        return res.status(404).send("Słowo o podanym ID nie istnieje.");
    }
    
    const word_validation = word_manager.validateWordName(word_name);
    const word_validation_errors = word_validation.word_name;

    if (!word_validation.is_valid) {
        res.status(400);
        return res.render("partials/errors/new_word", {
            title: "Zgadywanka - błąd w słowie",
            errors: word_validation_errors,
            word_name
        });
    }

    word_manager.updateWordById(word_id, word_name);
    res.redirect("/word_list");
}

export function postDeleteHandler(req, res) {

    const is_game_active = req.session?.game_state?.is_active || false;
    const word_id = req.body?.word_id;

    if (is_game_active) {
        return res.status(403).send("Nie można edytować słów w trakcie gry!");
    }

    if (!word_id || !word_manager.getWordById(word_id)) {
        return res.status(403).send("Przesłano niepoprawne parametry żądania.")
    }


    word_manager.deleteWordById(word_id);
    res.redirect("/word_list");
}