export type RatingZone = 'Красная' | 'Жёлтая' | 'Зелёная';
export type RatingRecord = { period: string; brigade: string; subsidiary: string; contractor: string; service: string; score: number; zone: RatingZone; stopFactor: boolean; preliminary: boolean; technology: number; hse: number };

const crews = [
  ['Бр-101', 'ГПН-Ямал', 'Альфа-Строй', 'Бурение', [72, 76, 79, 84], false],
  ['Бр-204', 'ГПН-Ямал', 'БетаГрупп', 'ТКРС', [68, 64, 61, 58], true],
  ['Бр-307', 'Мессояханефтегаз', 'Гамма-ТЭК', 'Бурение', [86, 89, 91, 93], false],
  ['Бр-415', 'Мессояханефтегаз', 'Дельта Инж', 'Обустройство', [78, 81, 77, 82], false],
  ['Бр-512', 'Газпромнефть-Хантос', 'Сигма Плюс', 'ТКРС', [91, 93, 94, 95], false],
  ['Бр-628', 'Газпромнефть-Хантос', 'Омега-Сервис', 'ГРП', [74, 69, 65, 62], true],
] as const;
const periods = ['Апр', 'Май', 'Июн', 'Июл'];
const zone = (score: number): RatingZone => score < 65 ? 'Красная' : score < 85 ? 'Жёлтая' : 'Зелёная';
export const RATING_RECORDS: RatingRecord[] = crews.flatMap(([brigade, subsidiary, contractor, service, scores, stopFactor], crewIndex) => scores.map((score, index) => ({ period: periods[index], brigade, subsidiary, contractor, service, score, zone: zone(score), stopFactor: Boolean(stopFactor && index === 3), preliminary: index === 3 && crewIndex === 3, technology: Math.round(score * .52), hse: Math.round(score * .48) })));
