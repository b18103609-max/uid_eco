import { AnalyticsPageShell } from '../analytics/components/AnalyticsPageShell.tsx';
import { ANALYTICS_PAGES, getAnalyticsPage, type AnalyticsPageId } from '../analytics/routing.ts';
import ContractsIndicators from './ContractsIndicators.tsx';

const AnalyticsPage = ({
  page,
  onNavigate,
  onBackToHub,
}: {
  page: AnalyticsPageId;
  onNavigate: (page: AnalyticsPageId) => void;
  onBackToHub: () => void;
}) => {
  const current = getAnalyticsPage(page);

  return (
    <AnalyticsPageShell page={page} onNavigate={onNavigate} onBackToHub={onBackToHub}>
      {page === 'overview' && (
        <section className="analytics-overview">
          {ANALYTICS_PAGES.filter(item => item.id !== 'overview').map(item => (
            <button key={item.id} className="analytics-overview__card" onClick={() => onNavigate(item.id)}>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
              <em>Открыть раздел →</em>
            </button>
          ))}
        </section>
      )}

      {page === 'indicators' && <ContractsIndicators />}

      {page !== 'overview' && page !== 'indicators' && (
        <section className="analytics-placeholder">
          <h2>{current.title}</h2>
          <p>
            Адрес и навигационный каркас раздела уже готовы. Содержательные виджеты,
            фильтры и детализация будут перенесены сюда на следующих шагах карты разработки.
          </p>
        </section>
      )}
    </AnalyticsPageShell>
  );
};

export default AnalyticsPage;
