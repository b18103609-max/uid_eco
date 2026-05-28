import { useState } from 'react';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import Layout from './Layout';
import ContractMgmtHub from './pages/ContractMgmtHub';
import ContractsPage from './pages/ContractsPage';
import ContractCard from './pages/ContractCard';
import FlagmanRating from './pages/FlagmanRating';

type Page = 'hub' | 'registry' | 'contract' | 'flagman';

const App = () => {
  const [page, setPage] = useState<Page>('hub');

  return (
    <Theme preset={presetGpnDefault}>
      <Layout>
        {page === 'hub' && (
          <ContractMgmtHub
            onOpenContracts={() => setPage('registry')}
            onOpenFlagman={() => setPage('flagman')}
          />
        )}
        {page === 'registry' && (
          <ContractsPage
            onOpenContract={() => setPage('contract')}
            onBackToHub={() => setPage('hub')}
          />
        )}
        {page === 'contract' && (
          <ContractCard
            onBackToHub={() => setPage('hub')}
            onBackToRegistry={() => setPage('registry')}
          />
        )}
        {page === 'flagman' && (
          <FlagmanRating onBackToHub={() => setPage('hub')} />
        )}
      </Layout>
    </Theme>
  );
};

export default App;
