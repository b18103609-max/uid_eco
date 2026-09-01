import type { AnalyticsFilters } from '../filters.ts';
import { DEFAULT_ANALYTICS_FILTERS } from '../filters.ts';
import { OVERVIEW_OPTIONS } from '../data/overviewData.ts';
import './overview.css';

const ALL = 'Все';

export const GlobalFilterBar = ({
  filters,
  onChange,
}: {
  filters: AnalyticsFilters;
  onChange: (filters: AnalyticsFilters) => void;
}) => {
  const set = (key: keyof AnalyticsFilters, value: string) => onChange({ ...filters, [key]: value });
  const active = [
    filters.subsidiary !== 'all' ? ['subsidiary', filters.subsidiary] : undefined,
    filters.service !== 'all' ? ['service', filters.service] : undefined,
    filters.contractor !== 'all' ? ['contractor', filters.contractor] : undefined,
  ].filter(Boolean) as [keyof AnalyticsFilters, string][];

  return (
    <section className="global-filters" aria-label="Общие фильтры аналитики">
      <div className="global-filters__fields">
        <label>Период<select value={filters.period} onChange={event => set('period', event.target.value)}><option value="2026-Q3">III квартал 2026</option><option value="2026-Q2">II квартал 2026</option><option value="2026">2026 год</option></select></label>
        <label>Сравнение<select value={filters.compare} onChange={event => set('compare', event.target.value)}><option value="previous">Предыдущий период</option><option value="last-year">Год к году</option><option value="none">Без сравнения</option></select></label>
        <label>ДО<select value={filters.subsidiary} onChange={event => set('subsidiary', event.target.value)}><option value="all">{ALL}</option>{OVERVIEW_OPTIONS.subsidiaries.map(item => <option key={item}>{item}</option>)}</select></label>
        <label>Сектор / услуга<select value={filters.service} onChange={event => set('service', event.target.value)}><option value="all">{ALL}</option>{OVERVIEW_OPTIONS.services.map(item => <option key={item}>{item}</option>)}</select></label>
        <label>Подрядчик<select value={filters.contractor} onChange={event => set('contractor', event.target.value)}><option value="all">{ALL}</option>{OVERVIEW_OPTIONS.contractors.map(item => <option key={item}>{item}</option>)}</select></label>
        <button className="global-filters__reset" onClick={() => onChange(DEFAULT_ANALYTICS_FILTERS)}>Сбросить все</button>
      </div>
      {active.length > 0 && <div className="global-filters__chips">{active.map(([key, value]) => <button key={key} onClick={() => set(key, 'all')}>{value} ×</button>)}</div>}
    </section>
  );
};
