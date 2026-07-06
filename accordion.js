"use strict";

// -----------------------
// Global State
// -----------------------
let currentlyOpen;

// -----------------------
// DOM Helper
// -----------------------
function $(el){return document.getElementById(el)}
function $$(el){return document.querySelector(el)}
function $$$(el){return document.querySelectorAll(el)}

// ------------------------
// DOM Selection 
// ------------------------
const root      = $( 'root' );
const acRoot    = $$( '.accordion' );
const acItem    = $$$( '.accordion-item' );
const acHeader  = $$$( '.accordion-header' );
const acContent = $$$( '.accordion-content' );

function activeTab(){

    acHeader.forEach( (item, index) => {
        item.addEventListener( 'click', () => handleCurrentItem(item, index ) );
    });
}

function handleCurrentItem( item, index ){

    const isAlreadyOpen = item.getAttribute( 'aria-expanded' ) === 'true';

    if( currentlyOpen ) {
        currentlyOpen.setAttribute( 'aria-expanded', 'false' );
    }

    if( isAlreadyOpen ) {
        currentlyOpen = null;
    }else{
        item.setAttribute( 'aria-expanded', 'true' );
        currentlyOpen = item;
    }
}

activeTab();