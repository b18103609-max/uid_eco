export type MeasureStatus = 'Реализовано' | 'В работе' | 'Новый';

export type MeasureRecord = {
  id: string;
  contractor: string;
  monthIndex: number;
  service: string;
  statusCode: MeasureStatus;
  responsiblePerson?: string;
};

export type MeasureBreachLink = {
  measureId: string;
  breachId: string;
};

export type MotivationRecord = {
  safety: number;
  technology: number;
  subsidiary: number;
};

export type MeasureFilters = {
  contractors: readonly string[];
  services: readonly string[];
  monthFrom: number;
  monthTo: number;
};

export const filterMeasures = (
  measures: readonly MeasureRecord[],
  filters: MeasureFilters,
) => {
  const contractorSet = new Set(filters.contractors);
  const serviceSet = new Set(filters.services);

  return measures.filter(measure => (
    contractorSet.has(measure.contractor)
    && serviceSet.has(measure.service)
    && measure.monthIndex >= filters.monthFrom
    && measure.monthIndex <= filters.monthTo
  ));
};

export const countUniqueMeasures = (measures: readonly MeasureRecord[]) => (
  new Set(measures.map(measure => measure.id)).size
);

export const countMeasuresByStatus = (measures: readonly MeasureRecord[]) => {
  const result: Record<MeasureStatus, number> = {
    'Реализовано': 0,
    'В работе': 0,
    'Новый': 0,
  };

  const unique = new Map(measures.map(measure => [measure.id, measure]));
  unique.forEach(measure => { result[measure.statusCode] += 1; });
  return result;
};

export const countMeasuresWithoutResponsible = (measures: readonly MeasureRecord[]) => {
  const ids = measures
    .filter(measure => !measure.responsiblePerson?.trim())
    .map(measure => measure.id);
  return new Set(ids).size;
};

export const countMeasuresLinkedToBreach = (
  measures: readonly MeasureRecord[],
  links: readonly MeasureBreachLink[],
) => {
  const visibleMeasureIds = new Set(measures.map(measure => measure.id));
  return new Set(
    links
      .filter(link => visibleMeasureIds.has(link.measureId))
      .map(link => link.measureId),
  ).size;
};

export const sumMotivation = (records: readonly MotivationRecord[]) => (
  records.reduce(
    (sum, record) => sum + record.safety + record.technology + record.subsidiary,
    0,
  )
);
