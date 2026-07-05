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
    $( 'question-text' ).textContent = q.question;

    $( 'options-list' ).innerHTML = '';
    selectedAnswer = null;
    // btnNext.disabled = true;

    q.options.forEach( ( item, index ) => {
        const li = document.createElement( 'li' );
        const btn = document.createElement( 'button' );

        btn.textContent = item;
        li.appendChild(btn);
        $( 'options-list' ).appendChild( li );

        btn.dataset.index = index;
        btn.addEventListener( 'click', () => handleOptionClick( index ) );
    });

    btnNext.textContent = currentIndex == totalQ - 1 ? 'See Result' : 'Next';
}

function handleOptionClick( chosenIndex ) {
    if( selectedAnswer != null ) return;

    const correct = questions[currentIndex].answer;
    selectedAnswer = chosenIndex;

    $( 'options-list' ).querySelectorAll( 'button' ).forEach( ( btn, index ) => {

        if( index === correct ) {
            btn.classList.add( 'correct' );
        }

        if( index === chosenIndex && chosenIndex != correct ) {
            btn.classList.add( 'wrong' );
        }

    });

    result.push({
        question   : questions[currentIndex].question,
        answer     : questions[currentIndex].answer,
        correct    : chosenIndex == correct,
        chosenIndex: chosenIndex,
        answerIndex: correct,
    });

    console.log(result);
}

function handleNext(){
    currentIndex++;
    if( selectedAnswer == null ) return;

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
    $( 'subheading' ).textContent = `Total ${questions.length} Quizes`;
    btnStart.addEventListener( 'click', function(){
        showScreen( 'question' );
        renderQuestion();
    });
})();