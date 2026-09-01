import assert from 'node:assert/strict';
import test from 'node:test';
import { filterOverviewRecords, summarizeOverview } from '../src/analytics/calculations/overview.ts';
import { OVERVIEW_RECORDS } from '../src/analytics/data/overviewData.ts';
import { DEFAULT_ANALYTICS_FILTERS } from '../src/analytics/filters.ts';

test('обзор считает только подтверждаемые показатели из выбранного периметра', () => {
  const summary = summarizeOverview(OVERVIEW_RECORDS.slice(0, 1));
  assert.deepEqual(summary, {
    criticalAndHighRiskContracts: 3,
    redAndYellowBrigades: 3,
    criticalBreaches: 3,
    dprDeviation: 2,
    addendumDeviation: 1,
  });
  assert.equal('overduePcm' in summary, false);
});

test('общие фильтры одновременно ограничивают ДО, услугу и подрядчика', () => {
  const selected = filterOverviewRecords(OVERVIEW_RECORDS, {
    ...DEFAULT_ANALYTICS_FILTERS,
    subsidiary: 'ГПН-Ямал',
    service: 'ТКРС',
    contractor: 'БетаГрупп',
  });
  assert.equal(selected.length, 1);
  assert.equal(selected[0].contractor, 'БетаГрупп');
});
