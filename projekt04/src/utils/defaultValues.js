export const DEFAULT_GAME_STATE = {
    is_active: false,
    score: 0,
    current_word: null,
    previous_words_names: [],
    difficulty: null
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
    }
}
