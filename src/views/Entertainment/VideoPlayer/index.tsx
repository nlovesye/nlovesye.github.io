import { useCallback, useMemo, useState } from 'react';
import { Player as PlayerComponent } from '@/components/Player';
import { Button, message, Upload } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { getObjectURL } from '@/utils';
import type { RcFile } from 'antd/es/upload';
import styles from './index.module.less';

const accept = '.mp4, .mkv';

const uploadProps: UploadProps = {
  className: styles.upload,
  name: 'file',
  accept,
  maxCount: 1,
  method: 'post',
  listType: 'picture-card',
  showUploadList: false,
};

export default function VideoPlayer() {
  const [url, setUrl] = useState<string>();
  const [currentFileName, setCurrentFileName] = useState<string>('');

  const customRequest: UploadProps['customRequest'] = useMemo(
    () =>
      async ({ onSuccess, file }) => {
        const hideLoading = message.loading({
          key: 'load',
          content: '视频加载中，请稍候',
        });

        const objURL = getObjectURL(file as RcFile);

        const { name } = file as RcFile;

        setUrl(objURL);
        setCurrentFileName(name);

        hideLoading();

        onSuccess?.(file);
      },
    [],
  );

  const onChange = useCallback(() => {
    setUrl(undefined);
    setCurrentFileName('');
  }, []);

  return (
    <section className={styles.videoPlayer}>
      <div className={styles.playerBox}>
        {url && (
          <div className={styles.headerbar}>
            <Button type="primary" className={styles.open} onClick={onChange}>
              看看别的
            </Button>
            <span>正在播放：{currentFileName}</span>
          </div>
        )}

        <PlayerComponent
          playerClassName={styles.player}
          url={url}
          emptyCover={
            <Upload.Dragger {...uploadProps} customRequest={customRequest}>
              <div className={styles.uploadDropper}>
                <InboxOutlined className={styles.uploadIcon} />
                点击或拖拽视频到这里开始播放，当前支持的格式：
                {accept}
              </div>
            </Upload.Dragger>
          }
        />
      </div>
    </section>
  );
}
