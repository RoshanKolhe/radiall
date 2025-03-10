// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import StorageLocationNewEditForm from '../storageLocation-new-edit-form';

// ----------------------------------------------------------------------

export default function StorageLocationCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Storage Location"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'StorageLocation',
            href: paths.dashboard.storageLocation.root,
          },
          { name: 'New Storage Location' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <StorageLocationNewEditForm />
    </Container>
  );
}
