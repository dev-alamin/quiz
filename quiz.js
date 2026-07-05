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
    btnNext.disabled = true;

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
        options    : questions[currentIndex].options,
        correct    : chosenIndex == correct,
        chosenIndex: chosenIndex,
        answerIndex: correct,
    });

    btnNext.disabled = false;
}

function handleNext(){
    currentIndex++;
    if( selectedAnswer == null ) return;

    if( currentIndex < questions.length ) {
        renderQuestion();
        showScreen( 'question' );
    }else{
        showResults();
    }

}

function showResults(){
    const correctTotal = result.filter( c => c.correct ).length;

    $( 'score-text' ).textContent = `You've got ${correctTotal} out of ${questions.length}`;

        // Built review list
    $( 'answer-review' ).innerHTML = ''; // clear any previous run

    result.forEach( result => {
        const div = document.createElement( 'div' );
        div.classList.add( 'review-item', result.correct ? 'correct' : 'wrong' );

        const qEl = document.createElement( 'p' );
        qEl.classList.add( 'review-q' );
        qEl.textContent = result.question;

        const aEl = document.createElement( 'p' );
        aEl.classList.add( 'review-a' );

        if( result.correct ) {
            aEl.textContent = `${result.options[result.answerIndex]}`;
        }else{
            aEl.textContent = 
            `X You chose: ${result.options[result.chosenIndex]}` + 
            `- Correct: ${result.options[result.answerIndex]}`;
        }

        div.appendChild(qEl);
        div.appendChild(aEl);
        $( 'answer-review' ).appendChild(div);
    });

    // Update progress bar to 100% on finish
    $( 'progress-bar').style.width = '100%';

    showScreen( 'result' );
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