import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import type { FC } from 'react';
import { Avatar, Menu } from 'antd';
import styles from './index.module.less';
import { useThemeTokenSelector } from '@/hooks/useThemeTokenSelector';
import { HEADER_MENU_ROUTES } from '@/router/routes';
import type { MenuClickEventHandler } from 'rc-menu/lib/interface';

import logo from './favicon.png';

export const Header: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const headerStyle = useThemeTokenSelector(({ boxShadow }) => ({
    boxShadow,
  }));

  const menuItems = useMemo(
    () =>
      HEADER_MENU_ROUTES.map(({ path, headerMenuLabel, icon }) => {
        return {
          key: path!,
          label: headerMenuLabel,
          icon,
        };
      }),
    [],
  );

  const selectedKey = useMemo(() => `${pathname.split('/')?.[1] || ''}`, [pathname]);

  const onMenuClick: MenuClickEventHandler = useCallback(
    ({ key }) => {
      navigate(key);
    },
    [navigate],
  );

  return (
    <header className={styles.header} style={headerStyle}>
      <div className={styles.mainContent}>
        <Link to="/" className={styles.logo}>
          <Avatar shape="square" src={logo} size={46} alt="home" />
        </Link>

        <Menu
          className={styles.menu}
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          onClick={onMenuClick}
          items={menuItems}
        />
      </div>
    </header>
  );
};
