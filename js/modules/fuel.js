export const FUEL_TYPES = [
    { id: 'petrol', name: 'Petrol ⛽', icon: '⛽', unit: 'per Litre', ext: 0 },
    { id: 'diesel', name: 'Diesel 🛢️', icon: '🛢️', unit: 'per Litre', ext: 0 },
    { id: 'lpg14', name: 'LPG Gas (14.2kg)', icon: '🔥', unit: 'per Cylinder', baseOnly: true },
    { id: 'lpg5', name: 'LPG Gas (5kg)', icon: '🔥', unit: 'per Cylinder', baseOnly: true },
    { id: 'cng', name: 'CNG 🌿', icon: '🌿', unit: 'per Kg', ext: 0 },
    { id: 'kerosene', name: 'Kerosene 🪔', icon: '🪔', unit: 'per Litre', baseOnly: true }
];

export function getCityFuelPrice(fuelId, city, fuelData) {
    if (!fuelData || !fuelData.cityPrices) return 0;
    const prices = fuelData.cityPrices[fuelId];
    if (!prices) return 0;
    
    // Some fuels are flat pan-India (baseOnly)
    if (prices.base !== undefined) return prices.base;

    return prices[city] || 0;
}
