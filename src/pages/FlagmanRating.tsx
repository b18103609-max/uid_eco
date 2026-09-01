import { useState } from 'react';
import { IconCalendar } from '@consta/icons/IconCalendar';
import { IconFilter } from '@consta/icons/IconFilter';
import { IconDocFilled } from '@consta/icons/IconDocFilled';
import './flagman.css';

type Row = {
  id: string;
  name: string;
  sub?: string;
  tag?: string;
  place: number;
  tech: number;
  pb: number;
  total: number;
  finalColour: 'green' | 'amber' | 'red';
  bonus: number;
  dimmed?: boolean;
  children?: Row[];
};

const data: Row[] = [
  {
    id: 'integra',
    name: 'Интегра-Бурение',
    tag: 'ГПН-Ямал',
    place: 1,
    tech: 48.5,
    pb: 47.3,
    total: 92.0,
    finalColour: 'green',
    bonus: 1.5,
    children: [
      {
        id: 'brig25',
        name: 'Бригада 25',
        place: 1,
        tech: 48.5,
        pb: 47.3,
        total: 93.0,
        finalColour: 'green',
        bonus: 1.5,
        children: [
          { id: 'w-9309D', name: '9309D', sub: 'Новопортовское · 243', place: 1, tech: 48.5, pb: 47.3, total: 98.0, finalColour: 'green', bonus: 1.5 },
          { id: 'w-5009A-1', name: '5009A', sub: 'Новопортовское · 178', place: 8, tech: 48.5, pb: 47.3, total: 76.1, finalColour: 'amber', bonus: 1.5 },
          { id: 'w-5009A-2', name: '5009A', sub: 'Новопортовское · 178', place: 9, tech: 48.5, pb: 47.3, total: 74.2, finalColour: 'red', bonus: 1.5 },
        ],
      },
      {
        id: 'brig24',
        name: 'Бригада 24',
        place: 5,
        tech: 48.5,
        pb: 47.3,
        total: 92.0,
        finalColour: 'green',
        bonus: 1.5,
        children: [],
      },
      {
        id: 'brig22',
        name: 'Бригада 22',
        place: 7,
        tech: 48.5,
        pb: 47.3,
        total: 90.0,
        finalColour: 'green',
        bonus: 1.5,
        children: [],
      },
    ],
  },
  { id: 'x2', name: 'XXXXXXXX', place: 2, tech: 48.5, pb: 47.3, total: 79.1, finalColour: 'amber', bonus: 1.5, dimmed: true, children: [] },
  { id: 'x3', name: 'XXXXXXXX', place: 3, tech: 48.5, pb: 47.3, total: 74.2, finalColour: 'red', bonus: 1.5, dimmed: true, children: [] },
];

const collectAllIds = (rows: Row[]): string[] => {
  const out: string[] = [];
  const walk = (rs: Row[]) => {
    for (const r of rs) {
      if (r.children) {
        out.push(r.id);
        walk(r.children);
      }
    }
  };
  walk(rows);
  return out;
};

type FlatRow = { row: Row; depth: number };
const flatten = (rows: Row[], depth: number, expanded: Set<string>, out: FlatRow[]) => {
  for (const r of rows) {
    out.push({ row: r, depth });
    if (r.children && r.children.length > 0 && expanded.has(r.id)) {
      flatten(r.children, depth + 1, expanded, out);
    }
  }
};

