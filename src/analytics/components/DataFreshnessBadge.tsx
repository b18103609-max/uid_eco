import {
  formatFreshnessDate,
  type DataFreshness,
  type DataStateKind,
} from '../data/dataFreshness.ts';
import './dataState.css';

const LABELS: Record<DataStateKind, string> = {
  actual: 'Данные актуальны',
  delayed: 'Обновление задержано',
  partial: 'Частичные данные',
  loading: 'Загрузка данных',
  empty: 'Нет данных',
  error: 'Ошибка данных',
  preliminary: 'Предварительные данные',
};

export const DataFreshnessBadge = ({
  freshness,
  state,
}: {
  freshness: DataFreshness;
  state: DataStateKind;
}) => (
  <div className={`data-freshness data-freshness--${state}`} title={freshness.warning}>
    <span className="data-freshness__dot" />
    <span className="data-freshness__label">{LABELS[state]}</span>
    {(state === 'partial' || state === 'preliminary') && (
      <span className="data-freshness__completeness">{freshness.completeness}%</span>
    )}
    <span className="data-freshness__date">на {formatFreshnessDate(freshness.lastSuccessfulLoad)}</span>
  </div>
);
