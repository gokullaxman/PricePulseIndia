import { getState, subscribe } from '../store/state.js';
import { METALS_DEF, getMetalValue, calcPctChange } from '../modules/metals.js';
import { inr, sparkline, cpill } from '../utils/format.js';

let isInitialized = false;

export function initMetals() {
    if (isInitialized) return;
    isInitialized = true;
    
    // Listen for tab active or price fetch completed
    subscribe((state) => {
        if (state.activeTab === 'metals' && state.prices) {
            renderMetals(state.prices);
        }
    });

    // Render immediately if already loaded and tab is active
    const s = getState();
    if (s.activeTab === 'metals' && s.prices) {
        renderMetals(s.prices);
    }
}

function renderMetals(prices) {
    const grid = document.getElementById('metalsGrid');
    if (!grid) return;

    const hist = prices.metals?.metalHistory || {};
    let html = '';

    METALS_DEF.forEach(m => {
        const val = getMetalValue(m.id, prices) * m.mul;
        const hArr = hist[m.name] || [];
        const pct = calcPctChange(hArr);

        if (val > 0) {
            html += `
            <div class="card">
                <span class="card-ico">${m.icon}</span>
                <div class="card-nm">${m.name}</div>
                <div class="card-pr">${inr(val)}</div>
                <div class="card-ut">per ${m.unit}</div>
                ${cpill(pct, pct >= 0)}
                ${sparkline(hArr, pct >= 0 ? '#16A34A' : '#EF4444')}
            </div>`;
        }
    });

    grid.innerHTML = html;
    
    // Update source info
    const src = document.getElementById('metalSrc');
    if (src) src.textContent = prices.source || 'Offline Data';
}
