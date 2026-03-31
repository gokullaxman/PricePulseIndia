const state = {
    city: localStorage.getItem('pp_city') || "Chennai",
    language: localStorage.getItem('pp_lang') || "en",
    activeTab: "loans",
    prices: null,
    banks: [],
    commoditiesOffline: null,
    translations: null
};

const listeners = [];

export function subscribe(fn) {
    listeners.push(fn);
}

export function setState(newState) {
    Object.assign(state, newState);
    // Persist to local storage where applicable
    if (newState.city) localStorage.setItem('pp_city', newState.city);
    if (newState.language) localStorage.setItem('pp_lang', newState.language);
    
    // Notify all subscribers
    listeners.forEach(fn => fn(state));
}

export function getState() {
    return state;
}
