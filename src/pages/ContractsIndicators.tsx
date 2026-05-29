import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './dashboard.css';

const ContractsIndicators = ({ only }: { only?: number[] } = {}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  // вкладки, которые надо показать; индекс 0..5 соответствует Финансы..Рейтинг
  const allowed = only && only.length > 0 ? only : [0, 1, 2, 3, 4, 5, 6];
  const initialTab = allowed[0];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const $ = (id: string) => root.querySelector<HTMLElement>('#' + id)!;

    Chart.defaults.color = '#5d6a73';
    Chart.defaults.borderColor = '#ebedf0';
    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.font.weight = 500;

    const GRID = '#ebedf0';
    const PT = '#ffffff';
    const AXIS = '#5d6a73';
    const C: Record<string, string> = {
      yellow: '#f5a623', yellow2: '#d98b00', blue: '#0078d2', blue2: '#0078d2',
      red: '#f4364c', green: '#15c39a', orange: '#ff8800', purple: '#6c5ce7',
      cyan: '#15a5c3', pink: '#EC4899',
    };
    const a = (hex: string, op: number) => {
      const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${op})`;
    };

    const CONTRACTORS = ['Альфа-Строй', 'БетаГрупп', 'Гамма-ТЭК', 'Дельта Инж', 'Сигма Плюс', 'Омега-Сервис'];
    const MASTER_CATS = ['ТОП-12', 'ЛЭП', 'АЛКО', 'ШС', 'Убытки', 'Прочие'];
    const FL_TYPES = ['ВА', 'ВК', 'Прочие нарушения ПБ'];
    const CATEGORIES = [...MASTER_CATS, ...FL_TYPES];
    const MONTHS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг'];
    const QUARTERS = ['Q1 23', 'Q2 23', 'Q3 23', 'Q4 23', 'Q1 24', 'Q2 24', 'Q3 24', 'Q4 24'];
    const CAT_COLORS = [C.red, C.orange, C.yellow, C.blue2, C.purple, C.cyan, '#3a7bd5', '#9b7ac4', '#5cb8a0'];
    const CON_COLORS = [C.green, C.yellow, C.blue2, C.red, C.purple, C.orange];
    const SERVICES = ['Эксплуатационное бурение', 'Разведочное бурение', 'ГРП', 'КРС/ТРС', 'Обустройство куста', 'Строительство трубопровода'];
    const SERVICE_COLORS = [C.orange, C.yellow, C.blue2, C.green, C.purple, C.cyan];

    const BASE: any = {
      fine: { 'Альфа-Строй': [[0.9, 0.5, 0.3], [1.1, 0.6, 0.4], [1.3, 0.7, 0.5], [1.1, 0.6, 0.4], [1.0, 0.5, 0.3], [1.2, 0.7, 0.4], [1.4, 0.8, 0.5], [1.3, 0.7, 0.4]], 'БетаГрупп': [[1.1, 0.6, 0.4], [1.3, 0.7, 0.4], [1.5, 0.8, 0.5], [1.3, 0.7, 0.4], [1.2, 0.6, 0.4], [1.4, 0.7, 0.5], [1.6, 0.9, 0.5], [1.5, 0.8, 0.5]], 'Гамма-ТЭК': [[0.6, 0.4, 0.2], [0.7, 0.4, 0.3], [0.8, 0.5, 0.3], [0.7, 0.4, 0.3], [0.6, 0.4, 0.2], [0.7, 0.4, 0.3], [0.9, 0.5, 0.3], [0.8, 0.4, 0.3]], 'Дельта Инж': [[0.8, 0.5, 0.3], [0.9, 0.5, 0.3], [1.0, 0.6, 0.4], [0.9, 0.5, 0.3], [0.8, 0.5, 0.3], [0.9, 0.5, 0.3], [1.1, 0.6, 0.4], [1.0, 0.5, 0.3]], 'Сигма Плюс': [[0.3, 0.2, 0.2], [0.4, 0.3, 0.2], [0.4, 0.3, 0.2], [0.3, 0.2, 0.2], [0.3, 0.2, 0.1], [0.4, 0.3, 0.2], [0.5, 0.3, 0.2], [0.4, 0.3, 0.2]], 'Омега-Сервис': [[1.5, 0.8, 0.4], [1.7, 0.9, 0.4], [2.0, 1.0, 0.5], [1.8, 0.9, 0.4], [1.7, 0.8, 0.4], [1.9, 1.0, 0.5], [2.2, 1.1, 0.5], [2.1, 1.0, 0.5]] },
      proactive: { 'Альфа-Строй': 1.2, 'БетаГрупп': 2.1, 'Гамма-ТЭК': 0.8, 'Дельта Инж': 1.5, 'Сигма Плюс': 0.6, 'Омега-Сервис': 1.8 },
      viol: {
        'ТОП-12': { 'Альфа-Строй': [5, 6, 8, 7, 8, 7, 9, 6], 'БетаГрупп': [7, 8, 10, 9, 10, 9, 11, 9], 'Гамма-ТЭК': [4, 5, 6, 6, 7, 6, 8, 7], 'Дельта Инж': [4, 5, 6, 5, 6, 5, 7, 5], 'Сигма Плюс': [3, 4, 5, 4, 5, 4, 6, 3], 'Омега-Сервис': [9, 10, 13, 11, 13, 11, 14, 12] },
        'ЛЭП': { 'Альфа-Строй': [4, 5, 6, 5, 6, 5, 7, 5], 'БетаГрупп': [5, 6, 7, 6, 7, 6, 8, 7], 'Гамма-ТЭК': [3, 4, 5, 4, 5, 4, 6, 5], 'Дельта Инж': [3, 4, 5, 4, 5, 4, 5, 4], 'Сигма Плюс': [2, 3, 3, 3, 3, 3, 4, 3], 'Омега-Сервис': [8, 9, 11, 10, 11, 10, 12, 10] },
        'АЛКО': { 'Альфа-Строй': [3, 4, 5, 4, 5, 4, 6, 4], 'БетаГрупп': [5, 6, 7, 6, 7, 6, 7, 6], 'Гамма-ТЭК': [3, 3, 4, 3, 4, 3, 5, 4], 'Дельта Инж': [2, 3, 4, 3, 4, 3, 4, 3], 'Сигма Плюс': [2, 2, 3, 2, 3, 2, 3, 2], 'Омега-Сервис': [7, 9, 11, 10, 11, 10, 12, 11] },
        'ШС': { 'Альфа-Строй': [2, 3, 4, 3, 4, 3, 4, 4], 'БетаГрупп': [4, 5, 5, 5, 5, 5, 6, 5], 'Гамма-ТЭК': [2, 3, 3, 3, 3, 3, 4, 3], 'Дельта Инж': [2, 2, 3, 3, 3, 3, 3, 3], 'Сигма Плюс': [1, 2, 2, 2, 2, 2, 3, 2], 'Омега-Сервис': [6, 8, 9, 9, 9, 9, 10, 9] },
        'Убытки': { 'Альфа-Строй': [1, 2, 2, 2, 2, 2, 3, 2], 'БетаГрупп': [2, 3, 3, 3, 3, 3, 4, 3], 'Гамма-ТЭК': [1, 2, 2, 2, 2, 2, 3, 2], 'Дельта Инж': [1, 2, 2, 2, 2, 2, 2, 2], 'Сигма Плюс': [1, 1, 2, 1, 2, 1, 2, 1], 'Омега-Сервис': [3, 4, 5, 5, 5, 5, 6, 5] },
        'Прочие': { 'Альфа-Строй': [5, 6, 7, 6, 7, 6, 8, 7], 'БетаГрупп': [7, 8, 9, 8, 9, 8, 10, 9], 'Гамма-ТЭК': [4, 5, 5, 5, 5, 5, 6, 5], 'Дельта Инж': [4, 4, 5, 5, 5, 5, 6, 5], 'Сигма Плюс': [3, 3, 4, 3, 4, 3, 4, 3], 'Омега-Сервис': [9, 11, 12, 12, 12, 12, 14, 13] },
      },
      npv: { 'Альфа-Строй': [68, 74, 82, 76, 80, 75, 88, 71], 'БетаГрупп': [78, 85, 95, 88, 92, 88, 99, 82], 'Гамма-ТЭК': [40, 44, 50, 46, 48, 45, 53, 44], 'Дельта Инж': [56, 62, 69, 64, 67, 63, 73, 60], 'Сигма Плюс': [28, 30, 34, 31, 33, 31, 36, 29], 'Омега-Сервис': [102, 114, 128, 118, 124, 117, 135, 110] },
      dpr_status: { 'Альфа-Строй': { acc: [5, 6, 7, 6, 7, 6, 7, 6], rej: [2, 2, 3, 2, 3, 2, 3, 2], court: [1, 1, 2, 1, 2, 1, 2, 1] }, 'БетаГрупп': { acc: [5, 6, 7, 6, 7, 6, 7, 6], rej: [3, 3, 4, 3, 4, 3, 4, 3], court: [2, 2, 2, 2, 2, 2, 3, 2] }, 'Гамма-ТЭК': { acc: [6, 7, 7, 7, 7, 7, 8, 7], rej: [1, 2, 2, 2, 2, 2, 2, 2], court: [1, 1, 1, 1, 1, 1, 1, 1] }, 'Дельта Инж': { acc: [5, 6, 6, 6, 6, 6, 7, 6], rej: [2, 2, 3, 2, 3, 2, 3, 2], court: [1, 1, 2, 1, 2, 1, 2, 1] }, 'Сигма Плюс': { acc: [7, 7, 8, 7, 8, 7, 8, 7], rej: [1, 1, 1, 1, 1, 1, 2, 1], court: [0, 1, 1, 1, 1, 1, 1, 1] }, 'Омега-Сервис': { acc: [4, 4, 5, 4, 5, 4, 5, 4], rej: [3, 4, 4, 4, 4, 4, 5, 4], court: [2, 2, 3, 3, 3, 3, 3, 3] } },
      delay: { 'Альфа-Строй': [14, 16, 20, 18, 17, 19, 22, 15], 'БетаГрупп': [18, 21, 27, 24, 22, 25, 28, 20], 'Гамма-ТЭК': [6, 8, 10, 9, 8, 9, 11, 8], 'Дельта Инж': [10, 12, 15, 13, 12, 14, 16, 12], 'Сигма Плюс': [3, 4, 5, 4, 4, 4, 5, 4], 'Омега-Сервис': [24, 27, 34, 30, 28, 31, 36, 26] },
      act: { 'Альфа-Строй': { done: [10, 12, 13, 12, 13, 12, 14, 12], wip: [3, 3, 3, 3, 3, 3, 3, 3], late: [2, 2, 2, 2, 2, 2, 2, 2] }, 'БетаГрупп': { done: [9, 10, 11, 10, 11, 10, 11, 10], wip: [4, 4, 5, 4, 5, 4, 5, 4], late: [3, 3, 4, 3, 4, 3, 4, 3] }, 'Гамма-ТЭК': { done: [12, 13, 14, 13, 14, 13, 15, 13], wip: [2, 2, 2, 2, 2, 2, 2, 2], late: [1, 1, 1, 1, 1, 1, 1, 1] }, 'Дельта Инж': { done: [10, 11, 12, 11, 12, 11, 12, 11], wip: [3, 3, 3, 3, 3, 3, 3, 3], late: [2, 2, 2, 2, 2, 2, 2, 2] }, 'Сигма Плюс': { done: [13, 14, 15, 14, 15, 14, 15, 14], wip: [1, 1, 2, 1, 2, 1, 2, 1], late: [1, 1, 1, 1, 1, 1, 1, 1] }, 'Омега-Сервис': { done: [7, 8, 8, 8, 8, 8, 9, 8], wip: [5, 5, 5, 5, 5, 5, 6, 5], late: [4, 4, 5, 4, 5, 4, 5, 4] } },
      payment: {
        'Альфа-Строй': [[1.2, 1.3, 1.4, 1.3, 1.4, 1.3, 1.5, 1.4], [0.4, 0.5, 0.5, 0.5, 0.5, 0.5, 0.6, 0.5], [0.6, 0.7, 0.7, 0.7, 0.7, 0.7, 0.8, 0.7], [0.3, 0.3, 0.4, 0.3, 0.4, 0.3, 0.4, 0.4], [0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.6], [0.2, 0.2, 0.3, 0.2, 0.3, 0.2, 0.3, 0.3]],
        'БетаГрупп': [[1.8, 1.9, 2.0, 1.9, 2.0, 1.9, 2.1, 2.0], [0.5, 0.6, 0.6, 0.6, 0.6, 0.6, 0.7, 0.6], [0.8, 0.8, 0.9, 0.8, 0.9, 0.8, 1.0, 0.9], [0.4, 0.4, 0.5, 0.4, 0.5, 0.4, 0.5, 0.5], [0.6, 0.7, 0.7, 0.7, 0.7, 0.7, 0.8, 0.7], [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.4, 0.3]],
        'Гамма-ТЭК': [[0.7, 0.8, 0.8, 0.8, 0.8, 0.8, 0.9, 0.8], [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.4, 0.3], [0.4, 0.4, 0.5, 0.4, 0.5, 0.4, 0.5, 0.5], [0.2, 0.2, 0.3, 0.2, 0.3, 0.2, 0.3, 0.3], [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.5, 0.4], [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.3, 0.2]],
        'Дельта Инж': [[1.0, 1.1, 1.1, 1.1, 1.1, 1.1, 1.2, 1.1], [0.4, 0.4, 0.5, 0.4, 0.5, 0.4, 0.5, 0.5], [0.5, 0.6, 0.6, 0.6, 0.6, 0.6, 0.7, 0.6], [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.4, 0.3], [0.4, 0.5, 0.5, 0.5, 0.5, 0.5, 0.6, 0.5], [0.2, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3]],
        'Сигма Плюс': [[0.5, 0.6, 0.6, 0.6, 0.6, 0.6, 0.7, 0.6], [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.4, 0.3], [0.3, 0.3, 0.4, 0.3, 0.4, 0.3, 0.4, 0.4], [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.3, 0.2], [0.2, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3], [0.1, 0.1, 0.2, 0.1, 0.2, 0.1, 0.2, 0.2]],
        'Омега-Сервис': [[2.4, 2.5, 2.6, 2.5, 2.6, 2.5, 2.7, 2.6], [0.6, 0.7, 0.7, 0.7, 0.7, 0.7, 0.8, 0.7], [1.0, 1.1, 1.1, 1.1, 1.1, 1.1, 1.2, 1.1], [0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.6], [0.7, 0.7, 0.8, 0.7, 0.8, 0.7, 0.9, 0.8], [0.3, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4]],
      },
      drillCrit: { 'Альфа-Строй': [3, 4, 5, 4, 5, 4, 6, 4], 'БетаГрупп': [5, 6, 7, 6, 7, 6, 8, 7], 'Гамма-ТЭК': [2, 3, 4, 3, 4, 3, 5, 4], 'Дельта Инж': [3, 4, 4, 4, 4, 4, 5, 4], 'Сигма Плюс': [1, 2, 2, 2, 2, 2, 3, 2], 'Омега-Сервис': [7, 8, 10, 9, 10, 9, 11, 10] },
      drillPaidWithCrit: { 'Альфа-Строй': 0.62, 'БетаГрупп': 0.78, 'Гамма-ТЭК': 0.41, 'Дельта Инж': 0.56, 'Сигма Плюс': 0.18, 'Омега-Сервис': 0.88 },
    };

    // === НАРУШЕНИЯ ФЛАГМАН (источники фиксации: ВА / ВК / ПБ) ===
    const FL_SOURCES = ['ВА', 'ВК', 'ПБ'];
    const FL_SRC_COLORS = [C.blue2, C.purple, C.cyan];
    const FL_CRIT_RATIO = [0.35, 0.5, 0.15]; // доля критичных по источнику ВА/ВК/ПБ
    const FIELDS = ['Ярудейское', 'Новопортовское', 'Мессояхское', 'Вынгапуровское', 'Ямбургское'];
    const FIELD_W = [0.28, 0.22, 0.2, 0.16, 0.14];
    const FIELD_CRIT = [0.5, 0.3, 0.2, 0.42, 0.25];
    const BRIGADES = ['Бр-101', 'Бр-204', 'Бр-307', 'Бр-415', 'Бр-512', 'Бр-628'];
    const BRIG_W = [0.2, 0.18, 0.17, 0.16, 0.15, 0.14];
    const BRIG_CRIT = [0.4, 0.3, 0.52, 0.25, 0.35, 0.18];
    const WELLS = ['Скв-1024', 'Скв-877', 'Скв-2156', 'Скв-413', 'Скв-1890', 'Скв-602', 'Скв-1337', 'Скв-744', 'Скв-2009', 'Скв-318', 'Скв-1551', 'Скв-980', 'Скв-2233', 'Скв-455', 'Скв-1102'];
    const WELL_W = [0.12, 0.11, 0.1, 0.09, 0.085, 0.08, 0.072, 0.066, 0.06, 0.055, 0.05, 0.045, 0.04, 0.035, 0.03];
    const WELL_CRIT = [0.55, 0.2, 0.45, 0.15, 0.4, 0.3, 0.5, 0.18, 0.35, 0.25, 0.48, 0.22, 0.38, 0.12, 0.3];
    const FL_DIRECTIONS = ['Бурение', 'ТКРС', 'ГРП', 'Обустройство'];
    const DIR_W = [0.38, 0.26, 0.2, 0.16];
    const DIR_CRIT = [0.45, 0.18, 0.3, 0.22];
    // матрица «бригада × месторождение» (веса распределения нарушений)
    const HEAT_W = [
      [0.9, 0.5, 0.4, 0.3, 0.2], [0.4, 0.8, 0.3, 0.5, 0.2], [0.6, 0.3, 0.9, 0.2, 0.4],
      [0.3, 0.5, 0.2, 0.7, 0.3], [0.5, 0.2, 0.4, 0.3, 0.6], [0.2, 0.4, 0.3, 0.2, 0.5],
    ];
    // flCounts[contractor] = [ВА[8], ВК[8], ПБ[8]] — число нарушений по месяцам
    const FL_BASE: any = {
      flCounts: {
        'Альфа-Строй': [[6, 7, 8, 7, 8, 7, 9, 8], [4, 5, 5, 5, 5, 5, 6, 5], [3, 3, 4, 3, 4, 3, 4, 3]],
        'БетаГрупп': [[8, 9, 11, 10, 11, 10, 12, 11], [5, 6, 7, 6, 7, 6, 8, 7], [4, 4, 5, 4, 5, 4, 5, 4]],
        'Гамма-ТЭК': [[4, 5, 6, 5, 6, 5, 7, 6], [3, 3, 4, 3, 4, 3, 4, 3], [2, 2, 3, 2, 3, 2, 3, 2]],
        'Дельта Инж': [[5, 6, 7, 6, 7, 6, 8, 7], [4, 4, 5, 4, 5, 4, 5, 4], [2, 3, 3, 3, 3, 3, 4, 3]],
        'Сигма Плюс': [[3, 3, 4, 3, 4, 3, 4, 3], [2, 2, 3, 2, 3, 2, 3, 2], [1, 1, 2, 1, 2, 1, 2, 1]],
        'Омега-Сервис': [[10, 12, 14, 13, 14, 13, 16, 14], [7, 8, 9, 8, 9, 8, 10, 9], [5, 5, 6, 5, 6, 5, 7, 6]],
      },
    };

    // === УСЛУГИ ПО ДОГОВОРУ ===
    // label — то, что выбирается в фильтре; w — доля объёма (для масштабирования метрик)
    const SERVICES_DEF: { code: string; label: string; w: number }[] = [
      { code: '10203', label: '10203 — Зарезка боковых стволов и углублений под ключ', w: 0.16 },
      { code: '10204', label: '10204 — Бурение эксплуатационных скважин (суточная/фикс. ставка)', w: 0.26 },
      { code: '10205', label: '10205 — Зарезка боковых стволов и углубление (суточная/фикс. ставка)', w: 0.14 },
      { code: '10206', label: '10206 — ПИР при бурении/реконструкции скважин, авторский надзор', w: 0.10 },
      { code: '11014', label: '11014 — Строительный контроль за объектами строительства', w: 0.08 },
      { code: '11018', label: '11018 — ПИР Комплексное обустройство месторождений нефти и газа', w: 0.10 },
      { code: '11019', label: '11019 — ПИР Объекты добычи, подготовки и транспорта нефти', w: 0.09 },
      { code: '11016', label: '11016 — ПИР Прочие объекты обустройства', w: 0.07 },
    ];
    const SERVICE_LABELS = SERVICES_DEF.map(s => s.label);
    const SVC_COLORS = SERVICES_DEF.map(() => C.blue);

    // ==== Договорные данные ====
    // Матрица [contractor][svcIdx], svcIdx соответствует SERVICES_DEF
    const CONTRACT_VALUE: Record<string, number[]> = {
      'Альфа-Строй':   [25, 40, 18, 12,  8, 14, 10,  7],
      'БетаГрупп':     [35, 55, 25, 15, 12, 18, 14,  9],
      'Гамма-ТЭК':     [18, 30, 14, 10,  7, 12,  9,  6],
      'Дельта Инж':    [22, 38, 17, 11,  9, 15, 11,  8],
      'Сигма Плюс':    [12, 22,  9,  7,  5,  9,  7,  5],
      'Омега-Сервис':  [45, 70, 32, 20, 15, 22, 17, 12],
    };
    const CONTRACT_COUNT: Record<string, number[]> = {
      'Альфа-Строй':   [2, 3, 2, 1, 1, 1, 1, 1],
      'БетаГрупп':     [3, 4, 3, 2, 1, 2, 1, 1],
      'Гамма-ТЭК':     [2, 2, 2, 1, 1, 1, 1, 1],
      'Дельта Инж':    [2, 3, 2, 1, 1, 1, 1, 1],
      'Сигма Плюс':    [1, 2, 1, 1, 1, 1, 1, 1],
      'Омега-Сервис':  [4, 5, 3, 2, 2, 2, 2, 2],
    };
    // Освоение, доля 0..1 (по комбинации contractor × service)
    const OSVOENIE: Record<string, number[]> = {
      'Альфа-Строй':   [0.62, 0.58, 0.70, 0.55, 0.80, 0.65, 0.50, 0.72],
      'БетаГрупп':     [0.48, 0.50, 0.55, 0.42, 0.60, 0.45, 0.38, 0.55],
      'Гамма-ТЭК':     [0.75, 0.70, 0.82, 0.68, 0.85, 0.72, 0.60, 0.80],
      'Дельта Инж':    [0.65, 0.62, 0.72, 0.58, 0.78, 0.60, 0.52, 0.70],
      'Сигма Плюс':    [0.85, 0.82, 0.88, 0.75, 0.92, 0.78, 0.70, 0.88],
      'Омега-Сервис':  [0.35, 0.40, 0.45, 0.32, 0.50, 0.38, 0.30, 0.42],
    };
    const svcFactor = () => {
      const sel: string[] = filterState.services;
      const tot = SERVICES_DEF.reduce((a, s) => a + s.w, 0);
      const selW = SERVICES_DEF.filter(s => sel.includes(s.label)).reduce((a, s) => a + s.w, 0);
      return tot ? selW / tot : 0;
    };
    // Глубокое масштабирование числовых листьев. round=true для счётных метрик, false для сумм (млн ₽)
    const scaleDeep = (obj: any, f: number, round: boolean): any => {
      if (typeof obj === 'number') return round ? Math.round(obj * f) : obj * f;
      if (Array.isArray(obj)) return obj.map(v => scaleDeep(v, f, round));
      const o: any = {}; for (const k in obj) o[k] = scaleDeep(obj[k], f, round); return o;
    };
    // Объёмные метрики масштабируются по доле услуг; ставки/доли/средние — нет
    let MASTER: any = BASE;
    let FL: any = FL_BASE;
    const applyServiceScale = () => {
      const f = svcFactor();
      MASTER = {
        fine: scaleDeep(BASE.fine, f, false),
        proactive: scaleDeep(BASE.proactive, f, false),
        viol: scaleDeep(BASE.viol, f, true),
        npv: scaleDeep(BASE.npv, f, true),
        dpr_status: scaleDeep(BASE.dpr_status, f, true),
        delay: BASE.delay,                      // средние дни — без масштабирования
        act: scaleDeep(BASE.act, f, true),
        payment: scaleDeep(BASE.payment, f, false),
        drillCrit: scaleDeep(BASE.drillCrit, f, true),
        drillPaidWithCrit: BASE.drillPaidWithCrit, // доля — без масштабирования
      };
      FL = { flCounts: scaleDeep(FL_BASE.flCounts, f, true) };
    };

    let filterState: any = { monthFrom: 0, monthTo: 7, contractors: [...CONTRACTORS], categories: [...CATEGORIES], services: [...SERVICE_LABELS] };

    function buildMultiSelect(id: string, items: string[], colors: string[], stateKey: string) {
      const drop = $('drop' + id.charAt(0).toUpperCase() + id.slice(1));
      drop.innerHTML = '';
      const allEl = document.createElement('div'); allEl.className = 'multi-option multi-all';
      allEl.innerHTML = `<input type="checkbox" id="all_${id}" checked><label for="all_${id}" style="cursor:pointer;font-weight:700">Все</label>`;
      allEl.querySelector('input')!.addEventListener('change', (e: any) => {
        drop.querySelectorAll<HTMLInputElement>('input[data-item]').forEach(cb => (cb.checked = e.target.checked));
        filterState[stateKey] = e.target.checked ? [...items] : []; updateLabel(id, stateKey, items); applyFilters();
      }); drop.appendChild(allEl);
      items.forEach((item, i) => {
        const el = document.createElement('div'); el.className = 'multi-option';
        el.innerHTML = `<input type="checkbox" data-item="${item}" checked><span style="width:10px;height:10px;border-radius:2px;background:${colors[i]};display:inline-block;flex-shrink:0"></span><label style="cursor:pointer">${item}</label>`;
        el.querySelector('input')!.addEventListener('change', () => {
          filterState[stateKey] = [...drop.querySelectorAll<HTMLInputElement>('input[data-item]:checked')].map(cb => cb.dataset.item);
          (drop.querySelector('#all_' + id) as HTMLInputElement).checked = filterState[stateKey].length === items.length;
          updateLabel(id, stateKey, items); applyFilters();
        }); drop.appendChild(el);
      });
    }
    function updateLabel(id: string, stateKey: string, items: string[]) {
      const sel = filterState[stateKey]; const cap = id.charAt(0).toUpperCase() + id.slice(1);
      const lbl = $('lbl' + cap), badge = $('badge' + cap);
      if (sel.length === items.length) { lbl.textContent = 'Все'; badge.style.display = 'none'; }
      else if (sel.length === 0) { lbl.textContent = 'Нет'; badge.style.display = 'none'; }
      else { lbl.textContent = sel.length === 1 ? sel[0].substring(0, 12) : sel[0].substring(0, 8) + '…'; badge.textContent = String(sel.length); badge.style.display = 'inline-block'; }
    }
    function toggleDropdown(id: string) {
      const cap = id.charAt(0).toUpperCase() + id.slice(1);
      const drop = $('drop' + cap), btn = $('btn' + cap);
      const open = drop.classList.toggle('open'); btn.classList.toggle('open', open);
    }
    const docClick = (e: any) => {
      ['Contractor', 'Category', 'Service'].forEach(id => {
        const wrap = root.querySelector('#wrap' + id);
        if (wrap && !wrap.contains(e.target)) { $('drop' + id).classList.remove('open'); $('btn' + id).classList.remove('open'); }
      });
    };
    const cleanups: Array<() => void> = [];
    const on = (el: EventTarget, ev: string, fn: any) => {
      el.addEventListener(ev, fn);
      cleanups.push(() => el.removeEventListener(ev, fn));
    };
    on(document, 'click', docClick);

    const charts: Record<string, Chart> = {};
    function mkChart(id: string, cfg: any) { if (charts[id]) charts[id].destroy(); charts[id] = new Chart($(id) as HTMLCanvasElement, cfg); }
    const getMonths = () => MONTHS.slice(filterState.monthFrom, filterState.monthTo + 1);
    const monthIdxs = () => { const o = []; for (let i = filterState.monthFrom; i <= filterState.monthTo; i++) o.push(i); return o; };
    const filteredContractors = () => CONTRACTORS.filter(c => filterState.contractors.includes(c));
    const filteredMasterCats = () => MASTER_CATS.filter(c => filterState.categories.includes(c));
    // FL_TYPES при выборе → индексы в FL_SOURCES (по позиции)
    const filteredFlIdxs = (): number[] => FL_TYPES.map((t, i) => filterState.categories.includes(t) ? i : -1).filter(i => i >= 0);
    const sumOverMonths = (arr: number[]) => arr.filter((_, i) => i >= filterState.monthFrom && i <= filterState.monthTo).reduce((s, v) => s + v, 0);

    function renderContractData() {
      const cons = filteredContractors();
      const midxs = monthIdxs();
      const periodFactor = midxs.length / 8;
      // индексы выбранных услуг в SERVICES_DEF (по label)
      const svcIdxs: number[] = SERVICES_DEF.map((s, i) => filterState.services.includes(s.label) ? i : -1).filter(i => i >= 0);

      // KPI
      let totalCount = 0;
      let totalValue = 0;
      const valByCon: Record<string, number> = {};
      const valBySvc: number[] = svcIdxs.map(() => 0);
      const osvByCon: Record<string, number> = {};  // млн руб освоено
      const osvBySvc: number[] = svcIdxs.map(() => 0);
      cons.forEach(c => {
        let conVal = 0, conOsv = 0;
        svcIdxs.forEach((si, j) => {
          const v = (CONTRACT_VALUE[c]?.[si] || 0) * periodFactor;
          const cnt = (CONTRACT_COUNT[c]?.[si] || 0) * periodFactor;
          const o = (OSVOENIE[c]?.[si] || 0);
          totalValue += v;
          totalCount += cnt;
          conVal += v;
          conOsv += v * o;
          valBySvc[j] += v;
          osvBySvc[j] += v * o;
        });
        valByCon[c] = +conVal.toFixed(1);
        osvByCon[c] = conVal > 0 ? +((conOsv / conVal) * 100).toFixed(1) : 0;
      });

      $('kpi-cd').innerHTML = `
        <div class="kpi" style="--kpi-accent:var(--blue2)"><div class="kpi-label">Кол-во договоров</div><div class="kpi-value">${Math.round(totalCount)}</div><div class="kpi-sub">в выборке</div></div>
        <div class="kpi" style="--kpi-accent:var(--purple)"><div class="kpi-label">Контрагентов</div><div class="kpi-value">${cons.length}</div><div class="kpi-sub">в выборке</div></div>
        <div class="kpi" style="--kpi-accent:var(--green)"><div class="kpi-label">Сумма договоров</div><div class="kpi-value">${totalValue.toFixed(1)}М</div><div class="kpi-sub">млн ₽</div></div>
        <div class="kpi" style="--kpi-accent:var(--orange)"><div class="kpi-label">Услуг в выборке</div><div class="kpi-value">${svcIdxs.length}</div><div class="kpi-sub">из ${SERVICES_DEF.length}</div></div>`;

      // CD1 — распределение договоров по видам услуг (млн ₽)
      const svcLabels = svcIdxs.map(si => SERVICES_DEF[si].code);
      const svcFullLabels = svcIdxs.map(si => SERVICES_DEF[si].label);
      mkChart('cCd1', { type: 'bar', data: { labels: svcLabels, datasets: [{ label: 'Сумма договоров, млн ₽', data: valBySvc.map(v => +v.toFixed(1)), backgroundColor: a(C.blue2, .85), borderRadius: 3 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { title: (items: any) => svcFullLabels[items[0].dataIndex], label: (ctx: any) => ` ${ctx.parsed.y.toFixed(1)} млн ₽` } } }, scales: { x: { grid: { display: false } }, y: { ticks: { callback: (v: any) => v + 'М' }, grid: { color: GRID } } } } });

      // CD2 — распределение договоров по контрагентам (млн ₽)
      const sortedConsByVal = [...cons].sort((x, y) => (valByCon[y] || 0) - (valByCon[x] || 0));
      mkChart('cCd2', { type: 'bar', data: { labels: sortedConsByVal, datasets: [{ label: 'Сумма договоров, млн ₽', data: sortedConsByVal.map(c => valByCon[c]), backgroundColor: sortedConsByVal.map(c => a(CON_COLORS[CONTRACTORS.indexOf(c)], .85)), borderRadius: 3 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.parsed.x.toFixed(1)} млн ₽` } } }, scales: { x: { ticks: { callback: (v: any) => v.toFixed(0) + 'М' }, grid: { color: GRID } }, y: { grid: { display: false } } } } });

      // CD3 — Освоение по услугам (%)
      const osvSvcPct = osvBySvc.map((o, i) => valBySvc[i] > 0 ? +((o / valBySvc[i]) * 100).toFixed(1) : 0);
      mkChart('cCd3', { type: 'bar', data: { labels: svcLabels, datasets: [{ label: 'Освоение, %', data: osvSvcPct, backgroundColor: osvSvcPct.map(p => p >= 70 ? a(C.green, .85) : p >= 50 ? a(C.yellow, .85) : a(C.red, .85)), borderRadius: 3 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { title: (items: any) => svcFullLabels[items[0].dataIndex], label: (ctx: any) => ` Освоено ${ctx.parsed.y.toFixed(1)}%` } } }, scales: { x: { grid: { display: false } }, y: { min: 0, max: 100, ticks: { callback: (v: any) => v + '%' }, grid: { color: GRID } } } } });

      // CD4 — Освоение по контрагентам (%)
      const sortedConsByOsv = [...cons].sort((x, y) => (osvByCon[y] || 0) - (osvByCon[x] || 0));
      mkChart('cCd4', { type: 'bar', data: { labels: sortedConsByOsv, datasets: [{ label: 'Освоение, %', data: sortedConsByOsv.map(c => osvByCon[c]), backgroundColor: sortedConsByOsv.map(c => { const p = osvByCon[c] || 0; return p >= 70 ? a(C.green, .85) : p >= 50 ? a(C.yellow, .85) : a(C.red, .85); }), borderRadius: 3 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` Освоено ${ctx.parsed.x.toFixed(1)}%` } } }, scales: { x: { min: 0, max: 100, ticks: { callback: (v: any) => v + '%' }, grid: { color: GRID } }, y: { grid: { display: false } } } } });
    }

    function renderFinance() {
      const cons = filteredContractors(), midxs = monthIdxs();
      let totIssued = 0, totAcc = 0, totPaid = 0; const uncovered: any = {}, issued_by_c: any = {}, proactive_by_c: any = {};
      cons.forEach(c => { let ci = 0, ca = 0, cp = 0; midxs.forEach(m => { ci += MASTER.fine[c][m][0]; ca += MASTER.fine[c][m][1]; cp += MASTER.fine[c][m][2]; }); totIssued += ci; totAcc += ca; totPaid += cp; uncovered[c] = +(ci - ca - cp).toFixed(2); issued_by_c[c] = +ci.toFixed(2); proactive_by_c[c] = MASTER.proactive[c]; });
      const totUnc = +(totIssued - totAcc - totPaid).toFixed(2);
      $('kpi-finance').innerHTML = `
        <div class="kpi" style="--kpi-accent:var(--blue2)"><div class="kpi-label">Выставлено</div><div class="kpi-value">${totIssued.toFixed(1)}М</div><div class="kpi-sub">штрафных претензий</div></div>
        <div class="kpi" style="--kpi-accent:var(--yellow)"><div class="kpi-label">Принято</div><div class="kpi-value">${totAcc.toFixed(1)}М</div><div class="kpi-sub">${totIssued > 0 ? Math.round(totAcc / totIssued * 100) : 0}% от выставленных</div></div>
        <div class="kpi" style="--kpi-accent:var(--green)"><div class="kpi-label">Оплачено</div><div class="kpi-value">${totPaid.toFixed(1)}М</div><div class="kpi-sub">${totIssued > 0 ? Math.round(totPaid / totIssued * 100) : 0}% от выставленных</div></div>
        <div class="kpi" style="--kpi-accent:var(--red)"><div class="kpi-label">Непокрытый долг</div><div class="kpi-value">${totUnc.toFixed(1)}М</div><div class="kpi-sub">не оплачено</div><span class="kpi-badge badge-red">⚠</span></div>`;
      mkChart('c1', { type: 'bar', data: { labels: ['Выставлено', 'Принято', 'Оплачено', 'Непокрытый остаток'], datasets: [{ data: [+totIssued.toFixed(2), +totAcc.toFixed(2), +totPaid.toFixed(2), totUnc], backgroundColor: [a(C.blue2, .8), a(C.yellow, .8), a(C.green, .8), a(C.red, .8)], borderColor: [C.blue2, C.yellow, C.green, C.red], borderWidth: 1.5, borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.parsed.y.toFixed(2)} М ₽` } } }, scales: { x: { grid: { display: false } }, y: { ticks: { callback: (v: any) => v + 'М' }, grid: { color: GRID } } } } });
      const sortedCons = [...cons].sort((x, y) => (uncovered[y] || 0) - (uncovered[x] || 0));
      mkChart('c2', { type: 'bar', data: { labels: sortedCons, datasets: [{ label: 'Непокрыто, млн ₽', data: sortedCons.map(c => Math.max(0, uncovered[c] || 0)), backgroundColor: (ctx: any) => ctx.raw > 5 ? a(C.red, .8) : ctx.raw > 2 ? a(C.orange, .8) : a(C.yellow, .8), borderRadius: 3 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.parsed.x.toFixed(2)} М ₽` } } }, scales: { x: { ticks: { callback: (v: any) => v.toFixed(1) + 'М' }, grid: { color: GRID } }, y: { grid: { display: false } } } } });
      const months = getMonths();
      const issuedByM = midxs.map(m => +cons.reduce((s, c) => s + MASTER.fine[c][m][0], 0).toFixed(2));
      const accByM = midxs.map(m => +cons.reduce((s, c) => s + MASTER.fine[c][m][1], 0).toFixed(2));
      mkChart('c3', { type: 'line', data: { labels: months, datasets: [{ label: 'Выставлено', data: issuedByM, borderColor: C.blue2, backgroundColor: a(C.blue2, .12), borderWidth: 2.5, tension: .4, fill: true, pointRadius: 4, pointBackgroundColor: C.blue2, pointBorderColor: PT, pointBorderWidth: 2 }, { label: 'Принято', data: accByM, borderColor: C.yellow, backgroundColor: a(C.yellow, .08), borderWidth: 2.5, tension: .4, fill: true, pointRadius: 4, pointBackgroundColor: C.yellow, pointBorderColor: PT, pointBorderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', padding: 14 } } }, scales: { x: { grid: { color: GRID } }, y: { ticks: { callback: (v: any) => v + 'М' }, grid: { color: GRID } } } } });
      mkChart('c4', { type: 'bar', data: { labels: cons, datasets: [{ label: 'Проактив, млн ₽', data: cons.map(c => proactive_by_c[c]), backgroundColor: a(C.green, .8), borderRadius: 3 }, { label: 'Штрафы, млн ₽', data: cons.map(c => issued_by_c[c]), backgroundColor: a(C.red, .8), borderRadius: 3 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 14 } } }, scales: { x: { grid: { display: false } }, y: { ticks: { callback: (v: any) => v + 'М' }, grid: { color: GRID } } } } });
    }

    function renderViolations() {
      const cons = filteredContractors(), cats = filteredMasterCats(), midxs = monthIdxs(), months = getMonths();
      const catTotals = cats.map(cat => cons.reduce((s, c) => s + sumOverMonths(MASTER.viol[cat][c]), 0));
      const total = catTotals.reduce((s, v) => s + v, 0);
      const top12 = cats.includes('ТОП-12') ? cons.reduce((s, c) => s + sumOverMonths(MASTER.viol['ТОП-12'][c]), 0) : 0;
      const npvTot = cons.reduce((s, c) => s + sumOverMonths(MASTER.npv[c]), 0);
      $('kpi-viol').innerHTML = `
        <div class="kpi" style="--kpi-accent:var(--red)"><div class="kpi-label">Всего нарушений</div><div class="kpi-value">${total}</div><div class="kpi-sub">за период</div></div>
        <div class="kpi" style="--kpi-accent:var(--red)"><div class="kpi-label">ТОП-12</div><div class="kpi-value">${top12}</div><div class="kpi-sub">${total > 0 ? Math.round(top12 / total * 100) : 0}% от всех</div><span class="kpi-badge badge-red">⚠</span></div>
        <div class="kpi" style="--kpi-accent:var(--orange)"><div class="kpi-label">НПВ суммарно</div><div class="kpi-value">${npvTot} ч</div><div class="kpi-sub">за период</div></div>
        <div class="kpi" style="--kpi-accent:var(--blue2)"><div class="kpi-label">Подрядчиков</div><div class="kpi-value">${cons.length}</div><div class="kpi-sub">в выборке</div></div>`;
      mkChart('c5', { type: 'doughnut', data: { labels: cats, datasets: [{ data: catTotals, backgroundColor: cats.map(c => a(CAT_COLORS[CATEGORIES.indexOf(c)], .85)), borderColor: PT, borderWidth: 3, hoverOffset: 8 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '64%', plugins: { legend: { position: 'right', labels: { padding: 12, boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: 'rectRounded' } }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed} (${total ? Math.round(ctx.parsed / total * 100) : 0}%)` } } } } });
      mkChart('c6', { type: 'bar', data: { labels: months, datasets: cats.map(cat => ({ label: cat, data: midxs.map(m => cons.reduce((s, c) => s + MASTER.viol[cat][c][m], 0)), backgroundColor: a(CAT_COLORS[CATEGORIES.indexOf(cat)], .85), borderRadius: 2 })) }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 10, boxWidth: 10 } } }, scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, grid: { color: GRID } } } } });
      mkChart('c7', { type: 'bar', data: { labels: cons, datasets: cats.map(cat => ({ label: cat, data: cons.map(c => sumOverMonths(MASTER.viol[cat][c])), backgroundColor: a(CAT_COLORS[CATEGORIES.indexOf(cat)], .85) })) }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 10, boxWidth: 10 } } }, scales: { x: { stacked: true, grid: { color: GRID } }, y: { stacked: true, grid: { display: false } } } } });
      const totV = total;
      mkChart('c8', { type: 'bar', data: { labels: ['Новое', 'На рассмотрении', 'Оспаривается', 'Подтверждено', 'Закрыто', 'Отклонено'], datasets: [{ data: [Math.round(totV * .10), Math.round(totV * .21), Math.round(totV * .07), Math.round(totV * .25), Math.round(totV * .30), Math.round(totV * .07)], backgroundColor: [a(C.blue2, .85), a(C.yellow, .85), a(C.orange, .85), a(C.red, .85), a(C.green, .85), a(C.cyan, .85)], borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: GRID } } } } });
      const npvByCon = cons.map(c => sumOverMonths(MASTER.npv[c]));
      const sortedIdx = cons.map((_, i) => i).sort((x, y) => npvByCon[y] - npvByCon[x]);
      mkChart('c9', { type: 'bar', data: { labels: sortedIdx.map(i => cons[i]), datasets: [{ label: 'НПВ, ч', data: sortedIdx.map(i => npvByCon[i]), backgroundColor: (ctx: any) => ctx.raw > 500 ? a(C.red, .8) : ctx.raw > 300 ? a(C.orange, .8) : a(C.yellow, .8), borderRadius: 3 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.parsed.x} ч` } } }, scales: { x: { grid: { color: GRID } }, y: { grid: { display: false } } } } });

      // #17 — Динамика нарушений по подрядчику (кварталы) — перенесено из вкладки «Рейтинг»
      const seed17 = (c: string, q: number) => { const base = [40, 45, 55, 50, 60, 55, 65, 58]; const mult: any = { 'Альфа-Строй': 1.0, 'БетаГрупп': 1.3, 'Гамма-ТЭК': 0.8, 'Дельта Инж': 0.9, 'Сигма Плюс': 0.6, 'Омега-Сервис': 1.8 }; return Math.round(base[q] * (mult[c] || 1) + (c.charCodeAt(0) % 7 - 3)); };
      mkChart('c17', { type: 'line', data: { labels: QUARTERS, datasets: cons.map(c => ({ label: c, data: QUARTERS.map((_, q) => seed17(c, q)), borderColor: CON_COLORS[CONTRACTORS.indexOf(c)], backgroundColor: a(CON_COLORS[CONTRACTORS.indexOf(c)], .07), borderWidth: 2, tension: .4, fill: false, pointRadius: 3, pointBackgroundColor: CON_COLORS[CONTRACTORS.indexOf(c)], pointBorderColor: PT, pointBorderWidth: 1.5 })) }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 10, boxWidth: 10, font: { size: 10 } } } }, scales: { x: { grid: { color: GRID } }, y: { grid: { color: GRID } } } } });
    }

    function renderFlagman() {
      const cons = filteredContractors(), cats = filteredMasterCats(), midxs = monthIdxs(), months = getMonths();
      const GRAY = '#aab4bd';
      const flIdxs = filteredFlIdxs();
      const srcSum = (c: string, si: number) => sumOverMonths(FL.flCounts[c][si]);
      const srcTotals = flIdxs.map(si => cons.reduce((s, c) => s + srcSum(c, si), 0));
      const flTotal = srcTotals.reduce((s, v) => s + v, 0);
      const sc = (w: number) => Math.round(flTotal * w);

      // П1 — структура по типу источника (donut)
      const flLabels = flIdxs.map(si => ({ 0: 'Видеоаналитика (ВА)', 1: 'Видеоконтроль (ВК)', 2: 'Прочие ПБ' } as any)[si]);
      const flColors = flIdxs.map(si => FL_SRC_COLORS[si]);
      const flShortLabels = flIdxs.map(si => FL_SOURCES[si]);
      mkChart('cFl1', { type: 'doughnut', data: { labels: flLabels, datasets: [{ data: srcTotals, backgroundColor: flColors.map(c => a(c, .85)), borderColor: PT, borderWidth: 3, hoverOffset: 8 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '62%', plugins: { legend: { position: 'right', labels: { padding: 12, boxWidth: 10, usePointStyle: true, pointStyle: 'rectRounded' } }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed} (${flTotal ? Math.round(ctx.parsed / flTotal * 100) : 0}%)` } } } } });

      // П2 — по уровню критичности (grouped bar per source)
      const critBySrc = srcTotals.map((t, i) => Math.round(t * FL_CRIT_RATIO[flIdxs[i]]));
      const minorBySrc = srcTotals.map((t, i) => t - critBySrc[i]);
      mkChart('cFl2', { type: 'bar', data: { labels: flShortLabels, datasets: [{ label: 'Критичные', data: critBySrc, backgroundColor: a(C.red, .85), borderRadius: 3 }, { label: 'Незначительные', data: minorBySrc, backgroundColor: a(GRAY, .85), borderRadius: 3 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 12 } } }, scales: { x: { grid: { display: false } }, y: { grid: { color: GRID } } } } });

      // П3 — по подрядчикам и типу источника (h-stacked, sorted desc)
      const conTotal: any = {}; cons.forEach(c => { conTotal[c] = flIdxs.reduce((s, si) => s + srcSum(c, si), 0); });
      const sortedCons = [...cons].sort((x, y) => conTotal[y] - conTotal[x]);
      mkChart('cFl3', { type: 'bar', data: { labels: sortedCons, datasets: flIdxs.map(si => ({ label: FL_SOURCES[si], data: sortedCons.map(c => srcSum(c, si)), backgroundColor: a(FL_SRC_COLORS[si], .85) })) }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 10, boxWidth: 10 } } }, scales: { x: { stacked: true, grid: { color: GRID } }, y: { stacked: true, grid: { display: false } } } } });

      // П4 — по месторождениям (h-bar, цвет по доле критичных)
      const fieldData = FIELDS.map((f, i) => ({ f, total: sc(FIELD_W[i]), crit: FIELD_CRIT[i] })).sort((x, y) => y.total - x.total);
      mkChart('cFl4', { type: 'bar', data: { labels: fieldData.map(d => d.f), datasets: [{ label: 'Нарушения', data: fieldData.map(d => d.total), backgroundColor: fieldData.map(d => d.crit > 0.4 ? a(C.red, .8) : d.crit > 0.25 ? a(C.yellow, .85) : a(C.green, .8)), borderRadius: 3 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.parsed.x} нар. (крит. ${Math.round(fieldData[ctx.dataIndex].crit * 100)}%)` } } }, scales: { x: { grid: { color: GRID } }, y: { grid: { display: false } } } } });

      // П5 — по бригадам (h-bar stacked crit/minor, sorted desc)
      const brigData = BRIGADES.map((b, i) => { const total = sc(BRIG_W[i]); const crit = Math.round(total * BRIG_CRIT[i]); return { b, total, crit, minor: total - crit }; }).sort((x, y) => y.total - x.total);
      mkChart('cFl5', { type: 'bar', data: { labels: brigData.map(d => d.b), datasets: [{ label: 'Критичные', data: brigData.map(d => d.crit), backgroundColor: a(C.red, .85), borderRadius: 3, stack: 's' }, { label: 'Незначительные', data: brigData.map(d => d.minor), backgroundColor: a(GRAY, .85), borderRadius: 3, stack: 's' }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 10, boxWidth: 10 } } }, scales: { x: { stacked: true, grid: { color: GRID } }, y: { stacked: true, grid: { display: false } } } } });

      // П6 — по скважинам ТОП-15 (h-bar, цвет по критичности)
      const wellData = WELLS.map((w, i) => ({ w, total: sc(WELL_W[i]), crit: WELL_CRIT[i] })).sort((x, y) => y.total - x.total);
      mkChart('cFl6', { type: 'bar', data: { labels: wellData.map(d => d.w), datasets: [{ label: 'Нарушения', data: wellData.map(d => d.total), backgroundColor: wellData.map(d => d.crit > 0.4 ? a(C.red, .8) : d.crit > 0.25 ? a(C.orange, .8) : a(C.yellow, .85)), borderRadius: 3 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.parsed.x} нар. (крит. ${Math.round(wellData[ctx.dataIndex].crit * 100)}%)` } } }, scales: { x: { grid: { color: GRID } }, y: { grid: { display: false }, ticks: { font: { size: 10 } } } } } });

      // П7 — динамика по месяцам и типу источника (stacked bar)
      mkChart('cFl7', { type: 'bar', data: { labels: months, datasets: flIdxs.map(si => ({ label: FL_SOURCES[si], data: midxs.map(m => cons.reduce((s, c) => s + FL.flCounts[c][si][m], 0)), backgroundColor: a(FL_SRC_COLORS[si], .85), borderRadius: 2 })) }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 10, boxWidth: 10 } } }, scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, grid: { color: GRID } } } } });

      // П8 — критичные нарушения по направлению работ (grouped bar)
      const dirCrit = FL_DIRECTIONS.map((_, i) => sc(DIR_W[i] * DIR_CRIT[i]));
      const dirMinor = FL_DIRECTIONS.map((_, i) => sc(DIR_W[i]) - sc(DIR_W[i] * DIR_CRIT[i]));
      mkChart('cFl8', { type: 'bar', data: { labels: FL_DIRECTIONS, datasets: [{ label: 'Критичные', data: dirCrit, backgroundColor: a(C.red, .85), borderRadius: 3 }, { label: 'Незначительные', data: dirMinor, backgroundColor: a(GRAY, .85), borderRadius: 3 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 12 } } }, scales: { x: { grid: { display: false } }, y: { grid: { color: GRID } } } } });

      // П9 — ВА/ВК/ПБ vs основной реестр (dual axis line)
      const flByM = midxs.map(m => flIdxs.reduce((s, si) => s + cons.reduce((ss, c) => ss + FL.flCounts[c][si][m], 0), 0));
      const mainByM = midxs.map(m => cats.reduce((s, cat) => s + cons.reduce((ss, c) => ss + MASTER.viol[cat][c][m], 0), 0));
      mkChart('cFl9', { type: 'line', data: { labels: months, datasets: [{ label: 'Флагман (ВА/ВК/ПБ)', data: flByM, borderColor: C.blue2, backgroundColor: a(C.blue2, .12), borderWidth: 2.5, tension: .4, fill: true, pointRadius: 4, pointBackgroundColor: C.blue2, pointBorderColor: PT, pointBorderWidth: 2, yAxisID: 'y' }, { label: 'Основной реестр', data: mainByM, borderColor: C.red, backgroundColor: 'transparent', borderWidth: 2.5, tension: .4, fill: false, pointRadius: 4, pointBackgroundColor: C.red, pointBorderColor: PT, pointBorderWidth: 2, yAxisID: 'y2', borderDash: [5, 3] }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 14 } } }, scales: { x: { grid: { color: GRID } }, y: { position: 'left', title: { display: true, text: 'Флагман', color: AXIS }, grid: { color: GRID } }, y2: { position: 'right', title: { display: true, text: 'Реестр', color: AXIS }, grid: { display: false } } } } });

      // П10 — тепловая карта «бригада × месторождение»
      const heatNorm = HEAT_W.reduce((s, row) => s + row.reduce((a2, v) => a2 + v, 0), 0);
      const heat = HEAT_W.map(row => row.map(w => Math.round(flTotal * w / heatNorm)));
      const maxCell = Math.max(1, ...heat.flat());
      const heatHtml = `<table class="heat-table"><thead><tr><th></th>${FIELDS.map(f => `<th>${f}</th>`).join('')}</tr></thead><tbody>${BRIGADES.map((b, bi) => `<tr><td class="heat-row">${b}</td>${heat[bi].map(v => { const t = v / maxCell; const isCrit = t > 0.66; return `<td class="heat-cell" style="background:${a(C.red, 0.08 + t * 0.55)};color:${isCrit ? '#fff' : '#002033'}">${v}</td>`; }).join('')}</tr>`).join('')}</tbody></table>`;
      $('flHeat').innerHTML = heatHtml;
    }

    function renderDPR() {
      const cons = filteredContractors(), midxs = monthIdxs();
      let totAcc = 0, totRej = 0, totCourt = 0; const delayByCon: any = {}, courtByCon: any = {}, courtSumByCon: any = {};
      cons.forEach(c => { const d = MASTER.dpr_status[c]; const ca = midxs.reduce((s, m) => s + d.acc[m], 0), cr = midxs.reduce((s, m) => s + d.rej[m], 0), cc = midxs.reduce((s, m) => s + d.court[m], 0); totAcc += ca; totRej += cr; totCourt += cc; delayByCon[c] = +(midxs.reduce((s, m) => s + MASTER.delay[c][m], 0) / midxs.length).toFixed(1); courtByCon[c] = cc; courtSumByCon[c] = +(cc * 1.8).toFixed(1); });
      const totAll = totAcc + totRej + totCourt;
      const avgDelay = cons.length ? (cons.reduce((s, c) => s + delayByCon[c], 0) / cons.length).toFixed(1) : 0;
      $('kpi-dpr').innerHTML = `
        <div class="kpi" style="--kpi-accent:var(--blue2)"><div class="kpi-label">Всего ДПР</div><div class="kpi-value">${totAll}</div><div class="kpi-sub">за период</div></div>
        <div class="kpi" style="--kpi-accent:var(--green)"><div class="kpi-label">Принято</div><div class="kpi-value">${totAll ? Math.round(totAcc / totAll * 100) : 0}%</div><div class="kpi-sub">${totAcc} претензий</div></div>
        <div class="kpi" style="--kpi-accent:var(--red)"><div class="kpi-label">В суде</div><div class="kpi-value">${totCourt}</div><div class="kpi-sub">активных дел</div><span class="kpi-badge badge-red">⚠</span></div>
        <div class="kpi" style="--kpi-accent:var(--orange)"><div class="kpi-label">Ср. просрочка</div><div class="kpi-value">${avgDelay}</div><div class="kpi-sub">дней ответа</div></div>`;
      mkChart('c10', { type: 'doughnut', data: { labels: ['Принято', 'Отклонено', 'Судебное'], datasets: [{ data: [totAcc, totRej, totCourt], backgroundColor: [a(C.green, .85), a(C.red, .85), a(C.orange, .85)], borderColor: PT, borderWidth: 3, hoverOffset: 8 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '62%', plugins: { legend: { position: 'right', labels: { padding: 14, boxWidth: 10, usePointStyle: true, pointStyle: 'rectRounded' } }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed} (${totAll ? Math.round(ctx.parsed / totAll * 100) : 0}%)` } } } } });
      const sortedCons = [...cons].sort((x, y) => delayByCon[y] - delayByCon[x]);
      mkChart('c11', { type: 'bar', data: { labels: sortedCons, datasets: [{ label: 'Просрочка, дн.', data: sortedCons.map(c => delayByCon[c]), backgroundColor: (ctx: any) => ctx.raw > 20 ? a(C.red, .8) : ctx.raw > 10 ? a(C.orange, .8) : a(C.yellow, .8), borderRadius: 3 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.parsed.x} дн.` } } }, scales: { x: { grid: { color: GRID } }, y: { grid: { display: false } } } } });
      mkChart('c12', { type: 'bar', data: { labels: cons, datasets: [{ type: 'bar', label: 'Кол-во дел', data: cons.map(c => courtByCon[c]), backgroundColor: a(C.orange, .8), borderRadius: 3, yAxisID: 'y' }, { type: 'line', label: 'Сумма, млн ₽', data: cons.map(c => courtSumByCon[c]), borderColor: C.yellow, backgroundColor: a(C.yellow, .1), borderWidth: 2.5, tension: .3, pointRadius: 5, pointBackgroundColor: C.yellow, pointBorderColor: PT, pointBorderWidth: 2, yAxisID: 'y2' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 14 } } }, scales: { x: { grid: { display: false } }, y: { position: 'left', title: { display: true, text: 'Дел', color: AXIS }, grid: { color: GRID } }, y2: { position: 'right', title: { display: true, text: 'Млн ₽', color: AXIS }, grid: { display: false }, ticks: { callback: (v: any) => v + 'М' } } } } });
    }

    function renderActivities() {
      const cons = filteredContractors(), midxs = monthIdxs();
      let totDone = 0, totWip = 0, totLate = 0;
      cons.forEach(c => { const d = MASTER.act[c]; totDone += midxs.reduce((s, m) => s + d.done[m], 0); totWip += midxs.reduce((s, m) => s + d.wip[m], 0); totLate += midxs.reduce((s, m) => s + d.late[m], 0); });
      const totAct = totDone + totWip + totLate;
      $('kpi-act').innerHTML = `
        <div class="kpi" style="--kpi-accent:var(--blue2)"><div class="kpi-label">Всего мероприятий</div><div class="kpi-value">${totAct}</div><div class="kpi-sub">за период</div></div>
        <div class="kpi" style="--kpi-accent:var(--green)"><div class="kpi-label">Реализовано</div><div class="kpi-value">${totAct ? Math.round(totDone / totAct * 100) : 0}%</div><div class="kpi-sub">${totDone} шт.</div><span class="kpi-badge badge-green">↑</span></div>
        <div class="kpi" style="--kpi-accent:var(--red)"><div class="kpi-label">Просрочено</div><div class="kpi-value">${totLate}</div><div class="kpi-sub">не реализовано в срок</div><span class="kpi-badge badge-red">⚠</span></div>
        <div class="kpi" style="--kpi-accent:var(--yellow)"><div class="kpi-label">В работе</div><div class="kpi-value">${totWip}</div><div class="kpi-sub">активных</div></div>`;
      mkChart('c13', { type: 'bar', data: { labels: cons, datasets: [{ label: 'Реализовано', data: cons.map(c => midxs.reduce((s, m) => s + MASTER.act[c].done[m], 0)), backgroundColor: a(C.green, .85), borderRadius: 3 }, { label: 'В работе', data: cons.map(c => midxs.reduce((s, m) => s + MASTER.act[c].wip[m], 0)), backgroundColor: a(C.yellow, .85) }, { label: 'Просрочено', data: cons.map(c => midxs.reduce((s, m) => s + MASTER.act[c].late[m], 0)), backgroundColor: a(C.red, .85) }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 12 } } }, scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, grid: { color: GRID } } } } });
      const lateByCon = cons.map(c => midxs.reduce((s, m) => s + MASTER.act[c].late[m], 0));
      const sortIdx = cons.map((_, i) => i).sort((x, y) => lateByCon[y] - lateByCon[x]);
      mkChart('c14', { type: 'bar', data: { labels: sortIdx.map(i => cons[i]), datasets: [{ label: 'Просрочено', data: sortIdx.map(i => lateByCon[i]), backgroundColor: (ctx: any) => ctx.raw > 15 ? a(C.red, .8) : ctx.raw > 8 ? a(C.orange, .8) : a(C.yellow, .8), borderRadius: 3 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: GRID } }, y: { grid: { display: false } } } } });
      const top12 = filterState.categories.includes('ТОП-12');
      const base = top12 ? cons.reduce((s, c) => s + sumOverMonths(MASTER.viol['ТОП-12'][c]), 0) : 0;
      mkChart('c15', { type: 'bar', data: { labels: ['Запланировано', 'В работе', 'На согласовании', 'Реализовано', 'Просрочено', 'Закрыто'], datasets: [{ data: [Math.round(base * .18), Math.round(base * .12), Math.round(base * .08), Math.round(base * .37), Math.round(base * .16), Math.round(base * .09)], backgroundColor: [a(C.blue2, .85), a(C.yellow, .85), a(C.purple, .85), a(C.green, .85), a(C.red, .85), a(C.cyan, .85)], borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => `${ctx.label}: ${ctx.parsed.y}` } } }, scales: { x: { grid: { display: false } }, y: { grid: { color: GRID } } } } });
    }

    function renderMotivation() {
      const cons = filteredContractors(), midxs = monthIdxs(), months = getMonths();
      const paymentByService = SERVICES.map((_, si) => cons.reduce((s, c) => s + sumOverMonths(MASTER.payment[c][si]), 0));
      const totalPayment = paymentByService.reduce((s, v) => s + v, 0);
      const paymentByContractor: any = {};
      cons.forEach(c => { paymentByContractor[c] = +SERVICES.reduce((s, _, si) => s + sumOverMonths(MASTER.payment[c][si]), 0).toFixed(2); });
      const drillingTotal = cons.reduce((s, c) => s + sumOverMonths(MASTER.payment[c][0]), 0);
      const drillPayByCon: any = {}, drillCritByCon: any = {}, drillPaidWithCritByCon: any = {};
      cons.forEach(c => {
        drillPayByCon[c] = +sumOverMonths(MASTER.payment[c][0]).toFixed(2);
        drillCritByCon[c] = sumOverMonths(MASTER.drillCrit[c]);
        drillPaidWithCritByCon[c] = +(drillPayByCon[c] * MASTER.drillPaidWithCrit[c]).toFixed(2);
      });
      const totalCritDrill = cons.reduce((s, c) => s + drillCritByCon[c], 0);
      const totalPaidWithCrit = cons.reduce((s, c) => s + drillPaidWithCritByCon[c], 0);
      const pctPaidWithCrit = drillingTotal > 0 ? Math.round(totalPaidWithCrit / drillingTotal * 100) : 0;
      $('kpi-motiv').innerHTML = `
        <div class="kpi" style="--kpi-accent:var(--orange)"><div class="kpi-label">Выплачено мотивации</div><div class="kpi-value">${totalPayment.toFixed(1)}М</div><div class="kpi-sub">из актов выполненных работ</div></div>
        <div class="kpi" style="--kpi-accent:var(--blue2)"><div class="kpi-label">Эксплуатационное бурение</div><div class="kpi-value">${drillingTotal.toFixed(1)}М</div><div class="kpi-sub">${totalPayment > 0 ? Math.round(drillingTotal / totalPayment * 100) : 0}% от всех выплат</div></div>
        <div class="kpi" style="--kpi-accent:var(--red)"><div class="kpi-label">Критичных нарушений (бурение)</div><div class="kpi-value">${totalCritDrill}</div><div class="kpi-sub">ТОП-12 + ЛЭП</div><span class="kpi-badge badge-red">⚠</span></div>
        <div class="kpi" style="--kpi-accent:var(--orange)"><div class="kpi-label">Выплачено при нарушениях</div><div class="kpi-value">${totalPaidWithCrit.toFixed(1)}М</div><div class="kpi-sub">${pctPaidWithCrit}% от бурения</div><span class="kpi-badge badge-orange">!</span></div>`;
      mkChart('c19', { type: 'doughnut', data: { labels: SERVICES, datasets: [{ data: paymentByService.map(v => +v.toFixed(2)), backgroundColor: SERVICES.map((_, i) => a(SERVICE_COLORS[i], .85)), borderColor: PT, borderWidth: 3, hoverOffset: 8 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'right', labels: { padding: 12, boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: 'rectRounded', font: { size: 10 } } }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed.toFixed(2)} М ₽ (${totalPayment ? Math.round(ctx.parsed / totalPayment * 100) : 0}%)` } } } } });
      const sortedPay = [...cons].sort((x, y) => paymentByContractor[y] - paymentByContractor[x]);
      mkChart('c20', { type: 'bar', data: { labels: sortedPay, datasets: [{ label: 'Выплачено, млн ₽', data: sortedPay.map(c => paymentByContractor[c]), backgroundColor: a(C.orange, .8), borderRadius: 3 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.parsed.x.toFixed(2)} М ₽` } } }, scales: { x: { ticks: { callback: (v: any) => v.toFixed(1) + 'М' }, grid: { color: GRID } }, y: { grid: { display: false } } } } });
      mkChart('c21', { type: 'line', data: { labels: months, datasets: SERVICES.map((srv, si) => ({ label: srv, data: midxs.map(m => +cons.reduce((s, c) => s + MASTER.payment[c][si][m], 0).toFixed(2)), borderColor: SERVICE_COLORS[si], backgroundColor: a(SERVICE_COLORS[si], .55), borderWidth: 1.5, tension: .4, fill: true, pointRadius: 0 })) }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 10, boxWidth: 10, font: { size: 10 } } } }, scales: { x: { grid: { color: GRID } }, y: { stacked: true, ticks: { callback: (v: any) => v + 'М' }, grid: { color: GRID } } } } });
      mkChart('c22', { type: 'bar', data: { labels: cons, datasets: [{ type: 'bar', label: 'Мотивация (бурение), млн ₽', data: cons.map(c => drillPayByCon[c]), backgroundColor: a(C.orange, .8), borderRadius: 3, yAxisID: 'y', order: 2 }, { type: 'line', label: 'Критичные нарушения, шт.', data: cons.map(c => drillCritByCon[c]), borderColor: C.red, backgroundColor: a(C.red, .1), borderWidth: 2.5, tension: .3, pointRadius: 5, pointBackgroundColor: C.red, pointBorderColor: PT, pointBorderWidth: 2, yAxisID: 'y2', order: 1 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 12 } }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.dataset.label}: ${ctx.dataset.yAxisID === 'y' ? ctx.parsed.y.toFixed(2) + ' М ₽' : ctx.parsed.y + ' шт.'}` } } }, scales: { x: { grid: { display: false } }, y: { position: 'left', title: { display: true, text: 'Млн ₽', color: AXIS }, ticks: { callback: (v: any) => v + 'М' }, grid: { color: GRID } }, y2: { position: 'right', title: { display: true, text: 'Нарушения', color: AXIS }, grid: { display: false } } } } });
      const sortedDrill = [...cons].sort((x, y) => drillPaidWithCritByCon[y] - drillPaidWithCritByCon[x]);
      mkChart('c23', { type: 'bar', data: { labels: sortedDrill, datasets: [{ label: 'При наличии критичных нарушений', data: sortedDrill.map(c => drillPaidWithCritByCon[c]), backgroundColor: a(C.red, .8), borderRadius: 3, stack: 's' }, { label: 'Без критичных нарушений', data: sortedDrill.map(c => +(drillPayByCon[c] - drillPaidWithCritByCon[c]).toFixed(2)), backgroundColor: a(C.green, .8), borderRadius: 3, stack: 's' }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 10, boxWidth: 10 } }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.dataset.label}: ${ctx.parsed.x.toFixed(2)} М ₽` } } }, scales: { x: { stacked: true, ticks: { callback: (v: any) => v.toFixed(1) + 'М' }, grid: { color: GRID } }, y: { stacked: true, grid: { display: false } } } } });
      const drillPayByM = midxs.map(m => +cons.reduce((s, c) => s + MASTER.payment[c][0][m], 0).toFixed(2));
      const drillCritByM = midxs.map(m => cons.reduce((s, c) => s + MASTER.drillCrit[c][m], 0));
      mkChart('c24', { type: 'line', data: { labels: months, datasets: [{ label: 'Мотивация (бурение), млн ₽', data: drillPayByM, borderColor: C.orange, backgroundColor: a(C.orange, .12), borderWidth: 2.5, tension: .4, fill: true, pointRadius: 4, pointBackgroundColor: C.orange, pointBorderColor: PT, pointBorderWidth: 2, yAxisID: 'y' }, { label: 'Критичные нарушения, шт.', data: drillCritByM, borderColor: C.red, backgroundColor: 'transparent', borderWidth: 2.5, tension: .4, fill: false, pointRadius: 4, pointBackgroundColor: C.red, pointBorderColor: PT, pointBorderWidth: 2, yAxisID: 'y2', borderDash: [5, 3] }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 14 } } }, scales: { x: { grid: { color: GRID } }, y: { position: 'left', title: { display: true, text: 'Млн ₽', color: AXIS }, ticks: { callback: (v: any) => v + 'М' }, grid: { color: GRID } }, y2: { position: 'right', title: { display: true, text: 'Нарушения', color: AXIS }, grid: { display: false } } } } });
    }

    function renderRating() {
      const cons = filteredContractors(), midxs = monthIdxs();
      const data = cons.map(c => {
        const totViol = MASTER_CATS.reduce((s, cat) => s + sumOverMonths(MASTER.viol[cat][c]), 0);
        const violScore = Math.max(0, Math.round((1 - totViol / 375) * 100));
        const d = MASTER.dpr_status[c];
        const acc = midxs.reduce((s, m) => s + d.acc[m], 0);
        const all = midxs.reduce((s, m) => s + d.acc[m] + d.rej[m] + d.court[m], 0);
        const dprPct = all ? Math.round(acc / all * 100) : 0;
        const da = MASTER.act[c].done, dw = MASTER.act[c].wip, dl = MASTER.act[c].late;
        const done = midxs.reduce((s, m) => s + da[m], 0);
        const actAll = midxs.reduce((s, m) => s + da[m] + dw[m] + dl[m], 0);
        const actPct = actAll ? Math.round(done / actAll * 100) : 0;
        let fine = 0; midxs.forEach(m => { fine += MASTER.fine[c][m][0] - MASTER.fine[c][m][1] - MASTER.fine[c][m][2]; });
        const drillCleanPct = Math.round((1 - MASTER.drillPaidWithCrit[c]) * 100);
        const score = Math.round((violScore + dprPct + actPct + drillCleanPct) / 4);
        return { name: c, viol: violScore, dpr: dprPct, act: actPct, clean: drillCleanPct, fine: +fine.toFixed(1), score };
      }).sort((x, y) => y.score - x.score);
      const scoreColor = (s: number) => s >= 75 ? C.green : s >= 55 ? C.yellow : C.red;
      const cell = (v: number, lo: number, hi: number, suffix = '%', invert = false) => { const cls = invert ? (v < lo ? 'cell-green' : v < hi ? 'cell-amber' : 'cell-red') : (v >= hi ? 'cell-green' : v >= lo ? 'cell-amber' : 'cell-red'); return `<td class="${cls}" style="text-align:center">${v}${suffix}</td>`; };
      $('ratingTable').innerHTML = `<thead><tr>
        <th>#</th><th>Подрядчик</th><th>% без нарушений</th><th>% принятых ДПР</th>
        <th>% реализ. меропр.</th><th>% мотивации без крит. нарушений</th><th>Долг, млн ₽</th><th>Итоговый скор</th>
      </tr></thead><tbody>${data.map((d, i) => `<tr>
        <td style="color:var(--muted)">${i + 1}</td>
        <td style="font-family:var(--font-head);font-weight:600;color:var(--text)">${d.name}</td>
        ${cell(d.viol, 50, 70)} ${cell(d.dpr, 60, 75)} ${cell(d.act, 65, 80)} ${cell(d.clean, 50, 75)}
        ${cell(d.fine, 3, 6, 'М', true)}
        <td><div class="score-bar">
          <div class="score-bar-track"><div class="score-bar-fill" style="width:${d.score}%;background:${scoreColor(d.score)}"></div></div>
          <span style="color:${scoreColor(d.score)};font-weight:700;min-width:30px">${d.score}</span>
        </div></td>
      </tr>`).join('')}</tbody>`;
      // (диаграмма #17 «Динамика нарушений по подрядчику (кварталы)» перенесена во вкладку «Нарушения»)
      const accData = data.map(d => ({ name: d.name, pct: d.dpr })).sort((x, y) => y.pct - x.pct);
      const thr70: any = { id: 'thr', afterDraw(chart: any) { const { ctx, chartArea: { top, bottom }, scales: { x } } = chart; if (!x) return; const xp = x.getPixelForValue(70); ctx.save(); ctx.beginPath(); ctx.setLineDash([6, 4]); ctx.strokeStyle = C.red; ctx.lineWidth = 1.5; ctx.moveTo(xp, top); ctx.lineTo(xp, bottom); ctx.stroke(); ctx.restore(); } };
      if (charts['c18']) charts['c18'].destroy();
      charts['c18'] = new Chart($('c18') as HTMLCanvasElement, { type: 'bar', data: { labels: accData.map(d => d.name), datasets: [{ label: '% принятых', data: accData.map(d => d.pct), backgroundColor: accData.map(d => d.pct >= 70 ? a(C.green, .8) : a(C.red, .8)), borderRadius: 3 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.parsed.x}%` } } }, scales: { x: { min: 0, max: 100, ticks: { callback: (v: any) => v + '%' }, grid: { color: GRID } }, y: { grid: { display: false } } } }, plugins: [thr70] } as any);
    }

    function renderAll() { applyServiceScale(); renderContractData(); renderFinance(); renderViolations(); renderFlagman(); renderDPR(); renderActivities(); renderMotivation(); renderRating(); }
    function applyFilters() {
      filterState.monthFrom = +($('fMonthFrom') as HTMLSelectElement).value;
      filterState.monthTo = +($('fMonthTo') as HTMLSelectElement).value;
      if (filterState.monthTo < filterState.monthFrom) { filterState.monthTo = filterState.monthFrom; ($('fMonthTo') as HTMLSelectElement).value = String(filterState.monthFrom); }
      renderChips(); renderAll();
    }
    function renderChips() {
      const fs = filterState; const chips: string[] = [];
      if (fs.monthFrom !== 0 || fs.monthTo !== 7) chips.push(`${MONTHS[fs.monthFrom]} – ${MONTHS[fs.monthTo]}`);
      if (fs.contractors.length !== CONTRACTORS.length) chips.push(`Подрядчики: ${fs.contractors.length}`);
      if (fs.categories.length !== CATEGORIES.length) chips.push(`Категории: ${fs.categories.length}`);
      if (fs.services.length !== SERVICE_LABELS.length) chips.push(`Услуги: ${fs.services.length}`);
      $('filterChips').innerHTML = chips.map(c => `<span class="chip">${c}</span>`).join('');
    }
    function resetFilters() {
      ($('fMonthFrom') as HTMLSelectElement).value = '0'; ($('fMonthTo') as HTMLSelectElement).value = '7';
      filterState = { monthFrom: 0, monthTo: 7, contractors: [...CONTRACTORS], categories: [...CATEGORIES], services: [...SERVICE_LABELS] };
      root!.querySelectorAll<HTMLInputElement>('#dropContractor input,#dropCategory input,#dropService input').forEach(cb => (cb.checked = true));
      $('lblContractor').textContent = 'Все'; $('lblCategory').textContent = 'Все'; $('lblService').textContent = 'Все';
      $('badgeContractor').style.display = 'none'; $('badgeCategory').style.display = 'none'; $('badgeService').style.display = 'none';
      renderChips(); renderAll();
    }
    function showTab(idx: number) {
      if (!allowed.includes(idx)) return;
      root!.querySelectorAll('.section').forEach((s, i) => s.classList.toggle('active', i === idx));
      root!.querySelectorAll('.nav-tab').forEach((t, i) => t.classList.toggle('active', i === idx));
    }

    // wiring
    on($('fMonthFrom'), 'change', applyFilters);
    on($('fMonthTo'), 'change', applyFilters);
    on($('btnContractor'), 'click', (e: any) => { e.stopPropagation(); toggleDropdown('contractor'); });
    on($('btnCategory'), 'click', (e: any) => { e.stopPropagation(); toggleDropdown('category'); });
    on($('btnService'), 'click', (e: any) => { e.stopPropagation(); toggleDropdown('service'); });
    on($('btnReset'), 'click', resetFilters);
    root.querySelectorAll<HTMLElement>('.nav-tab').forEach((t, i) => on(t, 'click', () => showTab(i)));
    $('hdate').textContent = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
    buildMultiSelect('contractor', CONTRACTORS, CON_COLORS, 'contractors');
    buildMultiSelect('category', CATEGORIES, CAT_COLORS, 'categories');
    buildMultiSelect('service', SERVICE_LABELS, SVC_COLORS, 'services');
    renderAll();
    showTab(initialTab);

    return () => {
      cleanups.forEach(fn => fn());
      Object.values(charts).forEach(ch => ch.destroy());
    };
  }, []);

  return (
    <div className="dash" ref={rootRef}>
      <div className="dash-filterbar" id="filterbar">
        <span className="filter-label">Фильтры</span>
        <div className="filter-group">
          <span className="filter-label">Период с</span>
          <select className="f-select" id="fMonthFrom" defaultValue="0">
            <option value="0">Январь</option><option value="1">Февраль</option><option value="2">Март</option><option value="3">Апрель</option>
            <option value="4">Май</option><option value="5">Июнь</option><option value="6">Июль</option><option value="7">Август</option>
          </select>
          <span className="filter-label">по</span>
          <select className="f-select" id="fMonthTo" defaultValue="7">
            <option value="0">Январь</option><option value="1">Февраль</option><option value="2">Март</option><option value="3">Апрель</option>
            <option value="4">Май</option><option value="5">Июнь</option><option value="6">Июль</option><option value="7">Август</option>
          </select>
        </div>
        <div className="filter-sep" />
        <div className="filter-group">
          <span className="filter-label">Подрядчик</span>
          <div className="multi-wrap" id="wrapContractor">
            <div className="multi-btn" id="btnContractor">
              <span id="lblContractor">Все</span><span className="multi-badge" id="badgeContractor" style={{ display: 'none' }} />
              <span style={{ color: 'var(--muted)', fontSize: 9 }}>▾</span>
            </div>
            <div className="multi-dropdown" id="dropContractor" />
          </div>
        </div>
        <div className="filter-sep" />
        <div className="filter-group">
          <span className="filter-label">Категория</span>
          <div className="multi-wrap" id="wrapCategory">
            <div className="multi-btn" id="btnCategory">
              <span id="lblCategory">Все</span><span className="multi-badge" id="badgeCategory" style={{ display: 'none' }} />
              <span style={{ color: 'var(--muted)', fontSize: 9 }}>▾</span>
            </div>
            <div className="multi-dropdown" id="dropCategory" />
          </div>
        </div>
        <div className="filter-sep" />
        <div className="filter-group">
          <span className="filter-label">Услуга по договору</span>
          <div className="multi-wrap" id="wrapService">
            <div className="multi-btn" id="btnService">
              <span id="lblService">Все</span><span className="multi-badge" id="badgeService" style={{ display: 'none' }} />
              <span style={{ color: 'var(--muted)', fontSize: 9 }}>▾</span>
            </div>
            <div className="multi-dropdown multi-dropdown--wide" id="dropService" />
          </div>
        </div>
        <div className="filter-sep" />
        <button className="btn-reset" id="btnReset">↺ Сбросить</button>
        <div className="header-pulse" style={{ marginLeft: 'auto' }}><span className="pulse-dot" />Данные обновлены</div>
        <div className="header-date" id="hdate">—</div>
        <div className="filter-chips" id="filterChips" />
      </div>

      <nav className="dash-nav">
        <div className="nav-tab" style={{ display: allowed.includes(0) ? undefined : 'none' }}><span className="tab-dot" style={{ background: 'var(--blue2)' }} />Договорные данные</div>
        <div className="nav-tab" style={{ display: allowed.includes(1) ? undefined : 'none' }}><span className="tab-dot" style={{ background: 'var(--yellow)' }} />Финансы и штрафы</div>
        <div className="nav-tab" style={{ display: allowed.includes(2) ? undefined : 'none' }}><span className="tab-dot" style={{ background: 'var(--red)' }} />Нарушения</div>
        <div className="nav-tab" style={{ display: allowed.includes(3) ? undefined : 'none' }}><span className="tab-dot" style={{ background: 'var(--blue2)' }} />Претензии (ДПР)</div>
        <div className="nav-tab" style={{ display: allowed.includes(4) ? undefined : 'none' }}><span className="tab-dot" style={{ background: 'var(--green)' }} />Мероприятия</div>
        <div className="nav-tab" style={{ display: allowed.includes(5) ? undefined : 'none' }}><span className="tab-dot" style={{ background: 'var(--orange)' }} />Мотивация</div>
        <div className="nav-tab" style={{ display: allowed.includes(6) ? undefined : 'none' }}><span className="tab-dot" style={{ background: 'var(--purple)' }} />Рейтинг</div>
      </nav>

      <div className="dash-main">
        <section className="section" id="tab-cd">
          <div className="kpi-row" id="kpi-cd" />
          <p className="dash-section-title">Договорные данные</p>
          <div className="grid grid-2 mb">
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--blue2)' }}><div className="card-header"><div className="card-title">Распределение договоров по видам услуг</div><span className="card-num">CD1 Bar</span></div><div style={{ position: 'relative', height: 240 }}><canvas id="cCd1" /></div></div>
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--blue2)' }}><div className="card-header"><div className="card-title">Распределение договоров по контрагентам</div><span className="card-num">CD2 H-Bar</span></div><div style={{ position: 'relative', height: 240 }}><canvas id="cCd2" /></div></div>
          </div>
          <div className="grid grid-2">
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--green)' }}><div className="card-header"><div className="card-title">Освоение по услугам</div><span className="card-num">CD3 Bar</span></div><div style={{ position: 'relative', height: 240 }}><canvas id="cCd3" /></div></div>
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--green)' }}><div className="card-header"><div className="card-title">Освоение по контрагентам</div><span className="card-num">CD4 H-Bar</span></div><div style={{ position: 'relative', height: 240 }}><canvas id="cCd4" /></div></div>
          </div>
        </section>

        <section className="section" id="tab-0">
          <div className="kpi-row" id="kpi-finance" />
          <p className="dash-section-title">Блок 1 — Финансы и штрафы</p>
          <div className="grid grid-2 mb">
            <div className="dash-card"><div className="card-header"><div className="card-title">Финансовая воронка претензий</div><span className="card-num">#1 Bar</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c1" /></div></div>
            <div className="dash-card"><div className="card-header"><div className="card-title">Непокрытые штрафы по подрядчикам</div><span className="card-num">#2 H-Bar</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c2" /></div></div>
          </div>
          <div className="grid grid-2">
            <div className="dash-card"><div className="card-header"><div className="card-title">Динамика выставленных vs. принятых</div><span className="card-num">#3 Line</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c3" /></div></div>
            <div className="dash-card"><div className="card-header"><div className="card-title">Стоимость проактива vs. штрафы</div><span className="card-num">#4 Grouped Bar</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c4" /></div></div>
          </div>
        </section>

        <section className="section" id="tab-1">
          <div className="kpi-row" id="kpi-viol" />
          <p className="dash-section-title">Блок 2 — Нарушения</p>
          <div className="grid grid-2 mb">
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--red)' }}><div className="card-header"><div className="card-title">Нарушения по категориям</div><span className="card-num">#5 Donut</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c5" /></div></div>
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--red)' }}><div className="card-header"><div className="card-title">Динамика нарушений по времени</div><span className="card-num">#6 Stacked Bar</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c6" /></div></div>
          </div>
          <div className="grid grid-2 mb">
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--red)' }}><div className="card-header"><div className="card-title">Нарушения по подрядчикам</div><span className="card-num">#7 H-Stacked</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c7" /></div></div>
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--red)' }}><div className="card-header"><div className="card-title">Статус нарушений</div><span className="card-num">#8 Bar</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c8" /></div></div>
          </div>
          <div className="dash-card mb" style={{ ['--card-accent' as any]: 'var(--red)' }}><div className="card-header"><div className="card-title">НПВ по нарушениям</div><span className="card-num">#9 H-Bar</span></div><div style={{ position: 'relative', height: 200 }}><canvas id="c9" /></div></div>

          <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--red)' }}><div className="card-header"><div className="card-title">Динамика нарушений по подрядчику (кварталы)</div><span className="card-num">#17 Line</span></div><div style={{ position: 'relative', height: 250 }}><canvas id="c17" /></div></div>

          <p className="subsection-title">Нарушения Флагман<span className="subsection-badge">⚡ Источники фиксации: ВА / ВК / ПБ</span></p>
          <div className="subsection-note">
            <strong>Источник данных:</strong> система «Флагман» — нарушения, зафиксированные средствами видеоаналитики (ВА), видеоконтроля (ВК) и прочими каналами ПБ. Разрезы по подрядчикам, месторождениям, бригадам и скважинам, а также сопоставление с основным реестром нарушений.
          </div>
          <div className="grid grid-2 mb">
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--red)' }}><div className="card-header"><div className="card-title">Структура нарушений по типу источника</div><span className="card-num">П1 Donut</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="cFl1" /></div></div>
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--red)' }}><div className="card-header"><div className="card-title">Нарушения по уровню критичности</div><span className="card-num">П2 Bar</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="cFl2" /></div></div>
          </div>
          <div className="grid grid-2 mb">
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--red)' }}><div className="card-header"><div className="card-title">Нарушения по подрядчикам и типу источника</div><span className="card-num">П3 H-Stacked</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="cFl3" /></div></div>
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--red)' }}><div className="card-header"><div className="card-title">Нарушения по месторождениям</div><span className="card-num">П4 H-Bar</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="cFl4" /></div></div>
          </div>
          <div className="grid grid-2 mb">
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--red)' }}><div className="card-header"><div className="card-title">Нарушения по бригадам</div><span className="card-num">П5 H-Bar</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="cFl5" /></div></div>
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--red)' }}><div className="card-header"><div className="card-title">Нарушения по скважинам (ТОП-15)</div><span className="card-num">П6 H-Bar</span></div><div style={{ position: 'relative', height: 300 }}><canvas id="cFl6" /></div></div>
          </div>
          <div className="grid grid-2 mb">
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--red)' }}><div className="card-header"><div className="card-title">Динамика нарушений по месяцам и типу источника</div><span className="card-num">П7 Stacked Bar</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="cFl7" /></div></div>
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--red)' }}><div className="card-header"><div className="card-title">Критичные нарушения по направлению работ</div><span className="card-num">П8 Grouped Bar</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="cFl8" /></div></div>
          </div>
          <div className="dash-card mb" style={{ ['--card-accent' as any]: 'var(--red)' }}><div className="card-header"><div className="card-title">Нарушения ВА/ВК/ПБ vs. основной реестр</div><span className="card-num">П9 Dual Axis</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="cFl9" /></div></div>
          <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--red)' }}><div className="card-header"><div className="card-title">Тепловая карта: бригада × месторождение</div><span className="card-num">П10 Heatmap</span></div><div style={{ overflowX: 'auto' }} id="flHeat" /></div>
        </section>

        <section className="section" id="tab-2">
          <div className="kpi-row" id="kpi-dpr" />
          <p className="dash-section-title">Блок 3 — Претензионная работа (ДПР)</p>
          <div className="grid grid-2 mb">
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--blue2)' }}><div className="card-header"><div className="card-title">Распределение ДПР по статусам</div><span className="card-num">#10 Donut</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c10" /></div></div>
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--blue2)' }}><div className="card-header"><div className="card-title">Просрочка ответа по ДПР (дней)</div><span className="card-num">#11 H-Bar</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c11" /></div></div>
          </div>
          <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--blue2)' }}><div className="card-header"><div className="card-title">ДПР, переданные в суд</div><span className="card-num">#12 Grouped + Dual Axis</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c12" /></div></div>
        </section>

        <section className="section" id="tab-3">
          <div className="kpi-row" id="kpi-act" />
          <p className="dash-section-title">Блок 4 — Мероприятия</p>
          <div className="grid grid-2 mb">
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--green)' }}><div className="card-header"><div className="card-title">Исполнение: план vs. факт</div><span className="card-num">#13 Stacked Bar</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c13" /></div></div>
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--green)' }}><div className="card-header"><div className="card-title">Просроченные мероприятия</div><span className="card-num">#14 H-Bar</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c14" /></div></div>
          </div>
          <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--green)' }}><div className="card-header"><div className="card-title">Мероприятия по нарушениям ТОП-12</div><span className="card-num">#15 Bar</span></div><div style={{ position: 'relative', height: 200 }}><canvas id="c15" /></div></div>
        </section>

        <section className="section" id="tab-4">
          <div className="kpi-row" id="kpi-motiv" />
          <p className="dash-section-title">Блок 5 — Мотивация по актам выполненных работ</p>
          <div className="subsection-note">
            <strong>Источник данных:</strong> акты выполненных работ. Известны вид услуги, сумма мотивации, подрядчик. <strong>Связки с нарушениями нет</strong> — кроме услуги «эксплуатационное бурение».
          </div>
          <div className="grid grid-2 mb">
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--orange)' }}><div className="card-header"><div className="card-title">Структура мотивации по видам услуг</div><span className="card-num">#19 Donut</span></div><div style={{ position: 'relative', height: 240 }}><canvas id="c19" /></div></div>
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--orange)' }}><div className="card-header"><div className="card-title">Сумма выплаченной мотивации по подрядчикам</div><span className="card-num">#20 H-Bar</span></div><div style={{ position: 'relative', height: 240 }}><canvas id="c20" /></div></div>
          </div>
          <div className="dash-card mb" style={{ ['--card-accent' as any]: 'var(--orange)' }}><div className="card-header"><div className="card-title">Динамика выплат мотивации по месяцам</div><span className="card-num">#21 Stacked Line</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c21" /></div></div>
          <p className="subsection-title">Эксплуатационное бурение<span className="subsection-badge">⚡ Связка с критичными нарушениями</span></p>
          <div className="grid grid-2 mb">
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--orange)' }}><div className="card-header"><div className="card-title">Мотивация vs. критичные нарушения (по подрядчикам)</div><span className="card-num">#22 Dual Axis</span></div><div style={{ position: 'relative', height: 240 }}><canvas id="c22" /></div></div>
            <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--orange)' }}><div className="card-header"><div className="card-title">Мотивация при наличии критичных нарушений</div><span className="card-num">#23 Stacked H-Bar</span></div><div style={{ position: 'relative', height: 240 }}><canvas id="c23" /></div></div>
          </div>
          <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--orange)' }}><div className="card-header"><div className="card-title">Динамика: мотивация и критичные нарушения по месяцам</div><span className="card-num">#24 Dual Axis Line</span></div><div style={{ position: 'relative', height: 230 }}><canvas id="c24" /></div></div>
        </section>

        <section className="section" id="tab-5">
          <p className="dash-section-title">Блок 6 — Рейтинг подрядчиков</p>
          <div className="dash-card mb" style={{ ['--card-accent' as any]: 'var(--purple)' }}>
            <div className="card-header"><div className="card-title">Рейтинговая таблица подрядчиков</div><span className="card-num">#16 Table</span></div>
            <div style={{ overflowX: 'auto' }}><table className="rating-table" id="ratingTable" /></div>
          </div>
          <div className="dash-card" style={{ ['--card-accent' as any]: 'var(--purple)' }}><div className="card-header"><div className="card-title">Доля принятых претензий по подрядчику</div><span className="card-num">#18 H-Bar</span></div><div style={{ position: 'relative', height: 250 }}><canvas id="c18" /></div><div className="threshold-label">— красная линия: порог 70%</div></div>
        </section>
      </div>
    </div>
  );
};

export default ContractsIndicators;
