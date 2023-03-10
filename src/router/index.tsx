import type { FC } from 'react';
import { useMemo } from 'react';
import { useRoutes } from 'react-router';

import { ROUTES } from './routes';

export const Router: FC = () => {
  const routes = useMemo(() => ROUTES, []);

  const routesElement = useRoutes(
    routes.map((r) => {
      const { element } = r;
      return {
        ...r,
        element,
      };
    }),
  );
  return routesElement;
};
