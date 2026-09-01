import { useState } from 'react';
import { filterIndicatorContracts, summarizeIndicators } from '../calculations/indicators.ts';
import { INDICATOR_CONTRACTS } from '../data/indicatorsData.ts';
import type { AnalyticsFilters } from '../filters.ts';
import './indicators.css';

const format = (value: number, digits = 0) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: digits }).format(value);

export const IndicatorsDashboard = ({ filters, onOpenContract }: { filters: AnalyticsFilters; onOpenContract: () => void }) => {
  const contracts = filterIndicatorContracts(INDICATOR_CONTRACTS, filters);
  const summary = summarizeIndicators(contracts);
  const [selectedZone, setSelectedZone] = useState<string>('Все зоны');
  const details = selectedZone === 'Все зоны' ? contracts : contracts.filter(item => item.oedkZone === selectedZone);
  const kpis = [
    ['Договоры в выборке', format(summary.contracts), 'шт.'],
    ['Сумма с учётом ДС', format(summary.amountMln), 'млн ₽'],
    ['Критичные / высокий риск', format(summary.attentionShare), '% выборки'],
    ['Физический план', format(summary.physicalPercent), '% выполнения'],
    ['Финансовый план', format(summary.financePercent), '% освоения'],
    ['ОЭДК подрядчика', format(summary.oedkScore, 1), 'среднее, расчётная метрика'],
  ];

  if (!contracts.length) return <section className="analytics-empty"><h2>По выбранным фильтрам нет договоров</h2><p>Измените ДО, услугу или подрядчика.</p></section>;

  const zones = ['Красная', 'Жёлтая', 'Зелёная'] as const;
  return <div className="indicators-dashboard">
    <section className="indicators-kpis">{kpis.map(([label, value, unit]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>{unit}</small></article>)}</section>
    <section className="indicators-main">
      <article className="indicator-card"><header><h2>Как выполняются физический и финансовый планы?</h2><span>Готовые проценты формы ИДП по договорам</span></header><div className="plan-chart">{contracts.map(item => <button key={item.id} onClick={onOpenContract}><span>{item.number}</span><div><label>Физический<i><b style={{ width: `${Math.min(item.physicalPercent, 100)}%` }} /></i><em>{item.physicalPercent}%</em></label><label>Финансовый<i><b style={{ width: `${Math.min(item.financePercent, 100)}%` }} /></i><em>{item.financePercent}%</em></label></div></button>)}</div></article>
      <aside className="indicator-attention"><header><h2>Договоры с прямыми признаками внимания</h2><span>Критичность, высокий риск или происшествие</span></header>{contracts.filter(item => item.critical || item.risk === 'Высокий' || item.incident !== 'Нет').slice(0, 5).map(item => <button key={item.id} onClick={onOpenContract}><strong>{item.number}</strong><span>{item.critical ? 'Критичный договор' : `Риск ПБ: ${item.risk}`}</span><small>{item.contractor} · {item.incident !== 'Нет' ? `Происшествие: ${item.incident.toLowerCase()}` : item.service}</small></button>)}</aside>
    </section>
    <section className="indicators-secondary">
      <article className="indicator-card"><header><h2>Как договоры распределены по ОЭДК?</h2><span>Нажмите на зону для расшифровки</span></header><div className="oedk-zones">{zones.map(zone => { const zoneItems = contracts.filter(item => item.oedkZone === zone); return <button key={zone} className={`oedk-zone oedk-zone--${zone.toLowerCase()}${selectedZone === zone ? ' oedk-zone--selected' : ''}`} onClick={() => setSelectedZone(zone)}><span>{zone} зона</span><strong>{zoneItems.length}</strong><small>{format(zoneItems.reduce((sum, item) => sum + item.amountMln, 0))} млн ₽</small></button>})}</div></article>
      <article className="indicator-card"><header><h2>Какие меры применены по договорам?</h2><span>Суммы по прямым колонкам формы ИДП</span></header><div className="impact-summary"><div><span>Выставлено санкций</span><strong>{format(summary.sanctionsBilledMln, 1)} млн ₽</strong></div><div><span>Оплачено санкций</span><strong>{format(summary.sanctionsPaidMln, 1)} млн ₽</strong></div><div><span>Начислена мотивация</span><strong>{format(summary.motivationMln, 1)} млн ₽</strong></div></div></article>
    </section>
    <section className="segment-details"><header><div><h2>Расшифровка: {selectedZone.toLowerCase()}</h2><span>До пяти договоров, сформировавших выбранный сегмент</span></div>{selectedZone !== 'Все зоны' && <button onClick={() => setSelectedZone('Все зоны')}>Показать все зоны</button>}</header><div>{details.slice(0, 5).map(item => <article key={item.id}><strong>{item.number}</strong><span>{item.contractor}</span><small>ОЭДК {item.oedkScore} · {item.oedkZone.toLowerCase()} зона · риск {item.risk.toLowerCase()}</small><button onClick={onOpenContract}>Открыть договор</button></article>)}</div></section>
  </div>;
};
