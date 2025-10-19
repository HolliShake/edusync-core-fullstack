import LoginPage from '@/pages/auth/login/page';
import type { Route } from '@/types/route';

const AUTH: Route[] = [
  {
    key: 'auth.login',
    title: 'Login',
    path: '/auth/login',
    component: <LoginPage />,
    layout: 'default',
    sidebar: false,
  },
];

export default AUTH;
