import type { AnalyticsFilters } from '../filters.ts';
import type { OverviewRecord } from '../data/overviewData.ts';

export const filterOverviewRecords = (records: readonly OverviewRecord[], filters: AnalyticsFilters) => records.filter(item => (
  (filters.subsidiary === 'all' || item.subsidiary === filters.subsidiary)
  && (filters.service === 'all' || item.service === filters.service)
  && (filters.contractor === 'all' || item.contractor === filters.contractor)
));

export const summarizeOverview = (records: readonly OverviewRecord[]) => records.reduce((result, item) => ({
  criticalAndHighRiskContracts: result.criticalAndHighRiskContracts + item.contracts.critical + item.contracts.highRisk,
  redAndYellowBrigades: result.redAndYellowBrigades + item.ratingZones.red + item.ratingZones.yellow,
  criticalBreaches: result.criticalBreaches + item.breaches.critical,
  dprDeviation: result.dprDeviation + item.dprDeviation,
  addendumDeviation: result.addendumDeviation + item.addendumDeviation,
}), {
  criticalAndHighRiskContracts: 0,
  redAndYellowBrigades: 0,
  criticalBreaches: 0,
  dprDeviation: 0,
  addendumDeviation: 0,
});
