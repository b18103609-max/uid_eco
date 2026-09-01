import type { AnalyticsFilters } from '../filters.ts';
import type { IndicatorContract } from '../data/indicatorsData.ts';

export const filterIndicatorContracts = (items: readonly IndicatorContract[], filters: AnalyticsFilters) => items.filter(item => (
  (filters.subsidiary === 'all' || item.subsidiary === filters.subsidiary)
  && (filters.service === 'all' || item.service === filters.service)
  && (filters.contractor === 'all' || item.contractor === filters.contractor)
  && (filters.kt777Services.length === 0 || filters.kt777Services.includes(item.kt777))
  && (filters.contractIds.length === 0 || filters.contractIds.includes(item.id))
  && (filters.portfolios.length === 0 || filters.portfolios.includes(item.portfolio))
));

const average = (values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
const sumMoney = (values: number[]) => Math.round(values.reduce((sum, value) => sum + value, 0) * 10) / 10;

export const summarizeIndicators = (items: readonly IndicatorContract[]) => ({
  contracts: items.length,
  amountMln: items.reduce((sum, item) => sum + item.amountMln, 0),
  attentionShare: items.length ? items.filter(item => item.critical || item.risk === 'Высокий').length / items.length * 100 : 0,
  physicalPercent: average(items.map(item => item.physicalPercent)),
  financePercent: average(items.map(item => item.financePercent)),
  oedkScore: average(items.map(item => item.oedkScore)),
  sanctionsBilledMln: sumMoney(items.map(item => item.sanctionsBilledMln)),
  sanctionsPaidMln: sumMoney(items.map(item => item.sanctionsPaidMln)),
  motivationMln: sumMoney(items.map(item => item.motivationMln)),
});
