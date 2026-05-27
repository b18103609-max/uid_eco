import { useState } from 'react';
import ContractsRegistry from './ContractsRegistry';
import ContractsIndicators from './ContractsIndicators';

const ContractsPage = ({ onOpenContract }: { onOpenContract: () => void }) => {
  const [tab, setTab] = useState<'registry' | 'indicators'>('registry');

  return (
    <>
      <section className="card">
        <div className="breadcrumbs">
          Главная / Управление исполнением договора / <span>Договоры</span>
        </div>
        <h1 className="page-title">Договоры</h1>
        <div className="tabs">
          <div
            className={`tab${tab === 'registry' ? ' tab--active' : ''}`}
            onClick={() => setTab('registry')}
          >
            Реестр
          </div>
          <div
            className={`tab${tab === 'indicators' ? ' tab--active' : ''}`}
            onClick={() => setTab('indicators')}
          >
            Показатели
          </div>
        </div>
      </section>

      {tab === 'registry' ? (
        <ContractsRegistry onOpenContract={onOpenContract} />
      ) : (
        <ContractsIndicators />
      )}
    </>
  );
};

export default ContractsPage;
