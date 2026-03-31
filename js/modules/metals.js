export const METALS_DEF = [
    { id: 'gold24k', name: 'Gold 24K', unit: '10 Grams', mul: 10, icon: '🥇' },
    { id: 'gold22k', name: 'Gold 22K', unit: '10 Grams', mul: 10, icon: '🌟' },
    { id: 'gold18k', name: 'Gold 18K', unit: '10 Grams', mul: 10, icon: '✨' },
    { id: 'silver', name: 'Silver', unit: '1 Kg', mul: 1000, icon: '🥈' },
    { id: 'platinum', name: 'Platinum', unit: '10 Grams', mul: 10, icon: '💍' },
    { id: 'copper', name: 'Copper', unit: '1 Kg', mul: 1, icon: '🟤' },
    { id: 'aluminium', name: 'Aluminium', unit: '1 Kg', mul: 1, icon: '⚪' },
    { id: 'zinc', name: 'Zinc', unit: '1 Kg', mul: 1, icon: '🟦' }
];

export function getMetalValue(slug, pricesObj) {
    if (!pricesObj || !pricesObj.metals) return 0;
    return pricesObj.metals[`${slug}_per_gram`] || pricesObj.metals[`${slug}_per_kg`] || 0;
}

export function calcPctChange(histArray) {
    if (!histArray || histArray.length < 2) return 0;
    const latest = histArray[histArray.length - 1];
    const prev = histArray[histArray.length - 2];
    if (!prev) return 0;
    return ((latest - prev) / prev) * 100;
}
