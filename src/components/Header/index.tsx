import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import type { FC } from 'react';
import { Avatar, Button, Menu } from 'antd';
import styles from './index.module.less';
import { useThemeTokenSelector } from '@/hooks/useThemeTokenSelector';
import { HEADER_MENU_ROUTES } from '@/router/routes';
import type { MenuClickEventHandler } from 'rc-menu/lib/interface';

import logo from './favicon.png';
import { MenuFoldOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '@/store';
import { updateCollapsed } from '@/store/global';

export const Header: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const collapsed = useAppSelector((state) => state.global.collapsed);

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
    <>
      <header
        className={classNames(styles.header, {
          [styles.collapsed]: collapsed,
        })}
        style={headerStyle}
      >
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
      <Button
        className={classNames(styles.collapseButton, {
          [styles.collapsed]: collapsed,
        })}
        icon={<MenuFoldOutlined />}
        type="default"
        shape="circle"
        onClick={() => dispatch(updateCollapsed())}
      />
    </>
  );
};
