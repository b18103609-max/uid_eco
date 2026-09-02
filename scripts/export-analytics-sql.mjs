import { CONTRACT_BREACHES } from '../src/analytics/data/contractBreachesData.ts';
import { DEMO_MEASURE_BREACH_LINKS, DEMO_MEASURES } from '../src/analytics/data/demoMeasures.ts';
import { INDICATOR_CONTRACTS } from '../src/analytics/data/indicatorsData.ts';
import { OVERVIEW_RECORDS } from '../src/analytics/data/overviewData.ts';
import { PRECLAIM_CASES } from '../src/analytics/data/preclaimData.ts';
import { RATING_RECORDS } from '../src/analytics/data/ratingData.ts';
import { SAFETY_RECORDS } from '../src/analytics/data/safetyData.ts';

const datasets = {
  contracts: INDICATOR_CONTRACTS,
  safety_records: SAFETY_RECORDS,
  contract_breaches: CONTRACT_BREACHES,
  measures: DEMO_MEASURES,
  measure_breach_links: DEMO_MEASURE_BREACH_LINKS,
  preclaim_cases: PRECLAIM_CASES,
  rating_records: RATING_RECORDS,
  overview_records: OVERVIEW_RECORDS,
};

const snake = (value) => value
  .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
  .replace(/[^a-zA-Z0-9_]+/g, '_')
  .replace(/^_+|_+$/g, '')
  .toLowerCase();

const flatten = (value, prefix = '', target = {}) => {
  for (const [key, item] of Object.entries(value)) {
    const column = prefix ? `${prefix}_${snake(key)}` : snake(key);
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      flatten(item, column, target);
    } else {
      target[column] = item ?? null;
    }
  }
  return target;
};

const isDate = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
const sqlType = (values) => {
  const present = values.filter((value) => value !== null && value !== undefined);
  if (present.length && present.every((value) => typeof value === 'boolean')) return 'boolean';
  if (present.length && present.every((value) => Number.isInteger(value))) return 'integer';
  if (present.length && present.every((value) => typeof value === 'number')) return 'numeric';
  if (present.length && present.every(isDate)) return 'date';
  return 'text';
};

const literal = (value, type) => {
  if (value === null || value === undefined) return 'NULL';
  if (type === 'boolean') return value ? 'TRUE' : 'FALSE';
  if (type === 'integer' || type === 'numeric') return String(value);
  return `'${String(value).replaceAll("'", "''")}'`;
};

const statements = [
  '-- Generated from the typed prototype fixtures. Do not edit manually.',
  'BEGIN;',
];

for (const [table, sourceRows] of Object.entries(datasets)) {
  const rows = sourceRows.map((row) => flatten(row));
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const types = Object.fromEntries(columns.map((column) => [
    column,
    sqlType(rows.map((row) => row[column])),
  ]));

  statements.push(`DROP TABLE IF EXISTS ${table} CASCADE;`);
  statements.push(`CREATE TABLE ${table} (\n${columns.map((column) => `  ${column} ${types[column]}`).join(',\n')}\n);`);

  if (rows.length) {
    statements.push(`INSERT INTO ${table} (${columns.join(', ')}) VALUES\n${rows.map((row) => `  (${columns.map((column) => literal(row[column], types[column])).join(', ')})`).join(',\n')};`);
  }
}

statements.push('COMMIT;');
process.stdout.write(`${statements.join('\n\n')}\n`);
