import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/analytics'));

// USER
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
const UserViewPage = lazy(() => import('src/pages/dashboard/user/view'));

// TOOL TYPE
const ToolTypeListPage = lazy(() => import('src/pages/dashboard/toolType/list'));
const ToolTypeCreatePage = lazy(() => import('src/pages/dashboard/toolType/new'));
const ToolTypeEditPage = lazy(() => import('src/pages/dashboard/toolType/edit'));
const ToolTypeViewPage = lazy(() => import('src/pages/dashboard/toolType/view'));

// BLANK PAGE
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'profile', element: <UserAccountPage /> },
      {
        path: 'user',
        children: [
          { element: <UserListPage />, index: true },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: ':id/view', element: <UserViewPage /> },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },
      {
        path: 'toolType',
        children: [
          { element: <ToolTypeListPage />, index: true },
          { path: 'list', element: <ToolTypeListPage /> },
          { path: 'new', element: <ToolTypeCreatePage /> },
          { path: ':id/edit', element: <ToolTypeEditPage /> },
          { path: ':id/view', element: <ToolTypeViewPage /> },
        ],
      },

      { path: 'blank', element: <BlankPage /> },
    ],
  },
];
