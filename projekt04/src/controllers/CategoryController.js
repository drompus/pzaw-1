import BadRequestError from "../errors/BadRequestError.js";
import ForbiddenError from "../errors/ForbiddenError.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";

export default class CategoryController {

    #wordService;
    #authService
    constructor(wordService, authService) {
        this.#wordService = wordService;
        this.#authService = authService;
        this.getNew = this.getNew.bind(this);
        this.postNew = this.postNew.bind(this);
        this.postDelete = this.postDelete.bind(this);
    }

    getNew(req, res) {
        if (req.user) {
            const isUserAdmin = req.user?.role_id === this.#authService.getDefaultAdminRoleId() ? true : false;
            res.render("category/new", {
                title: "Zgadywanka - Dodawanie kategorii",
                is_admin: isUserAdmin
            });
            return;
        }

        res.render("category/new", {
            title: "Zgadywanka - Dodawanie kategorii"
        });
        return;
    }

    postNew(req, res) {
        if (!req.user) {
            throw new UnauthorizedError("Nie można dodawać kategorii bez logowania.")
        }

        const categoryName = req.body?.category_name;
        const authorId = req.user?.id;
        let isCategoryPublic = req.body?.is_category_public

        if (!categoryName || categoryName == '') {
            throw new BadRequestError("Niepoprawne dane formularza.");
        }

        if (!isCategoryPublic || !["true", "false"].includes(isCategoryPublic)) {
            isCategoryPublic = false;
        } else isCategoryPublic = isCategoryPublic === "true";

        if (isCategoryPublic && req.user.role_id !== this.#authService.getDefaultAdminRoleId()) {
            throw new ForbiddenError("Nie posiadasz uprawnień do tej operacji.");
        }

        this.#wordService.addCategory(categoryName, authorId, isCategoryPublic);
        isCategoryPublic ? res.redirect("/word/list/public") : res.redirect("/word/list/private");

    }

    postDelete(req, res) {
        if (!req.user) {
            throw new UnauthorizedError("Nie można wykonać tej operacji bez logowania");
        }

        const category_id = req.body?.category_id;
        if (!category_id) {
            throw new BadRequestError("Nieprawidłowe ID kategorii.");
        }

        const category = this.#wordService.deleteCategory(category_id, req.user, this.#authService.getDefaultAdminRoleId());
        res.redirect(category.is_public ? "/word/list/public" : "/word/list/private");
    }

}