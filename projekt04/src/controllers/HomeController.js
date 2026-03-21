export default class HomeController {

    #wordService;
    constructor(wordService) {
        this.#wordService = wordService;
        this.get = this.get.bind(this);
    }

    get(req, res) {
        res.render("home", { title: "Zgadywanka - Strona główna", words_count: this.#wordService.getWordsCount() });
    }
}