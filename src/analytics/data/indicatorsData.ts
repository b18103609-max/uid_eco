export type IndicatorContract = {
  id: string;
  number: string;
  subsidiary: string;
  service: string;
  kt777: string;
  portfolio: 'П-1' | 'П-2';
  contractor: string;
  amountMln: number;
  critical: boolean;
  risk: 'Высокий' | 'Средний' | 'Низкий';
  teamAssigned?: boolean;
  previousOedkZone?: 'Красная' | 'Жёлтая' | 'Зелёная';
  physicalPercent: number;
  financePercent: number;
  oedkScore: number;
  oedkZone: 'Красная' | 'Жёлтая' | 'Зелёная';
  sanctionsBilledMln: number;
  sanctionsPaidMln: number;
  proactiveMln: number;
  motivationMln: number;
  incident: 'Нет' | 'Значительное' | 'Крупное';
};

export const INDICATOR_CONTRACTS: IndicatorContract[] = [
  { id: 'contract-1', number: 'ГПН-ЯМ/24-101', subsidiary: 'ГПН-Ямал', service: 'Бурение', kt777: '10204 — Бурение эксплуатационных скважин', portfolio: 'П-1', contractor: 'Альфа-Строй', amountMln: 1840, critical: true, risk: 'Высокий', physicalPercent: 72, financePercent: 68, oedkScore: 78, oedkZone: 'Жёлтая', sanctionsBilledMln: 14.2, sanctionsPaidMln: 9.8, proactiveMln: 2.1, motivationMln: 4.6, incident: 'Значительное' },
  { id: 'contract-2', number: 'ГПН-ЯМ/25-044', subsidiary: 'ГПН-Ямал', service: 'ТКРС', kt777: '10203 — Зарезка боковых стволов', portfolio: 'П-1', contractor: 'БетаГрупп', amountMln: 960, critical: true, risk: 'Высокий', physicalPercent: 58, financePercent: 63, oedkScore: 64, oedkZone: 'Красная', sanctionsBilledMln: 22.5, sanctionsPaidMln: 8.4, proactiveMln: 3.7, motivationMln: 2.8, incident: 'Крупное' },
  { id: 'contract-3', number: 'МНГ/24-318', subsidiary: 'Мессояханефтегаз', service: 'Бурение', kt777: '10206 — ПИР при бурении и реконструкции', portfolio: 'П-2', contractor: 'Гамма-ТЭК', amountMln: 2160, critical: false, risk: 'Низкий', physicalPercent: 96, financePercent: 91, oedkScore: 91, oedkZone: 'Зелёная', sanctionsBilledMln: 5.4, sanctionsPaidMln: 5.1, proactiveMln: 0.6, motivationMln: 8.2, incident: 'Нет' },
  { id: 'contract-4', number: 'МНГ/25-127', subsidiary: 'Мессояханефтегаз', service: 'КС', kt777: '11014 — Строительный контроль', portfolio: 'П-2', contractor: 'Дельта Инж', amountMln: 1320, critical: false, risk: 'Средний', physicalPercent: 81, financePercent: 77, oedkScore: 82, oedkZone: 'Жёлтая', sanctionsBilledMln: 9.6, sanctionsPaidMln: 7.3, proactiveMln: 1.4, motivationMln: 5.1, incident: 'Нет' },
  { id: 'contract-5', number: 'ХНТ/24-205', subsidiary: 'Газпромнефть-Хантос', service: 'ТКРС', kt777: '10205 — Углубление скважин', portfolio: 'П-1', contractor: 'Сигма Плюс', amountMln: 740, critical: false, risk: 'Низкий', physicalPercent: 103, financePercent: 98, oedkScore: 94, oedkZone: 'Зелёная', sanctionsBilledMln: 2.2, sanctionsPaidMln: 2.2, proactiveMln: 0.2, motivationMln: 3.9, incident: 'Нет' },
  { id: 'contract-6', number: 'ХНТ/25-089', subsidiary: 'Газпромнефть-Хантос', service: 'ГРП', kt777: '11018 — Обустройство месторождений', portfolio: 'П-2', contractor: 'Омега-Сервис', amountMln: 1540, critical: true, risk: 'Высокий', physicalPercent: 49, financePercent: 56, oedkScore: 59, oedkZone: 'Красная', sanctionsBilledMln: 31.8, sanctionsPaidMln: 10.6, proactiveMln: 5.2, motivationMln: 1.7, incident: 'Крупное' },
];
