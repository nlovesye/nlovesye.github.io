import { useCallback, useMemo, useState } from 'react';
import { Player as PlayerComponent } from '@/components/Player';
import { Button, List, message, Upload } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { getObjectURL } from '@/utils';
import type { RcFile } from 'antd/es/upload';
import styles from './index.module.less';
import classNames from 'classnames';

const accept = '.mp4, .mkv';

const uploadProps: UploadProps = {
  className: styles.upload,
  name: 'file',
  accept,
  maxCount: 100,
  method: 'post',
  listType: 'picture-card',
  multiple: true,
  showUploadList: false,
};

type PlayerRecord = Record<'name' | 'url', string>;

export default function VideoPlayer() {
  const [list, setList] = useState<PlayerRecord[]>([]);
  const [current, setCurrent] = useState<PlayerRecord>();

  const customRequest: UploadProps['customRequest'] = useMemo(
    () => async (d: any) => {
      const { onSuccess, file } = d;
      const hideLoading = message.loading({
        key: 'load',
        content: '视频加载中，请稍候',
      });

      const objURL = getObjectURL(file as RcFile);

      const { name } = file as RcFile;

      const newRecord = { name, url: objURL };
      setList((prevList) => prevList.concat([newRecord]));

      hideLoading();

      onSuccess?.(file);
    },
    [],
  );

  const onChange = useCallback(() => {
    setCurrent(undefined);
  }, []);

  const onItemClick = useCallback((d: PlayerRecord) => {
    setCurrent(d);
  }, []);

  return (
    <section className={styles.videoPlayer}>
      <div className={styles.left}>
        <h1 className={styles.title}>{current?.name || '当前未播放'}</h1>
        <div className={styles.playerBox}>
          {current?.url && (
            <div className={styles.headerbar}>
              <Button type="primary" className={styles.open} onClick={onChange}>
                看看别的
              </Button>
            </div>
          )}

          <PlayerComponent
            playerClassName={styles.player}
            url={current?.url}
            emptyCover={
              <Upload.Dragger {...uploadProps} customRequest={customRequest}>
                <div className={styles.uploadDropper}>
                  <InboxOutlined className={styles.uploadIcon} />
                  点击或拖拽视频到这里以加载播放列表，当前支持的格式：
                  {accept}
                </div>
              </Upload.Dragger>
            }
          />
        </div>
      </div>

      <div className={styles.playerList}>
        <div className={styles.header}>
          <Button size="small" onClick={() => setList([])}>
            清空
          </Button>
        </div>
        <List<PlayerRecord>
          className={styles.list}
          dataSource={list}
          renderItem={(item) => {
            const { name } = item;
            return (
              <List.Item
                className={classNames(styles.listItem, {
                  [styles.active]: name === current?.name,
                })}
                onClick={() => onItemClick(item)}
              >
                {name}
              </List.Item>
            );
          }}
        />
      </div>
    </section>
  );
}
