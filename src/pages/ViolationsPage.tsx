import { useEffect, useMemo, useRef, useState } from 'react';
import { IconSearchStroked } from '@consta/icons/IconSearchStroked';
import { IconCalendar } from '@consta/icons/IconCalendar';
import { IconUser } from '@consta/icons/IconUser';
import { IconConnection } from '@consta/icons/IconConnection';
import {
  VIOLATIONS, type Source, type Crit, type Dir,
} from '../data';
import './violations.css';

const uniq = <T,>(arr: T[]) => Array.from(new Set(arr));
const sortStr = (a: string, b: string) => a.localeCompare(b, 'ru');
const sortNum = (a: string, b: string) => Number(a) - Number(b);

const SOURCES: Source[] = ['ВА', 'ВК', 'Прочие ПБ'];
const CRITS: Crit[] = ['Критичное', 'Незначительное'];
const DIRS: Dir[] = ['Бурение', 'ТКРС'];
const FIELDS = uniq(VIOLATIONS.map(v => v.field)).sort(sortStr);
const WELLS = uniq(VIOLATIONS.map(v => v.well)).sort(sortStr);
const CLUSTERS = uniq(VIOLATIONS.map(v => v.cluster)).sort(sortNum);
const BRIGADES = uniq(VIOLATIONS.map(v => v.brigade)).sort(sortNum);
const SUPS = uniq(VIOLATIONS.map(v => v.supervisor)).sort(sortStr);

