const orthography_map = {
    "u": "ó", "ó": "u",
    "h": "ch",
    "ż": "rz",
    "ć": "c", "ń": "n",
    "ł": "l", "ś": "s",
    "ź": "z", "ą": "a",
    "ę": "e"
};

const vowels = ["e", "a", "i", "o", "u", "y", "ę", "ą", "ó"];

function applyEasy(word) {
    let chars = word.split("");
    let changes = 0;

    for (let i = 0; i < chars.length; i++) {
        if (changes >= 2) break;
        if (Math.random() < 0.3) {
            let vowel = vowels[Math.floor(Math.random() * vowels.length)];
            chars[i] = vowel;
            changes++;
        }
    }

    return chars.join("");
}

function applyMedium(word) {
    let chars = applyEasy(word).split("");
    for (let i = 0; i < chars.length; i++) {
        if (Math.random() < 0.3) {
            chars[i] = orthography_map[chars[i]] || chars[i];
        }
    }

    return chars.join("");
}

function applyHard(word) {
    let chars = applyMedium(word).split("");
    for (let i = 0; i < chars.length; i++) {
        if (Math.random() < 0.15) {
            chars[i] = "_";
        }
    }

    return chars.join("");
}

export function distortWord(word, difficulty) {
    if (!word) return null;

    word = word.trim().toLowerCase();

    if (difficulty === "easy") return applyEasy(word);
    if (difficulty === "medium") return applyMedium(word);
    if (difficulty === "hard") return applyHard(word);

    return null; // wrong difficulty
}