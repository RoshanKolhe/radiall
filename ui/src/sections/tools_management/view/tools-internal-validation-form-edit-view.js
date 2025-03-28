// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetInternalValidationForm } from 'src/api/internal-validation-form';

import ToolsInternalValidationForm from '../internal-validation-form-view/internal-validation-form';

// ----------------------------------------------------------------------

export default function ToolsInternalValidationEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  // always passed tool id to get data of installation form
  const { internalValidationForm : currentForm } = useGetInternalValidationForm(id);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={currentForm?.isEditable ? "Internal Validation Form" : "Internal Validation Form Verification"}
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Tools',
            href: paths.dashboard.tools.root,
          },
          {
            name: `Internal Validation Form - ${currentForm?.tools?.partNumber}`,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ToolsInternalValidationForm currentForm={currentForm} verificationForm={!currentForm?.isEditable}/>
    </Container>
  );
}
