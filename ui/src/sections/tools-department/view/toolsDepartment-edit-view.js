// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetToolDepartment } from 'src/api/tools-department';
import ToolsDepartmentNewEditForm from '../toolsDepartment-new-edit-form';

// ----------------------------------------------------------------------

export default function ToolDepartmentEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { toolDepartment: currentToolDepartment } = useGetToolDepartment(id);

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
            name: 'Tool Department',
            href: paths.dashboard.toolsDepartment.root,
          },
          {
            name: currentToolDepartment?.toolDepartment,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ToolsDepartmentNewEditForm currentToolDepartment={currentToolDepartment} />
    </Container>
  );
}
