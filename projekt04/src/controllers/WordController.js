import BadRequestError from "../errors/BadRequestError.js";
import ForbiddenError from "../errors/ForbiddenError.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";

export default class WordController {

    #wordService;
    #authService;
    constructor(wordService, authService) {
        this.#wordService = wordService;
        this.#authService = authService;
        this.postNew = this.postNew.bind(this);
        this.getNew = this.getNew.bind(this);
        this.getEdit = this.getEdit.bind(this);
        this.getList = this.getList.bind(this);
        this.getPublicList = this.getPublicList.bind(this);
        this.postEdit = this.postEdit.bind(this);
        this.postDelete = this.postDelete.bind(this);
    }

    postNew(req, res) {
        if (!req.user) throw new UnauthorizedError("Musisz być zalogowany, aby dodawać słowa.");
        if (req.is_game_active) throw new ForbiddenError("Nie można edytować słów w trakcie gry!");

        const category_id = req.body?.category_id;
        const word_name = req.body?.word_name;

        if (!category_id || !word_name) {
            throw new BadRequestError("Niepoprawne dane formularza.");
        }

        const category = this.#wordService.getCategoryById(category_id);
        if (!category) throw new BadRequestError("Taka kategoria nie istnieje.");
        this.#wordService.checkCategoryPermissions(category, req.user, this.#authService.getDefaultAdminRoleId());
        this.#wordService.addWord(category_id, word_name);

        return res.redirect(category.is_public ? "/word/list/public" : "/word/list/private");
    }


    getNew(req, res) {
        if (req.is_game_active || !req.user) {
            res.render("word/new", { title: "Zgadywanka - Dodaj słowo" });
            return;
        }

        const isAdmin = req.user.role_id === this.#authService.getDefaultAdminRoleId();
        const categories = this.#wordService.getCategoriesForUser(req.user.id, isAdmin);
        res.render("word/new", {
            title: "Zgadywanka - Dodaj słowo",
            categories,
            is_admin: isAdmin
        });
        return;
    }

    getEdit(req, res) {
        if (!req.user) throw new UnauthorizedError("Musisz być zalogowany, aby edytować słowa.");
        if (req.is_game_active) throw new ForbiddenError("Nie można edytować słów w trakcie gry!");

        const word_id = req.params?.id;
        if (!word_id) throw new BadRequestError("Nieprawidłowy ID słowa.");

        const word = this.#wordService.getWord(word_id);

        this.#wordService.checkWordPermissions(word, req.user, this.#authService.getDefaultAdminRoleId());

        const isAdmin = req.user.role_id === this.#authService.getDefaultAdminRoleId();
        const categories = this.#wordService.getCategoriesForUser(req.user.id, isAdmin);

        return res.render("word/edit", {
            title: "Zgadywanka - edytuj słowo",
            word: {
                id: word?.id,
                name: word?.name,
                category_id: word?.category_id,
                category_name: word?.category_name
            },
            categories: categories
        });
    }


    getList(req, res) {

        if (req.is_game_active || !req.user) {
            return res.render("word/list", { title: "Zgadywanka - Osobista lista słów", is_public_view: false });
        }

        const privateCategories = this.#wordService.getCategoriesForUser(req.user.id, false).private; // even if user is admin, we don't need public cat.
        privateCategories.forEach(category => {
            category.words = this.#wordService.getWordsByCategory(category.id);
        });

        return res.render("word/list", { title: "Zgadywanka - Osobista lista słów", is_public_view: false, categories: privateCategories, is_admin: false });
    }

    getPublicList(req, res) {
        if (req.is_game_active) {
            return res.render("word/list", { title: "Zgadywanka - Globalna lista słów", is_public_view: true });
        }

        const isAdmin = !req.user ? false : req.user.role_id === this.#authService.getDefaultAdminRoleId();
        const publicCategories = this.#wordService.getPublicCategories();
        publicCategories.forEach(category => {
            category.words = this.#wordService.getWordsByCategory(category.id);
        });

        return res.render("word/list", { title: "Zgadywanka - Globalna lista słów", is_public_view: true, categories: publicCategories, is_admin: isAdmin });

    }

    postEdit(req, res) {
        if (!req.user) throw new UnauthorizedError("Musisz być zalogowany, aby edytować słowa.");
        if (req.is_game_active) throw new ForbiddenError("Nie można edytować słów w trakcie gry!");

        const word_id = req.body?.word_id;
        const word_name = req.body?.word_name;
        const word_category_id = req.body?.category_id;

        if (!word_id) throw new BadRequestError("Nieprawidłowy ID słowa.");

        const category = this.#wordService.updateWord(word_id, word_name, word_category_id, req.user, this.#authService.getDefaultAdminRoleId());

        return res.redirect(category.is_public ? "/word/list/public" : "/word/list/private");
    }

    postDelete(req, res) {
        if (!req.user) throw new UnauthorizedError("Musisz być zalogowany, aby usuwać słowa.");
        if (req.is_game_active) throw new ForbiddenError("Nie można usuwać słów w trakcie gry!");

        const word_id = req.body?.word_id;
        if (!word_id) throw new BadRequestError("Nieprawidłowy ID słowa.");

        const category = this.#wordService.deleteWord(word_id, req.user, this.#authService.getDefaultAdminRoleId());

        return res.redirect(category.is_public ? "/word/list/public" : "/word/list/private");
    }


}