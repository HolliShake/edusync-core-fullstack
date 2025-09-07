import AdminBuilding from '@/pages/admin/campuses/building/page';
import AdminCampusDetail from '@/pages/admin/campuses/campus/page';
import AdminCampus from '@/pages/admin/campuses/page';
import AdminDashboard from '@/pages/admin/dashboard';
import AdminDatabases from '@/pages/admin/databases';
import type { Route } from '@/types/types';
import { BuildingIcon, DatabaseIcon, LayoutDashboardIcon, SchoolIcon } from 'lucide-react';

const ADMIN: Route[] = [
  {
    key: 'admin.dashboard',
    title: 'Dashboard',
    path: '/admin/dashboard',
    component: <AdminDashboard />,
    icon: <LayoutDashboardIcon className="h-4 w-4" />,
    layout: 'dashboard',
  },
  {
    key: 'admin.campuses',
    title: 'Campuses',
    path: '/admin/campuses',
    component: <AdminCampus />,
    icon: <SchoolIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
  },
  // Campus/:id
  {
    key: 'admin.campus',
    title: 'Campus',
    path: '/admin/campuses/:campusId',
    component: <AdminCampusDetail />,
    icon: <SchoolIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
  },
  // Building/:id
  {
    key: 'admin.building',
    title: 'Building',
    path: '/admin/campuses/:campusId/buildings/:buildingId',
    component: <AdminBuilding />,
    icon: <BuildingIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
  },
  {
    key: 'admin.databases',
    title: 'Databases',
    path: '/admin/databases',
    component: <AdminDatabases />,
    icon: <DatabaseIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
  },
];

export default ADMIN;
