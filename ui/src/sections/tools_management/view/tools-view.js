// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetTool } from 'src/api/tools';

import ToolsViewForm from '../tools-view-form';

// ----------------------------------------------------------------------

export default function ToolsView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { tool : currentTool} = useGetTool(id);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Passport"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Production Means Master',
            href: paths.dashboard.tools.root,
          },
          {
            name: `Passport - ${currentTool?.partNumber}`,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ToolsViewForm currentTool={currentTool} />
    </Container>
  );
}
