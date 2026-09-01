import { useEffect, useState } from 'react';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import Layout from './Layout';
import ContractMgmtHub from './pages/ContractMgmtHub';
import ContractsPage from './pages/ContractsPage';
import ContractCard from './pages/ContractCard';
import FlagmanRating from './pages/FlagmanRating';
import ViolationsPage from './pages/ViolationsPage';
import PkmRegistry from './pages/PkmRegistry';
import PkmCreate, { type PkmDraft } from './pages/PkmCreate';
import PkmSuccess from './pages/PkmSuccess';
import PkmCard from './pages/PkmCard';
import ViolationsRegistry from './pages/ViolationsRegistry';
import ViolationCard from './pages/ViolationCard';
import AnalyticsPage from './pages/AnalyticsPage';
import {
  analyticsBrowserPath,
  appHomePath,
  parseAnalyticsPath,
  type AnalyticsPageId,
} from './analytics/routing.ts';
import { DEFAULT_ANALYTICS_FILTERS, type AnalyticsFilters } from './analytics/filters.ts';
import {
  SEED_PKMS, SEED_REGISTRY_VIOLATIONS,
  type Pkm, type PkmStatus, type HistoryEntry,
  type RegistryViolation, type RegistryViolationStatus, type RvHistoryEntry,
} from './data';

type Route =
  | { name: 'hub' }
  | { name: 'registry' }
  | { name: 'contract' }
  | { name: 'flagman' }
  | { name: 'violations' }
  | { name: 'pkm' }
  | { name: 'pkm-create'; violationIds: number[]; registryViolationIds: string[]; back: Route }
  | { name: 'pkm-success'; pkmId: string; back: Route }
  | { name: 'pkm-card'; pkmId: string; back: Route }
  | { name: 'violations-registry' }
  | { name: 'violation-card'; rvId: string; back: Route }
  | { name: 'analytics'; page: AnalyticsPageId };

const routeFromLocation = (): Route => {
  const analyticsPage = parseAnalyticsPath(window.location.pathname);
  return analyticsPage ? { name: 'analytics', page: analyticsPage } : { name: 'hub' };
};

const todayStr = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
};

