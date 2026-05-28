import { useEffect, useMemo, useRef, useState } from 'react';
import { IconSearchStroked } from '@consta/icons/IconSearchStroked';
import { IconCalendar } from '@consta/icons/IconCalendar';
import { IconUser } from '@consta/icons/IconUser';
import './violations.css';

type Source = 'ВА' | 'ВК' | 'Прочие ПБ';
type Crit = 'Критичное' | 'Незначительное';
type Dir = 'Бурение' | 'ТКРС';

type Violation = {
  id: number;
  scenario: string;
  source: Source;
  crit: Crit;
  field: string;
  well: string;
  cluster: string;
  brigade: string;
  dir: Dir;
  date: string;
  supervisor: string;
};

const VIOLATIONS: Violation[] = [
  { id: 1, scenario: 'Элеватор обращён вверх при проведении спуско-подъёмных операций', source: 'ВА', crit: 'Критичное', field: 'Новопортовское', well: '243K', cluster: '12', brigade: '52', dir: 'Бурение', date: '12.01.2026', supervisor: 'Иванов И. И.' },
  { id: 2, scenario: 'Отсутствие СИЗ у работников бригады при работе в опасной зоне', source: 'ВК', crit: 'Критичное', field: 'Ярудейское', well: '178A', cluster: '4', brigade: '48', dir: 'Бурение', date: '14.01.2026', supervisor: 'Петров П. П.' },
  { id: 3, scenario: 'Курение в неустановленном месте на территории буровой', source: 'ВА', crit: 'Незначительное', field: 'Мессояхское', well: '1024B', cluster: '7', brigade: '22', dir: 'ТКРС', date: '03.01.2026', supervisor: 'Сидоров А. А.' },
  { id: 4, scenario: 'Нарушение порядка работы с противовыбросовым оборудованием', source: 'Прочие ПБ', crit: 'Критичное', field: 'Новопортовское', well: '9309D', cluster: '5', brigade: '25', dir: 'Бурение', date: '18.01.2026', supervisor: 'Кузнецов С. С.' },
  { id: 5, scenario: 'Работы на высоте без страховочной привязи', source: 'ВК', crit: 'Критичное', field: 'Вынгапуровское', well: '877C', cluster: '3', brigade: '64', dir: 'ТКРС', date: '20.01.2026', supervisor: 'Морозов И. В.' },
  { id: 6, scenario: 'Использование неисправного грузоподъёмного оборудования', source: 'ВА', crit: 'Критичное', field: 'Ярудейское', well: '2156G', cluster: '8', brigade: '48', dir: 'Бурение', date: '07.01.2026', supervisor: 'Иванов И. И.' },
  { id: 7, scenario: 'Несоблюдение схемы обвязки устья скважины', source: 'Прочие ПБ', crit: 'Незначительное', field: 'Мессояхское', well: '415D', cluster: '6', brigade: '22', dir: 'ТКРС', date: '09.01.2026', supervisor: 'Петров П. П.' },
  { id: 8, scenario: 'Превышение скорости подъёма бурового инструмента', source: 'ВА', crit: 'Незначительное', field: 'Новопортовское', well: '5009A', cluster: '5', brigade: '25', dir: 'Бурение', date: '11.01.2026', supervisor: 'Кузнецов С. С.' },
  { id: 9, scenario: 'Отсутствие записи в журнале инструктажа по ТБ', source: 'Прочие ПБ', crit: 'Незначительное', field: 'Вынгапуровское', well: '123G', cluster: '2', brigade: '64', dir: 'Бурение', date: '15.01.2026', supervisor: 'Морозов И. В.' },
  { id: 10, scenario: 'Открытое пламя в опасной зоне без разрешения на огневые работы', source: 'ВК', crit: 'Критичное', field: 'Ярудейское', well: '178A', cluster: '4', brigade: '48', dir: 'ТКРС', date: '22.01.2026', supervisor: 'Сидоров А. А.' },
  { id: 11, scenario: 'Неправильное крепление груза на стропах', source: 'ВА', crit: 'Незначительное', field: 'Новопортовское', well: '9309D', cluster: '5', brigade: '25', dir: 'Бурение', date: '17.01.2026', supervisor: 'Иванов И. И.' },
  { id: 12, scenario: 'Несвоевременная проверка превентора', source: 'Прочие ПБ', crit: 'Критичное', field: 'Мессояхское', well: '1024B', cluster: '7', brigade: '22', dir: 'Бурение', date: '24.01.2026', supervisor: 'Петров П. П.' },
  { id: 13, scenario: 'Работы без оформленного наряда-допуска на огневые работы', source: 'ВК', crit: 'Критичное', field: 'Новопортовское', well: '243K', cluster: '12', brigade: '52', dir: 'ТКРС', date: '05.01.2026', supervisor: 'Кузнецов С. С.' },
  { id: 14, scenario: 'Нарушение требований к ограждениям опасных зон', source: 'ВА', crit: 'Незначительное', field: 'Вынгапуровское', well: '877C', cluster: '3', brigade: '64', dir: 'ТКРС', date: '26.01.2026', supervisor: 'Морозов И. В.' },
];

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

const ViolationsPage = ({ onBackToHub, onBackToFlagman }: { onBackToHub: () => void; onBackToFlagman: () => void }) => {
  const [search, setSearch] = useState('');
  const [src, setSrc] = useState<string[]>([...SOURCES]);
  const [crit, setCrit] = useState<string[]>([...CRITS]);
  const [dir, setDir] = useState<string[]>([...DIRS]);
  const [field, setField] = useState<string[]>([...FIELDS]);
  const [well, setWell] = useState<string[]>([...WELLS]);
  const [cluster, setCluster] = useState<string[]>([...CLUSTERS]);
  const [brigade, setBrigade] = useState<string[]>([...BRIGADES]);
  const [sup, setSup] = useState<string[]>([...SUPS]);

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

        <div className="vio-count">Найдено: <b>{filtered.length}</b> из {VIOLATIONS.length}</div>

        <div className="vio-list">
          {filtered.length === 0 ? (
            <div className="vio-empty">По заданным фильтрам нарушений не найдено</div>
          ) : (
            filtered.map(v => (
              <div key={v.id} className={`vio-card vio-card--${v.crit === 'Критичное' ? 'crit' : 'minor'}`}>
                <div className="vio-card__head">
                  <div className="vio-card__scenario">
                    <span className={`vio-source vio-source--${sourceCls(v.source)}`}>{v.source}</span>
                    <span>{v.scenario}</span>
                  </div>
                  <span className={`vio-crit vio-crit--${v.crit === 'Критичное' ? 'crit' : 'minor'}`}>
                    {v.crit.toUpperCase()}
                  </span>
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
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default ViolationsPage;
