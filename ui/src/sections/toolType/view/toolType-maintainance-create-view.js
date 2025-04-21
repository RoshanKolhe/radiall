// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useParams } from 'react-router';
import { useGetToolTypeMaintainancePlan } from 'src/api/tool-type-maintainance-plan';
import { useGetToolType } from 'src/api/toolType';
//
import CreateMaintainancePlan from '../maintainance-plan-create';

//

// ----------------------------------------------------------------------

export default function ToolTypeMaintainancePlanCreateView() {
  const params = useParams();
  const settings = useSettingsContext();
  const {id} = params;

  const {toolType : toolData} = useGetToolType(id);
  const {maintainancePlan : currentPlan} = useGetToolTypeMaintainancePlan(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Tool Type Maintainance Plan"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Maintainance',
            href: paths.dashboard.toolType.root,
          },
          { name: `Tool Type Maintainance Plan - ${toolData?.toolType}` },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CreateMaintainancePlan currentPlan={currentPlan} toolData={toolData} />

    </Container>
  );
}
