import type { ReactNode } from 'react';
import { ANALYTICS_PAGES, getAnalyticsPage, type AnalyticsPageId } from '../routing.ts';
import './analyticsShell.css';

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
      </header>

      <nav className="analytics-shell__nav" aria-label="Разделы аналитики">
        {ANALYTICS_PAGES.map(item => (
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
