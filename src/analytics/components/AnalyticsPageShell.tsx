import type { ReactNode } from 'react';
import { ANALYTICS_NAV_PAGES, getAnalyticsPage, type AnalyticsPageId } from '../routing.ts';
import './analyticsShell.css';
import { DataFreshnessBadge } from './DataFreshnessBadge.tsx';
import { combineDataFreshness, DATA_FRESHNESS } from '../data/dataFreshness.ts';

export const AnalyticsPageShell = ({
  page,
  onNavigate,
  onBackToHub,
  children,
}: {
  page: AnalyticsPageId;
  onNavigate: (page: AnalyticsPageId) => void;
  onBackToHub: () => void;
  children: ReactNode;
}) => {
  const current = getAnalyticsPage(page);
  const freshness = combineDataFreshness(Object.values(DATA_FRESHNESS));

  return (
    <div className="analytics-shell">
      <div className="analytics-shell__breadcrumbs">
        <button onClick={onBackToHub}>Управление исполнением договора</button>
        <span>/</span>
        {page !== 'overview' && (
          <>
            <button onClick={() => onNavigate('overview')}>Аналитика</button>
            <span>/</span>
          </>
        )}
        <span>{page === 'overview' ? 'Аналитика' : current.label}</span>
      </div>

      <header className="analytics-shell__header">
        <div>
          <h1>{current.title}</h1>
          <p>{current.description}</p>
        </div>
        <div className="analytics-shell__meta">
          <DataFreshnessBadge freshness={freshness} state={freshness.state} />
          <button title="Определения и источники показателей">О показателях</button>
        </div>
      </header>

      <nav className="analytics-shell__nav" aria-label="Разделы аналитики">
        {ANALYTICS_NAV_PAGES.map(item => (
          <button
            key={item.id}
            className={item.id === page ? 'analytics-shell__nav-item analytics-shell__nav-item--active' : 'analytics-shell__nav-item'}
            aria-current={item.id === page ? 'page' : undefined}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <main>{children}</main>
    </div>
  );
};
