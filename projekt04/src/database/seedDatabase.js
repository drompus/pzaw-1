// IMPORTANT: It is intented to seed an empty database

import { db } from "./createDatabase.js";
import DatabaseSeeder from "./Seeder.js";

const rolesData = ["admin", "user"];
const usersData = [
    {
        username: "admin",
        password: "Admin123",
        role: "admin"
    },
    {
        username: "Zdzisław",
        password: "Zdzisław123",
        role: "user"
    },
    {
        username: "Janusz",
        password: "Janusz123",
        role: "user"
    }
];
const wordsCategoriesData = {
    "środki_komunikacji": {
        name: "Środki komunikacji",
        author_username: "admin",
        is_public: 1,
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
        author_username: "admin",
        is_public: 1,
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
    },

    "zwierzeta": {
        name: "Zwierzęta",
        author_username: "Zdzisław",
        is_public: 0,
        words: [
            "pies",
            "kot",
            "koń",
            "krowa",
            "świnia",
            "kura",
            "wąż zbożowy"
        ]
    }
};

const seeder = new DatabaseSeeder(db);
await seeder.run(rolesData, usersData, wordsCategoriesData);