type MSProps = { label: string; items: string[]; selected: string[]; onChange: (next: string[]) => void };
const MultiSelect = ({ label, items, selected, onChange }: MSProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const all = selected.length === items.length;
  const none = selected.length === 0;
  const toggle = (item: string) =>
    onChange(selected.includes(item) ? selected.filter(s => s !== item) : [...selected, item]);
  const toggleAll = () => onChange(all ? [] : [...items]);

  const valueLabel = all ? 'Все' : none ? 'Нет' : selected.length === 1 ? selected[0] : `${selected.length} выбр.`;

  return (
    <div className="vio-ms" ref={ref}>
      <button
        className={`vio-ms__btn${open ? ' vio-ms__btn--open' : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        <span className="vio-ms__label">{label}:</span>
        <span className="vio-ms__value">{valueLabel}</span>
        {!all && !none && <span className="vio-ms__count">{selected.length}</span>}
        <span className="vio-ms__caret">▾</span>
      </button>
      {open && (
        <div className="vio-ms__drop">
          <label className="vio-ms__opt vio-ms__opt--all">
            <input type="checkbox" checked={all} onChange={toggleAll} />
            <span>Все</span>
          </label>
          {items.map(item => (
            <label key={item} className="vio-ms__opt">
              <input type="checkbox" checked={selected.includes(item)} onChange={() => toggle(item)} />
              <span>{item}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const sourceCls = (s: Source) => (s === 'ВА' ? 'va' : s === 'ВК' ? 'vk' : 'pb');

type Props = {
  onBackToHub: () => void;
  onBackToFlagman: () => void;
  violationPkm: Record<number, string>;
  onCreatePkm: (ids: number[]) => void;
  onOpenPkm: (pkmId: string) => void;
};

const ViolationsPage = ({ onBackToHub, onBackToFlagman, violationPkm, onCreatePkm, onOpenPkm }: Props) => {
  const [search, setSearch] = useState('');
  const [src, setSrc] = useState<string[]>([...SOURCES]);
  const [crit, setCrit] = useState<string[]>([...CRITS]);
  const [dir, setDir] = useState<string[]>([...DIRS]);
  const [field, setField] = useState<string[]>([...FIELDS]);
  const [well, setWell] = useState<string[]>([...WELLS]);
  const [cluster, setCluster] = useState<string[]>([...CLUSTERS]);
  const [brigade, setBrigade] = useState<string[]>([...BRIGADES]);
  const [sup, setSup] = useState<string[]>([...SUPS]);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return VIOLATIONS.filter(v =>
      (q === '' || v.scenario.toLowerCase().includes(q)) &&
      src.includes(v.source) &&
      crit.includes(v.crit) &&
      dir.includes(v.dir) &&
      field.includes(v.field) &&
      well.includes(v.well) &&
      cluster.includes(v.cluster) &&
      brigade.includes(v.brigade) &&
      sup.includes(v.supervisor),
    );
  }, [search, src, crit, dir, field, well, cluster, brigade, sup]);

  const resetAll = () => {
    setSearch('');
    setSrc([...SOURCES]); setCrit([...CRITS]); setDir([...DIRS]);
    setField([...FIELDS]); setWell([...WELLS]); setCluster([...CLUSTERS]);
    setBrigade([...BRIGADES]); setSup([...SUPS]);
  };

  const toggleOne = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const filteredIds = filtered.map(v => v.id);
  const allFilteredSelected = filteredIds.length > 0 && filteredIds.every(id => selected.has(id));
  const someFilteredSelected = filteredIds.some(id => selected.has(id));
  const toggleAllFiltered = () => {
    setSelected(prev => {
      const next = new Set(prev);
      if (allFilteredSelected) filteredIds.forEach(id => next.delete(id));
      else filteredIds.forEach(id => next.add(id));
      return next;
    });
  };
  const clearSelection = () => setSelected(new Set());

  return (
    <>
      <section className="card">
        <div className="breadcrumbs">
          Главная / <span className="link" onClick={onBackToHub}>Управление исполнением договоров</span> /{' '}
          <span className="link" onClick={onBackToFlagman}>Рейтинг флагман</span> / <span>Нарушения</span>
        </div>
        <h1 className="vio-title">Нарушения</h1>
        <p className="vio-sub">Реестр нарушений, зафиксированных по результатам контроля «Флагман»</p>
      </section>

      <section className="card">
        <div className="vio-toolbar">
          <div className="vio-search">
            <IconSearchStroked size="s" view="ghost" />
            <input
              placeholder="Поиск по сценарию нарушения"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="vio-filters">
            <MultiSelect label="Тип" items={SOURCES} selected={src} onChange={setSrc} />
            <MultiSelect label="Критичность" items={CRITS} selected={crit} onChange={setCrit} />
            <MultiSelect label="Направление" items={DIRS} selected={dir} onChange={setDir} />
            <MultiSelect label="Месторождение" items={FIELDS} selected={field} onChange={setField} />
            <MultiSelect label="Скважина" items={WELLS} selected={well} onChange={setWell} />
            <MultiSelect label="Куст" items={CLUSTERS} selected={cluster} onChange={setCluster} />
            <MultiSelect label="Бригада" items={BRIGADES} selected={brigade} onChange={setBrigade} />
            <MultiSelect label="Супервайзер" items={SUPS} selected={sup} onChange={setSup} />
            <button className="vio-reset" onClick={resetAll}>↺ Сбросить</button>
          </div>
        </div>

        <div className="vio-count-row">
          <label className="vio-select-all">
            <input
              type="checkbox"
              checked={allFilteredSelected}
              ref={el => { if (el) el.indeterminate = !allFilteredSelected && someFilteredSelected; }}
              onChange={toggleAllFiltered}
              disabled={filteredIds.length === 0}
            />
            Выбрать все
          </label>
          <div className="vio-count">Найдено: <b>{filtered.length}</b> из {VIOLATIONS.length}</div>
        </div>

        <div className="vio-list">
          {filtered.length === 0 ? (
            <div className="vio-empty">По заданным фильтрам нарушений не найдено</div>
          ) : (
            filtered.map(v => {
              const isSel = selected.has(v.id);
              const pkmId = violationPkm[v.id];
              return (
                <div key={v.id} className={`vio-card vio-card--${v.crit === 'Критичное' ? 'crit' : 'minor'}${isSel ? ' vio-card--selected' : ''}`}>
                  <label className="vio-card__check">
                    <input type="checkbox" checked={isSel} onChange={() => toggleOne(v.id)} />
                  </label>
                  <div className="vio-card__main">
                    <div className="vio-card__head">
                      <div className="vio-card__scenario">
                        <span className={`vio-source vio-source--${sourceCls(v.source)}`}>{v.source}</span>
                        <span>{v.scenario}</span>
                      </div>
                      <div className="vio-card__badges">
                        {pkmId && (
                          <span className="vio-pkm-badge">
                            <IconConnection size="xs" />Создан ПКМ
                            <span className="vio-pkm-tip">
                              <span className="vio-pkm-tip__link" onClick={() => onOpenPkm(pkmId)}>Перейти к карточке ПКМ →</span>
                            </span>
                          </span>
                        )}
                        <span className={`vio-crit vio-crit--${v.crit === 'Критичное' ? 'crit' : 'minor'}`}>
                          {v.crit.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="vio-card__body">
                      <span className="vio-attr"><span className="vio-attr__label">Месторождение:</span><span className="vio-attr__value">{v.field}</span></span>
                      <span className="vio-attr"><span className="vio-attr__label">Скважина:</span><span className="vio-attr__value">{v.well}</span></span>
                      <span className="vio-attr"><span className="vio-attr__label">Куст:</span><span className="vio-attr__value">{v.cluster}</span></span>
                      <span className="vio-attr"><span className="vio-attr__label">Бригада:</span><span className="vio-attr__value">{v.brigade}</span></span>
                      <span className="vio-attr"><span className="vio-attr__label">Направление:</span><span className="vio-attr__value">{v.dir}</span></span>
                    </div>
                    <div className="vio-card__foot">
                      <span className="vio-foot-item"><IconCalendar size="xs" />{v.date}</span>
                      <span className="vio-foot-item"><IconUser size="xs" />Зафиксировал: <span className="vio-foot-name">{v.supervisor}</span></span>
                      <button
                        className="vio-card__pkm-btn"
                        onClick={(e) => { e.stopPropagation(); onCreatePkm([v.id]); }}
                      >+ Создать ПКМ</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {selected.size > 0 && (
        <div className="vio-actionbar" role="dialog" aria-label="Действия с выбранными нарушениями">
          <button className="vio-actionbar__btn vio-actionbar__btn--primary" onClick={() => onCreatePkm([...selected])}>
            Создать ПКМ
          </button>
          <span className="vio-actionbar__count">
            Выбрано {selected.size}
            <button className="vio-actionbar__close" onClick={clearSelection} aria-label="Сбросить выбор">×</button>
          </span>
        </div>
      )}
    </>
  );
};

export default ViolationsPage;
