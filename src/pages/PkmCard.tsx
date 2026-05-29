import { useRef, useState } from 'react';
import { IconAttach } from '@consta/icons/IconAttach';
import { IconClose } from '@consta/icons/IconClose';
import { IconDocFilled } from '@consta/icons/IconDocFilled';
import {
  VIOLATIONS, USERS, PKM_STATUSES, userInitials,
  type Pkm, type PkmStatus,
} from '../data';
import './pkmcard.css';

type Props = {
  pkm: Pkm;
  onBack: () => void;
  onBackToHub: () => void;
  onChangeStatus: (to: PkmStatus, responsible: string, comment: string, file?: string) => void;
};

const statusCls = (s: PkmStatus): string => {
  switch (s) {
    case 'Новый': return 'new';
    case 'В работе': return 'wip';
    case 'Реализовано': return 'done';
    case 'Реализовано частично': return 'partial';
    case 'Отменено': return 'cancel';
  }
};

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="pc-row">
    <div className="pc-row__label">{label}</div>
    <div className="pc-row__value">{children}</div>
  </div>
);

const PkmCard = ({ pkm, onBack, onBackToHub, onChangeStatus }: Props) => {
  const [target, setTarget] = useState<PkmStatus | null>(null);
  const [mResp, setMResp] = useState(pkm.responsible);
  const [mComment, setMComment] = useState('');
  const [mFile, setMFile] = useState<string>('');
  const fileRef = useRef<HTMLInputElement>(null);

  const openModal = (s: PkmStatus) => {
    if (s === pkm.status) return;
    setTarget(s);
    setMResp(pkm.responsible);
    setMComment('');
    setMFile('');
  };
  const confirm = () => {
    if (!target || !mResp || !mComment.trim()) return;
    onChangeStatus(target, mResp, mComment.trim(), mFile || undefined);
    setTarget(null);
  };

  const linkedVios = pkm.linkedViolations.map(id => VIOLATIONS.find(v => v.id === id)).filter(Boolean);

  return (
    <>
      <section className="card">
        <div className="breadcrumbs">
          Главная / <span className="link" onClick={onBackToHub}>Управление исполнением договоров</span> /{' '}
          <span className="link" onClick={onBack}>План корректирующих мероприятий</span> / <span>ПКМ №{pkm.num}</span>
        </div>
        <div className="pc-head">
          <h1 className="pf-title">Корректирующее мероприятие №{pkm.num}</h1>
          <span className={`pkm-status pkm-status--${statusCls(pkm.status)}`}>{pkm.status.toUpperCase()}</span>
        </div>
      </section>

      <div className="pc-layout">
        <section className="card pc-attrs">
          <h2 className="pc-section-title">Атрибуты</h2>
          <Row label="Номер">№{pkm.num}</Row>
          <Row label="Описание">{pkm.description}</Row>
          <Row label="Номер договора"><a href="#" onClick={e => e.preventDefault()}>{pkm.contractNo}</a></Row>
          <Row label="Дата формирования">{pkm.formedAt}</Row>
          <Row label="Плановая дата выполнения">{pkm.plannedEnd}</Row>
          <Row label="Связанные нарушения">
            {linkedVios.length === 0 ? '—' : (
              <div className="pc-links">
                {linkedVios.map(v => <span key={v!.id} className="pc-linkchip">№{v!.id} — {v!.scenario}</span>)}
              </div>
            )}
          </Row>
          <Row label="Связанные претензии">{pkm.claimsCount > 0 ? `${pkm.claimsCount} шт.` : '—'}</Row>
          <Row label="ПКМ (документ)">{pkm.pkmFile ? <span className="pc-file"><IconDocFilled size="xs" />{pkm.pkmFile}</span> : '—'}</Row>
          <Row label="Письмо-запрос мероприятий">{pkm.requestLetterFile ? <span className="pc-file"><IconDocFilled size="xs" />{pkm.requestLetterFile}</span> : '—'}</Row>
          <Row label="Дата письма">{pkm.letterDate || '—'}</Row>
          <Row label="Протокол">{pkm.protocolNo || '—'}</Row>
          <Row label="Дата протокола">{pkm.protocolDate || '—'}</Row>
          <Row label="Стоимость мероприятий">{pkm.cost != null ? `${pkm.cost.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽` : '—'}</Row>
          <Row label="Приложение">
            {pkm.attachments.length === 0 ? '—' : (
              <div className="pc-links">{pkm.attachments.map((a, i) => <span key={i} className="pc-file"><IconDocFilled size="xs" />{a}</span>)}</div>
            )}
          </Row>
          <Row label="Комментарий">{pkm.comment || '—'}</Row>
          <Row label="Ответственный">
            <span className="pkm-resp"><span className="pkm-resp__avatar">{userInitials(pkm.responsible)}</span><span className="pkm-resp__name">{pkm.responsible}</span></span>
          </Row>
        </section>

        <section className="card pc-side">
          <h2 className="pc-section-title">Состояние</h2>
          <div className="pc-graph">
            {PKM_STATUSES.map((s, i) => (
              <div key={s} className="pc-graph__item">
                <button
                  className={`pc-node pc-node--${statusCls(s)}${s === pkm.status ? ' pc-node--current' : ''}`}
                  onClick={() => openModal(s)}
                  disabled={s === pkm.status}
                  title={s === pkm.status ? 'Текущий статус' : `Перевести в «${s}»`}
                >
                  <span className="pc-node__dot" />
                  {s}
                  {s === pkm.status && <span className="pc-node__badge">текущий</span>}
                </button>
                {i < PKM_STATUSES.length - 1 && <span className="pc-graph__line" />}
              </div>
            ))}
          </div>
          <p className="pc-hint">Нажмите на статус, чтобы перевести карточку. Потребуется указать ответственного и комментарий.</p>

          <h2 className="pc-section-title" style={{ marginTop: 24 }}>История</h2>
          <div className="pc-history">
            {[...pkm.history].reverse().map((h, i) => (
              <div key={i} className="pc-hist">
                <div className="pc-hist__line">
                  <span className={`pc-hist__dot pc-hist__dot--${statusCls(h.to)}`} />
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

export default PkmCard;
