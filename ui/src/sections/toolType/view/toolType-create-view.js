// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ToolTypeNewEditForm from '../toolType-new-edit-form';

// ----------------------------------------------------------------------

export default function ToolTypeCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Tool Type"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'ToolType',
            href: paths.dashboard.toolType.root,
          },
          { name: 'New Tool Type' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ToolTypeNewEditForm />
    </Container>
  );
}
