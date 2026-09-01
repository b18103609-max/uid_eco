import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ANALYTICS_PAGES,
  analyticsBrowserPath,
  appHomePath,
  parseAnalyticsPath,
  stripAppBase,
} from '../src/analytics/routing.ts';

test('каждая аналитическая страница имеет уникальный маршрут и разбирается обратно', () => {
  const paths = ANALYTICS_PAGES.map(page => page.path);
  assert.equal(new Set(paths).size, ANALYTICS_PAGES.length);

  for (const page of ANALYTICS_PAGES) {
    const browserPath = analyticsBrowserPath(page.id);
    assert.equal(parseAnalyticsPath(browserPath), page.id);
    assert.equal(parseAnalyticsPath(`${browserPath}/`), page.id);
  }
});

test('маршруты работают как с базой GitHub Pages, так и без неё', () => {
  assert.equal(parseAnalyticsPath('/tdk/analytics', ''), 'overview');
  assert.equal(parseAnalyticsPath('/uid_eco/tdk/analytics/reports'), 'reports');
  assert.equal(stripAppBase('/uid_eco/tdk/analytics/pcm'), '/tdk/analytics/pcm');
});

test('неаналитический адрес не распознаётся как аналитика', () => {
  assert.equal(parseAnalyticsPath('/uid_eco/'), undefined);
  assert.equal(parseAnalyticsPath('/uid_eco/contracts'), undefined);
  assert.equal(appHomePath(), '/uid_eco/');
});
