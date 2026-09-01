import type { AnalyticsFilters } from '../filters.ts';
import { DEFAULT_ANALYTICS_FILTERS } from '../filters.ts';
import { OVERVIEW_OPTIONS } from '../data/overviewData.ts';
import { INDICATOR_CONTRACTS } from '../data/indicatorsData.ts';
import './overview.css';

const toggle = (items: string[], value: string) => items.includes(value) ? items.filter(item => item !== value) : [...items, value];

export const GlobalFilterBar = ({ filters, onChange }: { filters: AnalyticsFilters; onChange: (filters: AnalyticsFilters) => void }) => {
  const set = <K extends keyof AnalyticsFilters>(key: K, value: AnalyticsFilters[K]) => onChange({ ...filters, [key]: value });
  const groups = [...new Set(INDICATOR_CONTRACTS.map(item => item.service))];
  const kt777 = [...new Set(INDICATOR_CONTRACTS.filter(item => filters.service === 'all' || item.service === filters.service).map(item => item.kt777))];
  const availableContracts = INDICATOR_CONTRACTS.filter(item => (filters.subsidiary === 'all' || item.subsidiary === filters.subsidiary) && (filters.service === 'all' || item.service === filters.service) && (filters.contractor === 'all' || item.contractor === filters.contractor));
  const activeCount = filters.kt777Services.length + filters.contractIds.length + filters.portfolios.length;
  return <section className="global-filters" aria-label="Общие фильтры аналитики"><div className="global-filters__fields">
    <label>Дата данных<input type="date" value={filters.date} onChange={event => set('date', event.target.value)} /></label>
    <label>ДО<select value={filters.subsidiary} onChange={event => set('subsidiary', event.target.value)}><option value="all">Все</option>{OVERVIEW_OPTIONS.subsidiaries.map(item => <option key={item}>{item}</option>)}</select></label>
    <label>Группа услуг<select value={filters.service} onChange={event => onChange({ ...filters, service: event.target.value, kt777Services: [] })}><option value="all">Все</option>{groups.map(item => <option key={item}>{item}</option>)}</select></label>
    <details className="global-filters__multi"><summary>Услуги КТ-777 <b>{filters.kt777Services.length || 'Все'}</b></summary><div>{kt777.map(item => <label key={item}><input type="checkbox" checked={filters.kt777Services.includes(item)} onChange={() => set('kt777Services', toggle(filters.kt777Services, item))}/>{item}</label>)}</div></details>
    <details className="global-filters__multi"><summary>Договоры <b>{filters.contractIds.length || 'Все'}</b></summary><div>{availableContracts.map(item => <label key={item.id}><input type="checkbox" checked={filters.contractIds.includes(item.id)} onChange={() => set('contractIds', toggle(filters.contractIds, item.id))}/>{item.number} · {item.contractor}</label>)}</div></details>
    <label>Подрядчик<select value={filters.contractor} onChange={event => set('contractor', event.target.value)}><option value="all">Все</option>{OVERVIEW_OPTIONS.contractors.map(item => <option key={item}>{item}</option>)}</select></label>
    <details className="global-filters__multi global-filters__multi--small"><summary>Перечень <b>{filters.portfolios.length || 'Все'}</b></summary><div>{['П-1','П-2'].map(item => <label key={item}><input type="checkbox" checked={filters.portfolios.includes(item)} onChange={() => set('portfolios', toggle(filters.portfolios,item))}/>{item}</label>)}</div></details>
    <button className="global-filters__reset" onClick={() => onChange(DEFAULT_ANALYTICS_FILTERS)}>Сбросить</button>
  </div>{activeCount > 0 && <div className="global-filters__chips"><span>Выбрано: КТ-777 — {filters.kt777Services.length || 'все'}, договоров — {filters.contractIds.length || 'все'}, перечней — {filters.portfolios.length || 'все'}</span></div>}</section>;
};
