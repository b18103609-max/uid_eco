export type AnalyticsFilters = {
  date: string;
  subsidiary: string;
  service: string;
  kt777Services: string[];
  contractor: string;
  contractIds: string[];
  portfolios: string[];
};

export const DEFAULT_ANALYTICS_FILTERS: AnalyticsFilters = {
  date: '2026-09-01',
  subsidiary: 'all',
  service: 'all',
  kt777Services: [],
  contractor: 'all',
  contractIds: [],
  portfolios: [],
};
