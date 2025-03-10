// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetToolType } from 'src/api/toolType';

import ToolTypeViewForm from '../toolType-view-form';

// ----------------------------------------------------------------------

export default function ToolTypeView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { toolType: currentToolType } = useGetToolType(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'ToolType',
            href: paths.dashboard.toolType.root,
          },
          {
            name: currentToolType?.toolType,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ToolTypeViewForm currentToolType={currentToolType} />
    </Container>
  );
}
