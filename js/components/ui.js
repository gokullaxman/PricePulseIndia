export function showBanner(msg, type) {
    const el = document.getElementById('priceBanner');
    if (!el) return;

    const s = {
        green: 'background:#DCFCE7;color:#15803D;border:1px solid #86EFAC',
        blue:  'background:#DBEAFE;color:#1E40AF;border:1px solid #93C5FD',
        yellow:'background:#FEF9C3;color:#854D0E;border:1px solid #FDE047',
        red:   'background:#FEE2E2;color:#991B1B;border:1px solid #FCA5A5'
    };
    
    el.setAttribute('style', `display:block;position:fixed;bottom:62px;left:50%;transform:translateX(-50%);padding:7px 16px;border-radius:18px;font-size:11px;font-weight:700;z-index:998;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,.15);pointer-events:none;transition:opacity 1.5s ease;max-width:90%;overflow:hidden;text-overflow:ellipsis;${s[type] || s.blue}`);
    
    // Simple text setting (no HTML) avoids basic XSS.
    el.textContent = msg;
    
    clearTimeout(el._t);
    el._t = setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => el.style.display = 'none', 1600);
    }, 5000);
}

export function showToast(msg, delay = 1200) {
    const t = document.getElementById('toast');
    if (!t) return;
    const msgEl = document.getElementById('toastMsg');
    
    msgEl.textContent = msg;
    setTimeout(() => t.classList.add('show'), delay);
    setTimeout(() => t.classList.remove('show'), delay + 3500);
}

export function startCountdown() {
    function tick() {
        const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        const next = new Date(now);
        next.setHours(6, 0, 0, 0);
        if (now >= next) next.setDate(next.getDate() + 1);
        
        const diff = next - now;
        const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        
        const el = document.getElementById('nextUpdate');
        if (el) el.textContent = `${h}:${m}:${s}`;
    }
    tick();
    setInterval(tick, 1000);

    const db = document.getElementById('dateBadge');
    if (db) {
        db.textContent = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }
}
