export default class HomeController {

    #wordService;
    constructor(wordService) {
        this.#wordService = wordService;
        this.get = this.get.bind(this);
    }

    get(req, res) {
        res.render("home", {
            title: "Zgadywanka - Strona główna",
            public_words_count: this.#wordService.getPublicWordsCount(),
            private_words_count: req.user ? this.#wordService.getPrivateWordsCount(req.user.id) : 0
        });
    }
}