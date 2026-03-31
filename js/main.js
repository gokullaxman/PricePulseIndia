import { initNavigation } from './components/navigation.js';
import { startCountdown } from './components/ui.js';
import { initLanguage } from './modules/language.js';
import { checkAdminMode, initAdmin } from './modules/admin.js';
import { fetchLivePrices } from './api/fetchLivePrices.js';

// Feature Controllers
import { initLoans } from './controllers/loansController.js';
import { initMetals } from './controllers/metalsController.js';
import { initGroceries } from './controllers/groceriesController.js';
import { initFuel } from './controllers/fuelController.js';

import { subscribe, getState } from './store/state.js';

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Initial UI Setup
    initNavigation();
    startCountdown();
    checkAdminMode();
    initAdmin();

    // 2. Load Translations first for quick text swap
    await initLanguage();

    // 3. Initiate background data fetch
    fetchLivePrices();

    // 4. Initialize Core Tab Modules (lazy logic happens inside them)
    initLoans();
    initMetals();
    initGroceries();
    initFuel();

    // Optional: Log global state changes for debugging
    subscribe((state) => {
        // console.log("State updated:", state.activeTab, state.city, state.language);
    });
});
