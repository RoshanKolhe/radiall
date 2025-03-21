// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetSpare } from 'src/api/spare';

import SpareViewForm from '../spare-view-form';

// ----------------------------------------------------------------------

export default function SpareView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { spare: currentSpare } = useGetSpare(id);

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
            name: 'Spare',
            href: paths.dashboard.spare.root,
          },
          {
            name: currentSpare?.description,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SpareViewForm currentSpare={currentSpare} />
    </Container>
  );
}
