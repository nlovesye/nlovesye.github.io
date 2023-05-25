import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Player as PlayerComponent } from '@/components/Player';
import { Button, message, Tooltip, Upload } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { getObjectURL, ls } from '@/utils';
import type { RcFile } from 'antd/es/upload';
import styles from './index.module.less';
import classNames from 'classnames';
import { initIndexDBStore } from './indexDBStore';
import type { LocalStorageName } from '@/models';
import type { OnProgressProps } from 'react-player/base';
import type ReactPlayer from 'react-player';

const accept = '.mp4, .mkv';

const LOAD_CACHE_TIME = 1800;

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

interface PlayerRecord extends Record<'name', string> {
  originFile: RcFile;
  url?: string;
}

const indexDBStore = initIndexDBStore<PlayerRecord>('video_player');

export default function VideoPlayer() {
  const [, setLoading] = useState<boolean>(true);
  const [list, setList] = useState<PlayerRecord[]>([]);
  const [current, setCurrent] = useState<PlayerRecord>();

  const playerRef = useRef<ReactPlayer>();
  const timer = useRef<number>();

  const customRequest: UploadProps['customRequest'] = useMemo(
    () => async (d: any) => {
      const { onSuccess, file } = d;
      const hideLoading = message.loading({
        key: 'load',
        content: '视频加载中，请稍候',
      });

      const { name } = file as RcFile;

      const newRecord = { name, originFile: file };
      setList((prevList) => prevList.concat([newRecord]));
      await indexDBStore.putData(newRecord, name);

      hideLoading();

      onSuccess?.(file);
    },
    [],
  );

  const onStop = useCallback(() => {
    setCurrent(undefined);
  }, []);

  const onItemClick = useCallback((d: PlayerRecord) => {
    setCurrent((c) => {
      const newCurrent =
        c?.name === d.name
          ? c
          : !d.url
          ? {
              ...d,
              url: getObjectURL(d.originFile),
            }
          : d;
      ls.set('prev_video_name', newCurrent.name);
      return newCurrent;
    });
  }, []);

  const clear = useCallback(() => {
    setList([]);
    indexDBStore.clearData();
    ls.remove('prev_video_name');
  }, []);

  const onProgress = useCallback((state: OnProgressProps) => {
    ls.set('prev_video_progress_info', state, true);
  }, []);

  const renderListItem = useCallback(
    (data: PlayerRecord[]) => {
      return (
        <ul className={styles.list}>
          {data.map((item) => {
            const { name } = item;
            return (
              <li
                key={name}
                className={classNames(styles.listItem, {
                  [styles.active]: name === current?.name,
                })}
                onClick={() => {
                  ls.remove('prev_video_progress_info');
                  onItemClick(item);
                }}
              >
                <Tooltip placement="bottomLeft" title={name}>
                  {name}
                </Tooltip>
              </li>
            );
          })}
        </ul>
      );
    },
    [onItemClick, current?.name],
  );

  // 初始化播放列表和上一次播放
  useEffect(() => {
    indexDBStore
      .getData()
      .then((data) => {
        setLoading(false);
        setList(data);
        const prevName = ls.get<LocalStorageName>('prev_video_name');
        const target = data.find((d) => d.name === prevName);
        if (target) {
          onItemClick(target);

          const prevProgressInfo = ls.get<OnProgressProps>('prev_video_progress_info', true);
          const player = playerRef.current;

          const hideLoading = message.loading({
            key: 'load',
            content: '加载播放记录',
          });
          if (prevProgressInfo && player) {
            if (timer.current) {
              clearTimeout(timer.current);
            }
            timer.current = setTimeout(() => {
              player.seekTo(prevProgressInfo.played);
              hideLoading();
            }, LOAD_CACHE_TIME);
          } else {
            hideLoading();
          }
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [onItemClick]);

  return (
    <section className={styles.videoPlayer}>
      <div className={styles.left}>
        <h1 className={styles.title}>
          <Tooltip title={current?.name || '当前未播放'}>{current?.name || '当前未播放'}</Tooltip>
        </h1>
        <div className={styles.playerBox}>
          {current?.url && (
            <div className={styles.headerbar}>
              <Button type="primary" className={styles.open} onClick={onStop}>
                停止播放
              </Button>
            </div>
          )}

          <PlayerComponent
            playerClassName={styles.player}
            url={current?.url}
            onProgress={onProgress}
            ref={playerRef}
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
          播放列表
          <Button size="small" onClick={clear}>
            清空
          </Button>
        </div>

        {renderListItem(list)}
      </div>
    </section>
  );
}
