import { useMemo, useState } from 'react';
import { IconSearchStroked } from '@consta/icons/IconSearchStroked';
import { IconFilter } from '@consta/icons/IconFilter';
import { IconDocFilled } from '@consta/icons/IconDocFilled';
import { IconConnection } from '@consta/icons/IconConnection';
import './pkm.css';

type Status = 'Новое' | 'В работе' | 'Выполнено' | 'Просрочено';

type Pkm = {
  id: string;
  num: string;
  code: string;
  contractSubject: string;
  description: string;
  assignedAt: string;
  plannedEnd: string;
  contractNo: string;
  customer: string;
  contractor: string;
  violationsCount: number;
  claimsCount: number;
  protocolNo: string;
  protocolDate: string;
  responsible: { initials: string; name: string };
  status: Status;
};

const DATA: Pkm[] = [
  {
    id: '64865-1',
    num: '64865/1',
    code: 'WS91811',
    contractSubject: 'Поставка оборудования для бурения по нанесению покрывного слоя трубопроводов',
    description: 'Отсутствие или неисправность противовыбросового оборудования (ПВО)',
    assignedAt: '05.08.2025',
    plannedEnd: '20.09.2025',
    contractNo: 'ГПН-25/20000/012345/К/63/ГПБ-Д/ГБЦ',
    customer: 'ООО «ГПН-ЦР»',
    contractor: 'ООО «Недра»',
    violationsCount: 1,
    claimsCount: 2,
    protocolNo: '№64865',
    protocolDate: '05.08.2025',
    responsible: { initials: 'ИД', name: 'Иванов Д.М.' },
    status: 'Новое',
  },
  {
    id: '64865-2',
    num: '64865/2',
    code: 'WS91811',
    contractSubject: 'Поставка оборудования для бурения по нанесению покрывного слоя трубопроводов',
    description: 'Несоблюдение порядка спуска НКТ на скважине',
    assignedAt: '06.08.2025',
    plannedEnd: '15.09.2025',
    contractNo: 'ГПН-25/20000/012345/К/63/ГПБ-Д/ГБЦ',
    customer: 'ООО «ГПН-ЦР»',
    contractor: 'ООО «Недра»',
    violationsCount: 1,
    claimsCount: 2,
    protocolNo: '№64865',
    protocolDate: '05.08.2025',
    responsible: { initials: 'ИД', name: 'Иванов Д.М.' },
    status: 'В работе',
  },
  {
    id: '64866-1',
    num: '64866/1',
    code: 'WS91812',
    contractSubject: 'Капитальный ремонт скважин Новопортовского месторождения',
    description: 'Работы на высоте без страховочной привязи у бригады 48',
    assignedAt: '12.08.2025',
    plannedEnd: '30.09.2025',
    contractNo: 'ГПН-25/20000/012346/К/63/ГПБ-Д/ГБЦ',
    customer: 'ООО «ГПН-ЦР»',
    contractor: 'ООО «ТехноПром»',
    violationsCount: 2,
    claimsCount: 1,
    protocolNo: '№64866',
    protocolDate: '12.08.2025',
    responsible: { initials: 'ЕС', name: 'Еремеев С.А.' },
    status: 'Новое',
  },
  {
    id: '64867-1',
    num: '64867/1',
    code: 'WS91814',
    contractSubject: 'Эксплуатационное бурение на Ярудейском месторождении',
    description: 'Превышение скорости подъёма бурового инструмента',
    assignedAt: '15.08.2025',
    plannedEnd: '10.09.2025',
    contractNo: 'ГПН-25/20000/012347/К/63/ГПБ-Д/ГБЦ',
    customer: 'ООО «ГПН-ЦР»',
    contractor: 'ООО «ГеоИнвест»',
    violationsCount: 1,
    claimsCount: 0,
    protocolNo: '№64867',
    protocolDate: '15.08.2025',
    responsible: { initials: 'СА', name: 'Сидоров А.А.' },
    status: 'Выполнено',
  },
  {
    id: '64867-2',
    num: '64867/2',
    code: 'WS91814',
    contractSubject: 'Эксплуатационное бурение на Ярудейском месторождении',
    description: 'Курение в неустановленном месте на территории буровой',
    assignedAt: '17.08.2025',
    plannedEnd: '01.09.2025',
    contractNo: 'ГПН-25/20000/012347/К/63/ГПБ-Д/ГБЦ',
    customer: 'ООО «ГПН-ЦР»',
    contractor: 'ООО «ГеоИнвест»',
    violationsCount: 1,
    claimsCount: 0,
    protocolNo: '№64867',
    protocolDate: '15.08.2025',
    responsible: { initials: 'СА', name: 'Сидоров А.А.' },
    status: 'Просрочено',
  },
  {
    id: '64868-1',
    num: '64868/1',
    code: 'WS91820',
    contractSubject: 'ТКРС на Мессояхском месторождении',
    description: 'Несвоевременная проверка превентора',
    assignedAt: '20.08.2025',
    plannedEnd: '25.09.2025',
    contractNo: 'ГПН-25/20000/012350/К/63/ГПБ-Д/ГБЦ',
    customer: 'ООО «ГПН-ЦР»',
    contractor: 'ООО «Недра»',
    violationsCount: 1,
    claimsCount: 1,
    protocolNo: '№64868',
    protocolDate: '20.08.2025',
    responsible: { initials: 'КС', name: 'Кузнецов С.С.' },
    status: 'Новое',
  },
  {
    id: '64869-1',
    num: '64869/1',
    code: 'WS91821',
    contractSubject: 'Зарезка боковых стволов на Вынгапуровском месторождении',
    description: 'Открытое пламя в опасной зоне без наряда-допуска',
    assignedAt: '22.08.2025',
    plannedEnd: '05.10.2025',
    contractNo: 'ГПН-25/20000/012351/К/63/ГПБ-Д/ГБЦ',
    customer: 'ООО «ГПН-ЦР»',
    contractor: 'ООО «ТехноПром»',
    violationsCount: 3,
    claimsCount: 2,
    protocolNo: '№64869',
    protocolDate: '22.08.2025',
    responsible: { initials: 'МИ', name: 'Морозов И.В.' },
    status: 'В работе',
  },
  {
    id: '64870-1',
    num: '64870/1',
    code: 'WS91822',
    contractSubject: 'Поставка оборудования для бурения по нанесению покрывного слоя трубопроводов',
    description: 'Использование неисправного грузоподъёмного оборудования',
    assignedAt: '25.08.2025',
    plannedEnd: '15.10.2025',
    contractNo: 'ГПН-25/20000/012352/К/63/ГПБ-Д/ГБЦ',
    customer: 'ООО «ГПН-ЦР»',
    contractor: 'ООО «Недра»',
    violationsCount: 1,
    claimsCount: 1,
    protocolNo: '№64870',
    protocolDate: '25.08.2025',
    responsible: { initials: 'ИД', name: 'Иванов Д.М.' },
    status: 'Новое',
  },
  {
    id: '64871-1',
    num: '64871/1',
    code: 'WS91823',
    contractSubject: 'Эксплуатационное бурение на Ярудейском месторождении',
    description: 'Отсутствие СИЗ у работников бригады при работе в опасной зоне',
    assignedAt: '28.08.2025',
    plannedEnd: '20.09.2025',
    contractNo: 'ГПН-25/20000/012353/К/63/ГПБ-Д/ГБЦ',
    customer: 'ООО «ГПН-ЦР»',
    contractor: 'ООО «ГеоИнвест»',
    violationsCount: 2,
    claimsCount: 0,
    protocolNo: '№64871',
    protocolDate: '28.08.2025',
    responsible: { initials: 'ПП', name: 'Петров П.П.' },
    status: 'В работе',
  },
  {
    id: '64872-1',
    num: '64872/1',
    code: 'WS91824',
    contractSubject: 'ТКРС на Новопортовском месторождении',
    description: 'Нарушение требований к ограждениям опасных зон',
    assignedAt: '01.09.2025',
    plannedEnd: '20.10.2025',
    contractNo: 'ГПН-25/20000/012354/К/63/ГПБ-Д/ГБЦ',
    customer: 'ООО «ГПН-ЦР»',
    contractor: 'ООО «Недра»',
    violationsCount: 1,
    claimsCount: 0,
    protocolNo: '№64872',
    protocolDate: '01.09.2025',
    responsible: { initials: 'СА', name: 'Сидоров А.А.' },
    status: 'Новое',
  },
  {
    id: '64873-1',
    num: '64873/1',
    code: 'WS91825',
    contractSubject: 'Капитальный ремонт скважин Мессояхского месторождения',
    description: 'Несоблюдение схемы обвязки устья скважины',
    assignedAt: '03.09.2025',
    plannedEnd: '15.10.2025',
    contractNo: 'ГПН-25/20000/012355/К/63/ГПБ-Д/ГБЦ',
    customer: 'ООО «ГПН-ЦР»',
    contractor: 'ООО «ТехноПром»',
    violationsCount: 2,
    claimsCount: 1,
    protocolNo: '№64873',
    protocolDate: '03.09.2025',
    responsible: { initials: 'КС', name: 'Кузнецов С.С.' },
    status: 'Выполнено',
  },
  {
    id: '64874-1',
    num: '64874/1',
    code: 'WS91826',
    contractSubject: 'Зарезка боковых стволов на Ярудейском месторождении',
    description: 'Нарушение порядка работы с противовыбросовым оборудованием',
    assignedAt: '05.09.2025',
    plannedEnd: '25.10.2025',
    contractNo: 'ГПН-25/20000/012356/К/63/ГПБ-Д/ГБЦ',
    customer: 'ООО «ГПН-ЦР»',
    contractor: 'ООО «ГеоИнвест»',
    violationsCount: 1,
    claimsCount: 2,
    protocolNo: '№64874',
    protocolDate: '05.09.2025',
    responsible: { initials: 'МИ', name: 'Морозов И.В.' },
    status: 'Просрочено',
  },
];

