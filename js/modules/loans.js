// Pure business logic for loans

export function calculateEMI(p, r, tYears) {
    if (tYears === 0) return { emi: 0, total: p, interest: 0 };
    const rM = r / 12 / 100;
    const n = tYears * 12;
    const emi = p * rM * Math.pow(1 + rM, n) / (Math.pow(1 + rM, n) - 1);
    const total = emi * n;
    return {
        emi: Math.round(emi),
        total: Math.round(total),
        interest: Math.round(total - p)
    };
}

export function generateAmortization(p, r, tYears) {
    const rM = r / 12 / 100;
    const n = tYears * 12;
    const emi = p * rM * Math.pow(1 + rM, n) / (Math.pow(1 + rM, n) - 1);
    
    let bal = p;
    const schedule = [];
    
    // Group by year for standard view
    for (let y = 1; y <= tYears; y++) {
        let yInt = 0, yPrin = 0;
        for (let m = 1; m <= 12; m++) {
            if (bal <= 0) break;
            const i = bal * rM;
            let pr = emi - i;
            if (pr > bal) pr = bal;
            yInt += i;
            yPrin += pr;
            bal -= pr;
        }
        schedule.push({
            year: y,
            principal: Math.round(yPrin),
            interest: Math.round(yInt),
            balance: Math.max(0, Math.round(bal))
        });
        if (bal <= 0) break;
    }
    return schedule;
}

export function checkEligibility(income, age, emi, type, employment) {
    let foir = income < 50000 ? 0.50 : 0.60;
    if (age > 55) foir -= 0.10;
    if (employment === 'self') foir -= 0.05;

    let dti = foir;
    let net = (income * dti) - emi;
    let available = Math.max(0, net);

    return {
        availableEMI: available,
        foir: foir * 100
    };
}

export function mapBanksForLoanType(banks, loanType) {
    return [...banks]
        .filter(b => b[loanType] && b[loanType].rate > 0)
        .sort((a, b) => a[loanType].rate - b[loanType].rate);
}
