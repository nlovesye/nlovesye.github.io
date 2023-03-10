import type { FC, ReactNode } from 'react';
import ReactPlayer from 'react-player';
import type { ReactPlayerProps } from 'react-player';
import styles from './index.module.less';
import classNames from 'classnames';

interface Props extends ReactPlayerProps {
  className?: string;
  playerClassName?: string;
  emptyCoverWrapperClassName?: string;
  emptyCover?: ReactNode;
}

export const Player: FC<Props> = ({
  url,
  className,
  playerClassName,
  emptyCoverWrapperClassName,
  emptyCover,
  ...restPlayerProps
}) => {
  return (
    <div className={classNames(styles.playerBox, className)}>
      <ReactPlayer
        className={classNames(styles.player, playerClassName)}
        url={url}
        width="100%"
        height="100%"
        controls
        playing
        {...restPlayerProps}
      />

      {emptyCover && (
        <div
          className={classNames(styles.cover, emptyCoverWrapperClassName, {
            [styles.show]: !url,
          })}
        >
          {emptyCover}
        </div>
      )}
    </div>
  );
};
