import { useMemo, useState } from 'react';
import { IconSearchStroked } from '@consta/icons/IconSearchStroked';
import { IconFilter } from '@consta/icons/IconFilter';
import { IconDocFilled } from '@consta/icons/IconDocFilled';
import { IconConnection } from '@consta/icons/IconConnection';
import { IconAdd } from '@consta/icons/IconAdd';
import { type Pkm, type PkmStatus, userInitials } from '../data';
import './pkm.css';

const statusCls = (s: PkmStatus): string => {
  switch (s) {
    case 'Новый': return 'new';
    case 'В работе': return 'wip';
    case 'Реализовано': return 'done';
    case 'Реализовано частично': return 'partial';
    case 'Отменено': return 'cancel';
  }
};

type Props = {
  pkms: Pkm[];
  onBackToHub: () => void;
  onCreate: () => void;
  onOpenPkm: (id: string) => void;
};

const PkmRegistry = ({ pkms, onBackToHub, onCreate, onOpenPkm }: Props) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pkms;
    return pkms.filter(p =>
      p.num.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.contractNo.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q),
    );
  }, [search, pkms]);

  return (
    <>
      <section className="card">
        <div className="breadcrumbs">
          Главная / <span className="link" onClick={onBackToHub}>Управление исполнением договоров</span> /{' '}
          <span>План корректирующих мероприятий</span>
        </div>
        <div className="pkm-title-row">
          <h1 className="pkm-title">План корректирующих мероприятий</h1>
          <button className="pkm-create-btn" onClick={onCreate}><IconAdd size="s" />Создать ПКМ</button>
        </div>
      </section>

      <>
          <section className="card">
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
            <div key={p.id} className="pkm-card pkm-card--clickable" onClick={() => onOpenPkm(p.id)}>
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
                <div className="pkm-card__cell">{p.formedAt}</div>
                <div className="pkm-card__cell" style={{ textAlign: 'right' }}>{p.plannedEnd}</div>
              </div>

              <div className="pkm-card__parties">
                <div>Договор №: <a href="#" onClick={e => { e.preventDefault(); e.stopPropagation(); }}>{p.contractNo}</a></div>
                <div>
                  Заказчик: <a href="#" onClick={e => { e.preventDefault(); e.stopPropagation(); }}>{p.customer}</a>
                  &nbsp;&nbsp;&nbsp;Подрядчик: <a href="#" onClick={e => { e.preventDefault(); e.stopPropagation(); }}>{p.contractor}</a>
                </div>
              </div>

              <div className="pkm-card__foot">
                <div className="pkm-foot-group">
                  <span className="pkm-link"><IconConnection size="xs" />Нарушения: {p.linkedViolations.length}</span>
                  <span className="pkm-link"><IconConnection size="xs" />Претензии: {p.claimsCount}</span>
                  <span className="pkm-proto">
                    <span>Протокол:</span>
                    <span className="pkm-proto__chip">{p.protocolNo} от {p.protocolDate}</span>
                  </span>
                </div>
                <div className="pkm-resp">
                  <span>Ответственный:</span>
                  <span className="pkm-resp__avatar">{userInitials(p.responsible)}</span>
                  <span className="pkm-resp__name">{p.responsible}</span>
                </div>
              </div>
            </div>
          ))
        )}
          </div>
      </>
    </>
  );
};

export default PkmRegistry;
