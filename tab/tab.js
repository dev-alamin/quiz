"use strict";

// Global State to derive the whole app
let tabs = [];
let currentTab;

// DOM Selection
const tabPanels = document.querySelector( '.tab-panels' );
const tabList = document.querySelector( '.tab-list' );

// Query API data, inject data to tabs state
async function fetchTabData(){
    try{
        const res = await fetch( '/tab/tabs.json' );

        if( ! res.ok ) {
            console.log( `HTTP Error ${res.status}` );
        }else{
            tabs = await res.json();
        }
        
    }catch(err){
        console.warn( `Error fetching json data from tabs.json ${err}` );
    }
}

// BUILD the tab & panel
function buildTab( tabs ){
    tabs.forEach( ( tab, index ) => {
        const btn = document.createElement( 'button' );
        btn.classList.add( 'tab' );
        btn.type = 'button';
        btn.role = 'tab';
        btn.textContent =  tab.label;

        tabList.appendChild(btn);
    });
}


(async function init(){
    await fetchTabData();
    buildTab(tabs);
    // console.log(tabs);
})();