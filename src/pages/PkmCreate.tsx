import { useMemo, useRef, useState } from 'react';
import { IconAttach } from '@consta/icons/IconAttach';
import { IconClose } from '@consta/icons/IconClose';
import { IconAdd } from '@consta/icons/IconAdd';
import { VIOLATIONS, USERS } from '../data';
import './pkmcard.css';

export type PkmDraft = {
  description: string;
  contractNo: string;
  contractSubject?: string;
  formedAt: string;
  plannedEnd: string;
  linkedViolations: number[];
  claimsCount: number;
  pkmFile?: string;
  requestLetterFile?: string;
  letterDate?: string;
  protocolNo: string;
  protocolDate: string;
  cost?: number;
  attachments: string[];
  comment: string;
  responsible: string;
  customer?: string;
  contractor?: string;
};

const iso2ru = (iso: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
};
const todayIso = () => new Date().toISOString().slice(0, 10);

type Props = {
  preselectedViolations: number[];
  onSubmit: (draft: PkmDraft) => void;
  onCancel: () => void;
  onBackToHub: () => void;
};

const FileField = ({ value, onChange, multiple }: { value: string[]; onChange: (v: string[]) => void; multiple?: boolean }) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="pf-file">
      <button type="button" className="pf-file__btn" onClick={() => ref.current?.click()}>
        <IconAttach size="xs" />Прикрепить{multiple ? ' файлы' : ' файл'}
      </button>
      <input
        ref={ref}
        type="file"
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={e => {
          const names = Array.from(e.target.files || []).map(f => f.name);
          onChange(multiple ? [...value, ...names] : names.slice(0, 1));
        }}
      />
      <div className="pf-file__list">
        {value.map((f, i) => (
          <span key={i} className="pf-file__chip">
            {f}
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))}><IconClose size="xs" /></button>
          </span>
        ))}
      </div>
    </div>
  );
};

