import { getChildrenRoutes } from '@/router/routes';
import { Menu } from 'antd';
import { useMemo, useCallback, Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styles from './index.module.less';
import type { MenuClickEventHandler } from 'rc-menu/lib/interface';
import classNames from 'classnames';
import { useThemeTokenSelector } from '@/hooks/useThemeTokenSelector';
import { useAppSelector } from '@/store';
import { RouteLoading } from '@/components/RouteLoading';

const defaultPath = '';

export default function Entertainment() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const collapsed = useAppSelector((state) => state.global.collapsed);

  const siderStyle = useThemeTokenSelector(({ boxShadow }) => ({
    boxShadow,
  }));

  const [parentPath, selectedKey] = useMemo(() => {
    const paths = pathname.split('/');
    return paths.slice(1);
  }, [pathname]);

  const menuItems = useMemo(() => {
    const routes = getChildrenRoutes(parentPath);
    return routes.map(({ path, headerMenuLabel, icon }) => {
      return {
        key: path || defaultPath,
        label: headerMenuLabel,
        icon,
      };
    });
  }, [parentPath]);

  const onMenuClick: MenuClickEventHandler = useCallback(
    ({ key }) => {
      navigate(key);
    },
    [navigate],
  );

  return (
    <div
      className={classNames(styles.entertainment, {
        [styles.collapsed]: collapsed,
      })}
    >
      <aside
        className={classNames(styles.sider, {
          [styles.collapsed]: collapsed,
        })}
        style={siderStyle}
      >
        <Menu
          className={styles.menu}
          theme="dark"
          selectedKeys={[selectedKey || defaultPath]}
          mode="vertical"
          onClick={onMenuClick}
          items={menuItems}
        />
      </aside>

      <div className={styles.content}>
        <Suspense fallback={<RouteLoading />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
