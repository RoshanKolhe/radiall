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

// MANUFACTURER
const ManufacturerListPage = lazy(() => import('src/pages/dashboard/manufacturer/list'));
const ManufacturerCreatePage = lazy(() => import('src/pages/dashboard/manufacturer/new'));
const ManufacturerEditPage = lazy(() => import('src/pages/dashboard/manufacturer/edit'));
const ManufacturerViewPage = lazy(() => import('src/pages/dashboard/manufacturer/view'));

// SUPPLIER
const SupplierListPage = lazy(() => import('src/pages/dashboard/supplier/list'));
const SupplierCreatePage = lazy(() => import('src/pages/dashboard/supplier/new'));
const SupplierEditPage = lazy(() => import('src/pages/dashboard/supplier/edit'));
const SupplierViewPage = lazy(() => import('src/pages/dashboard/supplier/view'));

// STORAGE LOCATION
const StorageLocationListPage = lazy(() => import('src/pages/dashboard/storageLocation/list'));
const StorageLocationCreatePage = lazy(() => import('src/pages/dashboard/storageLocation/new'));
const StorageLocationEditPage = lazy(() => import('src/pages/dashboard/storageLocation/edit'));
const StorageLocationViewPage = lazy(() => import('src/pages/dashboard/storageLocation/view'));

// STATION
const StationListPage = lazy(() => import('src/pages/dashboard/station/list'));
const StationCreatePage = lazy(() => import('src/pages/dashboard/station/new'));
const StationEditPage = lazy(() => import('src/pages/dashboard/station/edit'));
const StationViewPage = lazy(() => import('src/pages/dashboard/station/view'));

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
      {
        path: 'manufacturer',
        children: [
          { element: <ManufacturerListPage />, index: true },
          { path: 'list', element: <ManufacturerListPage /> },
          { path: 'new', element: <ManufacturerCreatePage /> },
          { path: ':id/edit', element: <ManufacturerEditPage /> },
          { path: ':id/view', element: <ManufacturerViewPage /> },
        ],
      },
      {
        path: 'supplier',
        children: [
          { element: <SupplierListPage />, index: true },
          { path: 'list', element: <SupplierListPage /> },
          { path: 'new', element: <SupplierCreatePage /> },
          { path: ':id/edit', element: <SupplierEditPage /> },
          { path: ':id/view', element: <SupplierViewPage /> },
        ],
      },
      {
        path: 'storageLocation',
        children: [
          { element: <StorageLocationListPage />, index: true },
          { path: 'list', element: <StorageLocationListPage /> },
          { path: 'new', element: <StorageLocationCreatePage /> },
          { path: ':id/edit', element: <StorageLocationEditPage /> },
          { path: ':id/view', element: <StorageLocationViewPage /> },
        ],
      },

      {
        path: 'station',
        children: [
          { element: <StationListPage />, index: true },
          { path: 'list', element: <StationListPage /> },
          { path: 'new', element: <StationCreatePage /> },
          { path: ':id/edit', element: <StationEditPage /> },
          { path: ':id/view', element: <StationViewPage /> },
        ],
      },

      { path: 'blank', element: <BlankPage /> },
    ],
  },
];
