export type RatingZone = 'Красная' | 'Жёлтая' | 'Зелёная';
export type RatingRecord = { period: string; reportDate:string; brigade: string; subsidiary: string; structuralUnit:string; field:string; contractor: string; service: string; score: number; zone: RatingZone; stopFactor: boolean; preliminary: boolean; technology: number; hse: number };

const crews = [
  ['Бр-101', 'ГПН-Ямал', 'Блок бурения', 'Ярудейское', 'Альфа-Строй', 'Бурение', [72, 76, 79, 84], ['Жёлтая','Жёлтая','Жёлтая','Жёлтая'], false],
  ['Бр-204', 'ГПН-Ямал', 'Блок ТКРС', 'Новопортовское', 'БетаГрупп', 'ТКРС', [68, 64, 61, 58], ['Жёлтая','Красная','Красная','Красная'], true],
  ['Бр-307', 'Мессояханефтегаз', 'Дирекция бурения', 'Мессояхское', 'Гамма-ТЭК', 'Бурение', [86, 89, 91, 93], ['Зелёная','Зелёная','Зелёная','Зелёная'], false],
  ['Бр-415', 'Мессояханефтегаз', 'УКС', 'Мессояхское', 'Дельта Инж', 'КС', [78, 81, 77, 82], ['Жёлтая','Жёлтая','Жёлтая','Жёлтая'], false],
  ['Бр-512', 'Газпромнефть-Хантос', 'Блок ТКРС', 'Вынгапуровское', 'Сигма Плюс', 'ТКРС', [91, 93, 94, 95], ['Зелёная','Зелёная','Зелёная','Зелёная'], false],
  ['Бр-628', 'Газпромнефть-Хантос', 'Блок добычи', 'Ямбургское', 'Омега-Сервис', 'ГРП', [74, 69, 65, 62], ['Жёлтая','Жёлтая','Жёлтая','Красная'], true],
] as const;
const periods = ['Апр', 'Май', 'Июн', 'Июл'];
const dates=['2026-04-30','2026-05-31','2026-06-30','2026-07-31'];
export const RATING_RECORDS: RatingRecord[] = crews.flatMap(([brigade, subsidiary, structuralUnit, field, contractor, service, scores, zones, stopFactor], crewIndex) => scores.map((score, index) => ({ period: periods[index], reportDate:dates[index], brigade, subsidiary, structuralUnit, field, contractor, service, score, zone: zones[index] as RatingZone, stopFactor: Boolean(stopFactor && index === 3), preliminary: index === 3 && crewIndex === 3, technology: Math.round(score * .52), hse: Math.round(score * .48) })));
