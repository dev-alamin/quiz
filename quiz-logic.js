// -------------------------------
// Pure Quiz Logic
// -------------------------------
export function isCorrect(question, chosenIndex){
    return chosenIndex === question.answer;
}

export function buildResult(question, chosenIndex){
    return {
        question: question.question,
        options: question.options,
        correct: isCorrect(question, chosenIndex),
        chosenIndex,
        answerIndex: question.answer,
    }
}

export function calculateScore(result){
    return result.filter( r => r.correct ).length;
}

