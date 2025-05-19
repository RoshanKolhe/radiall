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
const ToolTypeMaintainancePlanPage = lazy(() => import('src/pages/dashboard/toolType/plan'));

// REVISION HISTORY
const RevisionHistoryListPage = lazy(() => import('src/pages/dashboard/revisionHistory/list'));
const RevisionHistoryCreatePage = lazy(() => import('src/pages/dashboard/revisionHistory/new'));
const RevisionHistoryEditPage = lazy(() => import('src/pages/dashboard/revisionHistory/edit'));
const RevisionHistoryViewPage = lazy(() => import('src/pages/dashboard/revisionHistory/view'));

// HISTORY CARD
const HistoryCardListPage = lazy(() => import('src/pages/dashboard/historyCard/list'));
const HistoryCardCreatePage = lazy(() => import('src/pages/dashboard/historyCard/new'));
const HistoryCardEditPage = lazy(() => import('src/pages/dashboard/historyCard/edit'));
const HistoryCardViewPage = lazy(() => import('src/pages/dashboard/historyCard/view'));

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

// SPARE
const SpareToolListPage = lazy(() => import('src/pages/dashboard/spare/tool-list'));
const SpareListPage = lazy(() => import('src/pages/dashboard/spare/list'));

// INVENTORY
const InventoryToolListPage = lazy(() => import('src/pages/dashboard/inventory/tool-list'));
const InventoryListPage = lazy(() => import('src/pages/dashboard/inventory/list'));
const InventoryCreatePage = lazy(() => import('src/pages/dashboard/inventory/new'));
const InventoryEditPage = lazy(() => import('src/pages/dashboard/inventory/edit'));
const InventoryInEntryPage = lazy(() => import('src/pages/dashboard/inventory/inEntry'));

// TOOLS MANAGEMENT
const ToolsListPage = lazy(() => import('src/pages/dashboard/tools_management/list'));
const ToolsCreatePage = lazy(() => import('src/pages/dashboard/tools_management/new'));
const ToolsEditPage = lazy(() => import('src/pages/dashboard/tools_management/edit'));
const ToolsViewPage = lazy(() => import('src/pages/dashboard/tools_management/view'));
const ToolsInstallationEditPage = lazy(() =>
  import('src/pages/dashboard/tools_management/installation-form')
);
const ToolsInternalValidationEditPage = lazy(() =>
  import('src/pages/dashboard/tools_management/internal-validation-form')
);
const ToolsInternalValidationHistoryPage = lazy(() =>
  import('src/pages/dashboard/tools_management/internal-validation-history-page')
);

// SCRAP MASTER
const ScrapToolListPage = lazy(() => import('src/pages/dashboard/scrap/tool-list'));
const ScrappingFormPage = lazy(() => import('src/pages/dashboard/scrap/scrapping-form'));

// TOOLS DEPARTMENT MASTER
const ToolsDepartmentListPage = lazy(() => import('src/pages/dashboard/tools-department/list'));
const ToolsDepartmentEditPage = lazy(() => import('src/pages/dashboard/tools-department/edit'));
const ToolsDepartmentCreatePage = lazy(() => import('src/pages/dashboard/tools-department/new'));
const ToolsDepartmentViewPage = lazy(() => import('src/pages/dashboard/tools-department/view'));

// BLANK PAGE
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

// MAINTAINANCE
const MaintainanceToolListPage = lazy(() =>
  import('src/pages/dashboard/maintainance-plan/tool-list')
);
const MaintainancePlanCreatePage = lazy(() =>
  import('src/pages/dashboard/maintainance-plan/new-plan')
);
const MaintainanceEntriesPage = lazy(() => import('src/pages/dashboard/maintainance-plan/entries'));
const MaintainanceEntryCreatePage = lazy(() =>
  import('src/pages/dashboard/maintainance-plan/new-entry')
);