const App = () => {
  const [route, setRoute] = useState<Route>(routeFromLocation);
  const [pkms, setPkms] = useState<Pkm[]>(SEED_PKMS);
  const [rviolations, setRviolations] = useState<RegistryViolation[]>(SEED_REGISTRY_VIOLATIONS);
  const [analyticsFilters, setAnalyticsFilters] = useState<AnalyticsFilters>(DEFAULT_ANALYTICS_FILTERS);
  const go = (nextRoute: Route) => {
    if (nextRoute.name === 'analytics') {
      window.history.pushState(null, '', analyticsBrowserPath(nextRoute.page));
    } else if (nextRoute.name === 'hub' && route.name === 'analytics') {
      window.history.pushState(null, '', appHomePath());
    }
    setRoute(nextRoute);
  };

  useEffect(() => {
    const handlePopState = () => setRoute(routeFromLocation());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const findPkm = (id: string) => pkms.find(p => p.id === id);
  const findRv = (id: string) => rviolations.find(v => v.id === id);

  // pkm id -> num (для подписи бейджа в реестре нарушений)
  const pkmNumById: Record<string, string> = {};
  for (const p of pkms) pkmNumById[p.id] = p.num;

  const createPkm = (draft: PkmDraft): string => {
    const seq = pkms.length + 1;
    const num = `64900/${seq}`;
    const id = 'pkm-' + Date.now();
    const now = todayStr();
    const pkm: Pkm = {
      id, num,
      description: draft.description,
      contractNo: draft.contractNo,
      code: 'WS-NEW',
      contractSubject: draft.contractSubject || 'Договор',
      formedAt: draft.formedAt || now,
      plannedEnd: draft.plannedEnd,
      linkedViolations: draft.linkedViolations,
      linkedRegistryViolations: draft.linkedRegistryViolations,
      claimsCount: draft.claimsCount,
      pkmFile: draft.pkmFile,
      requestLetterFile: draft.requestLetterFile,
      letterDate: draft.letterDate,
      protocolNo: draft.protocolNo,
      protocolDate: draft.protocolDate,
      cost: draft.cost,
      attachments: draft.attachments,
      comment: draft.comment,
      responsible: draft.responsible,
      customer: draft.customer || 'ООО «ГПН-ЦР»',
      contractor: draft.contractor || 'ООО «Недра»',
      status: 'Новый',
      history: [{ date: now, from: null, to: 'Новый', responsible: draft.responsible, comment: 'Мероприятие создано' }],
    };
    setPkms(prev => [pkm, ...prev]);
    if (draft.linkedRegistryViolations.length > 0) {
      setRviolations(prev => prev.map(v =>
        draft.linkedRegistryViolations.includes(v.id) ? { ...v, linkedPkmId: id } : v,
      ));
    }
    return id;
  };

  const changeStatus = (
    pkmId: string, to: PkmStatus, responsible: string, comment: string, file?: string,
  ) => {
    setPkms(prev => prev.map(p => {
      if (p.id !== pkmId) return p;
      const entry: HistoryEntry = { date: todayStr(), from: p.status, to, responsible, comment, file };
      return { ...p, status: to, responsible, history: [...p.history, entry] };
    }));
  };

  const changeRvStatus = (
    rvId: string, to: RegistryViolationStatus, responsible: string, comment: string, file?: string,
  ) => {
    setRviolations(prev => prev.map(v => {
      if (v.id !== rvId) return v;
      const entry: RvHistoryEntry = { date: todayStr(), from: v.status, to, responsible, comment, file };
      return { ...v, status: to, responsible, history: [...v.history, entry] };
    }));
  };

  // нарушение из старого «флагман» списка -> pkm.id
  const violationPkm: Record<number, string> = {};
  for (const p of pkms) for (const vid of p.linkedViolations) if (!violationPkm[vid]) violationPkm[vid] = p.id;

  return (
    <Theme preset={presetGpnDefault}>
      <Layout>
        {route.name === 'hub' && (
          <ContractMgmtHub
            onOpenContracts={() => go({ name: 'registry' })}
            onOpenFlagman={() => go({ name: 'flagman' })}
            onOpenPkm={() => go({ name: 'pkm' })}
            onOpenViolations={() => go({ name: 'violations-registry' })}
            onOpenAnalytics={() => go({ name: 'analytics', page: 'overview' })}
          />
        )}

        {route.name === 'analytics' && (
          <AnalyticsPage
            page={route.page}
            onNavigate={page => go({ name: 'analytics', page })}
            onBackToHub={() => go({ name: 'hub' })}
            filters={analyticsFilters}
            onFiltersChange={setAnalyticsFilters}
            onOpenContract={() => go({ name: 'contract' })}
          />
        )}

        {route.name === 'registry' && (
          <ContractsPage onOpenContract={() => go({ name: 'contract' })} onBackToHub={() => go({ name: 'hub' })} />
        )}

        {route.name === 'contract' && (
          <ContractCard onBackToHub={() => go({ name: 'hub' })} onBackToRegistry={() => go({ name: 'registry' })} />
        )}

        {route.name === 'flagman' && (
          <FlagmanRating onBackToHub={() => go({ name: 'hub' })} onOpenViolations={() => go({ name: 'violations' })} />
        )}

        {route.name === 'violations' && (
          <ViolationsPage
            onBackToHub={() => go({ name: 'hub' })}
            onBackToFlagman={() => go({ name: 'flagman' })}
            violationPkm={violationPkm}
            onCreatePkm={ids => go({ name: 'pkm-create', violationIds: ids, registryViolationIds: [], back: { name: 'violations' } })}
            onOpenPkm={id => go({ name: 'pkm-card', pkmId: id, back: { name: 'violations' } })}
          />
        )}

        {route.name === 'pkm' && (
          <PkmRegistry
            pkms={pkms}
            onBackToHub={() => go({ name: 'hub' })}
            onCreate={() => go({ name: 'pkm-create', violationIds: [], registryViolationIds: [], back: { name: 'pkm' } })}
            onOpenPkm={id => go({ name: 'pkm-card', pkmId: id, back: { name: 'pkm' } })}
          />
        )}

        {route.name === 'pkm-create' && (
          <PkmCreate
            preselectedViolations={route.violationIds}
            preselectedRegistryViolations={route.registryViolationIds}
            allRegistryViolations={rviolations}
            onBackToHub={() => go({ name: 'hub' })}
            onCancel={() => go(route.back)}
            onSubmit={draft => {
              const id = createPkm(draft);
              go({ name: 'pkm-success', pkmId: id, back: route.back });
            }}
          />
        )}

        {route.name === 'pkm-success' && (
          <PkmSuccess
            pkm={findPkm(route.pkmId)!}
            onOpenCard={() => go({ name: 'pkm-card', pkmId: route.pkmId, back: route.back })}
            onBack={() => go(route.back)}
          />
        )}

        {route.name === 'pkm-card' && findPkm(route.pkmId) && (
          <PkmCard
            pkm={findPkm(route.pkmId)!}
            onBack={() => go(route.back)}
            onBackToHub={() => go({ name: 'hub' })}
            onChangeStatus={(to, resp, comment, file) => changeStatus(route.pkmId, to, resp, comment, file)}
          />
        )}

        {route.name === 'violations-registry' && (
          <ViolationsRegistry
            items={rviolations}
            pkmNumByid={pkmNumById}
            onBackToHub={() => go({ name: 'hub' })}
            onOpenCard={id => go({ name: 'violation-card', rvId: id, back: { name: 'violations-registry' } })}
            onOpenPkm={pkmId => go({ name: 'pkm-card', pkmId, back: { name: 'violations-registry' } })}
            onCreatePkm={rvIds => go({ name: 'pkm-create', violationIds: [], registryViolationIds: rvIds, back: { name: 'violations-registry' } })}
          />
        )}

        {route.name === 'violation-card' && findRv(route.rvId) && (
          <ViolationCard
            v={findRv(route.rvId)!}
            pkmNum={findRv(route.rvId)!.linkedPkmId ? pkmNumById[findRv(route.rvId)!.linkedPkmId!] : undefined}
            onBack={() => go(route.back)}
            onBackToHub={() => go({ name: 'hub' })}
            onOpenPkm={pkmId => go({ name: 'pkm-card', pkmId, back: { name: 'violation-card', rvId: route.rvId, back: route.back } })}
            onCreatePkm={() => go({ name: 'pkm-create', violationIds: [], registryViolationIds: [route.rvId], back: { name: 'violation-card', rvId: route.rvId, back: route.back } })}
            onChangeStatus={(to, resp, comment, file) => changeRvStatus(route.rvId, to, resp, comment, file)}
          />
        )}
      </Layout>
    </Theme>
  );
};

export default App;