const statusCls = (s: Status): string => {
  switch (s) {
    case 'Новое': return 'new';
    case 'В работе': return 'wip';
    case 'Выполнено': return 'done';
    case 'Просрочено': return 'late';
  }
};

const PkmRegistry = ({ onBackToHub }: { onBackToHub: () => void }) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return DATA;
    return DATA.filter(p =>
      p.num.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.contractNo.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <>
      <section className="card">
        <div className="breadcrumbs">
          Главная / <span className="link" onClick={onBackToHub}>Управление исполнением договоров</span> /{' '}
          <span>План корректирующих мероприятий</span>
        </div>
        <h1 className="pkm-title">План корректирующих мероприятий</h1>
        <div className="pkm-search-row">
          <div className="pkm-search">
            <IconSearchStroked size="s" view="ghost" />
            <input
              placeholder="Найти по номеру, описанию или номеру договора"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="pkm-filter-btn"><IconFilter size="s" /></button>
        </div>
      </section>

      <section className="card" style={{ padding: 0 }}>
        <div className="pkm-tbl-head">
          <div>Описание</div>
          <div>Дата назначения</div>
          <div className="pkm-tbl-head__num">Плановая дата окончания</div>
        </div>
      </section>

      <div className="pkm-list">
        {filtered.length === 0 ? (
          <div className="pkm-empty">По запросу ничего не найдено</div>
        ) : (
          filtered.map(p => (
            <div key={p.id} className="pkm-card">
              <div className="pkm-card__top">
                <div className="pkm-card__title">
                  <span className="pkm-card__icon"><IconDocFilled size="s" /></span>
                  <span className="pkm-card__num">№{p.num}</span>
                  <span className="pkm-card__code">{p.code}</span>
                  <span className="pkm-card__sub">— {p.contractSubject}</span>
                </div>
                <span className={`pkm-status pkm-status--${statusCls(p.status)}`}>{p.status.toUpperCase()}</span>
              </div>

              <div className="pkm-card__row">
                <div className="pkm-card__desc">{p.description}</div>
                <div className="pkm-card__cell">{p.assignedAt}</div>
                <div className="pkm-card__cell" style={{ textAlign: 'right' }}>{p.plannedEnd}</div>
              </div>

              <div className="pkm-card__parties">
                <div>Договор №: <a href="#" onClick={e => e.preventDefault()}>{p.contractNo}</a></div>
                <div>
                  Заказчик: <a href="#" onClick={e => e.preventDefault()}>{p.customer}</a>
                  &nbsp;&nbsp;&nbsp;Подрядчик: <a href="#" onClick={e => e.preventDefault()}>{p.contractor}</a>
                </div>
              </div>

              <div className="pkm-card__foot">
                <div className="pkm-foot-group">
                  <span className="pkm-link"><IconConnection size="xs" />Нарушения: {p.violationsCount}</span>
                  <span className="pkm-link"><IconConnection size="xs" />Претензии: {p.claimsCount}</span>
                  <span className="pkm-proto">
                    <span>Протокол:</span>
                    <span className="pkm-proto__chip">{p.protocolNo} от {p.protocolDate}</span>
                  </span>
                </div>
                <div className="pkm-resp">
                  <span>Ответственный:</span>
                  <span className="pkm-resp__avatar">{p.responsible.initials}</span>
                  <span className="pkm-resp__name">{p.responsible.name}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default PkmRegistry;
