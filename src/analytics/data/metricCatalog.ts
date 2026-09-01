export type MetricStatus = 'P' | 'R' | 'O';

export type MetricSource =
  | 'FMD-CONTRACTS'
  | 'FORM-IDP'
  | 'FORM-DPR'
  | 'FORM-DS';

export type MetricFormulaId =
  | 'countUniqueMeasures'
  | 'countMeasuresByStatus'
  | 'countMeasuresWithoutResponsible'
  | 'countMeasuresLinkedToBreach'
  | 'sumMotivation';

export type MetricDefinition = {
  label: string;
  status: MetricStatus;
  source?: MetricSource;
  grain?: string;
  unit?: string;
  sourceFields: readonly string[];
  formulaId?: MetricFormulaId;
  formula?: string;
  deferredReason?: string;
};

// First P0 slice of the catalog. It documents metrics already present in the
// prototype and prevents deferred calculations from being presented as facts.
export const METRIC_CATALOG = {
  'rating.finalScore': {
    label: 'Переданный итоговый балл',
    status: 'P',
    source: 'FMD-CONTRACTS',
    grain: 'бригада × дата рейтинга',
    unit: 'балл',
    sourceFields: ['contracts.gtm.final_rating_scores'],
  },
  'rating.finalColour': {
    label: 'Переданная цветовая зона',
    status: 'P',
    source: 'FMD-CONTRACTS',
    grain: 'бригада × дата рейтинга',
    sourceFields: ['contracts.gtm.final_rating_colour'],
  },
  'rating.contractorCompositeScore': {
    label: 'Сводный скор подрядчика',
    status: 'O',
    sourceFields: [],
    deferredReason: 'Нет утвержденной методики сводного индекса.',
  },
  'pcm.total': {
    label: 'Всего мероприятий',
    status: 'R',
    source: 'FMD-CONTRACTS',
    grain: 'мероприятие',
    unit: 'шт.',
    sourceFields: ['contract_measure.id'],
    formulaId: 'countUniqueMeasures',
    formula: 'Количество уникальных contract_measure.id в выборке.',
  },
  'pcm.byStatus': {
    label: 'Мероприятия по статусам',
    status: 'R',
    source: 'FMD-CONTRACTS',
    grain: 'мероприятие',
    unit: 'шт.',
    sourceFields: ['contract_measure.id', 'contract_measure.status_code'],
    formulaId: 'countMeasuresByStatus',
    formula: 'Количество мероприятий в группах status_code.',
  },
  'pcm.withoutResponsible': {
    label: 'Мероприятия без ответственного',
    status: 'R',
    source: 'FMD-CONTRACTS',
    grain: 'мероприятие',
    unit: 'шт.',
    sourceFields: ['contract_measure.id', 'contract_measure.responsible_person'],
    formulaId: 'countMeasuresWithoutResponsible',
    formula: 'Количество записей с пустым responsible_person.',
  },
  'pcm.linkedToBreach': {
    label: 'Мероприятия, связанные с нарушениями',
    status: 'R',
    source: 'FMD-CONTRACTS',
    grain: 'мероприятие',
    unit: 'шт.',
    sourceFields: ['contract_measure.id', 'lnk_contract_measure_breach'],
    formulaId: 'countMeasuresLinkedToBreach',
    formula: 'Количество мероприятий с хотя бы одной физической связью.',
  },
  'pcm.overdue': {
    label: 'Просроченные мероприятия',
    status: 'O',
    sourceFields: [],
    deferredReason: 'В contract_measure не подтверждена контрольная дата.',
  },
  'pcm.completedOnTime': {
    label: 'Мероприятия, завершенные в срок',
    status: 'O',
    sourceFields: [],
    deferredReason: 'Нет контрольной и фактической дат завершения.',
  },
  'motivation.total': {
    label: 'Начисленная мотивация',
    status: 'R',
    source: 'FORM-IDP',
    grain: 'договор × отчетный период',
    unit: 'руб.',
    sourceFields: [
      'Мотивация ПБ',
      'Мотивация за технологические требования',
      'Мотивация ДО',
    ],
    formulaId: 'sumMotivation',
    formula: 'Сумма трех колонок мотивации в выборке.',
  },
  'motivation.withCriticalBreach': {
    label: 'Мотивация при наличии критичных нарушений',
    status: 'O',
    sourceFields: [],
    deferredReason: 'Нет стабильной связи и утвержденного правила атрибуции.',
  },
} as const satisfies Record<string, MetricDefinition>;

export type MetricId = keyof typeof METRIC_CATALOG;

export const isMetricAvailable = (id: MetricId) => METRIC_CATALOG[id].status !== 'O';
