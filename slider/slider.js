"use strict";

let currentIndex = 0;
const totalSlides = document.querySelectorAll( '.slide' ).length;

const track   = document.querySelector( 'slider-track' );
const dots    = document.querySelectorAll( 'slider-dot' );
const btnPrev = document.querySelector( 'slider-btn--prev' );
const btnNext = document.querySelector( '.slider-btn--next' );

// ------------------------------------
// Step 3: The index math
// ------------------------------------
function goToNext() {
    currentIndex = (currentIndex + 1 ) % totalSlides;
}

function goToPrev() {
    currentIndex = (currentIndex - 1 + totalSlides ) % totalSlides;
}

// ------------------------------------
// One function that "paints" the current 
// state - the render function
// ------------------------------------
