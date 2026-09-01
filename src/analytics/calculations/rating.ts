import type { AnalyticsFilters } from '../filters.ts';
import type { RatingRecord, RatingZone } from '../data/ratingData.ts';
export const filterRatings = (items: readonly RatingRecord[], filters: AnalyticsFilters) => items.filter(item => (filters.subsidiary === 'all' || item.subsidiary === filters.subsidiary) && (filters.service === 'all' || item.service === filters.service) && (filters.contractor === 'all' || item.contractor === filters.contractor));
const rank: Record<RatingZone, number> = { 'Красная': 0, 'Жёлтая': 1, 'Зелёная': 2 };
export const summarizeRating = (items: readonly RatingRecord[]) => {
  const latestPeriod = items[items.length - 1]?.period;
  const latest = items.filter(item => item.period === latestPeriod);
  const transitions = latest.map(current => {
    const history = items.filter(item => item.brigade === current.brigade);
    return { current, previous: history[history.length - 2] as RatingRecord | undefined };
  }).filter((item): item is { current: RatingRecord; previous: RatingRecord } => Boolean(item.previous));
  return { average: latest.length ? latest.reduce((sum, item) => sum + item.score, 0) / latest.length : 0, zones: { red: latest.filter(item => item.zone === 'Красная').length, yellow: latest.filter(item => item.zone === 'Жёлтая').length, green: latest.filter(item => item.zone === 'Зелёная').length }, worse: transitions.filter(item => rank[item.current.zone] < rank[item.previous.zone]).length, better: transitions.filter(item => rank[item.current.zone] > rank[item.previous.zone]).length, stopFactors: latest.filter(item => item.stopFactor).length, preliminary: latest.filter(item => item.preliminary).length };
};
