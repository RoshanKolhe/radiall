// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useParams } from 'react-router';
import { useGetTool } from 'src/api/tools';
import { useGetMaintainancePlan } from 'src/api/maintainance-plan';
//
import CreateMaintainancePlan from '../maintainance-plan-create';
//

// ----------------------------------------------------------------------

export default function MaintainancePlanCreateView() {
  const params = useParams();
  const settings = useSettingsContext();
  const {id} = params;

  const {tool : toolData} = useGetTool(id);
  const {maintainancePlan : currentPlan} = useGetMaintainancePlan(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Maintainance Plan"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Maintainance',
            href: paths.dashboard.maintainancePlan.root,
          },
          { name: `Maintainance Plan - ${toolData?.partNumber}` },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CreateMaintainancePlan currentPlan={currentPlan} toolData={toolData} />

    </Container>
  );
}
