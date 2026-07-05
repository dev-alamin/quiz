// ---------------------------------
// App States
// ---------------------------------
let questions      = [];
let currentIndex   = 0;
let selectedAnswer = null;
let results        = [];

// ---------------------------------
// DOM Reference 
// ---------------------------------
function $( selector ) {return document.getElementById(selector)}

const startBtn      = $( 'btn-start' );
const btnNext       = $( 'btn-next' );
const btnRestart    = $( 'btn-restart' );
const questionCard  = $( 'question-card' );
const optionList    = $( 'options-list' );
const questionText  = $( 'question-text' );
const initScrenSubH = $( 'start-screen-subheading' );
const scoreText     = $( 'score-text' );
const answersReview = $( 'answers-review' );

// ---------------------------------
// Screens 
// ---------------------------------
const screens = {
    start    : $( 'screen-start' ),
    questions: $( 'screen-question' ),
    results  : $( 'screen-result' ),
    error    : $( 'screen-error' ),
}

function showScreen( name ) {
    Object.values(screens).forEach( s => s.classList.remove( 'active' ) );
    screens[name].classList.add( 'active' );
}

async function loadQuestions(){
    try{
        const res = await fetch( 'data.json' );

        if( !res.ok ) {
            throw new Error( `HTTP Error. Status: ${res.status}`);
        }

        questions = await res.json();
    }catch(err){
        console.warn( `Quesions cannot be loaded:  ${err.message}`);
        showScreen( 'error' );
    }
}

function renderQuestion() {
    const q = questions[currentIndex]; // grab the current index

    const options = q.options;
    const progressWidth = `${( ( (currentIndex + 1) / questions.length ) * 100 )}%`;

    questionText.textContent = q.question;
    $( 'progress-text' ).textContent = `Question ${currentIndex + 1} of ${questions.length}`;
    optionList.innerHTML = '';
    selectedAnswer = null;
    btnNext.disabled = true;

    options.forEach( (option, index) => {
        const li = document.createElement( 'li' );
        const btn = document.createElement( 'button' );

        li.dataset.index = index;
        btn.addEventListener( 'click', () => handleOptionClick(index) );
        
        btn.textContent = option;
        li.appendChild( btn );
        optionList.appendChild(li);

    });
    
    $( 'progress-bar' ).style.width = progressWidth;
}

function handleOptionClick(chosenIndex) {
    if( selectedAnswer !== null ) return;

    selectedAnswer = chosenIndex;
    const correct = questions[currentIndex].answer;

    optionList.querySelectorAll( 'button' ).forEach( (btn, i) => {
        btn.disabled = true;

        if( i === correct ) {
            btn.classList.add( 'correct' );
        }

        if( i === chosenIndex && chosenIndex !== correct ) {
            btn.classList.add( 'wrong' );
        }

    });

    btnNext.disabled = false;

    results.push({
        question   : questions[currentIndex].question,
        options    : questions[currentIndex].options,
        correct    : chosenIndex === correct,
        chosenIndex: chosenIndex,
        answerIndex: correct,
    });
   
}

function showResults(){
    const progressBar = $( 'progress-bar' );
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

    showScreen( 'results' );
}

function startQuiz(){
    showScreen( 'questions' );
    renderQuestion();
    btnNext.disabled = false;
}

// ----------------------------
// Restart the quiz
// ----------------------------
function resetQuiz(){
    currentIndex = 0;
    results = [];
    selectedAnswer = null;
    
    renderQuestion();
    showScreen( 'questions' );
}

function handleNext(){
    currentIndex++;
    
    if(currentIndex < questions.length ) {
        renderQuestion();
    }else{
        showResults();
        btnNext.disabled = true;
    }
}

// ---------------------------------------
// DOM Handling
// ---------------------------------------
btnNext.addEventListener( 'click', handleNext );
startBtn.addEventListener( 'click', startQuiz );
btnRestart.addEventListener( 'click', resetQuiz );

async function init(){
    await loadQuestions();
    initScrenSubH.textContent = `${questions.length} questions on JavaScript basics.`;

}
// Init the app
init();