// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ManufacturerNewEditForm from '../manufacturer-new-edit-form';

// ----------------------------------------------------------------------

export default function ManufacturerCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Manufacturer"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Manufacturer',
            href: paths.dashboard.toolType.root,
          },
          { name: 'New Manufacturer' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ManufacturerNewEditForm />
    </Container>
  );
}
