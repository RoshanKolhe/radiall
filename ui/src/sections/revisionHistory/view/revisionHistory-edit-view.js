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
import RevisionHistoryNewEditForm from '../revisionHistory-new-edit-form';

// ----------------------------------------------------------------------

export default function RevisionHistoryEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { revisionHistory: currentRevisionHistory } = useGetRevisionHistory(id);

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
            name: 'Revision History',
            href: paths.dashboard.revisionHistory.root,
          },
          {
            name: `${currentRevisionHistory?.revision}`,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RevisionHistoryNewEditForm currentRevisionHistory={currentRevisionHistory} />
    </Container>
  );
}
