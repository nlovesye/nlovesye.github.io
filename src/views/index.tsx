import { HashRouter } from 'react-router-dom';
import { Suspense } from 'react';
import type { FC } from 'react';
import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { Router } from '@/router';
import { Header } from '@/components/Header';
import { useAppSelector } from '@/store';
import { RouteLoading } from '@/components/RouteLoading';
import styles from './index.module.less';

const MainView: FC = () => {
  const { theme } = useAppSelector((state) => state.global);

  return (
    <AntdApp className={styles.antApp}>
      <ConfigProvider theme={theme} locale={zhCN}>
        <HashRouter>
          <Header />

          <Suspense fallback={<RouteLoading />}>
            <Router />
          </Suspense>
        </HashRouter>
      </ConfigProvider>
    </AntdApp>
  );
};

export default MainView;
