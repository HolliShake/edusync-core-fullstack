import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import DashboardLayout from './layouts/dashboard'
import DefaultLayout from './layouts/default'
import ROUTES from './routes'
import type { Route } from './types/route'


const router = createBrowserRouter(ROUTES.map((route: Route) => ({
  path: route.path,
  key: route.key,
  index: route.index === true,
  element: (route.layout === 'dashboard'
    ? (
      <DashboardLayout>
        {route.component}
      </DashboardLayout>
    )
    : (
      <DefaultLayout>
        {route.component}
      </DefaultLayout>
    )),
})))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
