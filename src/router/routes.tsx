import { lazy } from 'react';
import type { ReactNode } from 'react';
import type { RouteObject } from 'react-router-dom';

import NotFound from '@/views/404';
import {
  AppstoreOutlined,
  HomeOutlined,
  Html5Outlined,
  PlayCircleOutlined,
} from '@ant-design/icons';

const Home = lazy(() => import('@/views/Home'));
const Entertainment = lazy(() => import('@/views/Entertainment'));
const EntertainmentMain = lazy(() => import('@/views/Entertainment/Main'));
const VideoPlayer = lazy(() => import('@/views/Entertainment/VideoPlayer'));
const Blog = lazy(() => import('@/views/Blog'));

interface RouteObj {
  headerMenuLabel?: string;
  icon?: ReactNode;
  children?: RouteExtendObject[];
}
type RouteExtendObject = RouteObject & RouteObj;

export const ROUTES: RouteExtendObject[] = [
  {
    path: `/`,
    element: <Home />,
  },
  {
    path: `entertainment`,
    element: <Entertainment />,
    children: [
      {
        path: '',
        element: <EntertainmentMain />,
        headerMenuLabel: '看板',
        icon: <HomeOutlined />,
      },
      {
        path: 'video-player',
        element: <VideoPlayer />,
        headerMenuLabel: '视频播放器',
        icon: <PlayCircleOutlined />,
      },
    ],
    headerMenuLabel: '娱乐板块',
    icon: <AppstoreOutlined />,
  },
  {
    path: `blog`,
    element: <Blog />,
    headerMenuLabel: '博客板块',
    icon: <Html5Outlined />,
    children: [],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export const HEADER_MENU_ROUTES = ROUTES.filter((o) => !!o.path && !!o.headerMenuLabel);

export function getChildrenRoutes(targetPath: string): RouteExtendObject[] {
  const target = ROUTES.find((o) => o.path === targetPath);
  return target?.children ?? [];
}
