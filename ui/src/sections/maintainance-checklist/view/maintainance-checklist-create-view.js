import { useParams } from 'react-router';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import CheckpointLevelOneNewEditForm from '../maintainance-level-one-checkpoint-new-edit-form';
import CheckpointLevelTwoNewEditForm from '../maintainance-level-two-checkpoint-new-edit-form';

// ----------------------------------------------------------------------

export default function MaintainanceChecklistCreateView() {
  const settings = useSettingsContext();
  const params = useParams();
  const {level} = params;
  const numericLevel = Number(level);

  console.log('level', level);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Mainatainance Instruction"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Maintainance Instructions',
            href: paths.dashboard.maintainanceChecklist.root,
          },
          { name: 'New Instruction' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {numericLevel === 1 ? <CheckpointLevelOneNewEditForm /> : <CheckpointLevelTwoNewEditForm />}
    </Container>
  );
}
