import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import type { IconComponent } from '@consta/icons/Icon';
import { IconDocFilled } from '@consta/icons/IconDocFilled';
import { IconBag } from '@consta/icons/IconBag';
import { IconUser } from '@consta/icons/IconUser';
import { IconEdit } from '@consta/icons/IconEdit';
import { IconFileDocument } from '@consta/icons/IconFileDocument';
import { IconAlert } from '@consta/icons/IconAlert';
import { IconList } from '@consta/icons/IconList';
import { IconQuestion } from '@consta/icons/IconQuestion';
import { IconFlagFilled } from '@consta/icons/IconFlagFilled';
import { IconCalendar } from '@consta/icons/IconCalendar';
import { IconKebab } from '@consta/icons/IconKebab';
import { IconInfoCircle } from '@consta/icons/IconInfoCircle';
import { IconCheck } from '@consta/icons/IconCheck';
import { IconWrench } from '@consta/icons/IconWrench';
import { IconStop } from '@consta/icons/IconStop';
import './hub.css';

type Tile = { label: string; icon: IconComponent; onClick?: () => void };

const ContractMgmtHub = ({ onOpenContracts, onOpenFlagman, onOpenPkm }: { onOpenContracts: () => void; onOpenFlagman: () => void; onOpenPkm: () => void }) => {
  const c1Ref = useRef<HTMLCanvasElement>(null);
  const c2Ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const charts: Chart[] = [];
    const labels = ['I кв.', 'II кв.', 'III кв.', 'IV кв.'];
    const common = {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' as const, align: 'start' as const, labels: { usePointStyle: true, padding: 12, font: { size: 12 } } },
        tooltip: { displayColors: false },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#5d6a73' } },
        y: { beginAtZero: true, max: 40, grid: { color: '#ebedf0' }, ticks: { color: '#5d6a73', stepSize: 10 } },
      },
    };
    if (c1Ref.current) {
      charts.push(new Chart(c1Ref.current, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Договоры действующие — 27', data: [23, 12, 35, 25], backgroundColor: '#3a7bd5', borderRadius: 4, barThickness: 38 }] },
        options: common as any,
      }));
    }
    if (c2Ref.current) {
      charts.push(new Chart(c2Ref.current, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Стоимость действующих договоров — 27,13', data: [23.03, 12.85, 35.12, 25.00], backgroundColor: '#15c39a', borderRadius: 4, barThickness: 38 }] },
        options: common as any,
      }));
    }
    return () => charts.forEach(c => c.destroy());
  }, []);

  const row1: Tile[] = [
    { label: 'Договоры', icon: IconDocFilled, onClick: onOpenContracts },
    { label: 'Контрагенты', icon: IconBag },
    { label: 'Сотрудники', icon: IconUser },
    { label: 'ЭДО', icon: IconEdit },
    { label: 'База знаний', icon: IconFileDocument },
    { label: 'Нарушения', icon: IconAlert },
  ];
  const row2: Tile[] = [
    { label: 'ПКМ', icon: IconList, onClick: onOpenPkm },
    { label: 'Допретензионная работа', icon: IconQuestion },
    { label: 'Рейтинг флагман', icon: IconFlagFilled, onClick: onOpenFlagman },
  ];

  const renderTile = (t: Tile) => (
    <button
      key={t.label}
      className={`hub-tile${t.onClick ? ' hub-tile--clickable' : ''}`}
      onClick={t.onClick}
    >
      <t.icon size="m" />
      <span>{t.label}</span>
    </button>
  );

  return (
    <>
      <section className="card hub-header-card">
        <div className="breadcrumbs">
          Главная / <span>Управление исполнением договора</span>
        </div>
        <h1 className="hub-page-title">Управление исполнением договора</h1>
        <div className="hub-tile-panel">
          <div className="hub-tile-row">{row1.map(renderTile)}</div>
          <div className="hub-tile-row">{row2.map(renderTile)}</div>
        </div>
      </section>

      <h2 className="hub-section">Виджеты</h2>
      <div className="hub-grid-2">
        <div className="card hub-widget">
          <h3 className="hub-widget__title">Количество договоров</h3>
          <div className="hub-widget__chart"><canvas ref={c1Ref} /></div>
        </div>
        <div className="card hub-widget">
          <h3 className="hub-widget__title">Стоимость, млн. руб.</h3>
          <div className="hub-widget__chart"><canvas ref={c2Ref} /></div>
        </div>
      </div>

      <section className="card hub-flagman">
        <div className="hub-flagman__head">
          <h3>Флагман бурение</h3>
          <div className="hub-flagman__controls">
            <span className="hub-month"><IconCalendar size="xs" />Январь 2026 ▾</span>
            <button className="hub-dots"><IconKebab size="s" /></button>
          </div>
        </div>

        <div className="hub-flagman__top">
          <div className="hub-card hub-card--info">
            <div className="hub-card__head">
              <div className="hub-card__title">Эксплуатационное бурение</div>
              <span className="hub-date">Январь 2026</span>
            </div>
            <div className="hub-card__sub">Дочернее общество</div>
            <div className="hub-card__big">ГПН-Ямал</div>
            <div className="hub-bchips">
              <span>Подрядчики: 3</span>
              <span>Месторождения: 6</span>
              <span>Бригады: 9</span>
              <span>Скважины: 17</span>
            </div>
          </div>
          <div className="hub-card hub-card--green">
            <div className="hub-card__label">Итого баллов <IconInfoCircle size="xs" /></div>
            <div className="hub-card__value">90,5</div>
            <div className="hub-card__foot">Среднее</div>
          </div>
          <div className="hub-card hub-card--coef">
            <div className="hub-card__label">Коэффициент премии <IconInfoCircle size="xs" /></div>
            <div className="hub-card__value">1,15</div>
            <div className="hub-card__foot">Среднее</div>
          </div>
          <div className="hub-card hub-card--reward">
            <div className="hub-card__label">Сумма вознаграждения <IconInfoCircle size="xs" /></div>
            <div className="hub-card__foot">Всего</div>
            <div className="hub-card__value" style={{ textAlign: 'right' }}>102,500 млн.руб.</div>
          </div>
        </div>

        <div className="hub-scores">
          <div className="hub-score">
            <div className="hub-score__head">
              <span className="hub-score__title">Безопасность <b>44,1</b></span>
              <span className="hub-score__avg">Среднее <IconCheck size="xs" /></span>
            </div>
            <div className="hub-metric">
              <div className="hub-metric__row"><span>Критичные нарушения</span><span><b>17,9</b> / 20 баллов</span></div>
              <div className="hub-metric__note">Наличие хотя бы одного — 0 баллов за весь блок!</div>
            </div>
            <div className="hub-metric">
              <div className="hub-metric__row"><span>Нарушения по видео</span><span><b>11,5</b> / 15 баллов</span></div>
              <div className="hub-metric__note">Видеоаналитика и контроль искусственным интеллектом</div>
            </div>
            <div className="hub-metric">
              <div className="hub-metric__row"><span>Каркас безопасности</span><span><b>10,0</b> / 10 баллов</span></div>
              <div className="hub-metric__note">Оценка барьеров заказчиком и супервайзером</div>
            </div>
            <div className="hub-metric">
              <div className="hub-metric__row"><span>Прочие нарушения</span><span><b>0,9</b> / 5 баллов</span></div>
              <div className="hub-metric__note">Наличие хотя бы одного — 0 баллов за весь блок!</div>
            </div>
          </div>

          <div className="hub-score">
            <div className="hub-score__head">
              <span className="hub-score__title">Технология <b>48,5</b></span>
              <span className="hub-score__avg">Среднее <IconWrench size="xs" /></span>
            </div>
            <div className="hub-metric">
              <div className="hub-metric__row"><span>Непроизводительное время</span><span><b>28,5</b> / 30 баллов</span></div>
              <div className="hub-metric__note">Чем меньше простоев бригады тем выше балл</div>
            </div>
            <div className="hub-metric">
              <div className="hub-metric__row"><span>Выполнение плановых сроков</span><span><b>20,0</b> / 20 баллов</span></div>
              <div className="hub-metric__note">
                Плановое время на бурение скважины № 20085 в ГГД = 40,62 сут.<br />
                Фактическое время бурения = 40,38 сут.<br />
                Отклонение от плана составляет = −0,59%
              </div>
            </div>
            <div className="hub-metric">
              <div className="hub-metric__row"><span>Стоп-факторы</span><span><b>Нет</b></span></div>
              <div className="hub-metric__note">Всего <IconStop size="xs" /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="hub-banner">
        <h3>Витрина отчетов</h3>
        <span className="hub-banner__pill">Сводный отчет по договорам (ИДП)</span>
      </section>
    </>
  );
};

export default ContractMgmtHub;
