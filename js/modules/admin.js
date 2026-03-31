import { getState, setState } from '../store/state.js';
import { showToast } from '../components/ui.js';

const ADMIN_PWD_HASH = 'pricepulse2026';

export function openAdmin() {
    const p = prompt('Admin Password:');
    if (p !== ADMIN_PWD_HASH) {
        alert('Incorrect password');
        return;
    }
    document.getElementById('adminModal').style.display = 'block';
    renderAdminCards();
    loadRateLog();
}

function closeAdmin() {
    document.getElementById('adminModal').style.display = 'none';
}

function renderAdminCards() {
    const banks = getState().banks;
    const lts = ['home', 'car', 'personal', 'education', 'business', 'gold', 'twoWheeler', 'property', 'agriculture', 'medical'];
    const lbls = {
        home: '🏠 Home', car: '🚗 Car', personal: '💳 Personal', education: '🎓 Edu',
        business: '🏭 Biz', gold: '🥇 Gold', twoWheeler: '🏍 2W', property: '🏗 LAP',
        agriculture: '🌾 Agri', medical: '🏥 Medical'
    };

    let html = '';
    banks.forEach(b => {
        let rows = '';
        lts.forEach(lt => {
            if (b[lt] && b[lt].rate > 0) {
                rows += `
                <div style="display:flex;align-items:center;gap:5px;margin-bottom:5px">
                    <span style="font-size:10px;color:var(--muted);width:65px;flex-shrink:0">${lbls[lt] || lt}</span>
                    <input type="number" id="rate_${b.id}_${lt}" value="${b[lt].rate}" step="0.05" min="4" max="30"
                        style="width:60px;padding:2px 5px;border:1px solid var(--border);border-radius:5px;font-size:11px;font-weight:700"
                        oninput="this.style.background='#FEF3C7';this.style.borderColor='#F59E0B'"/>
                    <span style="font-size:9px;color:var(--muted)">%</span>
                </div>`;
            }
        });
        html += `
        <div style="border:1.5px solid var(--border);border-radius:9px;padding:12px">
            <div style="font-weight:800;font-size:12px;margin-bottom:8px">${b.gov ? '🟢' : '🔵'} ${b.name}</div>
            ${rows}
        </div>`;
    });

    const container = document.getElementById('adminBankCards');
    if(container) container.innerHTML = html;
}

function saveAllRates() {
    const banks = getState().banks;
    const lts = ['home', 'car', 'personal', 'education', 'business', 'gold', 'twoWheeler', 'property', 'agriculture', 'medical'];
    const changes = [];

    banks.forEach(b => {
        lts.forEach(lt => {
            if (!b[lt] || b[lt].rate <= 0) return;
            const el = document.getElementById('rate_' + b.id + '_' + lt);
            if (!el) return;
            
            const v = parseFloat(el.value);
            if (isNaN(v) || v < 4 || v > 30) {
                el.style.borderColor = '#EF4444';
                return;
            }
            if (v !== b[lt].rate) {
                changes.push(`${b.name} ${lt}: ${b[lt].rate}% → ${v}%`);
                b[lt].rate = v;
                el.style.background = '#DCFCE7';
                el.style.borderColor = '#16A34A';
            }
        });
    });

    const st = document.getElementById('adminSaveStatus');
    if (!changes.length) {
        st.textContent = 'No changes';
        st.style.color = 'var(--muted)';
        return;
    }

    // Persist to local storage
    localStorage.setItem('pp_bank_rates', JSON.stringify(banks.map(b => ({
        id: b.id,
        rates: Object.fromEntries(lts.filter(lt => b[lt] && b[lt].rate > 0).map(lt => [lt, b[lt].rate]))
    }))));

    let log = JSON.parse(localStorage.getItem('pp_rate_log') || '[]');
    log.unshift({ at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }), changes });
    if (log.length > 20) log = log.slice(0, 20);
    localStorage.setItem('pp_rate_log', JSON.stringify(log));

    // Force updates via setState
    setState({ banks });
    loadRateLog();

    st.textContent = `✅ Saved ${changes.length} change(s)`;
    st.style.color = '#16A34A';
    showToast(`✅ ${changes.length} bank rate(s) updated`);
}

function loadRateLog() {
    const log = JSON.parse(localStorage.getItem('pp_rate_log') || '[]');
    const el = document.getElementById('rateChangeLog');
    if (!el) return;
    
    if (!log.length) {
        el.textContent = 'No changes yet.';
        return;
    }
    
    let html = '';
    log.slice(0, 5).forEach(e => {
        html += `<div style="margin-bottom:7px;padding:7px;background:#fff;border-radius:6px;border:1px solid var(--border)">
        <strong>${e.at}</strong><br>
        ${e.changes.map(ch => '• ' + ch).join('<br>')}
        </div>`;
    });
    el.innerHTML = html;
}

export function resetRates() {
    if (!confirm('Reset all rates to defaults?')) return;
    localStorage.removeItem('pp_bank_rates');
    location.reload();
}

export function checkAdminMode() {
    if (window.location.search.includes('admin=true')) {
        setTimeout(openAdmin, 500);
    }
}

// Bind to window for global access (as they are called safely inline from index.html in original app)
// OR bind directly via ID here
export function initAdmin() {
    document.querySelector('.admin-close')?.addEventListener('click', closeAdmin);
    document.getElementById('saveAllAdminBtn')?.addEventListener('click', saveAllRates);
    document.getElementById('resetAdminBtn')?.addEventListener('click', resetRates);
}
