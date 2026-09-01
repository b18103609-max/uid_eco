import type { DataStateKind } from '../data/dataFreshness.ts';
import './dataState.css';

const STATE_CONTENT: Record<DataStateKind, { title: string; description: string }> = {
  actual: { title: '', description: '' },
  delayed: {
    title: 'Обновление одного из источников задерживается',
    description: 'Показатели рассчитаны по последней успешной загрузке.',
  },
  partial: {
    title: 'Данные загружены частично',
    description: 'Доступные показатели показаны, неполнота источников учтена в статусе.',
  },
  loading: {
    title: 'Загружаем аналитику',
    description: 'Подготавливаем показатели и связанные объекты.',
  },
  empty: {
    title: 'По выбранным условиям данных нет',
    description: 'Измените период или сбросьте часть фильтров.',
  },
  error: {
    title: 'Не удалось загрузить аналитику',
    description: 'Повторите попытку позже. Последние подтверждённые значения не подменяются.',
  },
  preliminary: {
    title: 'Рейтинг ещё не зафиксирован',
    description: 'Показаны предварительные результаты текущего периода.',
  },
};

export const DataState = ({ state, warning }: { state: DataStateKind; warning?: string }) => {
  if (state === 'actual') return null;
  const content = STATE_CONTENT[state];
  const blocking = state === 'loading' || state === 'empty' || state === 'error';

  return (
    <div
      className={`data-state data-state--${state}${blocking ? ' data-state--blocking' : ''}`}
      role={state === 'error' ? 'alert' : 'status'}
    >
      <span className="data-state__icon" aria-hidden="true">
        {state === 'loading' ? '◌' : state === 'error' ? '!' : state === 'empty' ? '○' : 'i'}
      </span>
      <div>
        <div className="data-state__title">{content.title}</div>
        <div className="data-state__description">{warning || content.description}</div>
      </div>
    </div>
  );
};
