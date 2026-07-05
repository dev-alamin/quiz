"use strict";

let currentIndex   = 0;
let result         = [];
let questions      = [];
let selectedAnswer = null;

//  Utility function for DOM selection 
function $(e) { return document.getElementById(e); }

// ----------------------------------
// DOM selection 
// ----------------------------------
const startScreen    = $('screen-start');
const questionScreen = $('screen-question');
const resultScreen   = $('screen-result');
const errorScreen    = $('screen-error');
const optionList     = $( 'option-list' );
const questionText   = $( 'question-text' );

const btnStart = $('btn-start');
const btnNext = $( 'btn-next' );

const screen = {
    'start'   : startScreen,
    'question': questionScreen,
    'result'  : resultScreen,
    'error'   : errorScreen
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

/**
 * Load actual data(questions) from api
 * @returns void
 */
async function loadQuestions() {
    try {
        const res = await fetch('questions.json');

        if (!res.ok) {
            throw new Error(`HTTP Error: Status - ${res.status}`);
            return;
        }

        const data = await res.json();
        questions = data; // Inject questions
    } catch (err) {
        console.log(err);
        showScreen( 'error' );
    }
}

function renderQuestion(){
    const q        = questions[currentIndex];
    const qNumber  = currentIndex + 1;
    const totalQ   = questions.length;
    const progress = ( qNumber / totalQ ) * 100;

    $( 'progress-text' ).textContent = `Question ${qNumber} of total ${totalQ}`;
    $( 'progress-bar' ).style.width = `${progress}%`;

    console.log(progress);

    $( 'question-text' ).textContent = q.question;

    btnNext.textContent = currentIndex == totalQ ? 'See Result' : 'Next';
}

function handleNext(){
    currentIndex++;

    if( currentIndex < questions.length ) {
        renderQuestion();
        showScreen( 'question' );
    }else{
        showScreen( 'result' );
    }

}

btnNext.addEventListener( 'click', handleNext );

(async function() {
    await loadQuestions();

    btnStart.addEventListener( 'click', function(){
        showScreen( 'question' );
        renderQuestion();
    });
})();