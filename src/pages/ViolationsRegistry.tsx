import { useEffect, useMemo, useRef, useState } from 'react';
import { IconSearchStroked } from '@consta/icons/IconSearchStroked';
import { IconCalendar } from '@consta/icons/IconCalendar';
import { IconUser } from '@consta/icons/IconUser';
import { IconConnection } from '@consta/icons/IconConnection';
import {
  VIOLATION_TYPES, RV_STATUSES,
  type RegistryViolation, type ViolationType, type RegistryViolationStatus,
} from '../data';
import './rviolations.css';
import './violations.css';

const uniq = <T,>(arr: T[]) => Array.from(new Set(arr));
const sortStr = (a: string, b: string) => a.localeCompare(b, 'ru');

const typeCls = (t: ViolationType): string => {
  switch (t) {
    case 'ВА': return 'va';
    case 'ВК': return 'vk';
    case 'Прочие нарушения ПБ': return 'pb';
    case 'ТОП-12': return 'top12';
    case 'ЛЭП': return 'lep';
    case 'АЛКО': return 'alko';
    case 'ШС': return 'ss';
    case 'Убытки': return 'uby';
    case 'Прочие': return 'pro';
  }
};
const statusCls = (s: RegistryViolationStatus): string => {
  switch (s) {
    case 'Новое': return 'new';
    case 'В работе': return 'wip';
    case 'Предъявлен ДПР': return 'dpr';
    case 'Замена на проактивные мероприятия': return 'proactive';
    case 'Отозвано': return 'recall';
    case 'Не признано': return 'reject';
    case 'Оплачено': return 'paid';
    case 'Закрыто': return 'closed';
  }
};

