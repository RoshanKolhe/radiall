// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ToolsNewEditForm from '../tools-new-edit-form';

// ----------------------------------------------------------------------

export default function ToolsCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Tool Entry"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Tools',
            href: paths.dashboard.tools.root,
          },
          { name: 'Tool Entry' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ToolsNewEditForm />
    </Container>
  );
}
