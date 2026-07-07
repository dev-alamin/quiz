"use strict";

// Global state to derive the app, the HERO
let currentTab = 'overview';

// DOM Reference
const tabRoot  = document.querySelector( '.tabs' );
const tabList  = tabRoot.querySelector( '.tab-list' );
const tabBtns  = tabList.querySelectorAll( '.tab' );
const tabPanel = tabRoot.querySelectorAll( '.tab-panel' );

function switchTab(tab) {
    currentTab = tab;
}

function render() {
    tabBtns.forEach( (tab, index) => {
        const isActive = tab.dataset.tab === currentTab;
        tab.classList.toggle( 'active', isActive );
    });

    tabPanel.forEach( (panel, index ) => {
        const isActive = panel.id === `panel-${currentTab}`;

        panel.hidden = !isActive;
    });
}

tabBtns.forEach( ( tab, index ) => {
    tab.addEventListener( 'click', () => {
        switchTab( tab.dataset.tab );
        render();
    });
});

render();