export type AnalyticsFilters = {
  period: string;
  compare: string;
  subsidiary: string;
  service: string;
  contractor: string;
};

export const DEFAULT_ANALYTICS_FILTERS: AnalyticsFilters = {
  period: '2026-Q3',
  compare: 'previous',
  subsidiary: 'all',
  service: 'all',
  contractor: 'all',
};
