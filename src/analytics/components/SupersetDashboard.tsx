import { useEffect, useMemo, useRef, useState } from 'react';
import { embedDashboard, type EmbeddedDashboard } from '@superset-ui/embedded-sdk';
import type { AnalyticsPageId } from '../routing.ts';
import './supersetDashboard.css';

const SUPERSET_DOMAIN = (import.meta.env.VITE_SUPERSET_DOMAIN || 'https://94.125.100.176').replace(/\/$/, '');

type DashboardConfig = { slug: string; id: string; label: string };

const DASHBOARDS: Partial<Record<AnalyticsPageId, DashboardConfig[]>> = {
  overview: [{ slug: 'overview', id: '1f44ca22-e850-4fa5-8d6e-c4289bf054dd', label: 'Фокус внимания' }],
  indicators: [{ slug: 'contracts', id: '7535e69a-2972-4d8d-a868-aef45732e637', label: 'Договоры' }],
  rating: [{ slug: 'rating', id: 'a956f547-5730-4ee5-b83b-f9b552322756', label: 'Флагман' }],
  safety: [{ slug: 'breaches', id: '10c8507e-ee6d-48af-91dc-95086b7e074e', label: 'Нарушения по договору' }],
  pcm: [{ slug: 'pcm', id: '72769d2e-c274-45f6-87df-2e10a77546ba', label: 'ПКМ' }],
  preclaim: [{ slug: 'preclaims', id: '54ff2a33-a935-47ab-8284-a047ed7cf02c', label: 'Допретензионная работа' }],
};

const fetchGuestToken = async (slug: string) => {
  const response = await fetch(`${SUPERSET_DOMAIN}/api/guest-token?dashboard=${encodeURIComponent(slug)}`, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Сервис BI вернул код ${response.status}`);
  const body = await response.json() as { token?: string };
  if (!body.token) throw new Error('Сервис BI не вернул гостевой токен');
  return body.token;
};

export const SupersetDashboardView = ({ page }: { page: AnalyticsPageId }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const configs = useMemo(() => DASHBOARDS[page] || [], [page]);
  const [activeSlug, setActiveSlug] = useState(configs[0]?.slug || '');
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => setActiveSlug(configs[0]?.slug || ''), [configs]);
  const active = configs.find(item => item.slug === activeSlug) || configs[0];

  useEffect(() => {
    if (!active || !mountRef.current) return;
    let dashboard: EmbeddedDashboard | undefined;
    let cancelled = false;
    setState('loading');
    setError('');
    mountRef.current.replaceChildren();

    embedDashboard({
      id: active.id,
      supersetDomain: SUPERSET_DOMAIN,
      mountPoint: mountRef.current,
      fetchGuestToken: () => fetchGuestToken(active.slug),
      iframeTitle: `UID ECO — ${active.label}`,
      referrerPolicy: 'strict-origin-when-cross-origin',
      guestTokenFetchTimeoutMs: 15_000,
      dashboardUiConfig: {
        hideTitle: true,
        hideTab: true,
        hideChartControls: true,
        filters: { visible: true, expanded: false },
        urlParams: { standalone: 3 },
      },
    }).then(instance => {
      if (cancelled) instance.unmount();
      else {
        dashboard = instance;
        setState('ready');
      }
    }).catch((reason: unknown) => {
      if (!cancelled) {
        setError(reason instanceof Error ? reason.message : 'Не удалось открыть BI-дашборд');
        setState('error');
      }
    });

    return () => {
      cancelled = true;
      dashboard?.unmount();
    };
  }, [active, retry]);

  if (!active) return null;

  return (
    <section className="superset-dashboard">
      {configs.length > 1 && (
        <nav className="superset-dashboard__tabs" aria-label="BI-представления">
          {configs.map(item => (
            <button
              key={item.slug}
              className={item.slug === active.slug ? 'is-active' : undefined}
              onClick={() => setActiveSlug(item.slug)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}
      <div className="superset-dashboard__frame">
        {state === 'loading' && <div className="superset-dashboard__status">Загружаем BI-дашборд…</div>}
        {state === 'error' && (
          <div className="superset-dashboard__status superset-dashboard__status--error">
            <strong>BI-дашборд временно недоступен</strong>
            <span>{error}</span>
            <button onClick={() => setRetry(value => value + 1)}>Повторить</button>
          </div>
        )}
        <div ref={mountRef} className={state === 'ready' ? 'superset-dashboard__mount is-ready' : 'superset-dashboard__mount'} />
      </div>
    </section>
  );
};
