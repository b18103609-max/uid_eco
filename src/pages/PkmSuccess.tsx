import { IconCheck } from '@consta/icons/IconCheck';
import { type Pkm } from '../data';
import './pkmcard.css';

type Props = {
  pkm: Pkm;
  onOpenCard: () => void;
  onBack: () => void;
};

const PkmSuccess = ({ pkm, onOpenCard, onBack }: Props) => (
  <section className="card pf-success">
    <div className="pf-success__icon"><IconCheck size="m" /></div>
    <h1 className="pf-success__title">Корректирующее мероприятие создано</h1>
    <p className="pf-success__sub">ПКМ №{pkm.num} добавлено в реестр со статусом «Новый».</p>
    <div className="pf-success__actions">
      <button className="pf-btn pf-btn--primary" onClick={onOpenCard}>Перейти к карточке ПКМ</button>
      <button className="pf-btn pf-btn--ghost" onClick={onBack}>Назад</button>
    </div>
  </section>
);

export default PkmSuccess;
