// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ToolsDepartmentNewEditForm from '../toolsDepartment-new-edit-form';

// ----------------------------------------------------------------------

export default function ToolsDepartmentCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Tool Department"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'ToolsDepartment',
            href: paths.dashboard.toolsDepartment.root,
          },
          { name: 'New Tool Department' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ToolsDepartmentNewEditForm />
    </Container>
  );
}
