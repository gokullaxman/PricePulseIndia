import { setState, getState, subscribe } from '../store/state.js';

let LANGUAGES = {};
let TRANSLATIONS = {};

export async function initLanguage() {
    try {
        const res = await fetch('./data/translations.json');
        const data = await res.json();
        LANGUAGES = data.languages;
        TRANSLATIONS = data.data;

        // Apply initially
        const currentLang = getState().language;
        applyLanguage(currentLang);

        // Bind UI events
        document.querySelector('.lang-btn')?.addEventListener('click', openLang);
        document.querySelector('.lang-close')?.addEventListener('click', closeLang);
        document.getElementById('langModal')?.addEventListener('click', e => {
            if (e.target === e.currentTarget) closeLang();
        });

        // Listen for language state changes triggered from anywhere
        subscribe((state) => {
            if (state.language !== document.documentElement.lang) {
                applyLanguage(state.language);
            }
        });
    } catch(e) {
        console.error("Failed to load translations", e);
    }
}

function applyLanguage(lang) {
    const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
    if(!t) return;
    
    // Apply translations directly
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.dataset.key;
        if (t[key]) el.textContent = t[key];
    });

    // Update lang button
    const btn = document.querySelector('.lang-btn');
    if (btn) btn.textContent = '🌐 ' + lang.toUpperCase();

    // Update DOM settings
    document.documentElement.lang = lang;
    document.body.dir = lang === 'ur' ? 'rtl' : 'ltr';
}

function openLang() {
    const modal = document.getElementById('langModal');
    if (!modal) return;
    
    modal.classList.add('open');
    const grid = document.getElementById('langGrid');
    
    // Use innerHTML batching
    const currentLang = getState().language;
    let html = '';
    
    for(const [code, info] of Object.entries(LANGUAGES)) {
        html += `
        <div class="lang-card ${code === currentLang ? 'active' : ''}" data-code="${code}" role="button" tabindex="0">
            <div class="lang-name">${info.flag} ${info.name}</div>
            <div class="lang-native">${info.native}</div>
        </div>`;
    }
    
    grid.innerHTML = html;

    grid.querySelectorAll('.lang-card').forEach(card => {
        card.addEventListener('click', () => selectLang(card.dataset.code));
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') selectLang(card.dataset.code);
        });
    });
}

function selectLang(code) {
    document.querySelectorAll('.lang-card').forEach(c => c.classList.remove('active'));
    document.querySelector(`.lang-card[data-code="${code}"]`)?.classList.add('active');
    
    setState({ language: code });
    setTimeout(closeLang, 300);
}

function closeLang() {
    document.getElementById('langModal')?.classList.remove('open');
}
