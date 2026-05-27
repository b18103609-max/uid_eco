import { IconUpload } from '@consta/icons/IconUpload';
import { IconSearchStroked } from '@consta/icons/IconSearchStroked';
import { IconFilter } from '@consta/icons/IconFilter';
import { IconDocFilled } from '@consta/icons/IconDocFilled';
import { IconConnection } from '@consta/icons/IconConnection';

type Contract = {
  number: string;
  date: string;
  code: string;
  subjectLong: string;
  subjectShort: string;
  kind: string;
  currency: string;
  costNet: string;
  costGross: string;
  customer: string;
  contractor: string;
  start: string;
  end: string;
  progress: number;
  status: 'Новый' | 'Истек';
  eol: string;
  ki: string;
};

const contracts: Contract[] = [
  {
    number: 'Д-ННГ 784957646',
    date: '22.03.2023',
    code: 'WS91811',
    subjectLong: 'Поставка оборудования для бурения по нанесению покрывного слоя…',
    subjectShort: 'Выполнение работ по нанесению покрывного слоя',
    kind: 'НИР',
    currency: 'Рубль',
    costNet: '10 000 000,00',
    costGross: '12 000 000,00',
    customer: 'ООО «ГПН-ЦР»',
    contractor: 'ООО «Недра»',
    start: '24.01.2025',
    end: '24.01.2026',
    progress: 60,
    status: 'Новый',
    eol: 'Еремеев С.А.',
    ki: 'Иванов Д.М.',
  },
  {
    number: 'Д-ННГ 784957646',
    date: '22.03.2023',
    code: 'WS91811',
    subjectLong: 'Поставка оборудования для бурения по нанесению покрывного слоя…',
    subjectShort: 'Выполнение работ по нанесению покрывного слоя',
    kind: 'НИР',
    currency: 'Рубль',
    costNet: '10 000 000,00',
    costGross: '12 000 000,00',
    customer: 'ООО «ТехноПром»',
    contractor: 'ООО «ГеоИнвест»',
    start: '24.01.2025',
    end: '24.01.2026',
    progress: 60,
    status: 'Истек',
    eol: 'Еремеев С.А.',
    ki: 'Иванов Д.М.',
  },
];

const ContractsRegistry = ({ onOpenContract }: { onOpenContract: () => void }) => (
  <>
    <section className="card">
      <div className="registry-head">
        <div className="section-title">Реестр</div>
        <button className="btn-outline">
          <IconUpload size="s" />
          Выгрузить реестр
        </button>
      </div>

      <div className="toolbar">
        <div className="search">
          <IconSearchStroked size="s" view="ghost" />
          <input placeholder="Найти договор" />
        </div>
        <div className="chip">Новый</div>
        <div className="chip">Действующий</div>
        <div className="chip">Истек</div>
        <button className="filter-btn">
          <IconFilter size="s" />
        </button>
      </div>

      <div className="table-head">
        <div>Предмет</div>
        <div>Вид</div>
        <div>Валюта</div>
        <div>Стоимость без НДС</div>
        <div>Стоимость с НДС</div>
      </div>

      {contracts.map((c, i) => (
        <div
          key={i}
          className={`row${i === 0 ? ' row--clickable' : ''}`}
          onClick={i === 0 ? onOpenContract : undefined}
        >
          <div className="row__main">
            <div className="row__title">
              <IconDocFilled size="s" className="row__doc-icon" />
              <span className="row__num">№{c.number}</span>
              <span className="row__date">от {c.date}</span>
              <span className="row__code">{c.code}</span>
              <span className="row__subject-long">— {c.subjectLong}</span>
              <span className={`status status--${c.status === 'Новый' ? 'new' : 'expired'}`}>
                {c.status.toUpperCase()}
              </span>
            </div>

            <div className="row__cells">
              <div className="row__subject">{c.subjectShort}</div>
              <div>{c.kind}</div>
              <div>{c.currency}</div>
              <div className="row__cost">{c.costNet}</div>
              <div className="row__cost">{c.costGross}</div>
            </div>

            <div className="row__parties">
              <div>
                Заказчик: <a href="#" onClick={(e) => e.stopPropagation()}>{c.customer}</a>
                &nbsp;&nbsp;&nbsp;Подрядчик:{' '}
                <a href="#" onClick={(e) => e.stopPropagation()}>{c.contractor}</a>
              </div>
              <div>
                Начало: {c.start}&nbsp;&nbsp;&nbsp;Окончание: {c.end}
                <IconConnection size="xs" view="ghost" style={{ marginLeft: 8 }} />
              </div>
            </div>

            <div className="row__footer">
              <div className="row__progress">
                Освоение <span className="progress-pill">{c.progress}%</span>
              </div>
              <div className="row__people">
                ЕОЛ ДО:&nbsp;<span className="person-avatar person-avatar--orange">ЕС</span>&nbsp;{c.eol}
                &nbsp;&nbsp;&nbsp;КИ ДО:&nbsp;
                <span className="person-avatar person-avatar--purple">ИД</span>&nbsp;{c.ki}
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  </>
);

export default ContractsRegistry;
