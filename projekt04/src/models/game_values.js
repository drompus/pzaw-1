export function getDefaultGameState() {
    return {
        is_active: false,
        score: 0,
        current_word: null,
        previous_words_names: [],
        difficulty: null
    };
}