type MSProps = { label: string; items: string[]; selected: string[]; onChange: (n: string[]) => void };
const MS = ({ label, items, selected, onChange }: MSProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [open]);
  const all = selected.length === items.length;
  const none = selected.length === 0;
  const toggle = (it: string) => onChange(selected.includes(it) ? selected.filter(s => s !== it) : [...selected, it]);
  const toggleAll = () => onChange(all ? [] : [...items]);
  const valueLabel = all ? 'Все' : none ? 'Нет' : selected.length === 1 ? selected[0] : `${selected.length} выбр.`;
  return (
    <div className="vio-ms" ref={ref}>
      <button className={`vio-ms__btn${open ? ' vio-ms__btn--open' : ''}`} onClick={() => setOpen(o => !o)}>
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
          {items.map(it => (
            <label key={it} className="vio-ms__opt">
              <input type="checkbox" checked={selected.includes(it)} onChange={() => toggle(it)} />
              <span>{it}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const fmtRub = (n?: number) => n == null ? '—' : `${n.toLocaleString('ru-RU')} ₽`;

type Props = {
  items: RegistryViolation[];
  pkmNumByid: Record<string, string>;
  onBackToHub: () => void;
  onOpenCard: (id: string) => void;
  onOpenPkm: (pkmId: string) => void;
};

const ViolationsRegistry = ({ items, pkmNumByid, onBackToHub, onOpenCard, onOpenPkm }: Props) => {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<string[]>([...VIOLATION_TYPES]);
  const [status, setStatus] = useState<string[]>([...RV_STATUSES]);

  const CONTRACTORS = useMemo(() => uniq(items.map(i => i.contractor)).sort(sortStr), [items]);
  const CUSTOMERS = useMemo(() => uniq(items.map(i => i.customer)).sort(sortStr), [items]);
  const CONTRACTS = useMemo(() => uniq(items.map(i => i.contractNo)).sort(sortStr), [items]);
  const FIELDS = useMemo(() => uniq(items.map(i => i.field)).sort(sortStr), [items]);
  const OBJECTS = useMemo(() => uniq(items.map(i => i.object)).sort(sortStr), [items]);
  const CLUSTERS = useMemo(() => uniq(items.map(i => i.cluster)).sort((a, b) => Number(a) - Number(b)), [items]);
  const WELLS = useMemo(() => uniq(items.map(i => i.well)).sort(sortStr), [items]);
  const RESPS = useMemo(() => uniq(items.map(i => i.responsible)).sort(sortStr), [items]);

  const [contractor, setContractor] = useState<string[]>([]);
  const [customer, setCustomer] = useState<string[]>([]);
  const [contract, setContract] = useState<string[]>([]);
  const [field, setField] = useState<string[]>([]);
  const [object, setObject] = useState<string[]>([]);
  const [cluster, setCluster] = useState<string[]>([]);
  const [well, setWell] = useState<string[]>([]);
  const [resp, setResp] = useState<string[]>([]);
  const [pkmFilter, setPkmFilter] = useState<string[]>([]);

  // initialize multi-select state once
  useEffect(() => {
    setContractor(CONTRACTORS); setCustomer(CUSTOMERS); setContract(CONTRACTS);
    setField(FIELDS); setObject(OBJECTS); setCluster(CLUSTERS); setWell(WELLS);
    setResp(RESPS); setPkmFilter(['С ПКМ', 'Без ПКМ']);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter(v =>
      (q === '' || v.shortDesc.toLowerCase().includes(q) || v.groundText.toLowerCase().includes(q) || v.num.toLowerCase().includes(q)) &&
      type.includes(v.type) && status.includes(v.status) &&
      contractor.includes(v.contractor) && customer.includes(v.customer) && contract.includes(v.contractNo) &&
      field.includes(v.field) && object.includes(v.object) && cluster.includes(v.cluster) && well.includes(v.well) &&
      resp.includes(v.responsible) &&
      (v.linkedPkmId ? pkmFilter.includes('С ПКМ') : pkmFilter.includes('Без ПКМ')),
    );
  }, [search, type, status, contractor, customer, contract, field, object, cluster, well, resp, pkmFilter, items]);

  const reset = () => {
    setSearch('');
    setType([...VIOLATION_TYPES]); setStatus([...RV_STATUSES]);
    setContractor(CONTRACTORS); setCustomer(CUSTOMERS); setContract(CONTRACTS);
    setField(FIELDS); setObject(OBJECTS); setCluster(CLUSTERS); setWell(WELLS);
    setResp(RESPS); setPkmFilter(['С ПКМ', 'Без ПКМ']);
  };

  return (
    <>
      <section className="card">
        <div className="breadcrumbs">
          Главная / <span className="link" onClick={onBackToHub}>Управление исполнением договоров</span> /{' '}
          <span>Нарушения</span>
        </div>
        <h1 className="rv-title">Нарушения</h1>
        <p className="rv-sub">Сводный реестр нарушений по договорам и контролю «Флагман»</p>
      </section>

      <section className="card">
        <div className="rv-toolbar">
          <div className="rv-search">
            <IconSearchStroked size="s" view="ghost" />
            <input
              placeholder="Поиск по номеру, описанию или основанию"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="rv-filters">
            <MS label="Тип" items={VIOLATION_TYPES as unknown as string[]} selected={type} onChange={setType} />
            <MS label="Статус" items={RV_STATUSES as unknown as string[]} selected={status} onChange={setStatus} />
            <MS label="Контрагент" items={CONTRACTORS} selected={contractor} onChange={setContractor} />
            <MS label="Заказчик" items={CUSTOMERS} selected={customer} onChange={setCustomer} />
            <MS label="Договор" items={CONTRACTS} selected={contract} onChange={setContract} />
            <MS label="Месторождение" items={FIELDS} selected={field} onChange={setField} />
            <MS label="Объект" items={OBJECTS} selected={object} onChange={setObject} />
            <MS label="Куст" items={CLUSTERS} selected={cluster} onChange={setCluster} />
            <MS label="Скважина" items={WELLS} selected={well} onChange={setWell} />
            <MS label="Ответственный" items={RESPS} selected={resp} onChange={setResp} />
            <MS label="ПКМ" items={['С ПКМ', 'Без ПКМ']} selected={pkmFilter} onChange={setPkmFilter} />
            <button className="vio-reset" onClick={reset}>↺ Сбросить</button>
          </div>
        </div>

        <div className="rv-count">Найдено: <b>{filtered.length}</b> из {items.length}</div>

        <div className="rv-list">
          {filtered.length === 0 ? (
            <div className="rv-empty">По заданным фильтрам нарушений не найдено</div>
          ) : (
            filtered.map(v => (
              <div key={v.id} className="rv-card" onClick={() => onOpenCard(v.id)}>
                <div className="rv-card__head">
                  <div className="rv-card__title">
                    <span className="rv-card__num">№{v.num}</span>
                    <span className="rv-card__date">от {v.receivedAt}</span>
                    <span className={`rv-card__type rv-card__type--${typeCls(v.type)}`}>{v.type}</span>
                  </div>
                  <div className="rv-card__badges">
                    {v.linkedPkmId && pkmNumByid[v.linkedPkmId] && (
                      <span className="rv-pkm-badge">
                        <IconConnection size="xs" />ПКМ №{pkmNumByid[v.linkedPkmId]}
                        <span className="rv-pkm-tip">
                          <span
                            className="rv-pkm-tip__link"
                            onClick={(e) => { e.stopPropagation(); onOpenPkm(v.linkedPkmId!); }}
                          >Перейти к карточке ПКМ →</span>
                        </span>
                      </span>
                    )}
                    <span className={`rv-card__status rv-status--${statusCls(v.status)}`}>{v.status.toUpperCase()}</span>
                  </div>
                </div>

                <div className="rv-card__desc">{v.shortDesc}</div>

                <div className="rv-card__body">
                  <span><span className="rv-attr__label">Контрагент:</span> <span className="rv-attr__value">{v.contractor}</span></span>
                  <span><span className="rv-attr__label">Заказчик:</span> <span className="rv-attr__value">{v.customer}</span></span>
                  <span><span className="rv-attr__label">Договор:</span> <span className="rv-attr__value">{v.contractNo}</span></span>
                  <span><span className="rv-attr__label">Объект:</span> <span className="rv-attr__value">{v.object}</span></span>
                  <span><span className="rv-attr__label">Месторождение:</span> <span className="rv-attr__value">{v.field}</span></span>
                  <span><span className="rv-attr__label">Куст / Скважина:</span> <span className="rv-attr__value">{v.cluster} / {v.well}</span></span>
                </div>

                <div className="rv-card__foot">
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="rv-foot-item"><IconCalendar size="xs" />{v.receivedAt}</span>
                    <span className="rv-foot-item"><IconUser size="xs" />Ответственный: <span className="rv-foot-name">{v.responsible}</span></span>
                    {v.hasNpv && <span className="rv-npv-chip">НПВ</span>}
                  </div>
                  {v.demandSum != null && (
                    <span className="rv-sum-chip">Сумма требования: {fmtRub(v.demandSum)}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default ViolationsRegistry;
