import styles from './index.module.less';
import { LoadingSpin } from '@/components/LoadingSpin';
import { SyncOutlined } from '@ant-design/icons';
import type { FC } from 'react';

export const RouteLoading: FC = () => {
  return (
    <LoadingSpin
      tip="加载中..."
      size='large'
      className={styles.routeLoading}
      indicator={<SyncOutlined className={styles.indicatorIcon} spin />}
    />
  );
};
