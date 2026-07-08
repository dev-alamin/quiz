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
        // Build the tab button
        const btn = document.createElement( 'button' );
        btn.classList.add( 'tab' );
        btn.type = 'button';
        btn.role = 'tab';
        btn.dataset.tab = tab.id;
        btn.textContent =  tab.label;

        tabList.appendChild(btn);

        btn.addEventListener( 'click', () => {
            location.hash = tab.id;
        });

        // Build the tab panel
        const panel = document.createElement( 'div' );
        panel.id = 'panel-' + tab.id;
        panel.className = 'tab-panel';
        panel.setAttribute( 'role', 'tabpanel' );
        panel.hidden = true;

        const heading = document.createElement( 'h2' );
        heading.textContent = tab.heading;

        const tabContent = document.createElement( 'p' );
        tabContent.textContent = tab.content;

        panel.appendChild(heading);
        panel.appendChild(tabContent);
        tabPanels.appendChild(panel);
    });
}

// Render the data, central point
function render(){
    const btns = document.querySelectorAll( '.tab' );

    btns.forEach( ( btn, index ) => {
        btn.classList.toggle( 'active',  btn.dataset.tab === currentTab );
    });

    const panels = tabPanels.querySelectorAll( '.tab-panel' );
    
    panels.forEach( ( tab, index ) => {
        tab.hidden = tab.id !== `panel-${currentTab}`;
    });
}

// Sync From Hash
function syncFromHash() {
    const hash = location.hash.slice(1);
    const exist = tabs.some( (tab) => tab.id === hash );
    currentTab = exist ? hash : tabs[0].id;
    render();
}
window.addEventListener( 'hashchange', syncFromHash );

// Bootstrap the app, init the srcipt
(async function init(){
    await fetchTabData();
    buildTab(tabs);
    syncFromHash();
})();