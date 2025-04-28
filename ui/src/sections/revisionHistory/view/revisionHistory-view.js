// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetRevisionHistory } from 'src/api/revisionHistory';

import RevisionHistoryViewForm from '../revisionHistory-view-form';

// ----------------------------------------------------------------------

export default function RevisionHistoryView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { revisionHistory: currentRevisionHistory } = useGetRevisionHistory(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="View"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'RevisionHistory',
            href: paths.dashboard.revisionHistory.root,
          },
          {
            name: currentRevisionHistory?.revision,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RevisionHistoryViewForm currentRevisionHistory={currentRevisionHistory} />
    </Container>
  );
}