const PkmCreate = ({ preselectedViolations, onSubmit, onCancel, onBackToHub }: Props) => {
  const [description, setDescription] = useState('');
  const [contractNo, setContractNo] = useState('');
  const [formedAt, setFormedAt] = useState(todayIso());
  const [plannedEnd, setPlannedEnd] = useState('');
  const [linkedViolations, setLinkedViolations] = useState<number[]>(preselectedViolations);
  const [claims, setClaims] = useState<string[]>([]);
  const [pkmFile, setPkmFile] = useState<string[]>([]);
  const [letterFile, setLetterFile] = useState<string[]>([]);
  const [letterDate, setLetterDate] = useState('');
  const [protocolNo, setProtocolNo] = useState('');
  const [protocolDate, setProtocolDate] = useState('');
  const [cost, setCost] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [responsible, setResponsible] = useState('');
  const [addVioOpen, setAddVioOpen] = useState(false);

  const valid = description.trim() !== '' && responsible !== '' && plannedEnd !== '';

  const availableVios = useMemo(
    () => VIOLATIONS.filter(v => !linkedViolations.includes(v.id)),
    [linkedViolations],
  );

  const submit = () => {
    if (!valid) return;
    onSubmit({
      description: description.trim(),
      contractNo,
      formedAt: iso2ru(formedAt),
      plannedEnd: iso2ru(plannedEnd),
      linkedViolations,
      claimsCount: claims.length,
      pkmFile: pkmFile[0],
      requestLetterFile: letterFile[0],
      letterDate: iso2ru(letterDate),
      protocolNo,
      protocolDate: iso2ru(protocolDate),
      cost: cost ? Number(cost.replace(',', '.')) : undefined,
      attachments,
      comment: comment.trim(),
      responsible,
    });
  };

  return (
    <>
      <section className="card">
        <div className="breadcrumbs">
          Главная / <span className="link" onClick={onBackToHub}>Управление исполнением договоров</span> /{' '}
          <span className="link" onClick={onCancel}>План корректирующих мероприятий</span> / <span>Создание ПКМ</span>
        </div>
        <h1 className="pf-title">Создание корректирующего мероприятия</h1>
        {preselectedViolations.length > 0 && (
          <p className="pf-note">На основании выбранных нарушений: {preselectedViolations.length} шт.</p>
        )}
      </section>

      <section className="card">
        <div className="pf-grid">
          <div className="pf-field">
            <label className="pf-label">Номер</label>
            <div className="pf-readonly">Будет присвоен автоматически</div>
          </div>

          <div className="pf-field pf-field--full">
            <label className="pf-label">Описание <span className="pf-req">*</span></label>
            <textarea className="pf-input pf-textarea" value={description} onChange={e => setDescription(e.target.value)} placeholder="Опишите корректирующее мероприятие" />
          </div>

          <div className="pf-field">
            <label className="pf-label">Номер договора</label>
            <input className="pf-input" value={contractNo} onChange={e => setContractNo(e.target.value)} placeholder="ГПН-25/…" />
          </div>
          <div className="pf-field">
            <label className="pf-label">Ответственный <span className="pf-req">*</span></label>
            <select className="pf-input" value={responsible} onChange={e => setResponsible(e.target.value)}>
              <option value="">— выберите —</option>
              {USERS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div className="pf-field">
            <label className="pf-label">Дата формирования</label>
            <input type="date" className="pf-input" value={formedAt} onChange={e => setFormedAt(e.target.value)} />
          </div>
          <div className="pf-field">
            <label className="pf-label">Плановая дата выполнения <span className="pf-req">*</span></label>
            <input type="date" className="pf-input" value={plannedEnd} onChange={e => setPlannedEnd(e.target.value)} />
          </div>

          <div className="pf-field pf-field--full">
            <label className="pf-label">Связанные нарушения</label>
            <div className="pf-chips">
              {linkedViolations.map(id => {
                const v = VIOLATIONS.find(x => x.id === id);
                return (
                  <span key={id} className="pf-chip">
                    №{id} {v ? v.scenario.slice(0, 40) + (v.scenario.length > 40 ? '…' : '') : ''}
                    <button type="button" onClick={() => setLinkedViolations(linkedViolations.filter(x => x !== id))}><IconClose size="xs" /></button>
                  </span>
                );
              })}
              <div className="pf-add-wrap">
                <button type="button" className="pf-add" onClick={() => setAddVioOpen(o => !o)} disabled={availableVios.length === 0}>
                  <IconAdd size="xs" />Привязать нарушение
                </button>
                {addVioOpen && (
                  <div className="pf-add-drop">
                    {availableVios.map(v => (
                      <div key={v.id} className="pf-add-opt" onClick={() => { setLinkedViolations([...linkedViolations, v.id]); setAddVioOpen(false); }}>
                        №{v.id} — {v.scenario}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pf-field pf-field--full">
            <label className="pf-label">Связанные претензии</label>
            <div className="pf-chips">
              {claims.map((c, i) => (
                <span key={i} className="pf-chip">
                  {c}
                  <button type="button" onClick={() => setClaims(claims.filter((_, j) => j !== i))}><IconClose size="xs" /></button>
                </span>
              ))}
              <button type="button" className="pf-add" onClick={() => setClaims([...claims, `Претензия №${1000 + claims.length + 1}`])}>
                <IconAdd size="xs" />Привязать претензию
              </button>
            </div>
          </div>

          <div className="pf-field">
            <label className="pf-label">ПКМ (документ)</label>
            <FileField value={pkmFile} onChange={setPkmFile} />
          </div>
          <div className="pf-field">
            <label className="pf-label">Письмо-запрос мероприятий</label>
            <FileField value={letterFile} onChange={setLetterFile} />
          </div>

          <div className="pf-field">
            <label className="pf-label">Дата письма</label>
            <input type="date" className="pf-input" value={letterDate} onChange={e => setLetterDate(e.target.value)} />
          </div>
          <div className="pf-field">
            <label className="pf-label">Стоимость мероприятий, ₽</label>
            <input className="pf-input" value={cost} onChange={e => setCost(e.target.value)} placeholder="0,00" inputMode="decimal" />
          </div>

          <div className="pf-field">
            <label className="pf-label">Протокол</label>
            <input className="pf-input" value={protocolNo} onChange={e => setProtocolNo(e.target.value)} placeholder="№…" />
          </div>
          <div className="pf-field">
            <label className="pf-label">Дата протокола</label>
            <input type="date" className="pf-input" value={protocolDate} onChange={e => setProtocolDate(e.target.value)} />
          </div>

          <div className="pf-field pf-field--full">
            <label className="pf-label">Приложение</label>
            <FileField value={attachments} onChange={setAttachments} multiple />
          </div>

          <div className="pf-field pf-field--full">
            <label className="pf-label">Комментарий</label>
            <textarea className="pf-input pf-textarea" value={comment} onChange={e => setComment(e.target.value)} placeholder="Комментарий" />
          </div>
        </div>

        <div className="pf-actions">
          <button className="pf-btn pf-btn--ghost" onClick={onCancel}>Отмена</button>
          <button className="pf-btn pf-btn--primary" onClick={submit} disabled={!valid}>Создать</button>
        </div>
      </section>
    </>
  );
};

export default PkmCreate;
