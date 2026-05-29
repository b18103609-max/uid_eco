import { useState } from 'react';
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
import { SEED_PKMS, type Pkm, type PkmStatus, type HistoryEntry } from './data';

type Route =
  | { name: 'hub' }
  | { name: 'registry' }
  | { name: 'contract' }
  | { name: 'flagman' }
  | { name: 'violations' }
  | { name: 'pkm' }
  | { name: 'pkm-create'; violationIds: number[]; origin: 'violations' | 'pkm' }
  | { name: 'pkm-success'; pkmId: string; origin: 'violations' | 'pkm' }
  | { name: 'pkm-card'; pkmId: string; back: Route };

const todayStr = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
};

const App = () => {
  const [route, setRoute] = useState<Route>({ name: 'hub' });
  const [pkms, setPkms] = useState<Pkm[]>(SEED_PKMS);
  const go = (r: Route) => setRoute(r);

  const findPkm = (id: string) => pkms.find(p => p.id === id);

  const createPkm = (draft: PkmDraft): string => {
    const seq = pkms.length + 1;
    const num = `64900/${seq}`;
    const id = 'pkm-' + Date.now();
    const now = todayStr();
    const pkm: Pkm = {
      id,
      num,
      description: draft.description,
      contractNo: draft.contractNo,
      code: 'WS-NEW',
      contractSubject: draft.contractSubject || 'Договор',
      formedAt: draft.formedAt || now,
      plannedEnd: draft.plannedEnd,
      linkedViolations: draft.linkedViolations,
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
    return id;
  };

  const changeStatus = (
    pkmId: string,
    to: PkmStatus,
    responsible: string,
    comment: string,
    file?: string,
  ) => {
    setPkms(prev =>
      prev.map(p => {
        if (p.id !== pkmId) return p;
        const entry: HistoryEntry = { date: todayStr(), from: p.status, to, responsible, comment, file };
        return { ...p, status: to, responsible, history: [...p.history, entry] };
      }),
    );
  };

  // violation -> pkm id map (derived from pkms)
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
          />
        )}

        {route.name === 'registry' && (
          <ContractsPage
            onOpenContract={() => go({ name: 'contract' })}
            onBackToHub={() => go({ name: 'hub' })}
          />
        )}

        {route.name === 'contract' && (
          <ContractCard
            onBackToHub={() => go({ name: 'hub' })}
            onBackToRegistry={() => go({ name: 'registry' })}
          />
        )}

        {route.name === 'flagman' && (
          <FlagmanRating
            onBackToHub={() => go({ name: 'hub' })}
            onOpenViolations={() => go({ name: 'violations' })}
          />
        )}

        {route.name === 'violations' && (
          <ViolationsPage
            onBackToHub={() => go({ name: 'hub' })}
            onBackToFlagman={() => go({ name: 'flagman' })}
            violationPkm={violationPkm}
            onCreatePkm={ids => go({ name: 'pkm-create', violationIds: ids, origin: 'violations' })}
            onOpenPkm={id => go({ name: 'pkm-card', pkmId: id, back: { name: 'violations' } })}
          />
        )}

        {route.name === 'pkm' && (
          <PkmRegistry
            pkms={pkms}
            onBackToHub={() => go({ name: 'hub' })}
            onCreate={() => go({ name: 'pkm-create', violationIds: [], origin: 'pkm' })}
            onOpenPkm={id => go({ name: 'pkm-card', pkmId: id, back: { name: 'pkm' } })}
          />
        )}

        {route.name === 'pkm-create' && (
          <PkmCreate
            preselectedViolations={route.violationIds}
            onBackToHub={() => go({ name: 'hub' })}
            onCancel={() => go(route.origin === 'violations' ? { name: 'violations' } : { name: 'pkm' })}
            onSubmit={draft => {
              const id = createPkm(draft);
              go({ name: 'pkm-success', pkmId: id, origin: route.origin });
            }}
          />
        )}

        {route.name === 'pkm-success' && (
          <PkmSuccess
            pkm={findPkm(route.pkmId)!}
            onOpenCard={() => go({ name: 'pkm-card', pkmId: route.pkmId, back: { name: 'pkm' } })}
            onBack={() => go(route.origin === 'violations' ? { name: 'violations' } : { name: 'pkm' })}
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
      </Layout>
    </Theme>
  );
};

export default App;
