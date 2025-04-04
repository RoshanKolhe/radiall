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
import CreateMaintainanceEntry from '../maintainance-entry-create';
//

// ----------------------------------------------------------------------

export default function MaintainanceEntryCreateView() {
  const params = useParams();
  const settings = useSettingsContext();
  const {id} = params;

  const {tool : toolData} = useGetTool(id);
  const {maintainancePlan : currentPlan} = useGetMaintainancePlan(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Maintainance Entry"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Maintainance entries',
            href: paths.dashboard.maintainancePlan.entries(toolData?.id),
          },
          { name: `Maintainance Entry - ${toolData?.partNumber}` },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CreateMaintainanceEntry currentPlan={currentPlan} toolData={toolData} />

    </Container>
  );
}
