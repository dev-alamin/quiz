"use strict";

// Global state that will derive the app
let currentIndex = 0;

// DOM reference not to repeat query
const track      = document.querySelector( '.slider-track' );
const totalSlide = document.querySelectorAll( '.slide' ).length;
const btnNext    = document.querySelector( '.slider-btn--next' );
const btnPrev    = document.querySelector( '.slider-btn--prev' );
const dots       = document.querySelectorAll( '.slider-dot' );
const slider     = document.querySelector( '.slider' );
const announcer  = document.getElementById( 'slide-announcer' );

// Pure function, easy to seperate, reuse, test, maintenance
function goNext(){
    currentIndex = (currentIndex + 1 ) % totalSlide;
}

function goPrev(){
    currentIndex = (currentIndex - 1 + totalSlide ) % totalSlide;
}

function handleDots(dots){
    dots.forEach( (dot, index ) => {
        dot.addEventListener( 'click', () => {
            currentIndex = index;
            render();
        } );
    } );
}

// Go to previous slide
function prevSlide(){
    goPrev();
    render();
}

// Go next slide
function nextSlide(){
    goNext();
    render();
}

// Attach DOM
btnNext.addEventListener( 'click', nextSlide );
btnPrev.addEventListener( 'click', prevSlide );

function render(){
    track.style.setProperty( '--current', currentIndex );

    dots.forEach( ( dot, index ) => {
        const isActive = index === currentIndex;

        dot.classList.toggle( 'active', isActive );
        dot.setAttribute( 'aria-selected', isActive );
    } );

    announcer.textContent = `Slide ${currentIndex + 1} of ${totalSlide}`;
}

// Keyboard Navigation
slider.addEventListener( 'keydown', (e) => {
    if( e.key === 'ArrowRight' ){
        goNext();
        render();
    }

    if( e.key === 'ArrowLeft' ) {
        goPrev();
        render();
    }

});

// Render initialy, anyway
handleDots(dots);
render();
