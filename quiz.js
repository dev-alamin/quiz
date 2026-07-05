let currentIndex = null;
let result = [];
let questions = [];
let selectedAnswer = null;

//  Utility function for DOM selection 
function $(e) { return document.getElementById(e); }

// ----------------------------------
// DOM selection 
// ----------------------------------
const startScreen = $('screen-start');
const questionScreen = $('screen-question');
const resultScreen = $('screen-result');
const errorScreen = $('screen-error');

const btnStart = $('btn-start');

const screen = {
    'start': startScreen,
    'question': questionScreen,
    'result': resultScreen,
    'error': errorScreen
};

/**
 * Show Screen
 * @param {*} s 
 * @returns void
 */
function showScreen(s) {

    if (!screen[s]) {
        console.warn(`No screen found named '${s}'`);
        return;
    }

    Object.values(screen).forEach(e => e.classList.remove('active'));
    screen[s].classList.add('active');
}

async function loadQuestions() {
    try {
        const res = await fetch('data.json');
        if (!res.ok) {
            throw new Error(`HTTP Error: Status - ${res.status}`);
            return;
        }

        data = await res.json();
        questions = data;
    } catch (err) {
        console.log(err);
    }
}

(async function() {
    await loadQuestions();
    console.log(questions);
})();
