"use strict";

// Global state that will derive the app
let currentIndex = 0;

// DOM reference not to repeat query
const track = document.querySelector( '.slider-track' );
const totalSlide = document.querySelectorAll( '.slide' ).length;
const btnNext = document.querySelector( '.slider-btn--next' );
const btnPrev = document.querySelector( '.slider-btn--prev' );

// Go to next slide
function nextSlide(){
    currentIndex = (currentIndex + 1 ) % totalSlide;
    render();
    console.log(currentIndex, totalSlide);
}

// Go to previous slide
function prevSlide(){
    currentIndex = (currentIndex - 1 + totalSlide ) % totalSlide;
    render();
}

// Attach DOM
btnNext.addEventListener( 'click', nextSlide );
btnPrev.addEventListener( 'click', prevSlide );

function render(){
    track.style.setProperty( '--current', currentIndex );
}

render();

// Render initialy, anyway