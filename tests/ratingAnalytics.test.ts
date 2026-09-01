import assert from 'node:assert/strict';
import test from 'node:test';
import { filterRatings, summarizeRating } from '../src/analytics/calculations/rating.ts';
import { RATING_RECORDS } from '../src/analytics/data/ratingData.ts';
import { DEFAULT_ANALYTICS_FILTERS } from '../src/analytics/filters.ts';
test('рейтинг использует последний переданный результат и реальные переходы зон',()=>{const summary=summarizeRating(RATING_RECORDS);assert.equal(summary.zones.green,2);assert.equal(summary.zones.yellow,2);assert.equal(summary.zones.red,2);assert.equal(summary.stopFactors,2);assert.equal(summary.preliminary,1)});
test('общий фильтр подрядчика сохраняется на странице рейтинга',()=>{const rows=filterRatings(RATING_RECORDS,{...DEFAULT_ANALYTICS_FILTERS,contractor:'Омега-Сервис'});assert.equal(new Set(rows.map(item=>item.brigade)).size,1);assert.equal(rows.length,4)});
