export type OverviewRecord = {
  subsidiary: string;
  service: string;
  contractor: string;
  contracts: { highRisk: number; mediumRisk: number; lowRisk: number; critical: number };
  ratingZones: { red: number; yellow: number; green: number };
  ratingZonesPrevious: { red: number; yellow: number; green: number };
  breaches: { critical: number; significant: number; minor: number };
  dprDeviation: number;
  addendumDeviation: number;
};

export const OVERVIEW_RECORDS: OverviewRecord[] = [
  { subsidiary: 'ГПН-Ямал', service: 'Бурение', contractor: 'Альфа-Строй', contracts: { highRisk: 2, mediumRisk: 3, lowRisk: 4, critical: 1 }, ratingZones: { red: 1, yellow: 2, green: 4 }, ratingZonesPrevious: { red: 2, yellow: 2, green: 3 }, breaches: { critical: 3, significant: 7, minor: 12 }, dprDeviation: 2, addendumDeviation: 1 },
  { subsidiary: 'ГПН-Ямал', service: 'ТКРС', contractor: 'БетаГрупп', contracts: { highRisk: 3, mediumRisk: 4, lowRisk: 2, critical: 2 }, ratingZones: { red: 2, yellow: 3, green: 2 }, ratingZonesPrevious: { red: 1, yellow: 4, green: 2 }, breaches: { critical: 5, significant: 9, minor: 15 }, dprDeviation: 4, addendumDeviation: 2 },
  { subsidiary: 'Мессояханефтегаз', service: 'Бурение', contractor: 'Гамма-ТЭК', contracts: { highRisk: 1, mediumRisk: 2, lowRisk: 6, critical: 1 }, ratingZones: { red: 0, yellow: 2, green: 6 }, ratingZonesPrevious: { red: 1, yellow: 2, green: 5 }, breaches: { critical: 2, significant: 5, minor: 11 }, dprDeviation: 1, addendumDeviation: 1 },
  { subsidiary: 'Мессояханефтегаз', service: 'Обустройство', contractor: 'Дельта Инж', contracts: { highRisk: 2, mediumRisk: 4, lowRisk: 5, critical: 1 }, ratingZones: { red: 1, yellow: 2, green: 5 }, ratingZonesPrevious: { red: 1, yellow: 3, green: 4 }, breaches: { critical: 3, significant: 6, minor: 9 }, dprDeviation: 3, addendumDeviation: 3 },
  { subsidiary: 'Газпромнефть-Хантос', service: 'ТКРС', contractor: 'Сигма Плюс', contracts: { highRisk: 1, mediumRisk: 3, lowRisk: 7, critical: 0 }, ratingZones: { red: 0, yellow: 1, green: 7 }, ratingZonesPrevious: { red: 0, yellow: 2, green: 6 }, breaches: { critical: 1, significant: 4, minor: 8 }, dprDeviation: 1, addendumDeviation: 0 },
  { subsidiary: 'Газпромнефть-Хантос', service: 'ГРП', contractor: 'Омега-Сервис', contracts: { highRisk: 4, mediumRisk: 3, lowRisk: 2, critical: 2 }, ratingZones: { red: 3, yellow: 3, green: 1 }, ratingZonesPrevious: { red: 2, yellow: 3, green: 2 }, breaches: { critical: 6, significant: 10, minor: 14 }, dprDeviation: 5, addendumDeviation: 4 },
];

export const OVERVIEW_OPTIONS = {
  subsidiaries: [...new Set(OVERVIEW_RECORDS.map(item => item.subsidiary))],
  services: [...new Set(OVERVIEW_RECORDS.map(item => item.service))],
  contractors: [...new Set(OVERVIEW_RECORDS.map(item => item.contractor))],
};
