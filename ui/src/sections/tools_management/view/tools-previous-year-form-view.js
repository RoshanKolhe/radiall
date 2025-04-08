// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetPreviousInternalValidationForm } from 'src/api/previous-internal-validation';
//
import InternalValidationViewForm from '../internal-validation-form-view/internal-validation-view-form';

// ----------------------------------------------------------------------

export default function ToolsPreviousInternalValidationView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  // always passed tool id to get data of installation form
  const { internalValidationForm : currentForm } = useGetPreviousInternalValidationForm(id);

  const year = new Date(currentForm?.createdAt).getFullYear();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={`Internal Validation Form Record - ${year || 'NA'}`}
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

      <InternalValidationViewForm currentForm={currentForm} verificationForm/>
    </Container>
  );
}
