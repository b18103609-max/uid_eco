export type MetricSource = 'FMD-CONTRACTS' | 'FORM-IDP' | 'FORM-DPR' | 'FORM-DS';

export type DataStateKind =
  | 'actual'
  | 'delayed'
  | 'partial'
  | 'loading'
  | 'empty'
  | 'error'
  | 'preliminary';

export type DataFreshness = {
  source: MetricSource;
  state: Extract<DataStateKind, 'actual' | 'delayed' | 'partial'>;
  lastSuccessfulLoad: string;
  completeness: number;
  warning?: string;
};

export const DATA_FRESHNESS: Record<MetricSource, DataFreshness> = {
  'FMD-CONTRACTS': {
    source: 'FMD-CONTRACTS',
    state: 'actual',
    lastSuccessfulLoad: '2026-08-31T06:00:00+03:00',
    completeness: 100,
  },
  'FORM-IDP': {
    source: 'FORM-IDP',
    state: 'partial',
    lastSuccessfulLoad: '2026-08-30T21:15:00+03:00',
    completeness: 92,
    warning: 'Не загружены акты по одному дочернему обществу.',
  },
  'FORM-DPR': {
    source: 'FORM-DPR',
    state: 'delayed',
    lastSuccessfulLoad: '2026-08-29T23:40:00+03:00',
    completeness: 100,
    warning: 'Обновление FORM-DPR задерживается.',
  },
  'FORM-DS': {
    source: 'FORM-DS',
    state: 'delayed',
    lastSuccessfulLoad: '2026-08-29T18:10:00+03:00',
    completeness: 100,
    warning: 'Обновление FORM-DS задерживается.',
  },
};

const STATE_PRIORITY: Record<DataFreshness['state'], number> = {
  actual: 0,
  delayed: 1,
  partial: 2,
};

export const combineDataFreshness = (
  items: readonly DataFreshness[],
): DataFreshness => {
  if (items.length === 0) {
    throw new Error('Для расчёта свежести нужен хотя бы один источник.');
  }

  const worst = [...items].sort((a, b) => STATE_PRIORITY[b.state] - STATE_PRIORITY[a.state])[0];
  const oldest = [...items].sort(
    (a, b) => Date.parse(a.lastSuccessfulLoad) - Date.parse(b.lastSuccessfulLoad),
  )[0];
  const completeness = Math.min(...items.map(item => item.completeness));
  const warnings = items.flatMap(item => item.warning ? [item.warning] : []);

  return {
    ...worst,
    lastSuccessfulLoad: oldest.lastSuccessfulLoad,
    completeness,
    warning: warnings.join(' '),
  };
};

export const formatFreshnessDate = (isoDate: string) => new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Moscow',
}).format(new Date(isoDate));

export const parseDataStateOverride = (search: string): DataStateKind | undefined => {
  const value = new URLSearchParams(search).get('dataState');
  const allowed: DataStateKind[] = ['actual', 'delayed', 'partial', 'loading', 'empty', 'error', 'preliminary'];
  return allowed.includes(value as DataStateKind) ? value as DataStateKind : undefined;
};

export const isBlockingDataState = (state: DataStateKind) => (
  state === 'loading' || state === 'empty' || state === 'error'
);
