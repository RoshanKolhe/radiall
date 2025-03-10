// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetStorageLocation } from 'src/api/storageLocation';

import StorageLocationViewForm from '../storageLocation-view-form';

// ----------------------------------------------------------------------

export default function StorageLocationView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { storageLocation: currentStorageLocation } = useGetStorageLocation(id);

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
            name: 'Storage Location',
            href: paths.dashboard.storageLocation.root,
          },
          {
            name: currentStorageLocation?.location,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <StorageLocationViewForm currentStorageLocation={currentStorageLocation} />
    </Container>
  );
}
