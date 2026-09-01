import assert from 'node:assert/strict';
import test from 'node:test';
import { filterIndicatorContracts, summarizeIndicators } from '../src/analytics/calculations/indicators.ts';
import { INDICATOR_CONTRACTS } from '../src/analytics/data/indicatorsData.ts';
import { DEFAULT_ANALYTICS_FILTERS } from '../src/analytics/filters.ts';

test('показатели договоров агрегируются только из прямых полей выборки', () => {
  const result = summarizeIndicators(INDICATOR_CONTRACTS.slice(0, 2));
  assert.equal(result.contracts, 2);
  assert.equal(result.amountMln, 2800);
  assert.equal(result.attentionShare, 100);
  assert.equal(result.physicalPercent, 65);
  assert.equal(result.financePercent, 65.5);
  assert.equal(result.sanctionsBilledMln, 36.7);
  assert.equal(result.motivationMln, 7.4);
});

test('страница показателей использует общие фильтры аналитики', () => {
  const result = filterIndicatorContracts(INDICATOR_CONTRACTS, {
    ...DEFAULT_ANALYTICS_FILTERS,
    subsidiary: 'Газпромнефть-Хантос',
    service: 'ГРП',
  });
  assert.deepEqual(result.map(item => item.number), ['ХНТ/25-089']);
});

test('фильтры КТ-777, перечня и доступных договоров применяются совместно', () => {
  const selected = filterIndicatorContracts(INDICATOR_CONTRACTS, {
    ...DEFAULT_ANALYTICS_FILTERS,
    kt777Services: ['10204 — Бурение эксплуатационных скважин'],
    contractIds: ['contract-1'],
    portfolios: ['П-1'],
  });
  assert.deepEqual(selected.map(item => item.id), ['contract-1']);
});
