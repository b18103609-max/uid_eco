export type MeasureStatus = 'Реализовано' | 'В работе' | 'Новый';

export type MeasureRecord = {
  id: string; contractor: string; monthIndex: number; service: string; statusCode: MeasureStatus;
  responsiblePerson?: string; reportDate?: string; title?: string; subsidiary?: string;
  functionName?: string; field?: string; contractId?: string; contractNumber?: string;
  violationId?: string; violationCategory?: string; plannedEndDate?: string; completedAt?: string;
  observationBefore?: string; observationAfter?: string; similarBefore?: number; similarAfter?: number;
};

export type MeasureBreachLink = { measureId: string; breachId: string };

export const ANALYTICS_SERVICES = [
  '10203 — Зарезка боковых стволов',
  '10204 — Бурение эксплуатационных скважин',
  '10205 — Углубление скважин',
  '10206 — ПИР при бурении и реконструкции',
  '11014 — Строительный контроль',
  '11018 — Обустройство месторождений',
] as const;

export const DEMO_MEASURES: MeasureRecord[] = [
  {id:'ПКМ-001',reportDate:'2026-07-20',title:'Повторный инструктаж допуска на объект',contractor:'БетаГрупп',subsidiary:'ГПН-Ямал',functionName:'ТКРС',service:ANALYTICS_SERVICES[0],field:'Новопортовское',contractId:'contract-2',contractNumber:'ГПН-ЯМ/25-044',violationId:'НАР-002',violationCategory:'Пропускной режим',monthIndex:6,statusCode:'Реализовано',responsiblePerson:'Сафин Р.Р.',plannedEndDate:'2026-07-30',completedAt:'2026-07-29',observationBefore:'май–июнь',observationAfter:'август–сентябрь',similarBefore:5,similarAfter:2},
  {id:'ПКМ-002',reportDate:'2026-07-30',title:'Проверка чек-листа перед началом работ',contractor:'Гамма-ТЭК',subsidiary:'Мессояханефтегаз',functionName:'Бурение',service:ANALYTICS_SERVICES[3],field:'Мессояхское',contractId:'contract-3',contractNumber:'МНГ/24-318',violationId:'НАР-003',violationCategory:'Убытки',monthIndex:6,statusCode:'Реализовано',responsiblePerson:'Юдин В.А.',plannedEndDate:'2026-08-05',completedAt:'2026-08-04',observationBefore:'май–июнь',observationAfter:'август–сентябрь',similarBefore:3,similarAfter:1},
  {id:'ПКМ-003',reportDate:'2026-08-10',title:'Актуализация контроля договорных сроков',contractor:'Дельта Инж',subsidiary:'Мессояханефтегаз',functionName:'КС',service:ANALYTICS_SERVICES[4],field:'Мессояхское',contractId:'contract-4',contractNumber:'МНГ/25-127',violationId:'НАР-004',violationCategory:'Нарушение условий договора',monthIndex:7,statusCode:'В работе',responsiblePerson:'Алиев М.М.',plannedEndDate:'2026-09-15',observationBefore:'июнь–июль',observationAfter:'октябрь–ноябрь',similarBefore:4,similarAfter:0},
  {id:'ПКМ-004',reportDate:'2026-08-24',title:'Контроль защитных ограждений оборудования',contractor:'Омега-Сервис',subsidiary:'Газпромнефть-Хантос',functionName:'ГРП',service:ANALYTICS_SERVICES[5],field:'Ямбургское',contractId:'contract-6',contractNumber:'ХНТ/25-089',violationId:'НАР-006',violationCategory:'ПБ',monthIndex:7,statusCode:'В работе',responsiblePerson:'Тихонов А.В.',plannedEndDate:'2026-09-20',observationBefore:'июнь–июль',observationAfter:'октябрь–ноябрь',similarBefore:6,similarAfter:0},
  {id:'ПКМ-005',reportDate:'2026-08-25',title:'Разбор причин НПВ с буровой бригадой',contractor:'Альфа-Строй',subsidiary:'ГПН-Ямал',functionName:'Бурение',service:ANALYTICS_SERVICES[1],field:'Ярудейское',contractId:'contract-1',contractNumber:'ГПН-ЯМ/24-101',violationId:'НАР-009',violationCategory:'НПВ',monthIndex:7,statusCode:'Новый',responsiblePerson:'Ким А.В.',plannedEndDate:'2026-09-25',observationBefore:'июнь–июль',observationAfter:'октябрь–ноябрь',similarBefore:4,similarAfter:0},
  {id:'ПКМ-006',reportDate:'2026-08-26',title:'Проверка барьеров ПБ перед сменой',contractor:'Омега-Сервис',subsidiary:'Газпромнефть-Хантос',functionName:'ГРП',service:ANALYTICS_SERVICES[5],field:'Ямбургское',contractId:'contract-6',contractNumber:'ХНТ/25-089',violationId:'НАР-008',violationCategory:'ПБ',monthIndex:7,statusCode:'Новый',plannedEndDate:'2026-09-30',observationBefore:'июнь–июль',observationAfter:'октябрь–ноябрь',similarBefore:6,similarAfter:0},
  {id:'ПКМ-007',reportDate:'2026-07-22',title:'Единый журнал пропусков подрядчика',contractor:'БетаГрупп',subsidiary:'ГПН-Ямал',functionName:'ТКРС',service:ANALYTICS_SERVICES[0],field:'Новопортовское',contractId:'contract-2',contractNumber:'ГПН-ЯМ/25-044',violationId:'НАР-002',violationCategory:'Пропускной режим',monthIndex:6,statusCode:'Реализовано',responsiblePerson:'Петрова О.В.',plannedEndDate:'2026-08-01',completedAt:'2026-08-01',observationBefore:'май–июнь',observationAfter:'август–сентябрь',similarBefore:5,similarAfter:2},
  {id:'ПКМ-008',reportDate:'2026-08-12',title:'Входной контроль отчетных материалов',contractor:'Дельта Инж',subsidiary:'Мессояханефтегаз',functionName:'КС',service:ANALYTICS_SERVICES[4],field:'Мессояхское',contractId:'contract-4',contractNumber:'МНГ/25-127',violationId:'НАР-004',violationCategory:'Нарушение условий договора',monthIndex:7,statusCode:'Реализовано',responsiblePerson:'Ершов К.В.',plannedEndDate:'2026-08-20',completedAt:'2026-08-19',observationBefore:'май–июнь',observationAfter:'август–сентябрь',similarBefore:4,similarAfter:3},
  {id:'ПКМ-009',reportDate:'2026-08-18',title:'Проверка расчета производственных потерь',contractor:'Сигма Плюс',subsidiary:'Газпромнефть-Хантос',functionName:'ТКРС',service:ANALYTICS_SERVICES[2],field:'Вынгапуровское',contractId:'contract-5',contractNumber:'ХНТ/24-205',violationId:'НАР-005',violationCategory:'НПВ',monthIndex:7,statusCode:'Реализовано',responsiblePerson:'Крылов Н.А.',plannedEndDate:'2026-08-28',completedAt:'2026-08-27',observationBefore:'май–июнь',observationAfter:'август–сентябрь',similarBefore:2,similarAfter:2},
  {id:'ПКМ-010',reportDate:'2026-08-29',title:'Дополнительный аудит требований ПБ',contractor:'Альфа-Строй',subsidiary:'ГПН-Ямал',functionName:'Бурение',service:ANALYTICS_SERVICES[1],field:'Ярудейское',contractId:'contract-1',contractNumber:'ГПН-ЯМ/24-101',violationId:'НАР-001',violationCategory:'ПБ',monthIndex:7,statusCode:'В работе',responsiblePerson:'Орлова Е.С.',plannedEndDate:'2026-09-18',observationBefore:'июнь–июль',observationAfter:'октябрь–ноябрь',similarBefore:3,similarAfter:0},
  {id:'ПКМ-011',reportDate:'2026-09-01',title:'Обновление матрицы ответственности',contractor:'Дельта Инж',subsidiary:'Мессояханефтегаз',functionName:'КС',service:ANALYTICS_SERVICES[4],field:'Мессояхское',contractId:'contract-4',contractNumber:'МНГ/25-127',violationId:'НАР-010',violationCategory:'Убытки',monthIndex:8,statusCode:'Новый',plannedEndDate:'2026-10-05',observationBefore:'июль–август',observationAfter:'ноябрь–декабрь',similarBefore:2,similarAfter:0},
  {id:'ПКМ-012',reportDate:'2026-09-01',title:'Контроль соблюдения технологического окна',contractor:'БетаГрупп',subsidiary:'ГПН-Ямал',functionName:'ТКРС',service:ANALYTICS_SERVICES[0],field:'Новопортовское',contractId:'contract-2',contractNumber:'ГПН-ЯМ/25-044',violationId:'НАР-007',violationCategory:'Прочее',monthIndex:8,statusCode:'Новый',responsiblePerson:'Сафин Р.Р.',plannedEndDate:'2026-10-10',observationBefore:'июль–август',observationAfter:'ноябрь–декабрь',similarBefore:3,similarAfter:0},
];

export const DEMO_MEASURE_BREACH_LINKS: MeasureBreachLink[] = DEMO_MEASURES
  .filter(item => item.violationId)
  .map(item => ({ measureId: item.id, breachId: item.violationId! }));
