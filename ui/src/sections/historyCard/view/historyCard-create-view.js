// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import HistoryCardNewEditForm from '../historyCard-new-edit-form';

// ----------------------------------------------------------------------

export default function HistoryCardCreateView() {
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
            name: 'HistoryCard',
            href: paths.dashboard.historyCard.root,
          },
          { name: 'New Revision History' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <HistoryCardNewEditForm />
    </Container>
  );
}
