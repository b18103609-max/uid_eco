import { useState } from 'react';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import Layout from './Layout';
import ContractMgmtHub from './pages/ContractMgmtHub';
import ContractsPage from './pages/ContractsPage';
import ContractCard from './pages/ContractCard';

type Page = 'hub' | 'registry' | 'contract';

const App = () => {
  const [page, setPage] = useState<Page>('hub');

  return (
    <Theme preset={presetGpnDefault}>
      <Layout>
        {page === 'hub' && (
          <ContractMgmtHub onOpenContracts={() => setPage('registry')} />
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
      </Layout>
    </Theme>
  );
};

export default App;
