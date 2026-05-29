import { useRef, useState } from 'react';
import { IconAttach } from '@consta/icons/IconAttach';
import { IconClose } from '@consta/icons/IconClose';
import { IconDocFilled } from '@consta/icons/IconDocFilled';
import {
  USERS, RV_STATUSES, userInitials,
  type RegistryViolation, type RegistryViolationStatus,
} from '../data';
import './pkmcard.css';
import './rviolations.css';

type Props = {
  v: RegistryViolation;
  pkmNum?: string;
  onBack: () => void;
  onBackToHub: () => void;
  onOpenPkm: (pkmId: string) => void;
  onChangeStatus: (to: RegistryViolationStatus, responsible: string, comment: string, file?: string) => void;
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

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="pc-row">
    <div className="pc-row__label">{label}</div>
    <div className="pc-row__value">{children}</div>
  </div>
);

const fmtRub = (n?: number) => n == null ? '—' : `${n.toLocaleString('ru-RU')} ₽`;

const ViolationCard = ({ v, pkmNum, onBack, onBackToHub, onOpenPkm, onChangeStatus }: Props) => {
  const [target, setTarget] = useState<RegistryViolationStatus | null>(null);
  const [mResp, setMResp] = useState(v.responsible);
  const [mComment, setMComment] = useState('');
  const [mFile, setMFile] = useState<string>('');
  const fileRef = useRef<HTMLInputElement>(null);

  const openModal = (s: RegistryViolationStatus) => {
    if (s === v.status) return;
    setTarget(s); setMResp(v.responsible); setMComment(''); setMFile('');
  };
  const confirm = () => {
    if (!target || !mResp || !mComment.trim()) return;
    onChangeStatus(target, mResp, mComment.trim(), mFile || undefined);
    setTarget(null);
  };

  return (
    <>
      <section className="card">
        <div className="breadcrumbs">
          Главная / <span className="link" onClick={onBackToHub}>Управление исполнением договоров</span> /{' '}
          <span className="link" onClick={onBack}>Нарушения</span> / <span>№{v.num}</span>
        </div>
        <div className="pc-head">
          <h1 className="pf-title">Нарушение №{v.num}</h1>
          <span className={`rv-card__status rv-status--${statusCls(v.status)}`}>{v.status.toUpperCase()}</span>
        </div>
      </section>

      <div className="pc-layout">
        <section className="card pc-attrs">
          <h2 className="pc-section-title">Атрибуты</h2>
          <Row label="Номер">№{v.num}</Row>
          <Row label="Дата поступления">{v.receivedAt}</Row>
          <Row label="Основание (текст)">{v.groundText}</Row>
          <Row label="Основание (файл)">
            {v.groundFile ? <span className="pc-file"><IconDocFilled size="xs" />{v.groundFile}</span> : '—'}
          </Row>
          <Row label="Тип нарушения">{v.type}</Row>
          <Row label="Контрагент">{v.contractor}</Row>
          <Row label="Заказчик">{v.customer}</Row>
          <Row label="Договор"><a href="#" onClick={e => e.preventDefault()}>{v.contractNo}</a></Row>
          <Row label="Место фиксации">{v.object} · {v.field} · куст {v.cluster} · скв. {v.well}</Row>
          <Row label="Краткое описание">{v.shortDesc}</Row>
          <Row label="Ответственный">
            <span className="pkm-resp"><span className="pkm-resp__avatar">{userInitials(v.responsible)}</span><span className="pkm-resp__name">{v.responsible}</span></span>
          </Row>
          <Row label="Связанный ПКМ">
            {v.linkedPkmId && pkmNum ? (
              <span className="rv-pkm-badge" style={{ position: 'relative' }}>
                ПКМ №{pkmNum}
                <span className="rv-pkm-tip">
                  <span className="rv-pkm-tip__link" onClick={() => onOpenPkm(v.linkedPkmId!)}>Перейти к карточке ПКМ →</span>
                </span>
              </span>
            ) : '—'}
          </Row>
          <Row label="Наличие НПВ">{v.hasNpv ? 'Да' : 'Нет'}</Row>
          <Row label="Сумма требования к устранению">{fmtRub(v.demandSum)}</Row>
        </section>

        <section className="card pc-side">
          <h2 className="pc-section-title">Состояние</h2>
          <div className="pc-graph">
            {RV_STATUSES.map((s, i) => (
              <div key={s} className="pc-graph__item">
                <button
                  className={`pc-node${s === v.status ? ' pc-node--current' : ''}`}
                  onClick={() => openModal(s)}
                  disabled={s === v.status}
                  title={s === v.status ? 'Текущий статус' : `Перевести в «${s}»`}
                >
                  <span className={`pc-node__dot rv-dot--${statusCls(s)}`} />
                  {s}
                  {s === v.status && <span className="pc-node__badge">текущий</span>}
                </button>
                {i < RV_STATUSES.length - 1 && <span className="pc-graph__line" />}
              </div>
            ))}
          </div>
          <p className="pc-hint">Нажмите на статус, чтобы перевести карточку. Потребуется указать ответственного и комментарий.</p>

          <h2 className="pc-section-title" style={{ marginTop: 24 }}>История</h2>
          <div className="pc-history">
            {[...v.history].reverse().map((h, i) => (
              <div key={i} className="pc-hist">
                <div className="pc-hist__line">
                  <span className={`pc-hist__dot rv-dot--${statusCls(h.to)}`} />
                  <span className="pc-hist__status">
                    {h.from ? <>{h.from} → <b>{h.to}</b></> : <b>{h.to}</b>}
                  </span>
                  <span className="pc-hist__date">{h.date}</span>
                </div>
                <div className="pc-hist__meta">Ответственный: {h.responsible}</div>
                {h.comment && <div className="pc-hist__comment">{h.comment}</div>}
                {h.file && <div className="pc-file pc-hist__file"><IconAttach size="xs" />{h.file}</div>}
              </div>
            ))}
          </div>
        </section>
      </div>

      {target && (
        <div className="pc-modal-overlay" onClick={() => setTarget(null)}>
          <div className="pc-modal" onClick={e => e.stopPropagation()}>
            <div className="pc-modal__head">
              <h3>Перевод в статус «{target}»</h3>
              <button className="pc-modal__close" onClick={() => setTarget(null)}><IconClose size="s" /></button>
            </div>
            <div className="pc-modal__body">
              <label className="pf-label">Новый ответственный <span className="pf-req">*</span></label>
              <select className="pf-input" value={mResp} onChange={e => setMResp(e.target.value)}>
                {USERS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>

              <label className="pf-label">Комментарий <span className="pf-req">*</span></label>
              <textarea className="pf-input pf-textarea" value={mComment} onChange={e => setMComment(e.target.value)} placeholder="Причина перевода" />

              <label className="pf-label">Файл</label>
              <div className="pf-file">
                <button type="button" className="pf-file__btn" onClick={() => fileRef.current?.click()}><IconAttach size="xs" />Прикрепить файл</button>
                <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={e => setMFile(e.target.files?.[0]?.name || '')} />
                {mFile && <div className="pf-file__list"><span className="pf-file__chip">{mFile}<button type="button" onClick={() => setMFile('')}><IconClose size="xs" /></button></span></div>}
              </div>
            </div>
            <div className="pc-modal__actions">
              <button className="pf-btn pf-btn--ghost" onClick={() => setTarget(null)}>Отмена</button>
              <button className="pf-btn pf-btn--primary" onClick={confirm} disabled={!mResp || !mComment.trim()}>Перевести</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViolationCard;
