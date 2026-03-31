import { CONFIG } from './config.js';
import { setState, getState } from '../store/state.js';
import { showBanner } from '../components/ui.js';

function get6AMTimestamp() {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const t = new Date(now); t.setHours(6, 0, 0, 0);
    if (now < t) t.setDate(t.getDate() - 1);
    return t.toISOString().split('T')[0];
}

function loadCachedPrices() {
    try {
        const r = JSON.parse(localStorage.getItem(CONFIG.CACHE_KEY) || 'null');
        return r?.date === get6AMTimestamp() ? r.data : null;
    } catch (e) {
        return null;
    }
}

function savePriceCache(data) {
    try {
        localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify({
            date: get6AMTimestamp(),
            data,
            savedAt: new Date().toISOString()
        }));
    } catch (e) {}
}

function mapAPIResponse(json, offlineData) {
    const d = JSON.parse(JSON.stringify(offlineData)); // deep clone
    if (json.metals?.items) {
        json.metals.items.forEach(item => {
            if (item.name === 'Gold 24K') d.metals.gold24k_per_gram = item.price;
            if (item.name === 'Gold 22K') d.metals.gold22k_per_gram = item.price;
            if (item.name === 'Gold 18K') d.metals.gold18k_per_gram = item.price;
            if (item.name === 'Silver') d.metals.silver_per_gram = item.price;
            if (item.name === 'Platinum') d.metals.platinum_per_gram = item.price;
            if (item.name === 'Copper') d.metals.copper_per_kg = item.price;
            if (item.name === 'Aluminium') d.metals.aluminium_per_kg = item.price;
            if (item.name === 'Zinc') d.metals.zinc_per_kg = item.price;
        });
    }
    if (json.fuel) {
        if (json.fuel.allCities?.petrol) d.fuel.cityPrices.petrol = json.fuel.allCities.petrol;
        if (json.fuel.allCities?.diesel) d.fuel.cityPrices.diesel = json.fuel.allCities.diesel;
        if (json.fuel.lpg_14kg) d.fuel.cityPrices.lpg14.base = json.fuel.lpg_14kg;
    }
    if (json.groceries?.basePrices) d.groceries.basePrices = json.groceries.basePrices;
    
    d.source = json.metals?.source || 'Backend API';
    return d;
}

export async function fetchLivePrices() {
    const state = getState();
    
    // First: read offline commodities to act as base structure for API mappings
    if (!state.commoditiesOffline) {
        const cRes = await fetch('./data/commodities.json');
        const cData = await cRes.json();
        setState({ commoditiesOffline: cData.data });
    }

    const cached = loadCachedPrices();
    if (cached) {
        setState({ prices: cached });
        showBanner('✅ Prices from today\'s 6 AM update', 'green');
        return;
    }

    if (CONFIG.API_BASE) {
        try {
            showBanner('🔄 Fetching live prices...', 'blue');
            const res = await fetch(`${CONFIG.API_BASE}/api/prices?city=${state.city}`, { signal: AbortSignal.timeout(12000) });
            if (res.ok) {
                const json = await res.json();
                if (json.success) {
                    const d = mapAPIResponse(json, getState().commoditiesOffline);
                    savePriceCache(d);
                    setState({ prices: d });

                    const stale = Object.entries(json.freshness || {}).filter(([, v]) => !v).map(([k]) => k);
                    if (stale.length) {
                        showBanner('⚠️ ' + stale.join(', ') + ' not yet updated today (updates 6 AM IST)', 'yellow');
                    } else {
                        showBanner('✅ Live prices loaded — updated today at 6 AM IST', 'green');
                    }
                    return;
                }
            }
        } catch (e) {
            console.warn('[PP] Backend error:', e.message);
            showBanner('⚠️ Using verified offline prices', 'yellow');
        }
    }

    // Fallback if no custom API / Gold API logic
    const offlineCopy = JSON.parse(JSON.stringify(getState().commoditiesOffline));
    savePriceCache(offlineCopy);
    setState({ prices: offlineCopy });
    if (!CONFIG.API_BASE) showBanner('📅 Showing verified offline prices. Connect backend for live daily updates.', 'yellow');
}

export async function fetchBankRates() {
    if (!CONFIG.API_BASE) return;
    try {
        const res = await fetch(`${CONFIG.API_BASE}/api/bankrates`);
        if (!res.ok) return;
        const json = await res.json();
        if (!json.success || !json.rates) return;
        
        // Let loansController handle updating bank objects since the data sits there.
        // Or store raw rates inside state.
        setState({ liveBankRates: json });
    } catch (e) {
        console.warn('[PP] Bank rates error:', e.message);
    }
}
