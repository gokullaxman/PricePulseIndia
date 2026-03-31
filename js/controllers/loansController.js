import { calculateEMI, checkEligibility, mapBanksForLoanType, generateAmortization } from '../modules/loans.js';
import { getState, setState, subscribe } from '../store/state.js';
import { inr } from '../utils/format.js';

let isInitialized = false;

export async function initLoans() {
    if(isInitialized) return;
    isInitialized = true;

    // Fetch banks
    const res = await fetch('./data/banks.json');
    const data = await res.json();
    let banks = data.data;

    // Apply local rate overrides if any
    try {
        const stored = JSON.parse(localStorage.getItem('pp_bank_rates'));
        if (stored) {
            stored.forEach(sr => {
                const b = banks.find(x => x.id === sr.id);
                if (b && sr.rates) {
                    Object.keys(sr.rates).forEach(lt => {
                        if (b[lt]) b[lt].rate = sr.rates[lt];
                    });
                }
            });
        }
    } catch(e) {}

    setState({ banks });

    // Initial renders
    populateBankSelects();
    renderCompareTable();
    updateEMI(); // Auto trigger EMI

    // Bind EMI forms
    document.getElementById('loanType')?.addEventListener('change', () => {
        populateBankSelects();
        renderCompareTable();
        updateEMI();
    });
    
    ['loanAmt', 'loanTenure', 'bankSelect', 'loanType'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateEMI);
    });

    ['eligIncome', 'eligAge', 'eligEmi', 'eligType', 'eligEmp'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateEligibility);
    });

    // Handle range slider links
    const amt = document.getElementById('loanAmt');
    const amti = document.getElementById('loanAmtInput');
    if(amt && amti) {
        amt.addEventListener('input', () => amti.value = amt.value);
        amti.addEventListener('input', () => amt.value = amti.value);
    }

    const tnr = document.getElementById('loanTenure');
    const tnri = document.getElementById('loanTenureInput');
    if(tnr && tnri) {
        tnr.addEventListener('input', () => tnri.value = tnr.value);
        tnri.addEventListener('input', () => tnr.value = tnri.value);
    }
}

function updateEMI() {
    const p = parseFloat(document.getElementById('loanAmt')?.value || 0);
    const t = parseFloat(document.getElementById('loanTenure')?.value || 1);
    const bankId = parseInt(document.getElementById('bankSelect')?.value || 0);
    const type = document.getElementById('loanType')?.value || 'home';

    const b = getState().banks.find(x => x.id === bankId);
    if (!b || !b[type] || b[type].rate <= 0) return;

    const r = b[type].rate;
    
    // Update labels showing rate
    const rL = document.getElementById('pRateLbl');
    if(rL) rL.innerHTML = `Interest Rate: <strong>${r}% p.a.</strong>`;

    const { emi, total, interest } = calculateEMI(p, r, t);

    const elEmi = document.getElementById('emiTotal');
    const elPrn = document.getElementById('prnTotal');
    const elTot = document.getElementById('totalPayVal');
    const elInt = document.getElementById('totalInt');
    
    if(elEmi) elEmi.textContent = inr(emi);
    if(elPrn) elPrn.textContent = inr(p);
    if(elTot) elTot.textContent = inr(total);
    if(elInt) elInt.textContent = inr(interest);

    document.getElementById('prnPie')?.setAttribute('stroke-dasharray', `${(p/total)*100} 100`);
    
    // Amortization (keep hidden by default, or just attach data)
    renderAmortization(p, r, t);
}

