// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import CheckpointNewEditForm from '../checkpoint-new-edit-form';

// ----------------------------------------------------------------------

export default function MaintainanceChecklistCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Mainatainance Checkpoint"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Maintainance Checklist',
            href: paths.dashboard.maintainanceChecklist.root,
          },
          { name: 'New Checkpoint' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CheckpointNewEditForm />
    </Container>
  );
}
