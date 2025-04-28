// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import RevisionHistoryNewEditForm from '../revisionHistory-new-edit-form';

// ----------------------------------------------------------------------

export default function RevisionHistoryCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Revision History"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'RevisionHistory',
            href: paths.dashboard.revisionHistory.root,
          },
          { name: 'New Revision History' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RevisionHistoryNewEditForm />
    </Container>
  );
}