const FlagmanRating = ({ onBackToHub, onOpenViolations }: { onBackToHub: () => void; onOpenViolations: () => void }) => {
  const [tab, setTab] = useState<'drill' | 'sidetrack'>('drill');
  const [view, setView] = useState<'months' | 'cum' | 'dyn'>('months');
  const [level, setLevel] = useState<'org' | 'brigade' | 'well'>('org');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['integra', 'brig25']));

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpanded(new Set(collectAllIds(data)));
  const collapseAll = () => setExpanded(new Set());

  const flat: FlatRow[] = [];
  flatten(data, 0, expanded, flat);

  return (
    <>
      <section className="card">
        <div className="breadcrumbs">
          Главная / <span className="link" onClick={onBackToHub}>Управление исполнением договоров</span> / <span>Рейтинг флагман</span>
        </div>
        <h1 className="fl-title">Рейтинг флагман</h1>
        <div className="tabs">
          <div
            className={`tab${tab === 'drill' ? ' tab--active' : ''}`}
            onClick={() => setTab('drill')}
          >
            Эксплутационное бурение
          </div>
          <div
            className={`tab${tab === 'sidetrack' ? ' tab--active' : ''}`}
            onClick={() => setTab('sidetrack')}
          >
            Зарезка боковых стволов
          </div>
        </div>
      </section>

      <section className="card">
        <div className="fl-section-row">
          <h2 className="fl-section-title">Эксплутационное бурение</h2>
          <button className="fl-btn-primary" onClick={onOpenViolations}>Нарушения</button>
        </div>
        <div className="fl-toolbar">
          <div className="fl-seg">
            <button className={`fl-seg__item${view === 'months' ? ' fl-seg__item--active' : ''}`} onClick={() => setView('months')}>По месяцам</button>
            <button className={`fl-seg__item${view === 'cum' ? ' fl-seg__item--active' : ''}`} onClick={() => setView('cum')}>Накопленный итог</button>
            <button className={`fl-seg__item${view === 'dyn' ? ' fl-seg__item--active' : ''}`} onClick={() => setView('dyn')}>Динамика</button>
          </div>
          <div className="fl-toolbar__right">
            <button className="fl-pill">Мои</button>
            <button className="fl-chip-date">
              <IconCalendar size="xs" />Январь 2026 ▾
            </button>
            <button className="fl-iconbtn"><IconFilter size="s" /></button>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="fl-table-tools">
          <div className="fl-seg">
            <button className={`fl-seg__item${level === 'org' ? ' fl-seg__item--active' : ''}`} onClick={() => setLevel('org')}>Организация</button>
            <button className={`fl-seg__item${level === 'brigade' ? ' fl-seg__item--active' : ''}`} onClick={() => setLevel('brigade')}>Бригада</button>
            <button className={`fl-seg__item${level === 'well' ? ' fl-seg__item--active' : ''}`} onClick={() => setLevel('well')}>Скважина</button>
          </div>
          <div className="fl-btn-group">
            <button className="fl-btn-outline" onClick={expandAll}>⤢ Развернуть</button>
            <button className="fl-btn-outline" onClick={collapseAll}>＋ Свернуть</button>
          </div>
        </div>

        <div className="fl-tbl-wrap">
          <table className="fl-tbl">
            <thead>
              <tr>
                <th rowSpan={2}>Наименование</th>
                <th rowSpan={2} className="fl-th-num">Место</th>
                <th colSpan={3} className="fl-th-group">Интегральный рейтинг</th>
                <th rowSpan={2}>Премия сут.<br />ставка</th>
              </tr>
              <tr>
                <th className="fl-th-num">Технология<span className="fl-th-sub">МАКС. 50</span></th>
                <th className="fl-th-num">ПБ<span className="fl-th-sub">МАКС. 50</span></th>
                <th className="fl-th-num">Итого<span className="fl-th-sub">МАКС. 100</span></th>
              </tr>
            </thead>
            <tbody>
              {flat.map(({ row, depth }, idx) => {
                const isFirst = idx === 0;
                const hasChildren = !!row.children && row.children.length > 0;
                const open = expanded.has(row.id);
                const cls = row.finalColour;
                return (
                  <tr
                    key={row.id + '-' + idx}
                    className={[
                      isFirst ? 'fl-row--accent' : '',
                      row.dimmed ? 'fl-row--dimmed' : '',
                      hasChildren ? 'fl-row--clickable' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={hasChildren ? () => toggle(row.id) : undefined}
                  >
                    <td>
                      <span className="fl-name" style={{ paddingLeft: depth * 22 }}>
                        <span className={`fl-chev${hasChildren ? (open ? ' fl-chev--open' : '') : ' fl-chev--empty'}`}>▸</span>
                        <span className="fl-name__text">{row.name}</span>
                        {row.sub && <span className="fl-name__sub">{row.sub}</span>}
                        {row.tag && <span className="fl-org-tag">{row.tag}</span>}
                      </span>
                    </td>
                    <td className="fl-td-center">
                      <span className={`fl-place ${isFirst ? 'fl-place--top' : 'fl-place--regular'}`}>{row.place}</span>
                    </td>
                    <td className="fl-numcell">{row.tech.toFixed(1).replace('.', ',')}</td>
                    <td className="fl-numcell">{row.pb.toFixed(1).replace('.', ',')}</td>
                    <td className="fl-td-center">
                      <div className={`fl-total fl-total--${cls}`}>
                        <div className="fl-total__value">{row.total.toFixed(1).replace('.', ',')}</div>
                        <div className="fl-total__bar"><div className="fl-total__bar-fill" style={{ width: `${Math.min(100, row.total)}%` }} /></div>
                      </div>
                    </td>
                    <td>
                      <span className="fl-bonus">
                        <span className="fl-bonus__chip">{row.bonus.toFixed(1).replace('.', ',')}</span>
                        <span className="fl-bonus__icon"><IconDocFilled size="xs" /></span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default FlagmanRating;
