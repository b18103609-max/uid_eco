import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './dashboard.css';

const ContractsIndicators = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const $ = (id: string) => root.querySelector<HTMLElement>('#' + id)!;

    Chart.defaults.color = '#5d6a73';
    Chart.defaults.borderColor = '#ebedf0';
    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.font.weight = 500;

    const GRID = '#ebedf0';
    const PT = '#ffffff';
    const AXIS = '#5d6a73';
    const C: Record<string, string> = {
      yellow: '#f5a623', yellow2: '#d98b00', blue: '#0078d2', blue2: '#0078d2',
      red: '#f4364c', green: '#15c39a', orange: '#ff8800', purple: '#6c5ce7',
      cyan: '#15a5c3', pink: '#EC4899',
    };
    const a = (hex: string, op: number) => {
      const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${op})`;
    };

    const CONTRACTORS = ['Альфа-Строй', 'БетаГрупп', 'Гамма-ТЭК', 'Дельта Инж', 'Сигма Плюс', 'Омега-Сервис'];
    const CATEGORIES = ['ТОП-12', 'ЛЭП', 'АЛКО', 'ШС', 'Убытки', 'Прочие'];
    const MONTHS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг'];
    const QUARTERS = ['Q1 23', 'Q2 23', 'Q3 23', 'Q4 23', 'Q1 24', 'Q2 24', 'Q3 24', 'Q4 24'];
    const CAT_COLORS = [C.red, C.orange, C.yellow, C.blue2, C.purple, C.cyan];
    const CON_COLORS = [C.green, C.yellow, C.blue2, C.red, C.purple, C.orange];
    const SERVICES = ['Эксплуатационное бурение', 'Разведочное бурение', 'ГРП', 'КРС/ТРС', 'Обустройство куста', 'Строительство трубопровода'];
    const SERVICE_COLORS = [C.orange, C.yellow, C.blue2, C.green, C.purple, C.cyan];

    const MASTER: any = {
      fine: { 'Альфа-Строй': [[0.9, 0.5, 0.3], [1.1, 0.6, 0.4], [1.3, 0.7, 0.5], [1.1, 0.6, 0.4], [1.0, 0.5, 0.3], [1.2, 0.7, 0.4], [1.4, 0.8, 0.5], [1.3, 0.7, 0.4]], 'БетаГрупп': [[1.1, 0.6, 0.4], [1.3, 0.7, 0.4], [1.5, 0.8, 0.5], [1.3, 0.7, 0.4], [1.2, 0.6, 0.4], [1.4, 0.7, 0.5], [1.6, 0.9, 0.5], [1.5, 0.8, 0.5]], 'Гамма-ТЭК': [[0.6, 0.4, 0.2], [0.7, 0.4, 0.3], [0.8, 0.5, 0.3], [0.7, 0.4, 0.3], [0.6, 0.4, 0.2], [0.7, 0.4, 0.3], [0.9, 0.5, 0.3], [0.8, 0.4, 0.3]], 'Дельта Инж': [[0.8, 0.5, 0.3], [0.9, 0.5, 0.3], [1.0, 0.6, 0.4], [0.9, 0.5, 0.3], [0.8, 0.5, 0.3], [0.9, 0.5, 0.3], [1.1, 0.6, 0.4], [1.0, 0.5, 0.3]], 'Сигма Плюс': [[0.3, 0.2, 0.2], [0.4, 0.3, 0.2], [0.4, 0.3, 0.2], [0.3, 0.2, 0.2], [0.3, 0.2, 0.1], [0.4, 0.3, 0.2], [0.5, 0.3, 0.2], [0.4, 0.3, 0.2]], 'Омега-Сервис': [[1.5, 0.8, 0.4], [1.7, 0.9, 0.4], [2.0, 1.0, 0.5], [1.8, 0.9, 0.4], [1.7, 0.8, 0.4], [1.9, 1.0, 0.5], [2.2, 1.1, 0.5], [2.1, 1.0, 0.5]] },
      proactive: { 'Альфа-Строй': 1.2, 'БетаГрупп': 2.1, 'Гамма-ТЭК': 0.8, 'Дельта Инж': 1.5, 'Сигма Плюс': 0.6, 'Омега-Сервис': 1.8 },
      viol: {
        'ТОП-12': { 'Альфа-Строй': [5, 6, 8, 7, 8, 7, 9, 6], 'БетаГрупп': [7, 8, 10, 9, 10, 9, 11, 9], 'Гамма-ТЭК': [4, 5, 6, 6, 7, 6, 8, 7], 'Дельта Инж': [4, 5, 6, 5, 6, 5, 7, 5], 'Сигма Плюс': [3, 4, 5, 4, 5, 4, 6, 3], 'Омега-Сервис': [9, 10, 13, 11, 13, 11, 14, 12] },
        'ЛЭП': { 'Альфа-Строй': [4, 5, 6, 5, 6, 5, 7, 5], 'БетаГрупп': [5, 6, 7, 6, 7, 6, 8, 7], 'Гамма-ТЭК': [3, 4, 5, 4, 5, 4, 6, 5], 'Дельта Инж': [3, 4, 5, 4, 5, 4, 5, 4], 'Сигма Плюс': [2, 3, 3, 3, 3, 3, 4, 3], 'Омега-Сервис': [8, 9, 11, 10, 11, 10, 12, 10] },
        'АЛКО': { 'Альфа-Строй': [3, 4, 5, 4, 5, 4, 6, 4], 'БетаГрупп': [5, 6, 7, 6, 7, 6, 7, 6], 'Гамма-ТЭК': [3, 3, 4, 3, 4, 3, 5, 4], 'Дельта Инж': [2, 3, 4, 3, 4, 3, 4, 3], 'Сигма Плюс': [2, 2, 3, 2, 3, 2, 3, 2], 'Омега-Сервис': [7, 9, 11, 10, 11, 10, 12, 11] },
        'ШС': { 'Альфа-Строй': [2, 3, 4, 3, 4, 3, 4, 4], 'БетаГрупп': [4, 5, 5, 5, 5, 5, 6, 5], 'Гамма-ТЭК': [2, 3, 3, 3, 3, 3, 4, 3], 'Дельта Инж': [2, 2, 3, 3, 3, 3, 3, 3], 'Сигма Плюс': [1, 2, 2, 2, 2, 2, 3, 2], 'Омега-Сервис': [6, 8, 9, 9, 9, 9, 10, 9] },
        'Убытки': { 'Альфа-Строй': [1, 2, 2, 2, 2, 2, 3, 2], 'БетаГрупп': [2, 3, 3, 3, 3, 3, 4, 3], 'Гамма-ТЭК': [1, 2, 2, 2, 2, 2, 3, 2], 'Дельта Инж': [1, 2, 2, 2, 2, 2, 2, 2], 'Сигма Плюс': [1, 1, 2, 1, 2, 1, 2, 1], 'Омега-Сервис': [3, 4, 5, 5, 5, 5, 6, 5] },
        'Прочие': { 'Альфа-Строй': [5, 6, 7, 6, 7, 6, 8, 7], 'БетаГрупп': [7, 8, 9, 8, 9, 8, 10, 9], 'Гамма-ТЭК': [4, 5, 5, 5, 5, 5, 6, 5], 'Дельта Инж': [4, 4, 5, 5, 5, 5, 6, 5], 'Сигма Плюс': [3, 3, 4, 3, 4, 3, 4, 3], 'Омега-Сервис': [9, 11, 12, 12, 12, 12, 14, 13] },
      },
      npv: { 'Альфа-Строй': [68, 74, 82, 76, 80, 75, 88, 71], 'БетаГрупп': [78, 85, 95, 88, 92, 88, 99, 82], 'Гамма-ТЭК': [40, 44, 50, 46, 48, 45, 53, 44], 'Дельта Инж': [56, 62, 69, 64, 67, 63, 73, 60], 'Сигма Плюс': [28, 30, 34, 31, 33, 31, 36, 29], 'Омега-Сервис': [102, 114, 128, 118, 124, 117, 135, 110] },
      dpr_status: { 'Альфа-Строй': { acc: [5, 6, 7, 6, 7, 6, 7, 6], rej: [2, 2, 3, 2, 3, 2, 3, 2], court: [1, 1, 2, 1, 2, 1, 2, 1] }, 'БетаГрупп': { acc: [5, 6, 7, 6, 7, 6, 7, 6], rej: [3, 3, 4, 3, 4, 3, 4, 3], court: [2, 2, 2, 2, 2, 2, 3, 2] }, 'Гамма-ТЭК': { acc: [6, 7, 7, 7, 7, 7, 8, 7], rej: [1, 2, 2, 2, 2, 2, 2, 2], court: [1, 1, 1, 1, 1, 1, 1, 1] }, 'Дельта Инж': { acc: [5, 6, 6, 6, 6, 6, 7, 6], rej: [2, 2, 3, 2, 3, 2, 3, 2], court: [1, 1, 2, 1, 2, 1, 2, 1] }, 'Сигма Плюс': { acc: [7, 7, 8, 7, 8, 7, 8, 7], rej: [1, 1, 1, 1, 1, 1, 2, 1], court: [0, 1, 1, 1, 1, 1, 1, 1] }, 'Омега-Сервис': { acc: [4, 4, 5, 4, 5, 4, 5, 4], rej: [3, 4, 4, 4, 4, 4, 5, 4], court: [2, 2, 3, 3, 3, 3, 3, 3] } },
      delay: { 'Альфа-Строй': [14, 16, 20, 18, 17, 19, 22, 15], 'БетаГрупп': [18, 21, 27, 24, 22, 25, 28, 20], 'Гамма-ТЭК': [6, 8, 10, 9, 8, 9, 11, 8], 'Дельта Инж': [10, 12, 15, 13, 12, 14, 16, 12], 'Сигма Плюс': [3, 4, 5, 4, 4, 4, 5, 4], 'Омега-Сервис': [24, 27, 34, 30, 28, 31, 36, 26] },
      act: { 'Альфа-Строй': { done: [10, 12, 13, 12, 13, 12, 14, 12], wip: [3, 3, 3, 3, 3, 3, 3, 3], late: [2, 2, 2, 2, 2, 2, 2, 2] }, 'БетаГрупп': { done: [9, 10, 11, 10, 11, 10, 11, 10], wip: [4, 4, 5, 4, 5, 4, 5, 4], late: [3, 3, 4, 3, 4, 3, 4, 3] }, 'Гамма-ТЭК': { done: [12, 13, 14, 13, 14, 13, 15, 13], wip: [2, 2, 2, 2, 2, 2, 2, 2], late: [1, 1, 1, 1, 1, 1, 1, 1] }, 'Дельта Инж': { done: [10, 11, 12, 11, 12, 11, 12, 11], wip: [3, 3, 3, 3, 3, 3, 3, 3], late: [2, 2, 2, 2, 2, 2, 2, 2] }, 'Сигма Плюс': { done: [13, 14, 15, 14, 15, 14, 15, 14], wip: [1, 1, 2, 1, 2, 1, 2, 1], late: [1, 1, 1, 1, 1, 1, 1, 1] }, 'Омега-Сервис': { done: [7, 8, 8, 8, 8, 8, 9, 8], wip: [5, 5, 5, 5, 5, 5, 6, 5], late: [4, 4, 5, 4, 5, 4, 5, 4] } },
      payment: {
        'Альфа-Строй': [[1.2, 1.3, 1.4, 1.3, 1.4, 1.3, 1.5, 1.4], [0.4, 0.5, 0.5, 0.5, 0.5, 0.5, 0.6, 0.5], [0.6, 0.7, 0.7, 0.7, 0.7, 0.7, 0.8, 0.7], [0.3, 0.3, 0.4, 0.3, 0.4, 0.3, 0.4, 0.4], [0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.6], [0.2, 0.2, 0.3, 0.2, 0.3, 0.2, 0.3, 0.3]],
        'БетаГрупп': [[1.8, 1.9, 2.0, 1.9, 2.0, 1.9, 2.1, 2.0], [0.5, 0.6, 0.6, 0.6, 0.6, 0.6, 0.7, 0.6], [0.8, 0.8, 0.9, 0.8, 0.9, 0.8, 1.0, 0.9], [0.4, 0.4, 0.5, 0.4, 0.5, 0.4, 0.5, 0.5], [0.6, 0.7, 0.7, 0.7, 0.7, 0.7, 0.8, 0.7], [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.4, 0.3]],
        'Гамма-ТЭК': [[0.7, 0.8, 0.8, 0.8, 0.8, 0.8, 0.9, 0.8], [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.4, 0.3], [0.4, 0.4, 0.5, 0.4, 0.5, 0.4, 0.5, 0.5], [0.2, 0.2, 0.3, 0.2, 0.3, 0.2, 0.3, 0.3], [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.5, 0.4], [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.3, 0.2]],
        'Дельта Инж': [[1.0, 1.1, 1.1, 1.1, 1.1, 1.1, 1.2, 1.1], [0.4, 0.4, 0.5, 0.4, 0.5, 0.4, 0.5, 0.5], [0.5, 0.6, 0.6, 0.6, 0.6, 0.6, 0.7, 0.6], [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.4, 0.3], [0.4, 0.5, 0.5, 0.5, 0.5, 0.5, 0.6, 0.5], [0.2, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3]],
        'Сигма Плюс': [[0.5, 0.6, 0.6, 0.6, 0.6, 0.6, 0.7, 0.6], [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.4, 0.3], [0.3, 0.3, 0.4, 0.3, 0.4, 0.3, 0.4, 0.4], [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.3, 0.2], [0.2, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3], [0.1, 0.1, 0.2, 0.1, 0.2, 0.1, 0.2, 0.2]],
        'Омега-Сервис': [[2.4, 2.5, 2.6, 2.5, 2.6, 2.5, 2.7, 2.6], [0.6, 0.7, 0.7, 0.7, 0.7, 0.7, 0.8, 0.7], [1.0, 1.1, 1.1, 1.1, 1.1, 1.1, 1.2, 1.1], [0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.6], [0.7, 0.7, 0.8, 0.7, 0.8, 0.7, 0.9, 0.8], [0.3, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4]],
      },
      drillCrit: { 'Альфа-Строй': [3, 4, 5, 4, 5, 4, 6, 4], 'БетаГрупп': [5, 6, 7, 6, 7, 6, 8, 7], 'Гамма-ТЭК': [2, 3, 4, 3, 4, 3, 5, 4], 'Дельта Инж': [3, 4, 4, 4, 4, 4, 5, 4], 'Сигма Плюс': [1, 2, 2, 2, 2, 2, 3, 2], 'Омега-Сервис': [7, 8, 10, 9, 10, 9, 11, 10] },
      drillPaidWithCrit: { 'Альфа-Строй': 0.62, 'БетаГрупп': 0.78, 'Гамма-ТЭК': 0.41, 'Дельта Инж': 0.56, 'Сигма Плюс': 0.18, 'Омега-Сервис': 0.88 },
    };

    let filterState: any = { monthFrom: 0, monthTo: 7, contractors: [...CONTRACTORS], categories: [...CATEGORIES] };

    function buildMultiSelect(id: string, items: string[], colors: string[], stateKey: string) {
      const drop = $('drop' + id.charAt(0).toUpperCase() + id.slice(1));
      drop.innerHTML = '';
      const allEl = document.createElement('div'); allEl.className = 'multi-option multi-all';
      allEl.innerHTML = `<input type="checkbox" id="all_${id}" checked><label for="all_${id}" style="cursor:pointer;font-weight:700">Все</label>`;
      allEl.querySelector('input')!.addEventListener('change', (e: any) => {
        drop.querySelectorAll<HTMLInputElement>('input[data-item]').forEach(cb => (cb.checked = e.target.checked));
        filterState[stateKey] = e.target.checked ? [...items] : []; updateLabel(id, stateKey, items); applyFilters();
      }); drop.appendChild(allEl);
      items.forEach((item, i) => {
        const el = document.createElement('div'); el.className = 'multi-option';
        el.innerHTML = `<input type="checkbox" data-item="${item}" checked><span style="width:10px;height:10px;border-radius:2px;background:${colors[i]};display:inline-block;flex-shrink:0"></span><label style="cursor:pointer">${item}</label>`;
        el.querySelector('input')!.addEventListener('change', () => {
          filterState[stateKey] = [...drop.querySelectorAll<HTMLInputElement>('input[data-item]:checked')].map(cb => cb.dataset.item);
          (drop.querySelector('#all_' + id) as HTMLInputElement).checked = filterState[stateKey].length === items.length;
          updateLabel(id, stateKey, items); applyFilters();
        }); drop.appendChild(el);
      });
    }
    function updateLabel(id: string, stateKey: string, items: string[]) {
      const sel = filterState[stateKey]; const cap = id.charAt(0).toUpperCase() + id.slice(1);
      const lbl = $('lbl' + cap), badge = $('badge' + cap);
      if (sel.length === items.length) { lbl.textContent = 'Все'; badge.style.display = 'none'; }
      else if (sel.length === 0) { lbl.textContent = 'Нет'; badge.style.display = 'none'; }
      else { lbl.textContent = sel.length === 1 ? sel[0].substring(0, 12) : sel[0].substring(0, 8) + '…'; badge.textContent = String(sel.length); badge.style.display = 'inline-block'; }
    }
    function toggleDropdown(id: string) {
      const cap = id.charAt(0).toUpperCase() + id.slice(1);
      const drop = $('drop' + cap), btn = $('btn' + cap);
      const open = drop.classList.toggle('open'); btn.classList.toggle('open', open);
    }
    const docClick = (e: any) => {
      ['Contractor', 'Category'].forEach(id => {
        const wrap = root.querySelector('#wrap' + id);
        if (wrap && !wrap.contains(e.target)) { $('drop' + id).classList.remove('open'); $('btn' + id).classList.remove('open'); }
      });
    };
    const cleanups: Array<() => void> = [];
    const on = (el: EventTarget, ev: string, fn: any) => {
      el.addEventListener(ev, fn);
      cleanups.push(() => el.removeEventListener(ev, fn));
    };
    on(document, 'click', docClick);

    const charts: Record<string, Chart> = {};
    function mkChart(id: string, cfg: any) { if (charts[id]) charts[id].destroy(); charts[id] = new Chart($(id) as HTMLCanvasElement, cfg); }
    const getMonths = () => MONTHS.slice(filterState.monthFrom, filterState.monthTo + 1);
    const monthIdxs = () => { const o = []; for (let i = filterState.monthFrom; i <= filterState.monthTo; i++) o.push(i); return o; };
    const filteredContractors = () => CONTRACTORS.filter(c => filterState.contractors.includes(c));
    const filteredCategories = () => CATEGORIES.filter(c => filterState.categories.includes(c));
    const sumOverMonths = (arr: number[]) => arr.filter((_, i) => i >= filterState.monthFrom && i <= filterState.monthTo).reduce((s, v) => s + v, 0);

    function renderFinance() {
      const cons = filteredContractors(), midxs = monthIdxs();
      let totIssued = 0, totAcc = 0, totPaid = 0; const uncovered: any = {}, issued_by_c: any = {}, proactive_by_c: any = {};
      cons.forEach(c => { let ci = 0, ca = 0, cp = 0; midxs.forEach(m => { ci += MASTER.fine[c][m][0]; ca += MASTER.fine[c][m][1]; cp += MASTER.fine[c][m][2]; }); totIssued += ci; totAcc += ca; totPaid += cp; uncovered[c] = +(ci - ca - cp).toFixed(2); issued_by_c[c] = +ci.toFixed(2); proactive_by_c[c] = MASTER.proactive[c]; });
      const totUnc = +(totIssued - totAcc - totPaid).toFixed(2);
      $('kpi-finance').innerHTML = `
        <div class="kpi" style="--kpi-accent:var(--blue2)"><div class="kpi-label">Выставлено</div><div class="kpi-value">${totIssued.toFixed(1)}М</div><div class="kpi-sub">штрафных претензий</div></div>
        <div class="kpi" style="--kpi-accent:var(--yellow)"><div class="kpi-label">Принято</div><div class="kpi-value">${totAcc.toFixed(1)}М</div><div class="kpi-sub">${totIssued > 0 ? Math.round(totAcc / totIssued * 100) : 0}% от выставленных</div></div>
        <div class="kpi" style="--kpi-accent:var(--green)"><div class="kpi-label">Оплачено</div><div class="kpi-value">${totPaid.toFixed(1)}М</div><div class="kpi-sub">${totIssued > 0 ? Math.round(totPaid / totIssued * 100) : 0}% от выставленных</div></div>
        <div class="kpi" style="--kpi-accent:var(--red)"><div class="kpi-label">Непокрытый долг</div><div class="kpi-value">${totUnc.toFixed(1)}М</div><div class="kpi-sub">не оплачено</div><span class="kpi-badge badge-red">⚠</span></div>`;
      mkChart('c1', { type: 'bar', data: { labels: ['Выставлено', 'Принято', 'Оплачено', 'Непокрытый остаток'], datasets: [{ data: [+totIssued.toFixed(2), +totAcc.toFixed(2), +totPaid.toFixed(2), totUnc], backgroundColor: [a(C.blue2, .8), a(C.yellow, .8), a(C.green, .8), a(C.red, .8)], borderColor: [C.blue2, C.yellow, C.green, C.red], borderWidth: 1.5, borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.parsed.y.toFixed(2)} М ₽` } } }, scales: { x: { grid: { display: false } }, y: { ticks: { callback: (v: any) => v + 'М' }, grid: { color: GRID } } } } });
      const sortedCons = [...cons].sort((x, y) => (uncovered[y] || 0) - (uncovered[x] || 0));
      mkChart('c2', { type: 'bar', data: { labels: sortedCons, datasets: [{ label: 'Непокрыто, млн ₽', data: sortedCons.map(c => Math.max(0, uncovered[c] || 0)), backgroundColor: (ctx: any) => ctx.raw > 5 ? a(C.red, .8) : ctx.raw > 2 ? a(C.orange, .8) : a(C.yellow, .8), borderRadius: 3 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.parsed.x.toFixed(2)} М ₽` } } }, scales: { x: { ticks: { callback: (v: any) => v.toFixed(1) + 'М' }, grid: { color: GRID } }, y: { grid: { display: false } } } } });
      const months = getMonths();
      const issuedByM = midxs.map(m => +cons.reduce((s, c) => s + MASTER.fine[c][m][0], 0).toFixed(2));
      const accByM = midxs.map(m => +cons.reduce((s, c) => s + MASTER.fine[c][m][1], 0).toFixed(2));
      mkChart('c3', { type: 'line', data: { labels: months, datasets: [{ label: 'Выставлено', data: issuedByM, borderColor: C.blue2, backgroundColor: a(C.blue2, .12), borderWidth: 2.5, tension: .4, fill: true, pointRadius: 4, pointBackgroundColor: C.blue2, pointBorderColor: PT, pointBorderWidth: 2 }, { label: 'Принято', data: accByM, borderColor: C.yellow, backgroundColor: a(C.yellow, .08), borderWidth: 2.5, tension: .4, fill: true, pointRadius: 4, pointBackgroundColor: C.yellow, pointBorderColor: PT, pointBorderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', padding: 14 } } }, scales: { x: { grid: { color: GRID } }, y: { ticks: { callback: (v: any) => v + 'М' }, grid: { color: GRID } } } } });
      mkChart('c4', { type: 'bar', data: { labels: cons, datasets: [{ label: 'Проактив, млн ₽', data: cons.map(c => proactive_by_c[c]), backgroundColor: a(C.green, .8), borderRadius: 3 }, { label: 'Штрафы, млн ₽', data: cons.map(c => issued_by_c[c]), backgroundColor: a(C.red, .8), borderRadius: 3 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 14 } } }, scales: { x: { grid: { display: false } }, y: { ticks: { callback: (v: any) => v + 'М' }, grid: { color: GRID } } } } });
    }

    function renderViolations() {
      const cons = filteredContractors(), cats = filteredCategories(), midxs = monthIdxs(), months = getMonths();
      const catTotals = cats.map(cat => cons.reduce((s, c) => s + sumOverMonths(MASTER.viol[cat][c]), 0));
      const total = catTotals.reduce((s, v) => s + v, 0);
      const top12 = cats.includes('ТОП-12') ? cons.reduce((s, c) => s + sumOverMonths(MASTER.viol['ТОП-12'][c]), 0) : 0;
      const npvTot = cons.reduce((s, c) => s + sumOverMonths(MASTER.npv[c]), 0);
      $('kpi-viol').innerHTML = `
        <div class="kpi" style="--kpi-accent:var(--red)"><div class="kpi-label">Всего нарушений</div><div class="kpi-value">${total}</div><div class="kpi-sub">за период</div></div>
        <div class="kpi" style="--kpi-accent:var(--red)"><div class="kpi-label">ТОП-12</div><div class="kpi-value">${top12}</div><div class="kpi-sub">${total > 0 ? Math.round(top12 / total * 100) : 0}% от всех</div><span class="kpi-badge badge-red">⚠</span></div>
        <div class="kpi" style="--kpi-accent:var(--orange)"><div class="kpi-label">НПВ суммарно</div><div class="kpi-value">${npvTot} ч</div><div class="kpi-sub">за период</div></div>
        <div class="kpi" style="--kpi-accent:var(--blue2)"><div class="kpi-label">Подрядчиков</div><div class="kpi-value">${cons.length}</div><div class="kpi-sub">в выборке</div></div>`;
      mkChart('c5', { type: 'doughnut', data: { labels: cats, datasets: [{ data: catTotals, backgroundColor: cats.map(c => a(CAT_COLORS[CATEGORIES.indexOf(c)], .85)), borderColor: PT, borderWidth: 3, hoverOffset: 8 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '64%', plugins: { legend: { position: 'right', labels: { padding: 12, boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: 'rectRounded' } }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed} (${total ? Math.round(ctx.parsed / total * 100) : 0}%)` } } } } });
      mkChart('c6', { type: 'bar', data: { labels: months, datasets: cats.map(cat => ({ label: cat, data: midxs.map(m => cons.reduce((s, c) => s + MASTER.viol[cat][c][m], 0)), backgroundColor: a(CAT_COLORS[CATEGORIES.indexOf(cat)], .85), borderRadius: 2 })) }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 10, boxWidth: 10 } } }, scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, grid: { color: GRID } } } } });
      mkChart('c7', { type: 'bar', data: { labels: cons, datasets: cats.map(cat => ({ label: cat, data: cons.map(c => sumOverMonths(MASTER.viol[cat][c])), backgroundColor: a(CAT_COLORS[CATEGORIES.indexOf(cat)], .85) })) }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 10, boxWidth: 10 } } }, scales: { x: { stacked: true, grid: { color: GRID } }, y: { stacked: true, grid: { display: false } } } } });
      const totV = total;
      mkChart('c8', { type: 'bar', data: { labels: ['Новое', 'На рассмотрении', 'Оспаривается', 'Подтверждено', 'Закрыто', 'Отклонено'], datasets: [{ data: [Math.round(totV * .10), Math.round(totV * .21), Math.round(totV * .07), Math.round(totV * .25), Math.round(totV * .30), Math.round(totV * .07)], backgroundColor: [a(C.blue2, .85), a(C.yellow, .85), a(C.orange, .85), a(C.red, .85), a(C.green, .85), a(C.cyan, .85)], borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: GRID } } } } });
      const npvByCon = cons.map(c => sumOverMonths(MASTER.npv[c]));
      const sortedIdx = cons.map((_, i) => i).sort((x, y) => npvByCon[y] - npvByCon[x]);
      mkChart('c9', { type: 'bar', data: { labels: sortedIdx.map(i => cons[i]), datasets: [{ label: 'НПВ, ч', data: sortedIdx.map(i => npvByCon[i]), backgroundColor: (ctx: any) => ctx.raw > 500 ? a(C.red, .8) : ctx.raw > 300 ? a(C.orange, .8) : a(C.yellow, .8), borderRadius: 3 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.parsed.x} ч` } } }, scales: { x: { grid: { color: GRID } }, y: { grid: { display: false } } } } });
    }

    function renderDPR() {
      const cons = filteredContractors(), midxs = monthIdxs();
      let totAcc = 0, totRej = 0, totCourt = 0; const delayByCon: any = {}, courtByCon: any = {}, courtSumByCon: any = {};
      cons.forEach(c => { const d = MASTER.dpr_status[c]; const ca = midxs.reduce((s, m) => s + d.acc[m], 0), cr = midxs.reduce((s, m) => s + d.rej[m], 0), cc = midxs.reduce((s, m) => s + d.court[m], 0); totAcc += ca; totRej += cr; totCourt += cc; delayByCon[c] = +(midxs.reduce((s, m) => s + MASTER.delay[c][m], 0) / midxs.length).toFixed(1); courtByCon[c] = cc; courtSumByCon[c] = +(cc * 1.8).toFixed(1); });
      const totAll = totAcc + totRej + totCourt;
      const avgDelay = cons.length ? (cons.reduce((s, c) => s + delayByCon[c], 0) / cons.length).toFixed(1) : 0;
      $('kpi-dpr').innerHTML = `
        <div class="kpi" style="--kpi-accent:var(--blue2)"><div class="kpi-label">Всего ДПР</div><div class="kpi-value">${totAll}</div><div class="kpi-sub">за период</div></div>
        <div class="kpi" style="--kpi-accent:var(--green)"><div class="kpi-label">Принято</div><div class="kpi-value">${totAll ? Math.round(totAcc / totAll * 100) : 0}%</div><div class="kpi-sub">${totAcc} претензий</div></div>
        <div class="kpi" style="--kpi-accent:var(--red)"><div class="kpi-label">В суде</div><div class="kpi-value">${totCourt}</div><div class="kpi-sub">активных дел</div><span class="kpi-badge badge-red">⚠</span></div>
        <div class="kpi" style="--kpi-accent:var(--orange)"><div class="kpi-label">Ср. просрочка</div><div class="kpi-value">${avgDelay}</div><div class="kpi-sub">дней ответа</div></div>`;
      mkChart('c10', { type: 'doughnut', data: { labels: ['Принято', 'Отклонено', 'Судебное'], datasets: [{ data: [totAcc, totRej, totCourt], backgroundColor: [a(C.green, .85), a(C.red, .85), a(C.orange, .85)], borderColor: PT, borderWidth: 3, hoverOffset: 8 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '62%', plugins: { legend: { position: 'right', labels: { padding: 14, boxWidth: 10, usePointStyle: true, pointStyle: 'rectRounded' } }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed} (${totAll ? Math.round(ctx.parsed / totAll * 100) : 0}%)` } } } } });
      const sortedCons = [...cons].sort((x, y) => delayByCon[y] - delayByCon[x]);
      mkChart('c11', { type: 'bar', data: { labels: sortedCons, datasets: [{ label: 'Просрочка, дн.', data: sortedCons.map(c => delayByCon[c]), backgroundColor: (ctx: any) => ctx.raw > 20 ? a(C.red, .8) : ctx.raw > 10 ? a(C.orange, .8) : a(C.yellow, .8), borderRadius: 3 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.parsed.x} дн.` } } }, scales: { x: { grid: { color: GRID } }, y: { grid: { display: false } } } } });
      mkChart('c12', { type: 'bar', data: { labels: cons, datasets: [{ type: 'bar', label: 'Кол-во дел', data: cons.map(c => courtByCon[c]), backgroundColor: a(C.orange, .8), borderRadius: 3, yAxisID: 'y' }, { type: 'line', label: 'Сумма, млн ₽', data: cons.map(c => courtSumByCon[c]), borderColor: C.yellow, backgroundColor: a(C.yellow, .1), borderWidth: 2.5, tension: .3, pointRadius: 5, pointBackgroundColor: C.yellow, pointBorderColor: PT, pointBorderWidth: 2, yAxisID: 'y2' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 14 } } }, scales: { x: { grid: { display: false } }, y: { position: 'left', title: { display: true, text: 'Дел', color: AXIS }, grid: { color: GRID } }, y2: { position: 'right', title: { display: true, text: 'Млн ₽', color: AXIS }, grid: { display: false }, ticks: { callback: (v: any) => v + 'М' } } } } });
    }

    function renderActivities() {
      const cons = filteredContractors(), midxs = monthIdxs();
      let totDone = 0, totWip = 0, totLate = 0;
      cons.forEach(c => { const d = MASTER.act[c]; totDone += midxs.reduce((s, m) => s + d.done[m], 0); totWip += midxs.reduce((s, m) => s + d.wip[m], 0); totLate += midxs.reduce((s, m) => s + d.late[m], 0); });
      const totAct = totDone + totWip + totLate;
      $('kpi-act').innerHTML = `
        <div class="kpi" style="--kpi-accent:var(--blue2)"><div class="kpi-label">Всего мероприятий</div><div class="kpi-value">${totAct}</div><div class="kpi-sub">за период</div></div>
        <div class="kpi" style="--kpi-accent:var(--green)"><div class="kpi-label">Реализовано</div><div class="kpi-value">${totAct ? Math.round(totDone / totAct * 100) : 0}%</div><div class="kpi-sub">${totDone} шт.</div><span class="kpi-badge badge-green">↑</span></div>
        <div class="kpi" style="--kpi-accent:var(--red)"><div class="kpi-label">Просрочено</div><div class="kpi-value">${totLate}</div><div class="kpi-sub">не реализовано в срок</div><span class="kpi-badge badge-red">⚠</span></div>
        <div class="kpi" style="--kpi-accent:var(--yellow)"><div class="kpi-label">В работе</div><div class="kpi-value">${totWip}</div><div class="kpi-sub">активных</div></div>`;
      mkChart('c13', { type: 'bar', data: { labels: cons, datasets: [{ label: 'Реализовано', data: cons.map(c => midxs.reduce((s, m) => s + MASTER.act[c].done[m], 0)), backgroundColor: a(C.green, .85), borderRadius: 3 }, { label: 'В работе', data: cons.map(c => midxs.reduce((s, m) => s + MASTER.act[c].wip[m], 0)), backgroundColor: a(C.yellow, .85) }, { label: 'Просрочено', data: cons.map(c => midxs.reduce((s, m) => s + MASTER.act[c].late[m], 0)), backgroundColor: a(C.red, .85) }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 12 } } }, scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, grid: { color: GRID } } } } });
      const lateByCon = cons.map(c => midxs.reduce((s, m) => s + MASTER.act[c].late[m], 0));
      const sortIdx = cons.map((_, i) => i).sort((x, y) => lateByCon[y] - lateByCon[x]);
      mkChart('c14', { type: 'bar', data: { labels: sortIdx.map(i => cons[i]), datasets: [{ label: 'Просрочено', data: sortIdx.map(i => lateByCon[i]), backgroundColor: (ctx: any) => ctx.raw > 15 ? a(C.red, .8) : ctx.raw > 8 ? a(C.orange, .8) : a(C.yellow, .8), borderRadius: 3 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: GRID } }, y: { grid: { display: false } } } } });
      const top12 = filterState.categories.includes('ТОП-12');
      const base = top12 ? cons.reduce((s, c) => s + sumOverMonths(MASTER.viol['ТОП-12'][c]), 0) : 0;
      mkChart('c15', { type: 'bar', data: { labels: ['Запланировано', 'В работе', 'На согласовании', 'Реализовано', 'Просрочено', 'Закрыто'], datasets: [{ data: [Math.round(base * .18), Math.round(base * .12), Math.round(base * .08), Math.round(base * .37), Math.round(base * .16), Math.round(base * .09)], backgroundColor: [a(C.blue2, .85), a(C.yellow, .85), a(C.purple, .85), a(C.green, .85), a(C.red, .85), a(C.cyan, .85)], borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => `${ctx.label}: ${ctx.parsed.y}` } } }, scales: { x: { grid: { display: false } }, y: { grid: { color: GRID } } } } });
    }

    function renderMotivation() {
      const cons = filteredContractors(), midxs = monthIdxs(), months = getMonths();
      const paymentByService = SERVICES.map((_, si) => cons.reduce((s, c) => s + sumOverMonths(MASTER.payment[c][si]), 0));
      const totalPayment = paymentByService.reduce((s, v) => s + v, 0);
      const paymentByContractor: any = {};
      cons.forEach(c => { paymentByContractor[c] = +SERVICES.reduce((s, _, si) => s + sumOverMonths(MASTER.payment[c][si]), 0).toFixed(2); });
      const drillingTotal = cons.reduce((s, c) => s + sumOverMonths(MASTER.payment[c][0]), 0);
      const drillPayByCon: any = {}, drillCritByCon: any = {}, drillPaidWithCritByCon: any = {};
      cons.forEach(c => {
        drillPayByCon[c] = +sumOverMonths(MASTER.payment[c][0]).toFixed(2);
        drillCritByCon[c] = sumOverMonths(MASTER.drillCrit[c]);
        drillPaidWithCritByCon[c] = +(drillPayByCon[c] * MASTER.drillPaidWithCrit[c]).toFixed(2);
      });
      const totalCritDrill = cons.reduce((s, c) => s + drillCritByCon[c], 0);
      const totalPaidWithCrit = cons.reduce((s, c) => s + drillPaidWithCritByCon[c], 0);
      const pctPaidWithCrit = drillingTotal > 0 ? Math.round(totalPaidWithCrit / drillingTotal * 100) : 0;
      $('kpi-motiv').innerHTML = `
        <div class="kpi" style="--kpi-accent:var(--orange)"><div class="kpi-label">Выплачено мотивации</div><div class="kpi-value">${totalPayment.toFixed(1)}М</div><div class="kpi-sub">из актов выполненных работ</div></div>
        <div class="kpi" style="--kpi-accent:var(--blue2)"><div class="kpi-label">Эксплуатационное бурение</div><div class="kpi-value">${drillingTotal.toFixed(1)}М</div><div class="kpi-sub">${totalPayment > 0 ? Math.round(drillingTotal / totalPayment * 100) : 0}% от всех выплат</div></div>
        <div class="kpi" style="--kpi-accent:var(--red)"><div class="kpi-label">Критичных нарушений (бурение)</div><div class="kpi-value">${totalCritDrill}</div><div class="kpi-sub">ТОП-12 + ЛЭП</div><span class="kpi-badge badge-red">⚠</span></div>
        <div class="kpi" style="--kpi-accent:var(--orange)"><div class="kpi-label">Выплачено при нарушениях</div><div class="kpi-value">${totalPaidWithCrit.toFixed(1)}М</div><div class="kpi-sub">${pctPaidWithCrit}% от бурения</div><span class="kpi-badge badge-orange">!</span></div>`;
      mkChart('c19', { type: 'doughnut', data: { labels: SERVICES, datasets: [{ data: paymentByService.map(v => +v.toFixed(2)), backgroundColor: SERVICES.map((_, i) => a(SERVICE_COLORS[i], .85)), borderColor: PT, borderWidth: 3, hoverOffset: 8 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'right', labels: { padding: 12, boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: 'rectRounded', font: { size: 10 } } }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed.toFixed(2)} М ₽ (${totalPayment ? Math.round(ctx.parsed / totalPayment * 100) : 0}%)` } } } } });
      const sortedPay = [...cons].sort((x, y) => paymentByContractor[y] - paymentByContractor[x]);
      mkChart('c20', { type: 'bar', data: { labels: sortedPay, datasets: [{ label: 'Выплачено, млн ₽', data: sortedPay.map(c => paymentByContractor[c]), backgroundColor: a(C.orange, .8), borderRadius: 3 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.parsed.x.toFixed(2)} М ₽` } } }, scales: { x: { ticks: { callback: (v: any) => v.toFixed(1) + 'М' }, grid: { color: GRID } }, y: { grid: { display: false } } } } });
      mkChart('c21', { type: 'line', data: { labels: months, datasets: SERVICES.map((srv, si) => ({ label: srv, data: midxs.map(m => +cons.reduce((s, c) => s + MASTER.payment[c][si][m], 0).toFixed(2)), borderColor: SERVICE_COLORS[si], backgroundColor: a(SERVICE_COLORS[si], .55), borderWidth: 1.5, tension: .4, fill: true, pointRadius: 0 })) }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 10, boxWidth: 10, font: { size: 10 } } } }, scales: { x: { grid: { color: GRID } }, y: { stacked: true, ticks: { callback: (v: any) => v + 'М' }, grid: { color: GRID } } } } });
      mkChart('c22', { type: 'bar', data: { labels: cons, datasets: [{ type: 'bar', label: 'Мотивация (бурение), млн ₽', data: cons.map(c => drillPayByCon[c]), backgroundColor: a(C.orange, .8), borderRadius: 3, yAxisID: 'y', order: 2 }, { type: 'line', label: 'Критичные нарушения, шт.', data: cons.map(c => drillCritByCon[c]), borderColor: C.red, backgroundColor: a(C.red, .1), borderWidth: 2.5, tension: .3, pointRadius: 5, pointBackgroundColor: C.red, pointBorderColor: PT, pointBorderWidth: 2, yAxisID: 'y2', order: 1 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 12 } }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.dataset.label}: ${ctx.dataset.yAxisID === 'y' ? ctx.parsed.y.toFixed(2) + ' М ₽' : ctx.parsed.y + ' шт.'}` } } }, scales: { x: { grid: { display: false } }, y: { position: 'left', title: { display: true, text: 'Млн ₽', color: AXIS }, ticks: { callback: (v: any) => v + 'М' }, grid: { color: GRID } }, y2: { position: 'right', title: { display: true, text: 'Нарушения', color: AXIS }, grid: { display: false } } } } });
      const sortedDrill = [...cons].sort((x, y) => drillPaidWithCritByCon[y] - drillPaidWithCritByCon[x]);
      mkChart('c23', { type: 'bar', data: { labels: sortedDrill, datasets: [{ label: 'При наличии критичных нарушений', data: sortedDrill.map(c => drillPaidWithCritByCon[c]), backgroundColor: a(C.red, .8), borderRadius: 3, stack: 's' }, { label: 'Без критичных нарушений', data: sortedDrill.map(c => +(drillPayByCon[c] - drillPaidWithCritByCon[c]).toFixed(2)), backgroundColor: a(C.green, .8), borderRadius: 3, stack: 's' }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 10, boxWidth: 10 } }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.dataset.label}: ${ctx.parsed.x.toFixed(2)} М ₽` } } }, scales: { x: { stacked: true, ticks: { callback: (v: any) => v.toFixed(1) + 'М' }, grid: { color: GRID } }, y: { stacked: true, grid: { display: false } } } } });
      const drillPayByM = midxs.map(m => +cons.reduce((s, c) => s + MASTER.payment[c][0][m], 0).toFixed(2));
      const drillCritByM = midxs.map(m => cons.reduce((s, c) => s + MASTER.drillCrit[c][m], 0));
      mkChart('c24', { type: 'line', data: { labels: months, datasets: [{ label: 'Мотивация (бурение), млн ₽', data: drillPayByM, borderColor: C.orange, backgroundColor: a(C.orange, .12), borderWidth: 2.5, tension: .4, fill: true, pointRadius: 4, pointBackgroundColor: C.orange, pointBorderColor: PT, pointBorderWidth: 2, yAxisID: 'y' }, { label: 'Критичные нарушения, шт.', data: drillCritByM, borderColor: C.red, backgroundColor: 'transparent', borderWidth: 2.5, tension: .4, fill: false, pointRadius: 4, pointBackgroundColor: C.red, pointBorderColor: PT, pointBorderWidth: 2, yAxisID: 'y2', borderDash: [5, 3] }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 14 } } }, scales: { x: { grid: { color: GRID } }, y: { position: 'left', title: { display: true, text: 'Млн ₽', color: AXIS }, ticks: { callback: (v: any) => v + 'М' }, grid: { color: GRID } }, y2: { position: 'right', title: { display: true, text: 'Нарушения', color: AXIS }, grid: { display: false } } } } });
    }

    function renderRating() {
      const cons = filteredContractors(), midxs = monthIdxs();
      const data = cons.map(c => {
        const totViol = CATEGORIES.reduce((s, cat) => s + sumOverMonths(MASTER.viol[cat][c]), 0);
        const violScore = Math.max(0, Math.round((1 - totViol / 375) * 100));
        const d = MASTER.dpr_status[c];
        const acc = midxs.reduce((s, m) => s + d.acc[m], 0);
        const all = midxs.reduce((s, m) => s + d.acc[m] + d.rej[m] + d.court[m], 0);
        const dprPct = all ? Math.round(acc / all * 100) : 0;
        const da = MASTER.act[c].done, dw = MASTER.act[c].wip, dl = MASTER.act[c].late;
        const done = midxs.reduce((s, m) => s + da[m], 0);
        const actAll = midxs.reduce((s, m) => s + da[m] + dw[m] + dl[m], 0);
        const actPct = actAll ? Math.round(done / actAll * 100) : 0;
        let fine = 0; midxs.forEach(m => { fine += MASTER.fine[c][m][0] - MASTER.fine[c][m][1] - MASTER.fine[c][m][2]; });
        const drillCleanPct = Math.round((1 - MASTER.drillPaidWithCrit[c]) * 100);
        const score = Math.round((violScore + dprPct + actPct + drillCleanPct) / 4);
        return { name: c, viol: violScore, dpr: dprPct, act: actPct, clean: drillCleanPct, fine: +fine.toFixed(1), score };
      }).sort((x, y) => y.score - x.score);
      const scoreColor = (s: number) => s >= 75 ? C.green : s >= 55 ? C.yellow : C.red;
      const cell = (v: number, lo: number, hi: number, suffix = '%', invert = false) => { const cls = invert ? (v < lo ? 'cell-green' : v < hi ? 'cell-amber' : 'cell-red') : (v >= hi ? 'cell-green' : v >= lo ? 'cell-amber' : 'cell-red'); return `<td class="${cls}" style="text-align:center">${v}${suffix}</td>`; };
      $('ratingTable').innerHTML = `<thead><tr>
        <th>#</th><th>Подрядчик</th><th>% без нарушений</th><th>% принятых ДПР</th>
        <th>% реализ. меропр.</th><th>% мотивации без крит. нарушений</th><th>Долг, млн ₽</th><th>Итоговый скор</th>
      </tr></thead><tbody>${data.map((d, i) => `<tr>
        <td style="color:var(--muted)">${i + 1}</td>
        <td style="font-family:var(--font-head);font-weight:600;color:var(--text)">${d.name}</td>
        ${cell(d.viol, 50, 70)} ${cell(d.dpr, 60, 75)} ${cell(d.act, 65, 80)} ${cell(d.clean, 50, 75)}
        ${cell(d.fine, 3, 6, 'М', true)}
        <td><div class="score-bar">
          <div class="score-bar-track"><div class="score-bar-fill" style="width:${d.score}%;background:${scoreColor(d.score)}"></div></div>
          <span style="color:${scoreColor(d.score)};font-weight:700;min-width:30px">${d.score}</span>
        </div></td>
      </tr>`).join('')}</tbody>`;
      const cons2 = filteredContractors();
      const seed = (c: string, q: number) => { const base = [40, 45, 55, 50, 60, 55, 65, 58]; const mult: any = { 'Альфа-Строй': 1.0, 'БетаГрупп': 1.3, 'Гамма-ТЭК': 0.8, 'Дельта Инж': 0.9, 'Сигма Плюс': 0.6, 'Омега-Сервис': 1.8 }; return Math.round(base[q] * (mult[c] || 1) + (c.charCodeAt(0) % 7 - 3)); };
      mkChart('c17', { type: 'line', data: { labels: QUARTERS, datasets: cons2.map(c => ({ label: c, data: QUARTERS.map((_, q) => seed(c, q)), borderColor: CON_COLORS[CONTRACTORS.indexOf(c)], backgroundColor: a(CON_COLORS[CONTRACTORS.indexOf(c)], .07), borderWidth: 2, tension: .4, fill: false, pointRadius: 3, pointBackgroundColor: CON_COLORS[CONTRACTORS.indexOf(c)], pointBorderColor: PT, pointBorderWidth: 1.5 })) }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 10, boxWidth: 10, font: { size: 10 } } } }, scales: { x: { grid: { color: GRID } }, y: { grid: { color: GRID } } } } });
      const accData = data.map(d => ({ name: d.name, pct: d.dpr })).sort((x, y) => y.pct - x.pct);
      const thr70: any = { id: 'thr', afterDraw(chart: any) { const { ctx, chartArea: { top, bottom }, scales: { x } } = chart; if (!x) return; const xp = x.getPixelForValue(70); ctx.save(); ctx.beginPath(); ctx.setLineDash([6, 4]); ctx.strokeStyle = C.red; ctx.lineWidth = 1.5; ctx.moveTo(xp, top); ctx.lineTo(xp, bottom); ctx.stroke(); ctx.restore(); } };
      if (charts['c18']) charts['c18'].destroy();
      charts['c18'] = new Chart($('c18') as HTMLCanvasElement, { type: 'bar', data: { labels: accData.map(d => d.name), datasets: [{ label: '% принятых', data: accData.map(d => d.pct), backgroundColor: accData.map(d => d.pct >= 70 ? a(C.green, .8) : a(C.red, .8)), borderRadius: 3 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.parsed.x}%` } } }, scales: { x: { min: 0, max: 100, ticks: { callback: (v: any) => v + '%' }, grid: { color: GRID } }, y: { grid: { display: false } } } }, plugins: [thr70] } as any);
    }

    function renderAll() { renderFinance(); renderViolations(); renderDPR(); renderActivities(); renderMotivation(); renderRating(); }
    function applyFilters() {
      filterState.monthFrom = +($('fMonthFrom') as HTMLSelectElement).value;
      filterState.monthTo = +($('fMonthTo') as HTMLSelectElement).value;
      if (filterState.monthTo < filterState.monthFrom) { filterState.monthTo = filterState.monthFrom; ($('fMonthTo') as HTMLSelectElement).value = String(filterState.monthFrom); }
      renderChips(); renderAll();
    }
    function renderChips() {
      const fs = filterState; const chips: string[] = [];
      if (fs.monthFrom !== 0 || fs.monthTo !== 7) chips.push(`${MONTHS[fs.monthFrom]} – ${MONTHS[fs.monthTo]}`);
      if (fs.contractors.length !== CONTRACTORS.length) chips.push(`Подрядчики: ${fs.contractors.length}`);
      if (fs.categories.length !== CATEGORIES.length) chips.push(`Категории: ${fs.categories.length}`);
      $('filterChips').innerHTML = chips.map(c => `<span class="chip">${c}</span>`).join('');
    }
    function resetFilters() {
      ($('fMonthFrom') as HTMLSelectElement).value = '0'; ($('fMonthTo') as HTMLSelectElement).value = '7';
      filterState = { monthFrom: 0, monthTo: 7, contractors: [...CONTRACTORS], categories: [...CATEGORIES] };
      root!.querySelectorAll<HTMLInputElement>('#dropContractor input,#dropCategory input').forEach(cb => (cb.checked = true));
      $('lblContractor').textContent = 'Все'; $('lblCategory').textContent = 'Все';
      $('badgeContractor').style.display = 'none'; $('badgeCategory').style.display = 'none';
      renderChips(); renderAll();
    }
    function showTab(idx: number) { root!.querySelectorAll('.section').forEach((s, i) => s.classList.toggle('active', i === idx)); root!.querySelectorAll('.nav-tab').forEach((t, i) => t.classList.toggle('active', i === idx)); }

    // wiring
    on($('fMonthFrom'), 'change', applyFilters);
    on($('fMonthTo'), 'change', applyFilters);
    on($('btnContractor'), 'click', (e: any) => { e.stopPropagation(); toggleDropdown('contractor'); });
    on($('btnCategory'), 'click', (e: any) => { e.stopPropagation(); toggleDropdown('category'); });
    on($('btnReset'), 'click', resetFilters);
    root.querySelectorAll<HTMLElement>('.nav-tab').forEach((t, i) => on(t, 'click', () => showTab(i)));
    $('hdate').textContent = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
    buildMultiSelect('contractor', CONTRACTORS, CON_COLORS, 'contractors');
    buildMultiSelect('category', CATEGORIES, CAT_COLORS, 'categories');
    renderAll();

    return () => {
      cleanups.forEach(fn => fn());
      Object.values(charts).forEach(ch => ch.destroy());
    };
  }, []);

  return (
    <div className="dash" ref={rootRef}>
      <div className="dash-filterbar" id="filterbar">
        <span className="filter-label">Фильтры</span>
        <div className="filter-group">
          <span className="filter-label">Период с</span>
          <select className="f-select" id="fMonthFrom" defaultValue="0">
            <option value="0">Январь</option><option value="1">Февраль</option><option value="2">Март</option><option value="3">Апрель</option>
            <option value="4">Май</option><option value="5">Июнь</option><option value="6">Июль</option><option value="7">Август</option>
          </select>
          <span className="filter-label">по</span>
          <select className="f-select" id="fMonthTo" defaultValue="7">
            <option value="0">Январь</option><option value="1">Февраль</option><option value="2">Март</option><option value="3">Апрель</option>
            <option value="4">Май</option><option value="5">Июнь</option><option value="6">Июль</option><option value="7">Август</option>
          </select>
        </div>
        <div className="filter-sep" />
        <div className="filter-group">
          <span className="filter-label">Подрядчик</span>
          <div className="multi-wrap" id="wrapContractor">
            <div className="multi-btn" id="btnContractor">
              <span id="lblContractor">Все</span><span className="multi-badge" id="badgeContractor" style={{ display: 'none' }} />
              <span style={{ color: 'var(--muted)', fontSize: 9 }}>▾</span>
            </div>
            <div className="multi-dropdown" id="dropContractor" />
          </div>
        </div>
        <div className="filter-sep" />
        <div className="filter-group">
          <span className="filter-label">Категория</span>
          <div className="multi-wrap" id="wrapCategory">
            <div className="multi-btn" id="btnCategory">
              <span id="lblCategory">Все</span><span className="multi-badge" id="badgeCategory" style={{ display: 'none' }} />
              <span style={{ color: 'var(--muted)', fontSize: 9 }}>▾</span>
            </div>
            <div className="multi-dropdown" id="dropCategory" />
          </div>
        </div>
        <div className="filter-sep" />
        <button className="btn-reset" id="btnReset">↺ Сбросить</button>
        <div className="header-pulse" style={{ marginLeft: 'auto' }}><span className="pulse-dot" />Данные обновлены</div>
        <div className="header-date" id="hdate">—</div>
        <div className="filter-chips" id="filterChips" />
      </div>

      <nav className="dash-nav">
        <div className="nav-tab active"><span className="tab-dot" style={{ background: 'var(--yellow)' }} />Финансы и штрафы</div>
        <div className="nav-tab"><span className="tab-dot" style={{ background: 'var(--red)' }} />Нарушения</div>
        <div className="nav-tab"><span className="tab-dot" style={{ background: 'var(--blue2)' }} />Претензии (ДПР)</div>
        <div className="nav-tab"><span className="tab-dot" style={{ background: 'var(--green)' }} />Мероприятия</div>
        <div className="nav-tab"><span className="tab-dot" style={{ background: 'var(--orange)' }} />Мотивация</div>
        <div className="nav-tab"><span className="tab-dot" style={{ background: 'var(--purple)' }} />Рейтинг</div>
      </nav>

      <div className="dash-main">
        <section className="section active" id="tab-0">
          <div className="kpi-row" id="kpi-finance" />
          <p className="dash-section-title">Блок 1 — Финансы и штрафы</p>
          <div className="grid grid-2 mb">
            <div className="dash-card"><div className="card-header"><div className="card-title">Финансовая воронка претензий</div><span className="card-num">#1 Bar</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c1" /></div></div>
            <div className="dash-card"><div className="card-header"><div className="card-title">Непокрытые штрафы по подрядчикам</div><span className="card-num">#2 H-Bar</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c2" /></div></div>
          </div>
          <div className="grid grid-2">
            <div className="dash-card"><div className="card-header"><div className="card-title">Динамика выставленных vs. принятых</div><span className="card-num">#3 Line</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c3" /></div></div>
            <div className="dash-card"><div className="card-header"><div className="card-title">Стоимость проактива vs. штрафы</div><span className="card-num">#4 Grouped Bar</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c4" /></div></div>
          </div>
        </section>

        <section className="section" id="tab-1">
          <div className="kpi-row" id="kpi-viol" />
          <p className="dash-section-title">Блок 2 — Нарушения</p>
          <div className="grid grid-2 mb">
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--red)' }}><div className="card-header"><div className="card-title">Нарушения по категориям</div><span className="card-num">#5 Donut</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c5" /></div></div>
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--red)' }}><div className="card-header"><div className="card-title">Динамика нарушений по времени</div><span className="card-num">#6 Stacked Bar</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c6" /></div></div>
          </div>
          <div className="grid grid-2 mb">
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--red)' }}><div className="card-header"><div className="card-title">Нарушения по подрядчикам</div><span className="card-num">#7 H-Stacked</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c7" /></div></div>
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--red)' }}><div className="card-header"><div className="card-title">Статус нарушений</div><span className="card-num">#8 Bar</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c8" /></div></div>
          </div>
          <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--red)' }}><div className="card-header"><div className="card-title">НПВ по нарушениям</div><span className="card-num">#9 H-Bar</span></div><div style={{ position: 'relative', height: 200 }}><canvas id="c9" /></div></div>
        </section>

        <section className="section" id="tab-2">
          <div className="kpi-row" id="kpi-dpr" />
          <p className="dash-section-title">Блок 3 — Претензионная работа (ДПР)</p>
          <div className="grid grid-2 mb">
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--blue2)' }}><div className="card-header"><div className="card-title">Распределение ДПР по статусам</div><span className="card-num">#10 Donut</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c10" /></div></div>
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--blue2)' }}><div className="card-header"><div className="card-title">Просрочка ответа по ДПР (дней)</div><span className="card-num">#11 H-Bar</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c11" /></div></div>
          </div>
          <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--blue2)' }}><div className="card-header"><div className="card-title">ДПР, переданные в суд</div><span className="card-num">#12 Grouped + Dual Axis</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c12" /></div></div>
        </section>

        <section className="section" id="tab-3">
          <div className="kpi-row" id="kpi-act" />
          <p className="dash-section-title">Блок 4 — Мероприятия</p>
          <div className="grid grid-2 mb">
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--green)' }}><div className="card-header"><div className="card-title">Исполнение: план vs. факт</div><span className="card-num">#13 Stacked Bar</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c13" /></div></div>
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--green)' }}><div className="card-header"><div className="card-title">Просроченные мероприятия</div><span className="card-num">#14 H-Bar</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c14" /></div></div>
          </div>
          <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--green)' }}><div className="card-header"><div className="card-title">Мероприятия по нарушениям ТОП-12</div><span className="card-num">#15 Bar</span></div><div style={{ position: 'relative', height: 200 }}><canvas id="c15" /></div></div>
        </section>

        <section className="section" id="tab-4">
          <div className="kpi-row" id="kpi-motiv" />
          <p className="dash-section-title">Блок 5 — Мотивация по актам выполненных работ</p>
          <div className="subsection-note">
            <strong>Источник данных:</strong> акты выполненных работ. Известны вид услуги, сумма мотивации, подрядчик. <strong>Связки с нарушениями нет</strong> — кроме услуги «эксплуатационное бурение».
          </div>
          <div className="grid grid-2 mb">
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--orange)' }}><div className="card-header"><div className="card-title">Структура мотивации по видам услуг</div><span className="card-num">#19 Donut</span></div><div style={{ position: 'relative', height: 240 }}><canvas id="c19" /></div></div>
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--orange)' }}><div className="card-header"><div className="card-title">Сумма выплаченной мотивации по подрядчикам</div><span className="card-num">#20 H-Bar</span></div><div style={{ position: 'relative', height: 240 }}><canvas id="c20" /></div></div>
          </div>
          <div className="dash-card mb" style={{ ['--card-accent' as any]: 'var(--orange)' }}><div className="card-header"><div className="card-title">Динамика выплат мотивации по месяцам</div><span className="card-num">#21 Stacked Line</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c21" /></div></div>
          <p className="subsection-title">Эксплуатационное бурение<span className="subsection-badge">⚡ Связка с критичными нарушениями</span></p>
          <div className="grid grid-2 mb">
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--orange)' }}><div className="card-header"><div className="card-title">Мотивация vs. критичные нарушения (по подрядчикам)</div><span className="card-num">#22 Dual Axis</span></div><div style={{ position: 'relative', height: 240 }}><canvas id="c22" /></div></div>
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--orange)' }}><div className="card-header"><div className="card-title">Мотивация при наличии критичных нарушений</div><span className="card-num">#23 Stacked H-Bar</span></div><div style={{ position: 'relative', height: 240 }}><canvas id="c23" /></div></div>
          </div>
          <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--orange)' }}><div className="card-header"><div className="card-title">Динамика: мотивация и критичные нарушения по месяцам</div><span className="card-num">#24 Dual Axis Line</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c24" /></div></div>
        </section>

        <section className="section" id="tab-5">
          <p className="dash-section-title">Блок 6 — Рейтинг подрядчиков</p>
          <div className="dash-card mb" style={{ ['--card-accent' as any]: 'var(--purple)' }}>
            <div className="card-header"><div className="card-title">Рейтинговая таблица подрядчиков</div><span className="card-num">#16 Table</span></div>
            <div style={{ overflowX: 'auto' }}><table className="rating-table" id="ratingTable" /></div>
          </div>
          <div className="grid grid-2">
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--purple)' }}><div className="card-header"><div className="card-title">Динамика нарушений по подрядчику (кварталы)</div><span className="card-num">#17 Line</span></div><div style={{ position: 'relative', height: 250 }}><canvas id="c17" /></div></div>
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--purple)' }}><div className="card-header"><div className="card-title">Доля принятых претензий по подрядчику</div><span className="card-num">#18 H-Bar</span></div><div style={{ position: 'relative', height: 250 }}><canvas id="c18" /></div><div className="threshold-label">— красная линия: порог 70%</div></div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContractsIndicators;
