"use strict";
// -----------------------------------------------
// State
// -----------------------------------------------
let questions      = [];    // loaded via fetch
let currentIndex   = 0;     // Which questions we're on
let selectedAnswer = null;  // Index of the option the user picked
let results        = [];    // { question, correct: bool, chosenIndex, answerIndex }

// ----------------------------------------------
// DOM References
// ----------------------------------------------
function $(selector){ return document.getElementById(selector)}

const progressText  = $( 'progress-text' );
const progressBar   = $( 'progress-bar' );
const questionText  = $( 'question-text' );
const optionsList   = $( 'options-list' );
const btnNext       = $( 'btn-next' );
const scoreText     = $( 'score-text' );
const answersReview = $( 'answers-review' );

const screens = {
    start   : $( 'screen-start' ),
    question: $( 'screen-question' ),
    result  : $( 'screen-result' ),
    error   : $( 'screen-error' ),
}

// ---------------------------------------
// Screen Helper 
// ---------------------------------------
function showScreen(name) {
    if( !screens[name] ){
        console.warn( `showScreen: Unknow screen "${name}"`);
        return;
    }

    // Remove 'active' from all screens, add to the target
    Object.values( screens ).forEach( s => s.classList.remove( 'active' ) );
    screens[name].classList.add( 'active' );
}

// ---------------------------------------
// Fetch questions
// ---------------------------------------
async function loadQuestions() {
    try{
        const res = await fetch( 'questions.json' );

        if( ! res.ok ) {
            throw new Error( `HTTP error - status: ${res.status}` );
        }

        questions = await res.json();
    }catch( err ) {
        $( 'error-message' ).textContent = `Failed to load question: ${err.message}`;
        showScreen( 'error' );
    }
}

// --------------------------------------
// Render a question 
// --------------------------------------
function renderQuestion(){
    const q = questions[currentIndex];

    // Progress
    const questionNumber           = currentIndex + 1;
    const total                    = questions.length;
          progressText.textContent = `Question ${questionNumber} of ${total}`;
          progressBar.style.width  = `${((questionNumber - 1) / total ) * 100}%`;

    // Question text 
    questionText.textContent = q.question;

    // Clear previous options and reset state
    optionsList.innerHTML = '';
    selectedAnswer = null;
    btnNext.disabled = true;

    // Build option buttons with createElement (no innerHTML shortcuts)
    q.options.forEach((optionText, index ) => {
        const li = document.createElement( 'li' );
        const btn = document.createElement( 'button' );

        btn.textContent = optionText;
        btn.dataset.index = index; // store index so we can read it on click

        btn.addEventListener ( 'click', () => handleOptionClick(index) );

        li.appendChild( btn );
        optionsList.appendChild( li );
    });

    // Last question -> change button label
    btnNext.textContent = currentIndex === total - 1 ? 'See Results' : 'Next';
}

function handleOptionClick( chosenIndex ) {
    // Ignore clicks after one answer is already selected
    if ( selectedAnswer !== null ) return;

    selectedAnswer = chosenIndex;
    const correct = questions[currentIndex].answer;

    // Disable all buttons and highlight correct / wrong
    const buttons = optionsList.querySelectorAll( 'button' );
    buttons.forEach((btn, index) => {
        btn.disabled = true;

        if( index === correct ) {
            btn.classList.add( 'correct' );
        }
        if(index === chosenIndex && chosenIndex !== correct ) {
            btn.classList.add( 'wrong' );
        }
    });

    // Record result
    results.push({
        question   : questions[currentIndex].question,
        options    : questions[currentIndex].options,
        correct    : chosenIndex === correct,
        chosenIndex: chosenIndex,
        answerIndex: correct,
    });

    btnNext.disabled = false;
}

// -----------------------------------------
// Advance to next question or show results
// -----------------------------------------
function handleNext() {
    // If no answer selected yet, do nothing (button should be disabled anyway)
    if( selectedAnswer === null ) return;

    currentIndex++;

    if( currentIndex < questions.length ) {
        renderQuestion();
    }else{
        showResults();
    }
}

// ----------------------------------------
// Results screen
// ----------------------------------------
function showResults() {
    const total = questions.length;
    const correct = results.filter( r => r.correct ).length;

    scoreText.textContent = `You got ${correct} out of ${total} correct`;

    // Built review list
    answersReview.innerHTML = ''; // clear any previous run

    results.forEach( result => {
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
        answersReview.appendChild(div);
    });

    // Update progress bar to 100% on finish
    progressBar.style.width = '100%';

    showScreen( 'result' );
}

// --------------------------------------------
// Reset and restart
// --------------------------------------------
function restartQuiz() {
    currentIndex = 0;
    selectedAnswer = null;
    results = [];

    renderQuestion();
    showScreen( 'question' );
}

// ---------------------------------------------
// Event listener
// ---------------------------------------------

btnNext.addEventListener( 'click', handleNext );
$( 'btn-restart' ).addEventListener( 'click', restartQuiz );

(async function(){
    $( 'btn-start' ).disabled = true;
    $( 'btn-start' ).textContent = 'Loading...';

    await loadQuestions();

    if( questions.length > 0 ) {
        $( 'btn-start' ).disabled = false;
        $( 'btn-start' ).textContent = 'Start Quiz';

        $( 'btn-start' ).addEventListener('click', () => {
            showScreen('question');
            renderQuestion();
        });
    }
})();