// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetMaintainanceChecklistById } from 'src/api/maintainance-checklist';
import CheckpointNewEditForm from '../checkpoint-new-edit-form';

// ----------------------------------------------------------------------

export default function MaintainanceChecklistEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { maintainanceChecklist: currentCheckpoint } = useGetMaintainanceChecklistById(id);

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
            name: 'Maintainance Checklist',
            href: paths.dashboard.maintainanceChecklist.root,
          },
          {
            name: currentCheckpoint?.checklistPoint,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CheckpointNewEditForm currentCheckpoint={currentCheckpoint} />
    </Container>
  );
}
