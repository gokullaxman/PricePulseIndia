export function inr(v) {
    return '₹' + Number(v).toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

export function sparkline(data, color = '#F59E0B') {
    if (!data || !data.length) return '';
    const mn = Math.min(...data), mx = Math.max(...data), r = mx - mn || 1, w = 100, h = 30;
    const pts = data.map((v, i) => `${i * (w / (data.length - 1))},${h - ((v - mn) / r * (h - 4) + 2)}`).join(' ');
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polyline fill="none" stroke="${color}" stroke-width="2" points="${pts}"/></svg>`;
}

export function cpill(pct, up) {
    if (pct == null) return '';
    return `<span class="cpill ${up ? 'cup' : 'cdn'}" aria-label="${up ? 'Up' : 'Down'} ${Math.abs(pct).toFixed(2)}%">${up ? '▲ +' : '▼ -'}${Math.abs(pct).toFixed(2)}%</span>`;
}
