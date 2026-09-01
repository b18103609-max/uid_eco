import type {
  MeasureBreachLink,
  MeasureRecord,
  MeasureStatus,
} from '../calculations/metrics.ts';

export const ANALYTICS_SERVICES = [
  '10203 — Зарезка боковых стволов и углублений под ключ',
  '10204 — Бурение эксплуатационных скважин (суточная/фикс. ставка)',
  '10205 — Зарезка боковых стволов и углубление (суточная/фикс. ставка)',
  '10206 — ПИР при бурении/реконструкции скважин, авторский надзор',
  '11014 — Строительный контроль за объектами строительства',
  '11018 — ПИР Комплексное обустройство месторождений нефти и газа',
  '11019 — ПИР Объекты добычи, подготовки и транспорта нефти',
  '11016 — ПИР Прочие объекты обустройства',
] as const;

type MonthlyMeasureScenario = {
  done: readonly number[];
  wip: readonly number[];
  newCount: readonly number[];
  withoutResponsible: readonly number[];
  linkedToBreach: readonly number[];
};

const SCENARIOS: Record<string, MonthlyMeasureScenario> = {
  'Альфа-Строй': { done: [10, 12, 13, 12, 13, 12, 14, 12], wip: [3, 3, 3, 3, 3, 3, 3, 3], newCount: [2, 2, 2, 2, 2, 2, 2, 2], withoutResponsible: [1, 1, 2, 1, 1, 1, 2, 1], linkedToBreach: [10, 12, 13, 12, 13, 12, 14, 12] },
  'БетаГрупп': { done: [9, 10, 11, 10, 11, 10, 11, 10], wip: [4, 4, 5, 4, 5, 4, 5, 4], newCount: [3, 3, 4, 3, 4, 3, 4, 3], withoutResponsible: [2, 2, 2, 2, 2, 2, 3, 2], linkedToBreach: [11, 12, 14, 12, 14, 12, 14, 12] },
  'Гамма-ТЭК': { done: [12, 13, 14, 13, 14, 13, 15, 13], wip: [2, 2, 2, 2, 2, 2, 2, 2], newCount: [1, 1, 1, 1, 1, 1, 1, 1], withoutResponsible: [1, 1, 1, 1, 1, 1, 1, 1], linkedToBreach: [11, 12, 13, 12, 13, 12, 14, 12] },
  'Дельта Инж': { done: [10, 11, 12, 11, 12, 11, 12, 11], wip: [3, 3, 3, 3, 3, 3, 3, 3], newCount: [2, 2, 2, 2, 2, 2, 2, 2], withoutResponsible: [1, 1, 1, 1, 1, 1, 2, 1], linkedToBreach: [10, 11, 12, 11, 12, 11, 12, 11] },
  'Сигма Плюс': { done: [13, 14, 15, 14, 15, 14, 15, 14], wip: [1, 1, 2, 1, 2, 1, 2, 1], newCount: [1, 1, 1, 1, 1, 1, 1, 1], withoutResponsible: [0, 1, 1, 1, 1, 1, 1, 1], linkedToBreach: [11, 12, 13, 12, 13, 12, 13, 12] },
  'Омега-Сервис': { done: [7, 8, 8, 8, 8, 8, 9, 8], wip: [5, 5, 5, 5, 5, 5, 6, 5], newCount: [4, 4, 5, 4, 5, 4, 5, 4], withoutResponsible: [2, 2, 3, 2, 3, 2, 3, 2], linkedToBreach: [12, 13, 14, 13, 14, 13, 15, 13] },
};

const statusAt = (index: number, scenario: MonthlyMeasureScenario, month: number): MeasureStatus => {
  if (index < scenario.done[month]) return 'Реализовано';
  if (index < scenario.done[month] + scenario.wip[month]) return 'В работе';
  return 'Новый';
};

const buildDemoMeasures = () => {
  const measures: MeasureRecord[] = [];
  const links: MeasureBreachLink[] = [];

  Object.entries(SCENARIOS).forEach(([contractor, scenario], contractorIndex) => {
    scenario.done.forEach((done, monthIndex) => {
      const total = done + scenario.wip[monthIndex] + scenario.newCount[monthIndex];

      for (let index = 0; index < total; index += 1) {
        const id = `PCM-${contractorIndex + 1}-${monthIndex + 1}-${index + 1}`;
        measures.push({
          id,
          contractor,
          monthIndex,
          service: ANALYTICS_SERVICES[(index + contractorIndex + monthIndex) % ANALYTICS_SERVICES.length],
          statusCode: statusAt(index, scenario, monthIndex),
          responsiblePerson: index < scenario.withoutResponsible[monthIndex]
            ? undefined
            : `Ответственный ${contractorIndex + 1}.${(index % 4) + 1}`,
        });

        if (index < scenario.linkedToBreach[monthIndex]) {
          links.push({ measureId: id, breachId: `BREACH-${contractorIndex + 1}-${monthIndex + 1}-${index + 1}` });
        }
      }
    });
  });

  return { measures, links };
};

const demoData = buildDemoMeasures();

export const DEMO_MEASURES = demoData.measures;
export const DEMO_MEASURE_BREACH_LINKS = demoData.links;
