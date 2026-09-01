import { AnalyticsPageShell } from '../analytics/components/AnalyticsPageShell.tsx';
import type { AnalyticsPageId } from '../analytics/routing.ts';
import { GlobalFilterBar } from '../analytics/components/GlobalFilterBar.tsx';
import { OverviewDashboard } from '../analytics/components/OverviewDashboard.tsx';
import { IndicatorsDashboard } from '../analytics/components/IndicatorsDashboard.tsx';
import { RatingDashboard } from '../analytics/components/RatingDashboard.tsx';
import { SafetyDashboard } from '../analytics/components/SafetyDashboard.tsx';
import { PcmDashboard } from '../analytics/components/PcmDashboard.tsx';
import { PreclaimDashboard } from '../analytics/components/PreclaimDashboard.tsx';
import { ReportsDashboard } from '../analytics/components/ReportsDashboard.tsx';
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
  return (
    <AnalyticsPageShell page={page} onNavigate={onNavigate} onBackToHub={onBackToHub}>
      {page !== 'reports' && page !== 'addendums' && <GlobalFilterBar filters={filters} onChange={onFiltersChange} />}

      {page === 'overview' && <OverviewDashboard filters={filters} onNavigate={onNavigate} />}

      {page === 'indicators' && <IndicatorsDashboard filters={filters} onOpenContract={onOpenContract} />}
      {page === 'rating' && <RatingDashboard filters={filters} />}
      {page === 'safety' && <SafetyDashboard filters={filters} />}
      {page === 'pcm' && <PcmDashboard filters={filters} />}
      {page === 'preclaim' && <PreclaimDashboard filters={filters} />}
      {page === 'reports' && <ReportsDashboard />}

      {page === 'addendums' && (
        <section className="analytics-placeholder">
          <h2>Раздел перенесён в витрину отчётов</h2>
          <p>Отдельная аналитическая страница скрыта. Реестр дополнительных соглашений доступен как стандартный отчёт.</p>
          <button className="global-filters__reset" onClick={() => onNavigate('reports')}>Открыть витрину отчётов →</button>
        </section>
      )}
    </AnalyticsPageShell>
  );
};

export default AnalyticsPage;
