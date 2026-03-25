export const DEFAULT_ROLE = "user";
export const DEFAULT_ADMIN_ROLE = "admin";

export const DEFAULT_GAME_STATE = {
    is_active: false,
    score: 0,
    current_word: null,
    excluded_words_ids: [],
    difficulty: null,
    mode: null // can be: public or private
}

export const AUTH_REQUIREMENTS = {
    username: {
        length: {
            min: 3,
            max: 20
        },
        allowedChars: /^[a-zA-Z0-9_ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/
    },
    password: {
        length: {
            min: 5,
            max: 64
        },
        pattern: /^(?=.*[A-Z])(?=.*\d).{5,64}$/
    },
    word_name: {
        length: {
            min: 2,
            max: 40
        },
        pattern: /^[a-ząćęłńóśźż\s-]+$/i
    },
    
    category_name: {
        length: {
            min: 2,
            max: 100
        },
        pattern: /^[a-ząćęłńóśźż\s-]+$/i
    }
}
