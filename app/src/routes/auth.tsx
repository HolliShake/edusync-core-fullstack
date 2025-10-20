import LoginPage from '@/pages/auth/login/page';
import SignupPage from '@/pages/auth/signup/page';
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
  {
    key: 'auth.signup',
    title: 'Signup',
    path: '/auth/signup',
    component: <SignupPage />,
    layout: 'default',
    sidebar: false,
  },
];

export default AUTH;
