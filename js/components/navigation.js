import { setState } from '../store/state.js';

export function initNavigation() {
    const navTabs = document.getElementById('navTabs');
    if (!navTabs) return;

    // Handle tab clicks directly via delegation
    navTabs.addEventListener('click', e => {
        const btn = e.target.closest('.ntab');
        if (!btn) return;
        
        switchTab(btn);
    });

    // Handle keyboard navigation for accessibility
    navTabs.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            const tabs = [...document.querySelectorAll('.ntab')];
            const i = tabs.indexOf(document.activeElement);
            const next = e.key === 'ArrowRight' ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length;
            tabs[next].focus();
            switchTab(tabs[next]);
        }
    });

    // Handle city changes
    const citySelect = document.getElementById('citySelect');
    if(citySelect) {
        // Set initial value from local storage if exists
        const savedCity = localStorage.getItem('pp_city');
        if(savedCity) citySelect.value = savedCity;

        citySelect.addEventListener('change', (e) => {
            setState({ city: e.target.value });
        });
    }
}

function switchTab(btn) {
    document.querySelectorAll('.ntab').forEach(x => {
        x.classList.remove('active');
        x.setAttribute('aria-selected', 'false');
    });
    
    document.querySelectorAll('.sec').forEach(x => {
        x.classList.remove('active');
    });
    
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    
    const secId = btn.dataset.s;
    const sec = document.getElementById('sec-' + secId);
    if (sec) sec.classList.add('active');

    // Notify state so controllers can lazy load if necessary
    setState({ activeTab: secId });
}
