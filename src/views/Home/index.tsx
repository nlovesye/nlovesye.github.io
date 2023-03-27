import { useThemeTokenSelector } from '@/hooks/useThemeTokenSelector';
import { QRCode } from 'antd';

import styles from './index.module.less';

export default function Home() {
  const pStyle = useThemeTokenSelector(({ colorPrimary }) => ({ color: colorPrimary }));

  return (
    <section className={styles.home}>
      <div style={pStyle}>神器？</div>
      <QRCode
        className={styles.qrcode}
        value="https://nlovesye.github.io"
        errorLevel="H"
        icon="/favicon.ico"
      />
    </section>
  );
}
