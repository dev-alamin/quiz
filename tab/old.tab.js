"use strict";

// --- Global State ---
// This is the single source of truth (the "HERO") that drives the entire UI.
let tabs = []; // Will hold the array of tab data loaded from the server
let currentTab; // Tracks which tab ID is currently active

// --- DOM References ---
// Grabbing elements from the HTML page so JavaScript can manipulate them.
const tabRoot   = document.querySelector( '.tabs' );
const tabList   = tabRoot.querySelector( '.tab-list' );
const tabPanels = document.querySelector( '.tab-panels' );

// --- API / Data Fetching ---
// Fetches the configuration data asynchronously from a JSON file.
async function loadTabs() {
    const res = await fetch( '/tab/tabs.json' );
    tabs = await res.json();
}

// --- UI Rendering ---
// This function looks at the current state (`currentTab`) and updates the HTML to match it.
function render() {
    // 1. Toggle the 'active' class on buttons
    const btns = tabList.querySelectorAll( '.tab' );
    btns.forEach( (btn) => {
        // If the button's data-tab matches the current active tab, add 'active', else remove it.
        btn.classList.toggle( 'active', btn.dataset.tab === currentTab );
    });

    // 2. Show or hide panels based on the active tab
    const panels = tabPanels.querySelectorAll( '.tab-panel' );
    panels.forEach( (panel) => {
        // If the panel ID matches the active tab string, set hidden to false (show it).
        panel.hidden = panel.id !== `panel-${currentTab}`;
    });
}

// --- DOM Construction ---
// Loops through the loaded tab data and dynamically builds the HTML buttons and panels.
function buildTabs() {
    tabs.forEach( (tab) => {
        // 1. Build the Tab Button
        const btn             = document.createElement( 'button' );
              btn.type        = 'button';
              btn.className   = 'tab';
              btn.dataset.tab = tab.id; // Stores the tab ID in the HTML (e.g., data-tab="specs")
              btn.textContent = tab.label;
        btn.setAttribute( 'role', 'tab' );

        // CRITICAL STEP: Clicking a button *only* changes the URL hash.
        // It does not change the active tab UI directly.
        btn.addEventListener( 'click', () => {
            location.hash = tab.id;   // Changes URL to something like: mysite.com/#specs
        });

        tabList.appendChild( btn );

        // 2. Build the Tab Content Panel
        const panel = document.createElement( 'div' );
        panel.className = 'tab-panel';
        panel.id = `panel-${tab.id}`;
        panel.setAttribute( 'role', 'tabpanel' );
        panel.hidden = true; // Kept hidden by default; render() will unhide the active one.

        const heading = document.createElement( 'h2' );
        heading.textContent = tab.heading;

        const body = document.createElement( 'p' );
        body.textContent = tab.content;

        panel.appendChild( heading );
        panel.appendChild( body );
        tabPanels.appendChild( panel );
    });
}

// --- Router / Synchronization ---
// Reads the current URL hash, verifies it, updates the state, and refreshes the UI.
function syncFromHash() {
    // location.hash gives us "#specs". .slice(1) removes the "#" to give us just "specs".
    const requested = location.hash.slice(1); 
    
    // Check if the hash matches a tab that actually exists in our data
    const exists = tabs.some( (tab) => tab.id === requested );
    currentTab = exists ? requested : tabs[0].id; 
    render();
}

// --- Event Listeners ---
// Listens for when the URL hash changes (either via button click, back/forward browser button, or manual typing).
window.addEventListener( 'hashchange', syncFromHash );

// --- App Initialization ---
// The entry point. Runs automatically when the script loads.
(async function init() {
    await loadTabs();  // 1. Get the data
    buildTabs();       // 2. Build the HTML markup
    syncFromHash();    // 3. Read the URL immediately to handle direct links or refreshes
})();