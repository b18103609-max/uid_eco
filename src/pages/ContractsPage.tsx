import ContractsRegistry from './ContractsRegistry';

const ContractsPage = ({ onOpenContract, onBackToHub }: { onOpenContract: () => void; onBackToHub: () => void }) => (
  <>
    <section className="card">
      <div className="breadcrumbs">
        Главная / <span className="link" onClick={onBackToHub}>Управление исполнением договора</span> / <span>Договоры</span>
      </div>
      <h1 className="page-title">Договоры</h1>
    </section>
    <ContractsRegistry onOpenContract={onOpenContract} />
  </>
);

export default ContractsPage;
