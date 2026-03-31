export const GROC_CAT = {
    veg: ['Tomato', 'Onion', 'Potato', 'Carrot', 'Cabbage', 'Cauliflower', 'Brinjal', 'Capsicum', 'Beans', 'Ginger', 'Garlic', 'GreenChilli', 'Peas', 'Coriander', 'Spinach', 'LadyFinger', 'BitterGourd', 'Drumstick'],
    grains: ['Rice', 'RicePonni', 'Wheat', 'Atta', 'ToorDal', 'MoongDal', 'ChanaDal', 'UradDal', 'MasoorDal', 'Rajma', 'ChanaWhole', 'Poha', 'Sooji'],
    oils: ['SunflowerOil', 'GroundnutOil', 'CoconutOil', 'MustardOil', 'RefinedOil', 'SesameOil', 'PalmOil'],
    dairy: ['Milk', 'MilkBuffalo', 'Curd', 'Paneer', 'Ghee', 'Butter', 'Cream'],
    others: ['Eggs', 'Sugar', 'Salt', 'Maida', 'Besan', 'Turmeric', 'RedChilliPowder', 'Cumin', 'CorianderPowder', 'GaramMasala']
};

export const GROC_EXT = {
    Eggs: '1 Dozen', Coriander: 'Bunch', Spinach: 'Bunch',
    Paneer: '200g', Curd: '500g', Turmeric: '200g',
    RedChilliPowder: '200g', Cumin: '100g', CorianderPowder: '200g', GaramMasala: '100g'
};

export const GROC_ICONS = {
    Tomato: '🍅', Onion: '🧅', Potato: '🥔', Carrot: '🥕', Cabbage: '🥬', Cauliflower: '🥦', 
    Brinjal: '🍆', Capsicum: '🫑', Beans: '🫘', Ginger: '🫚', Garlic: '🧄', GreenChilli: '🌶️', 
    Peas: '🫛', Coriander: '🌿', Spinach: '🥬', LadyFinger: '🥒', BitterGourd: '🥒', Drumstick: '🥖',
    Rice: '🍚', RicePonni: '🍚', Wheat: '🌾', Atta: '🌾', ToorDal: '🍛', MoongDal: '🍛', 
    ChanaDal: '🍛', UradDal: '🍛', MasoorDal: '🍛', Rajma: '🫘', ChanaWhole: '🫘', Poha: '🥣', Sooji: '🥣',
    SunflowerOil: '🌻', GroundnutOil: '🥜', CoconutOil: '🥥', MustardOil: '🪔', RefinedOil: '🛢️', 
    SesameOil: '🫙', PalmOil: '🌴',
    Milk: '🥛', MilkBuffalo: '🥛', Curd: '🥣', Paneer: '🧀', Ghee: '🍯', Butter: '🧈', Cream: '🍦',
    Eggs: '🥚', Sugar: '🧂', Salt: '🧂', Maida: '🥣', Besan: '🥣', Turmeric: '🟡', 
    RedChilliPowder: '🌶️', Cumin: '🟤', CorianderPowder: '🌿', GaramMasala: '🥘'
};


export function filterGroceries(term, cat, pricesObj) {
    if (!pricesObj || !pricesObj.groceries || !pricesObj.groceries.basePrices) return {};
    
    const base = pricesObj.groceries.basePrices;
    let items = {};
    if (cat === 'all') {
        items = { ...base };
    } else {
        GROC_CAT[cat]?.forEach(k => { if (base[k]) items[k] = base[k]; });
    }

    if (term) {
        const query = term.toLowerCase();
        items = Object.fromEntries(
            Object.entries(items).filter(([k]) => k.toLowerCase().includes(query))
        );
    }
    
    return items;
}
