import { FUEL_TYPES, getCityFuelPrice } from '../modules/fuel.js';
import { getState, subscribe } from '../store/state.js';
import { inr } from '../utils/format.js';

let isInitialized = false;

export function initFuel() {
    if (isInitialized) return;
    isInitialized = true;

    // React to state changes (tab or city change or data loaded)
    subscribe((state) => {
        if (state.activeTab === 'fuel' && state.prices) {
            renderFuelCards(state.city, state.prices.fuel);
            renderCityPrices(state.prices.fuel);
        }
    });

    const s = getState();
    if (s.activeTab === 'fuel' && s.prices) {
        renderFuelCards(s.city, s.prices.fuel);
        renderCityPrices(s.prices.fuel);
    }
}

function renderFuelCards(city, fuelData) {
    const wrap = document.getElementById('fuelWrap');
    if (!wrap || !fuelData) return;

    const html = FUEL_TYPES.map(f => {
        const val = getCityFuelPrice(f.id, city, fuelData);
        if (val === 0) {
            return `<div class="fcard">
                <div class="fico">${f.icon}</div>
                <div class="ftype">${f.name}</div>
                <div class="fprice fna">N/A</div>
                <div class="fcity">Not available in ${city}</div>
            </div>`;
        }
        return `<div class="fcard">
            <div class="fico">${f.icon}</div>
            <div class="ftype">${f.name}</div>
            <div class="fprice">${inr(val)}</div>
            <div class="fcity">Avg price ✨</div>
        </div>`;
    }).join('');

    wrap.innerHTML = html;
}

function renderCityPrices(fuelData) {
    const tb = document.getElementById('tBodyFuel');
    if (!tb || !fuelData || !fuelData.cityPrices) return;

    const cities = Object.keys(fuelData.cityPrices.petrol || {}).sort();
    
    const html = cities.map(c => `
    <tr>
        <td style="font-weight:700">${c}</td>
        <td>${fuelData.cityPrices.petrol[c] ? inr(fuelData.cityPrices.petrol[c]) : '-'}</td>
        <td>${fuelData.cityPrices.diesel[c] ? inr(fuelData.cityPrices.diesel[c]) : '-'}</td>
        <td>${fuelData.cityPrices.cng?.[c] ? inr(fuelData.cityPrices.cng[c]) : '-'}</td>
    </tr>`).join('');

    tb.innerHTML = html;
}
