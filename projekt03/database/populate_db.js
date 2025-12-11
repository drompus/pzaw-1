// THIS CODE SHOULD NOT BE EXECUTED WITHOUT AN EXISTING DATABASE!
// IT IS INTENDED TO POPULATE AN EMPTY DATABASE

import { db } from "./db.js";

const initial_words_data = {
    "srodki_komunikacji": {
        name: "Środki komunikacji",
        words: [
            "samochód",
            "rower",
            "autobus",
            "tramwaj",
            "pociąg",
            "samolot",
            "statek",
            "motocykl",
            "hulajnoga",
            "taksówka"
        ]
    },

    "zywnosc": {
        name: "Żywność",
        words: [
            "chleb",
            "masło",
            "ser",
            "jabłko",
            "banan",
            "pomidor",
            "durian",
            "ogórek",
            "powidła"
        ]
    }
}

console.log("Populating database with initial data...");

for (const [dev_category_name, data] of Object.entries(initial_words_data)) {
    console.log("Creating category: ", dev_category_name);
    const category_id = db.prepare(`INSERT INTO categories (dev_name, name) VALUES (?, ?) RETURNING id`).get(dev_category_name, data.name).id;

    for (let word of data.words) {
        word = word.toLowerCase();
        console.log(word, dev_category_name);
        db.prepare(`INSERT INTO words (category_id, name) VALUES (?, ?)`).run(category_id, word);
    }
}

console.log("Done populating database!");
