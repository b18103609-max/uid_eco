import assert from 'node:assert/strict';
import test from 'node:test';

import {
  combineDataFreshness,
  isBlockingDataState,
  parseDataStateOverride,
  type DataFreshness,
} from '../src/analytics/data/dataFreshness.ts';

const actual: DataFreshness = {
  source: 'FMD-CONTRACTS',
  state: 'actual',
  lastSuccessfulLoad: '2026-08-31T06:00:00+03:00',
  completeness: 100,
};

const partial: DataFreshness = {
  source: 'FORM-IDP',
  state: 'partial',
  lastSuccessfulLoad: '2026-08-30T21:15:00+03:00',
  completeness: 92,
  warning: 'Часть актов не загружена.',
};

test('сводная свежесть выбирает худшее состояние и минимальную полноту', () => {
  const result = combineDataFreshness([actual, partial]);
  assert.equal(result.state, 'partial');
  assert.equal(result.completeness, 92);
  assert.equal(result.lastSuccessfulLoad, partial.lastSuccessfulLoad);
  assert.match(result.warning || '', /не загружена/);
});

test('состояние можно безопасно переопределить через query string демо-сценария', () => {
  assert.equal(parseDataStateOverride('?dataState=error'), 'error');
  assert.equal(parseDataStateOverride('?dataState=preliminary'), 'preliminary');
  assert.equal(parseDataStateOverride('?dataState=unknown'), undefined);
});

test('только loading, empty и error скрывают неподтверждённые значения', () => {
  assert.equal(isBlockingDataState('loading'), true);
  assert.equal(isBlockingDataState('empty'), true);
  assert.equal(isBlockingDataState('error'), true);
  assert.equal(isBlockingDataState('partial'), false);
  assert.equal(isBlockingDataState('delayed'), false);
  assert.equal(isBlockingDataState('actual'), false);
});

test('пустой список источников не создаёт фиктивную свежесть', () => {
  assert.throws(() => combineDataFreshness([]), /хотя бы один источник/);
});
