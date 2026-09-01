import { filterOverviewRecords, summarizeOverview } from '../calculations/overview.ts';
import { OVERVIEW_RECORDS } from '../data/overviewData.ts';
import type { AnalyticsFilters } from '../filters.ts';
import type { AnalyticsPageId } from '../routing.ts';
import './overview.css';

const total = (values: number[]) => values.reduce((sum, value) => sum + value, 0);

export const OverviewDashboard = ({ filters, onNavigate }: { filters: AnalyticsFilters; onNavigate: (page: AnalyticsPageId) => void }) => {
  const rows = filterOverviewRecords(OVERVIEW_RECORDS, filters);
  const summary = summarizeOverview(rows);
  const kpis: { label: string; value: number; note: string; page: AnalyticsPageId }[] = [
    { label: 'Критичные и высокорисковые договоры', value: summary.criticalAndHighRiskContracts, note: 'критичность + высокий риск ПБ', page: 'indicators' },
    { label: 'Бригады в красной и жёлтой зоне', value: summary.redAndYellowBrigades, note: 'по переданному цвету рейтинга', page: 'rating' },
    { label: 'Критические нарушения рейтинга ПБ', value: summary.criticalBreaches, note: 'ВА, ВК и прочие нарушения', page: 'safety' },
    { label: 'Случаи ДПР с отклонением', value: summary.dprDeviation, note: 'от нормативного срока', page: 'preclaim' },
    { label: 'Стандартные отчёты', value: 5, note: 'включая реестр допсоглашений', page: 'reports' },
  ];
  const riskGroups = Object.values(rows.reduce<Record<string, { subsidiary: string; highRisk: number; mediumRisk: number; lowRisk: number }>>((groups, row) => {
    const current = groups[row.subsidiary] || { subsidiary: row.subsidiary, highRisk: 0, mediumRisk: 0, lowRisk: 0 };
    current.highRisk += row.contracts.highRisk;
    current.mediumRisk += row.contracts.mediumRisk;
    current.lowRisk += row.contracts.lowRisk;
    groups[row.subsidiary] = current;
    return groups;
  }, {}));
  const riskMax = Math.max(1, ...riskGroups.map(group => total([group.highRisk, group.mediumRisk, group.lowRisk])));

  if (rows.length === 0) return <section className="analytics-empty"><h2>По выбранным фильтрам нет данных</h2><p>Сбросьте один или несколько фильтров, чтобы расширить периметр.</p></section>;

  return (
    <div className="overview-dashboard">
      <section className="overview-kpis">{kpis.map(kpi => <button key={kpi.label} onClick={() => onNavigate(kpi.page)}><span>{kpi.label}</span><strong>{kpi.value}</strong><small>{kpi.note}</small><em>Открыть раздел →</em></button>)}</section>
      <section className="overview-main">
        <article className="overview-chart overview-chart--risk"><header><h2>Как распределены договоры по уровню риска ПБ?</h2><span>Расчёт по подтверждённым категориям риска</span></header><div className="risk-bars">{riskGroups.map(group => { const count = total([group.highRisk, group.mediumRisk, group.lowRisk]); return <button key={group.subsidiary} onClick={() => onNavigate('indicators')} title={`${group.subsidiary}: ${count} договоров`}><span>{group.subsidiary}</span><div style={{ width: `${Math.max(18, count / riskMax * 100)}%` }}><i style={{ flex: group.highRisk }} className="risk-high" /><i style={{ flex: group.mediumRisk }} className="risk-medium" /><i style={{ flex: group.lowRisk }} className="risk-low" /></div><b>{count}</b></button>})}</div><footer><span><i className="risk-high" />Высокий</span><span><i className="risk-medium" />Средний</span><span><i className="risk-low" />Низкий</span></footer></article>
        <aside className="attention-panel"><header><h2>Требует внимания</h2><span>Без сводного приоритета</span></header>{rows.filter(row => row.contracts.critical || row.dprDeviation || row.addendumDeviation).slice(0, 5).map(row => <button key={row.contractor} onClick={() => onNavigate(row.contracts.critical ? 'indicators' : 'preclaim')}><strong>{row.contractor}</strong><span>{row.contracts.critical ? `Критичные договоры: ${row.contracts.critical}` : `ДПР с отклонением: ${row.dprDeviation}`}</span><small>{row.subsidiary} · {row.service}</small></button>)}</aside>
      </section>
      <section className="overview-secondary">
        <article className="overview-chart"><header><h2>Как меняется распределение бригад по зонам?</h2><span>Предыдущий и выбранный периоды</span></header><div className="zone-compare">{(['ratingZonesPrevious', 'ratingZones'] as const).map((key, index) => { const zones = rows.reduce((acc, row) => ({ red: acc.red + row[key].red, yellow: acc.yellow + row[key].yellow, green: acc.green + row[key].green }), { red: 0, yellow: 0, green: 0 }); const sum = total(Object.values(zones)); return <div key={key}><span>{index ? 'III кв. 2026' : 'II кв. 2026'}</span><div><i className="zone-red" style={{ width: `${zones.red / sum * 100}%` }}>{zones.red}</i><i className="zone-yellow" style={{ width: `${zones.yellow / sum * 100}%` }}>{zones.yellow}</i><i className="zone-green" style={{ width: `${zones.green / sum * 100}%` }}>{zones.green}</i></div></div>})}</div></article>
        <article className="overview-chart"><header><h2>Как распределены нарушения рейтинга по тяжести?</h2><span>В выбранном периметре</span></header><div className="breach-bars">{(['critical', 'significant', 'minor'] as const).map(key => { const value = rows.reduce((sum, row) => sum + row.breaches[key], 0); return <div key={key}><span>{{ critical: 'Критические', significant: 'Значительные', minor: 'Незначительные' }[key]}</span><div><i className={`breach-${key}`} style={{ width: `${value / Math.max(...(['critical', 'significant', 'minor'] as const).map(item => rows.reduce((sum, row) => sum + row.breaches[item], 0))) * 100}%` }} /></div><b>{value}</b></div>})}</div></article>
      </section>
    </div>
  );
};
