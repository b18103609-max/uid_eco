import assert from 'node:assert/strict';
import test from 'node:test';

import {
  countMeasuresByStatus,
  countMeasuresLinkedToBreach,
  countMeasuresWithoutResponsible,
  countUniqueMeasures,
  filterMeasures,
  sumMotivation,
  type MeasureBreachLink,
  type MeasureRecord,
} from '../src/analytics/calculations/metrics.ts';
import { METRIC_CATALOG } from '../src/analytics/data/metricCatalog.ts';

const measures: MeasureRecord[] = [
  { id: '1', contractor: 'А', monthIndex: 0, service: 'S1', statusCode: 'Новый' },
  { id: '2', contractor: 'А', monthIndex: 0, service: 'S1', statusCode: 'В работе', responsiblePerson: 'Иванов' },
  { id: '3', contractor: 'Б', monthIndex: 1, service: 'S2', statusCode: 'Реализовано', responsiblePerson: 'Петров' },
];

const links: MeasureBreachLink[] = [
  { measureId: '1', breachId: 'B-1' },
  { measureId: '1', breachId: 'B-2' },
  { measureId: '3', breachId: 'B-3' },
];

test('pcm.total считает уникальные мероприятия', () => {
  assert.equal(countUniqueMeasures([...measures, measures[0]]), 3);
});

test('pcm.byStatus группирует уникальные мероприятия по прямому статусу', () => {
  assert.deepEqual(countMeasuresByStatus(measures), {
    'Реализовано': 1,
    'В работе': 1,
    'Новый': 1,
  });
});

test('pcm.withoutResponsible считает записи без ответственного', () => {
  assert.equal(countMeasuresWithoutResponsible(measures), 1);
});

test('pcm.linkedToBreach считает мероприятия, а не количество связей', () => {
  assert.equal(countMeasuresLinkedToBreach(measures, links), 2);
  assert.equal(countMeasuresLinkedToBreach(measures.slice(1), links), 1);
});

test('motivation.total суммирует три прямые колонки FORM-IDP', () => {
  assert.equal(sumMotivation([
    { safety: 10, technology: 20, subsidiary: 5 },
    { safety: 3, technology: 7, subsidiary: 0 },
  ]), 45);
});

test('фильтры мероприятий применяются до агрегации', () => {
  const filtered = filterMeasures(measures, {
    contractors: ['А'],
    services: ['S1'],
    monthFrom: 0,
    monthTo: 0,
  });
  assert.deepEqual(filtered.map(measure => measure.id), ['1', '2']);
});

test('каждая расчётная метрика R связана с реализованной формулой', () => {
  const calculatedMetrics = Object.values(METRIC_CATALOG)
    .filter(metric => metric.status === 'R');

  assert.ok(calculatedMetrics.length > 0);
  calculatedMetrics.forEach(metric => {
    assert.ok('formulaId' in metric && metric.formulaId);
    assert.ok('formula' in metric && metric.formula);
  });
});
