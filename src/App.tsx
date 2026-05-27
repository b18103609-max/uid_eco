import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import type { IconComponent } from '@consta/icons/Icon';
import { IconHome } from '@consta/icons/IconHome';
import { IconConnection } from '@consta/icons/IconConnection';
import { IconList } from '@consta/icons/IconList';
import { IconEdit } from '@consta/icons/IconEdit';
import { IconBag } from '@consta/icons/IconBag';
import { IconPhone } from '@consta/icons/IconPhone';
import { IconShare } from '@consta/icons/IconShare';
import { IconBookmarkStroked } from '@consta/icons/IconBookmarkStroked';
import { IconUser } from '@consta/icons/IconUser';
import { IconRing } from '@consta/icons/IconRing';
import { IconInfoCircle } from '@consta/icons/IconInfoCircle';
import { IconQuestion } from '@consta/icons/IconQuestion';
import { IconInfo } from '@consta/icons/IconInfo';
import { IconArrowUp } from '@consta/icons/IconArrowUp';

type MenuItem =
  | { divider: true }
  | { label: string; icon: IconComponent; active?: boolean };

const menu: MenuItem[] = [
  { label: 'Главная', icon: IconHome },
  { label: 'Сервисы', icon: IconConnection },
  { label: 'Заявки', icon: IconList },
  { label: 'Документооборот', icon: IconEdit },
  { label: 'Маркетплейс', icon: IconBag },
  { label: 'Вызовы', icon: IconPhone },
  { label: 'УИД', icon: IconShare, active: true },
  { divider: true },
  { label: 'Мои подписки', icon: IconBookmarkStroked },
  { label: 'Мои роли', icon: IconUser },
  { label: 'Уведомления', icon: IconRing },
  { divider: true },
  { label: 'Информация', icon: IconInfoCircle },
  { label: 'Помощь', icon: IconQuestion },
];

const tabs = [
  'Информация',
  'Акты и платежи',
  'Дополнения',
  'Документы',
  'Команда',
  'ОЭДК',
  'Нарушения',
  'Допретензионна',
];

const generalData: { label: string; value: string; hint?: string }[] = [
  { label: 'Id карточки в sap', value: 'КЛ-2024-0456' },
  { label: 'Дата окончания действия по ДС', value: '31.03.2026' },
  { label: 'Автопролонгация', value: 'Да' },
  { label: 'Дата начала выполнения работ/услуг', value: '01.04.2024' },
  { label: 'Дата окончания выполнения работ/услуг', value: '30.03.2026' },
  { label: 'Услуга по КТ-777', value: 'Поставка оборудования для бурения', hint: 'WS91811' },
  { label: 'Тип договора', value: 'Типовой' },
  { label: 'Тип отношений', value: 'Договор закупки' },
  { label: 'ПФМ', value: 'Управление по внутрискважинным работам', hint: '123456' },
  { label: 'Реестровый номер процедуры', value: '011 0111 0111' },
  { label: 'Нормативный срок ответа на требования', value: '10 рабочих дней' },
  { label: 'Номер договора контрагента', value: 'КЛ-2024-0456' },
];

const App = () => (
  <Theme preset={presetGpnDefault}>
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar__logo">
          <div className="sidebar__logo-mark" />
          <div className="sidebar__logo-text">
            Экосистема
            <br />
            Блока разведки и добычи
          </div>
        </div>
        <nav className="sidebar__menu">
          {menu.map((item, i) =>
            'divider' in item ? (
              <div key={`d${i}`} className="menu-divider" />
            ) : (
              <button
                key={item.label}
                className={`menu-item${item.active ? ' menu-item--active' : ''}`}
              >
                <item.icon size="s" />
                {item.label}
              </button>
            ),
          )}
        </nav>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar__support">
            Помощь и поддержка
            <br />
            <a href="mailto:help.ecosystem@gazprom-neft.ru">help.ecosystem@gazprom-neft.ru</a>
          </div>
          <div className="topbar__icons">
            <button className="icon-btn">
              <IconQuestion size="s" />
            </button>
            <button className="icon-btn">
              <IconRing size="s" />
            </button>
            <div className="avatar">МВ</div>
          </div>
        </header>

        <div className="content">
          <section className="card">
            <div className="breadcrumbs">
              Главная / Управление исполнением договора / Реестр договоров / <span>Д-ННГ 784957646</span>
            </div>
            <div className="contract-meta">
              Договор № Д-ННГ 784957646 от 22.03.2023
            </div>
            <h1 className="contract-title">
              Выполнение работ по нанесению покрывного слоя трубопроводов по объекту: «ЦПС
              Ярудейского месторождения»
            </h1>
            <div className="contract-parties">
              <div>
                Заказчик: <a href="#">ООО «ГПН-ЦР»</a>&nbsp;&nbsp;&nbsp;Подрядчик:{' '}
                <a href="#">ООО «Недра»</a>
              </div>
              <div>Начало: 24.01.2025&nbsp;&nbsp;&nbsp;Окончание: 24.01.2026</div>
            </div>
            <div className="tabs">
              {tabs.map((t, i) => (
                <div key={t} className={`tab${i === 0 ? ' tab--active' : ''}`}>
                  {t}
                </div>
              ))}
            </div>
          </section>

          <div className="stats">
            <div className="card stat-card">
              <div className="stat-card__head">
                Критичность
                <IconInfo size="xs" view="ghost" />
              </div>
              <div className="stat-card__sub">Рейтинг критичности договора</div>
              <span className="badge badge--critical">КРИТИЧНЫЙ</span>
            </div>

            <div className="card stat-card">
              <div className="stat-card__head">
                Риск
                <IconInfo size="xs" view="ghost" />
              </div>
              <div className="stat-card__sub">Уровень риска по ПЭБ, ОТ и ГЗ</div>
              <span className="badge badge--medium">СРЕДНИЙ</span>
            </div>

            <div className="card stat-card">
              <div className="stat-card__head">
                Стоимость без НДС
                <IconArrowUp size="xs" view="ghost" />
              </div>
              <div className="stat-card__value">10 000 000,00 руб.</div>
              <div className="progress">
                <div className="progress__bar" style={{ width: '60%' }} />
              </div>
              <div className="progress__legend">
                <span>Освоено</span>
                <span style={{ color: '#002033' }}>6 000 000,00 руб.</span>
              </div>
            </div>
          </div>

          <section className="card">
            <div className="section-head">
              ОБЩИЕ ДАННЫЕ
              <IconEdit size="xs" view="ghost" />
            </div>
            {generalData.map((row) => (
              <div key={row.label} className="data-row">
                <div className="data-row__label">{row.label}</div>
                <div className="data-row__value">
                  {row.hint && <span className="data-row__hint">{row.hint}</span>}
                  {row.value}
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  </Theme>
);

export default App;
