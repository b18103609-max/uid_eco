import type { ReactNode } from 'react';
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

const Layout = ({ children }: { children: ReactNode }) => (
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

      <div className="content">{children}</div>
    </div>
  </div>
);

export default Layout;
