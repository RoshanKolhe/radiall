// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetInstallationForm } from 'src/api/installation-form';

import ToolsInstallationForm from '../installation-form-view/installation-form';

// ----------------------------------------------------------------------

export default function ToolsInstallationEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  // always passed tool id to get data of installation form
  const { installationForm : currentForm} = useGetInstallationForm(id);
  console.log('currentForm', currentForm);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={currentForm?.isEditable ? "Installation Form" : "Installation Verification"}
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Production Means Master',
            href: paths.dashboard.tools.root,
          },
          {
            name: `Installation form - ${currentForm?.tools?.partNumber}`,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ToolsInstallationForm currentForm={currentForm} verificationForm={!currentForm?.isEditable}/>
    </Container>
  );
}
