import { filterGroceries, GROC_EXT, GROC_ICONS } from '../modules/groceries.js';
import { getState, subscribe } from '../store/state.js';
import { inr } from '../utils/format.js';
import { debounce } from '../utils/debounce.js';
import { sanitize } from '../utils/sanitize.js';

let isInitialized = false;
let activeCat = 'all';

export function initGroceries() {
    if (isInitialized) return;
    isInitialized = true;

    // Filter UI setup
    document.querySelectorAll('.ltab').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.ltab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCat = btn.dataset.c;
            renderGroceries();
        });
    });

    // Search UI setup
    const sinp = document.getElementById('gSearch');
    if (sinp) {
        sinp.addEventListener('input', debounce(() => renderGroceries(), 200));
    }

    // Subscribe to state to lazy load items
    subscribe((state) => {
        if (state.activeTab === 'groceries' && state.prices) {
            renderGroceries();
        }
    });

    const s = getState();
    if (s.activeTab === 'groceries' && s.prices) {
        renderGroceries();
    }
}

function renderGroceries() {
    const s = getState();
    if (!s.prices || s.activeTab !== 'groceries') return;

    const term = sanitize(document.getElementById('gSearch')?.value || '');
    const items = filterGroceries(term, activeCat, s.prices);
    
    const wrap = document.getElementById('gWrap');
    if (!wrap) return;

    if (Object.keys(items).length === 0) {
        wrap.innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);width:100%">No items found</div>';
        return;
    }

    const html = Object.entries(items).map(([k, v]) => `
    <div class="gcard">
        <div class="gleft">
            <div style="width:36px;height:36px;background:#F8FAFC;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;border:1px solid var(--border)">
                ${GROC_ICONS[k] || '🛒'}
            </div>
            <div>
                <div class="gnm" data-key="${k}">${k.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div class="gut">per ${GROC_EXT[k] || '1 Kg'}</div>
            </div>
        </div>
        <div class="gprice">${inr(v)}</div>
    </div>`).join('');

    // InnerHTML batching for performant render
    wrap.innerHTML = html;

    // Auto translate if language is not English
    if (s.language !== 'en' && s.translations) {
        const t = s.translations[s.language];
        if (t) {
            wrap.querySelectorAll('.gnm').forEach(el => {
                const ky = el.dataset.key;
                if (t[ky]) el.textContent = t[ky];
            });
        }
    }
}
