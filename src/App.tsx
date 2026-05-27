import { useState } from 'react';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import Layout from './Layout';
import ContractsRegistry from './pages/ContractsRegistry';
import ContractCard from './pages/ContractCard';

type Page = 'registry' | 'contract';

const App = () => {
  const [page, setPage] = useState<Page>('registry');

  return (
    <Theme preset={presetGpnDefault}>
      <Layout>
        {page === 'registry' ? (
          <ContractsRegistry onOpenContract={() => setPage('contract')} />
        ) : (
          <ContractCard onBack={() => setPage('registry')} />
        )}
      </Layout>
    </Theme>
  );
};

export default App;
