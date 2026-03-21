import BadRequestError from "../errors/BadRequestError.js";
import ForbiddenError from "../errors/ForbiddenError.js";
import NotFoundError from "../errors/NotFoundError.js";

export default class WordController {

    #wordService;
    constructor(wordService) {
        this.#wordService = wordService;
        this.postNew = this.postNew.bind(this);
        this.getNew = this.getNew.bind(this);
        this.getEdit = this.getEdit.bind(this);
        this.getList = this.getList.bind(this);
        this.postEdit = this.postEdit.bind(this);
        this.postDelete = this.postDelete.bind(this);
    }

    postNew(req, res) {
        const category_id = req.body.category_id;
        const word_name = req.body.word_name;

        if (!this.#wordService.hasCategoryId(category_id)) throw new NotFoundError("Nieprawidłowe ID kategorii.");
        else {
            const word_validation = this.#wordService.validateWordName(word_name);
            const word_validation_errors = word_validation.word_name;

            if (!word_validation.is_valid) {
                throw new BadRequestError(`Przesłano nieprawidłowe słowo (${word_name})`, word_validation_errors);
            } else {
                this.#wordService.addWord(category_id, word_name)
                res.redirect("/word/list");
            }
        }
    }

    getNew(req, res) {

        if (req.is_game_active) {
            return res.render("word/new", { title: "Zgadywanka - Dodaj słowo", is_game_active: true })
        }

        return res.render("word/new", { title: "Zgadywanka - Dodaj słowo", categories: this.#wordService.getAllCategories(), is_game_active: false });

    };

    getEdit(req, res) {

        if (req.is_game_active) {
            throw new ForbiddenError("Nie można edytować słów w trakcie gry!");
        }

        const word_id = req.params?.id;
        if (!word_id) {
            throw new BadRequestError("Nieprawidłowy ID słowa.");
        }

        const word = this.#wordService.getWord(word_id);

        if (!word) {
            throw new NotFoundError("Słowo o podanym ID nie istnieje.");
        }

        return res.render("word/edit", {
            title: "Zgadywanka - edytuj słowo",
            word: {
                id: word?.id,
                name: word?.name,
                category_id: word?.category_id,
                category_name: word?.category_name
            },
            categories: this.#wordService.getAllCategories()
        });
    }

    getList(req, res) {

        if (req.is_game_active) {
            return res.render("word/list", { title: "Zgadywanka - Lista słów", is_game_active: true });
        }

        const categories = this.#wordService.getAllCategories();
        categories.forEach(category => {
            category.words = this.#wordService.getWordsByCategory(category.id);
        });

        return res.render("word/list", { title: "Zgadywanka - Lista słów", categories: categories, is_game_active: false });
    }

    postEdit(req, res) {

        if (req.is_game_active) {
            throw new ForbiddenError("Nie można edytować słów w trakcie gry!");
        }

        const word_id = req.body?.word_id;
        const word_name = req.body?.word_name;


        if (!word_id) {
            throw new BadRequestError("Nieprawidłowy ID słowa.");
        }

        const word = this.#wordService.getWord(word_id);
        if (!word) {
            throw new NotFoundError("Słowo o podanym ID nie istnieje.");
        }

        const word_validation = this.#wordService.validateWordName(word_name);
        const word_validation_errors = word_validation.word_name;

        if (!word_validation.is_valid) {
            throw new BadRequestError(`Przesłano nieprawidłowe słowo (${word_name})`, word_validation_errors);
        }

        this.#wordService.updateWord(word_id, word_name);
        res.redirect("/word/list");
    }

    postDelete(req, res) {

        const word_id = req.body?.word_id;

        if (req.is_game_active) throw new ForbiddenError("Nie można usuwać słów w trakcie gry!");

        if (!word_id) throw new BadRequestError("Nieprawidłowy ID słowa.");

        if (!this.#wordService.getWord(word_id)) throw new NotFoundError("Słowo o podanym ID nie istnieje.");
        


        this.#wordService.deleteWord(word_id);
        res.redirect("/word/list");
    }
}