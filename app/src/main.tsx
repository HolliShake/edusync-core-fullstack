import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router';
import './index.css';
import DashboardLayout from './layouts/dashboard';
import DefaultLayout from './layouts/default';
import ROUTES from './routes';
import type { Route } from './types/route';

const router = createBrowserRouter(
  ROUTES.flatMap((route: Route) => {
    const items: RouteObject[] = [];

    let stack: Route[] = [route];

    while (stack.length > 0) {
      const current = stack.pop()!;
      items.push({
        path: current.path,
        key: current.key,
        index: current.index === true,
        element:
          current.layout === 'dashboard' ? (
            <DashboardLayout>{current.component}</DashboardLayout>
          ) : (
            <DefaultLayout>{current.component}</DefaultLayout>
          ),
      } as any);
      stack.push(...(current.children ?? []));
    }

    return items;
  })
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
