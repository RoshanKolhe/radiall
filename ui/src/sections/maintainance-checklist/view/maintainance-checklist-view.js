// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetStation } from 'src/api/station';

import StationViewForm from '../maintainance-checklist-view-form';

// ----------------------------------------------------------------------

export default function StationView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { station: currentStation } = useGetStation(id);

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
            name: 'Station',
            href: paths.dashboard.station.root,
          },
          {
            name: currentStation?.station,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <StationViewForm currentStation={currentStation} />
    </Container>
  );
}
