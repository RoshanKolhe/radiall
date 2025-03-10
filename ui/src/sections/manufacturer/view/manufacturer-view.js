// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetManufacturer } from 'src/api/manufacturer';

import ManufacturerViewForm from '../manufacturer-view-form';

// ----------------------------------------------------------------------

export default function ManufacturerView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { manufacturer: currentManufacturer } = useGetManufacturer(id);

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
            name: 'Manufacturer',
            href: paths.dashboard.manufacturer.root,
          },
          {
            name: currentManufacturer?.manufacturer,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ManufacturerViewForm currentManufacturer={currentManufacturer} />
    </Container>
  );
}
