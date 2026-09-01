import { AnalyticsPageShell } from '../analytics/components/AnalyticsPageShell.tsx';
import { getAnalyticsPage, type AnalyticsPageId } from '../analytics/routing.ts';
import { GlobalFilterBar } from '../analytics/components/GlobalFilterBar.tsx';
import { OverviewDashboard } from '../analytics/components/OverviewDashboard.tsx';
import { IndicatorsDashboard } from '../analytics/components/IndicatorsDashboard.tsx';
import { RatingDashboard } from '../analytics/components/RatingDashboard.tsx';
import { SafetyDashboard } from '../analytics/components/SafetyDashboard.tsx';
import type { AnalyticsFilters } from '../analytics/filters.ts';

const AnalyticsPage = ({
  page,
  onNavigate,
  onBackToHub,
  filters,
  onFiltersChange,
  onOpenContract,
}: {
  page: AnalyticsPageId;
  onNavigate: (page: AnalyticsPageId) => void;
  onBackToHub: () => void;
  filters: AnalyticsFilters;
  onFiltersChange: (filters: AnalyticsFilters) => void;
  onOpenContract: () => void;
}) => {
  const current = getAnalyticsPage(page);

  return (
    <AnalyticsPageShell page={page} onNavigate={onNavigate} onBackToHub={onBackToHub}>
      <GlobalFilterBar filters={filters} onChange={onFiltersChange} />

      {page === 'overview' && <OverviewDashboard filters={filters} onNavigate={onNavigate} />}

      {page === 'indicators' && <IndicatorsDashboard filters={filters} onOpenContract={onOpenContract} />}
      {page === 'rating' && <RatingDashboard filters={filters} />}
      {page === 'safety' && <SafetyDashboard filters={filters} />}

      {page !== 'overview' && page !== 'indicators' && page !== 'rating' && page !== 'safety' && (
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