// MAINTAINANCE CHECKLIST
const MaintainanceChecklistListPage = lazy(() => import('src/pages/dashboard/maintainance-checklist/list'));
const MaintainanceChecklistCreatePage = lazy(() => import('src/pages/dashboard/maintainance-checklist/new'));
const MaintainanceCheckpointEditPage = lazy(() => import('src/pages/dashboard/maintainance-checklist/edit'));

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
          { path: ':id/maintainance-plan', element: <ToolTypeMaintainancePlanPage /> },
        ],
      },
      {
        path: 'revisionHistory',
        children: [
          { element: <RevisionHistoryListPage />, index: true },
          { path: 'list', element: <RevisionHistoryListPage /> },
          { path: 'new', element: <RevisionHistoryCreatePage /> },
          { path: ':id/edit', element: <RevisionHistoryEditPage /> },
          { path: ':id/view', element: <RevisionHistoryViewPage /> },
        ],
      },
      {
        path: 'historyCard',
        children: [
          { element: <HistoryCardListPage />, index: true },
          { path: 'list', element: <HistoryCardListPage /> },
          { path: 'new', element: <HistoryCardCreatePage /> },
          { path: ':id/edit', element: <HistoryCardEditPage /> },
          { path: ':id/view', element: <HistoryCardViewPage /> },
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

      {
        path: 'maintainance-checklist',
        children: [
          { element: <MaintainanceChecklistListPage />, index: true },
          { path: 'list/:level', element: <MaintainanceChecklistListPage /> },
          { path: 'new/:level', element: <MaintainanceChecklistCreatePage /> },
          { path: ':id/edit', element: <MaintainanceCheckpointEditPage /> },
          { path: ':id/view', element: <StorageLocationViewPage /> },
        ],
      },

      {
        path: 'inventory',
        children: [
          { element: <InventoryListPage />, index: true },
          // { path: 'toolList', element: <InventoryToolListPage /> },
          { path: 'list', element: <InventoryListPage /> },
          { path: ':id', element: <InventoryInEntryPage /> },
          { path: 'new', element: <InventoryCreatePage /> },
        ],
      },

      {
        path: 'spare',
        children: [
          { element: <SpareToolListPage />, index: true },
          { path: 'toolList', element: <SpareToolListPage /> },
          { path: ':id/list', element: <SpareListPage /> },
        ],
      },

      // TOOLS MANAGEMENT ROUTES
      {
        path: 'tools',
        children: [
          { element: <ToolsListPage />, index: true },
          { path: 'list', element: <ToolsListPage /> },
          { path: 'new', element: <ToolsCreatePage /> },
          { path: ':id/edit', element: <ToolsEditPage /> },
          { path: ':id/view', element: <ToolsViewPage /> },
          { path: ':id/installation-form', element: <ToolsInstallationEditPage /> },
          { path: ':id/internal-validation-form', element: <ToolsInternalValidationEditPage /> },
          {
            path: ':id/internal-validation-form-history',
            element: <ToolsInternalValidationHistoryPage />,
          },
        ],
      },

      // SCRAP MASTER
      {
        path: 'scrap',
        children: [
          { element: <ScrapToolListPage />, index: true },
          { path: 'toolList', element: <ScrapToolListPage /> },
          { path: ':id/scrapping-form', element: <ScrappingFormPage /> },
        ],
      },

      // MAINTAINANCE MASTER
      {
        path: 'maintainance',
        children: [
          { element: <MaintainanceToolListPage />, index: true },
          { path: 'toolList', element: <MaintainanceToolListPage /> },
          { path: 'maintainance-plan/:id', element: <MaintainancePlanCreatePage /> },
          { path: 'entries/:id', element: <MaintainanceEntriesPage /> },
          { path: 'new-entry/:id', element: <MaintainanceEntryCreatePage /> },
        ],
      },

      // TOOLS DEPARTMENT
      {
        path: 'tools-department',
        children: [
          { element: <ToolsDepartmentListPage />, index: true },
          { path: 'list', element: <ToolsDepartmentListPage /> },
          { path: 'new', element: <ToolsDepartmentCreatePage /> },
          { path: ':id/edit', element: <ToolsDepartmentEditPage /> },
          { path: ':id/view', element: <ToolsDepartmentViewPage /> },
        ],
      },

      { path: 'blank', element: <BlankPage /> },
    ],
  },
];
