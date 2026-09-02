export const ANALYTICS_PAGES = [
  { id: 'overview', path: '/tdk/analytics', label: 'Фокус внимания', title: 'Фокус внимания', description: 'Критические сигналы, очередь действий и состояние портфеля на выбранную дату.' },
  { id: 'indicators', path: '/tdk/analytics/indicators', label: 'Договоры', title: 'Договоры', description: 'Портфель договоров, объёмы, освоение, ОЭДК и мотивация подрядных организаций.' },
  { id: 'rating', path: '/tdk/analytics/rating', label: 'Флагман', title: 'Флагман', description: 'Официальные срезы рейтинга и нарушения ПБ по функциям Бурение и ТКРС.' },
  { id: 'safety', path: '/tdk/analytics/safety', label: 'Договорные нарушения', title: 'Договорные нарушения', description: 'События, статусы, повторяемость и связи с ДПР и ПКМ.' },
  { id: 'pcm', path: '/tdk/analytics/pcm', label: 'ПКМ', title: 'Предупреждающие и корректирующие мероприятия', description: 'Контроль мероприятий, сроков, статусов и связей с нарушениями.' },
  { id: 'preclaim', path: '/tdk/analytics/preclaim', label: 'ДПР', title: 'Допретензионная работа', description: 'Статусы допретензионной работы, суммы и сроки урегулирования.' },
  { id: 'addendums', path: '/tdk/analytics/addendums', label: 'Допсоглашения', title: 'Дополнительные соглашения', description: 'Изменения условий договоров и их влияние на сроки и стоимость.' },
  { id: 'reports', path: '/tdk/analytics/reports', label: 'Отчёты', title: 'Витрина отчётов', description: 'Доступ к согласованным формам и аналитическим отчётам.' },
] as const;

export type AnalyticsPageId = typeof ANALYTICS_PAGES[number]['id'];
export const ANALYTICS_NAV_PAGES = ANALYTICS_PAGES.filter(page => page.id !== 'addendums');

export const ANALYTICS_BASE_PATH = '/uid_eco';

const trimTrailingSlash = (path: string) => path.length > 1 ? path.replace(/\/+$/, '') : path;

export const stripAppBase = (pathname: string, appBase = ANALYTICS_BASE_PATH) => {
  const normalizedBase = trimTrailingSlash(appBase);
  if (normalizedBase && pathname.startsWith(`${normalizedBase}/`)) {
    return pathname.slice(normalizedBase.length);
  }
  if (pathname === normalizedBase) return '/';
  return pathname;
};

export const parseAnalyticsPath = (
  pathname: string,
  appBase = ANALYTICS_BASE_PATH,
): AnalyticsPageId | undefined => {
  const appPath = trimTrailingSlash(stripAppBase(pathname, appBase));
  return ANALYTICS_PAGES.find(page => page.path === appPath)?.id;
};

export const getAnalyticsPage = (id: AnalyticsPageId) => (
  ANALYTICS_PAGES.find(page => page.id === id)!
);

export const analyticsBrowserPath = (
  id: AnalyticsPageId,
  appBase = ANALYTICS_BASE_PATH,
) => `${trimTrailingSlash(appBase)}${getAnalyticsPage(id).path}`;

export const appHomePath = (appBase = ANALYTICS_BASE_PATH) => `${trimTrailingSlash(appBase)}/`;
