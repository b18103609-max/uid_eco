import { useState } from 'react';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import Layout from './Layout';
import ContractsPage from './pages/ContractsPage';
import ContractCard from './pages/ContractCard';

type Page = 'registry' | 'contract';

const App = () => {
  const [page, setPage] = useState<Page>('registry');

  return (
    <Theme preset={presetGpnDefault}>
      <Layout>
        {page === 'registry' ? (
          <ContractsPage onOpenContract={() => setPage('contract')} />
        ) : (
          <ContractCard onBack={() => setPage('registry')} />
        )}
      </Layout>
    </Theme>
  );
};

export default App;