function renderAmortization(p, r, t) {
    const sched = generateAmortization(p, r, t);
    const w = document.getElementById('amortBtnWrap');
    if(!w) return;
    
    w.innerHTML = `<button class="tbtn" id="shAmort" style="margin-top:10px" data-key="amort_schedule">📅 Amortization Schedule</button>`;
    document.getElementById('shAmort').addEventListener('click', (e) => {
        const tblId = 'amortTblWrap';
        let act = document.getElementById(tblId);
        
        if(e.target.innerText.includes('Hide')) {
            if(act) act.style.display = 'none';
            e.target.innerText = '📅 Amortization Schedule';
            return;
        }

        e.target.innerText = '📅 Hide Schedule';
        if(!act) {
            act = document.createElement('div');
            act.id = tblId;
            act.style.marginTop = '15px';
            w.appendChild(act);
        }
        act.style.display = 'block';
        
        let h = `<div style="max-height:250px;overflow-y:auto;border:1px solid var(--border);border-radius:8px">
            <table class="tbl"><tr><th>Year</th><th>Principal</th><th>Interest</th><th>Balance</th></tr>`;
        sched.forEach(s => {
            h += `<tr><td>Year ${s.year}</td><td>${inr(s.principal)}</td><td>${inr(s.interest)}</td><td>${inr(s.balance)}</td></tr>`;
        });
        h += `</table></div>`;
        act.innerHTML = h;
    });
}

function updateEligibility() {
    const inc = parseFloat(document.getElementById('eligIncome')?.value || 0);
    const age = parseInt(document.getElementById('eligAge')?.value || 0);
    const emi = parseFloat(document.getElementById('eligEmi')?.value || 0);
    const lType = document.getElementById('eligType')?.value || 'home';
    const emp = document.getElementById('eligEmp')?.value || 'salaried';

    if (inc < 10000 || age < 21 || age > 70) {
        document.getElementById('eligResultWrap').style.display = 'none';
        return;
    }

    const { availableEMI } = checkEligibility(inc, age, emi, lType, emp);
    
    const banks = mapBanksForLoanType(getState().banks, lType);
    if (!banks.length) return;

    // Use top bank (lowest rate) to estimate logic
    const top = banks[0];
    const rte = top[lType].rate;
    const mt = top[lType].tenure;

    let rM = rte / 12 / 100;
    let n = mt * 12;
    let ml = availableEMI * (Math.pow(1 + rM, n) - 1) / (rM * Math.pow(1 + rM, n));

    document.getElementById('eligLoan').textContent = ml > 0 ? inr(Math.round(ml)) : '₹0';
    document.getElementById('eligRate').textContent = rte + '% p.a.';
    document.getElementById('eligTenure').textContent = mt + ' yrs';
    
    const wr = document.getElementById('eligResultWrap');
    if(wr) wr.style.display = 'block';
}

function populateBankSelects() {
    const sel = document.getElementById('bankSelect');
    if (!sel) return;
    const lType = document.getElementById('loanType')?.value || 'home';
    const banks = mapBanksForLoanType(getState().banks, lType);
    
    sel.innerHTML = '';
    banks.forEach(b => {
        const o = document.createElement('option');
        o.value = b.id;
        o.text = `${b.name} (${b[lType].rate}%)`;
        sel.add(o);
    });
}

function renderCompareTable() {
    const tb = document.getElementById('cmpTbody');
    if(!tb) return;

    const lType = document.getElementById('loanType')?.value || 'home';
    const lAmt = parseFloat(document.getElementById('loanAmt')?.value || 5000000);
    const lTnr = parseFloat(document.getElementById('loanTenure')?.value || 20);

    const ds = mapBanksForLoanType(getState().banks, lType);
    if (!ds.length) {
        tb.innerHTML = '<tr><td colspan="4">No data available for this loan type.</td></tr>';
        return;
    }

    const bestId = ds[0].id;
    let h = '';
    
    ds.forEach(d => {
        const tr = d[lType];
        const res = calculateEMI(lAmt, tr.rate, lTnr);
        const best = d.id === bestId;
        const worst = ds.length > 3 && d.id === ds[ds.length - 1].id;

        h += `<tr>
            <td style="font-weight:700">${d.gov ? '🟢' : '🔵'} ${d.name} ${best ? '<span class="bbadge">Lowest</span>' : ''}</td>
            <td class="${best ? 'rbest' : worst ? 'rworst' : ''}">${tr.rate}%</td>
            <td>${inr(res.emi)}</td>
            <td class="bank-col-hide">${inr(res.total)}</td>
        </tr>`;
    });
    
    tb.innerHTML = h;
}
