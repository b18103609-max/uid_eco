import { AnalyticsPageShell } from '../analytics/components/AnalyticsPageShell.tsx';
import type { AnalyticsPageId } from '../analytics/routing.ts';
import { SupersetDashboardView } from '../analytics/components/SupersetDashboard.tsx';
import { ReportsDashboard } from '../analytics/components/ReportsDashboard.tsx';

const AnalyticsPage = ({
  page,
  onNavigate,
  onBackToHub,
}: {
  page: AnalyticsPageId;
  onNavigate: (page: AnalyticsPageId) => void;
  onBackToHub: () => void;
}) => {
  return (
    <AnalyticsPageShell page={page} onNavigate={onNavigate} onBackToHub={onBackToHub}>
      {page !== 'reports' && page !== 'addendums' && <SupersetDashboardView page={page} />}
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
