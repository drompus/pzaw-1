import express from "express";
import { createDBTables } from "./database/db.js";
import words from "./models/words.js";

createDBTables();

const port = 8000;
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded());

app.get("/word_list", (req, res) => {
    const categories = words.getAllCategories();
    categories.forEach(category => {
        category.words = words.getWordsByCategoryId(category.id);
    });

    res.render("word_list", { title: "Zgadywanka - Lista słów", categories: categories });
});

app.get("/add_word", (req, res) => {
    res.render("add_word", { title: "Zgadywanka - Dodaj słowo", categories: words.getAllCategories() });
});

app.post("/add_word", (req, res) => {
    const category_id = req.body.category_id;
    const word_name = req.body.word_name;

    console.log(`Dodawanie słowa: ${word_name} do kategorii o ID: ${category_id}`);

    if (!words.hasCategoryId(category_id)) return res.status(404).send("Nieprawidłowe ID kategorii.");
    else {
        var word_validation = words.validateWordName(word_name);
        const word_validation_errors = word_validation.word_name;

        if (!word_validation.is_valid) {
            res.status(400);
            res.render("errors/new_word", { title: "Zgadywanka - błąd w słowie", errors: word_validation_errors, word_name: word_name });
        } else {
            words.addWordToCategory(category_id, word_name);
                res.redirect("/word_list");
        }
    }

});

app.listen(port, () => {
    console.log(`Server listening on https://localhost:${port}`);
});