// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useParams } from 'src/routes/hook';
import SpareNewEditForm from '../spare-new-edit-form';

// ----------------------------------------------------------------------

export default function SpareCreateView() {

  const params = useParams();
  const { id: toolId } = params;
  
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Spare"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Spare',
            href: paths.dashboard.toolType.root,
          },
          { name: 'New Spare' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SpareNewEditForm toolId={toolId} />
    </Container>
  );
}
