import type { ThemeConfig } from 'antd';

export type ThemeType = 'default' | 'dark';

export interface GlobalState {
  loading: boolean;
  themeType: ThemeType;
  theme: ThemeConfig;
  locale: string;
  collapsed: boolean;
}

export type DbStoreName = 'video_player';

export type LocalStorageName = 'prev_video_name';
