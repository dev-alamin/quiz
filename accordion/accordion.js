"use strict";

// -----------------------
// Global State
// -----------------------
let currentlyOpen = null;

// -----------------------
// DOM Helper
// -----------------------
function $(el){return document.getElementById(el)}
function $$(el){return document.querySelector(el)}
function $$$(el){return document.querySelectorAll(el)}

// ------------------------
// DOM Selection 
// ------------------------
const acRoot    = $$( '.accordion' );

function activeTab(){
    // Better way through event delegation
    acRoot.addEventListener( 'click', (e) => {
        if(e.target.matches( '.accordion-header' ) ) {
            handleCurrentItem(e.target);
        }
    } );

    // Noob way adding EL to all, perf degradation
    // acHeader.forEach( item => {
    //     item.addEventListener( 'click', () => handleCurrentItem(item ) );
    // });
}

function handleCurrentItem( header ) {
    const alreadyOpen = header.getAttribute( 'aria-expanded' ) === 'true';

    // Close whichever one is open (could be this one, could be a different one)
    if( currentlyOpen ) {
        currentlyOpen.setAttribute( 'aria-expanded', 'false' );
    }

    // If the clicked one was already open, we just close it (toggle-off) — leave currentlyOpen as null
    // If it was closed, open it and remember it
    if( alreadyOpen ) {
        currentlyOpen = null;
    }else{
        header.setAttribute( 'aria-expanded', 'true' ); 
        currentlyOpen = header;
    }
}

activeTab();