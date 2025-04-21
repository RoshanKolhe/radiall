import { useNavigate } from 'react-router';
import { format } from 'date-fns';
// @mui
import Container from '@mui/material/Container';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
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
  const navigate = useNavigate();
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  // always passed tool id to get data of installation form
  const { internalValidationForm : currentForm } = useGetInternalValidationForm(id);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Container sx={{width: '100%', display: 'flex', alignItems: 'start', justifyContent: 'space-between', flexWrap: 'wrap'}}>
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
            width:{xs : '100%', md:'50%'}
          }}
        />

        <Box sx={{width: '50%', textAlign: {xs: 'left', md: 'right'}}} component='div'>
          <FormControl sx={{width: '250px'}}>
              <InputLabel id='previous-year-form'>Previous Years Records</InputLabel>
              <Select label='Previous Years Records' labelId='previous-year-form' onChange={(e) => navigate(paths.dashboard.tools.internalValidationFormHistory(e.target.value))}>
                  {currentForm?.previousYearForms?.length > 0 ? currentForm?.previousYearForms?.map((form) => (
                      <MenuItem key={form?.formId} value={form?.formId}>Record - {format(new Date(form?.date), 'dd MM yyyy')}</MenuItem>
                  )) : (
                      <MenuItem value='' disabled>No Records</MenuItem>
                  )}
              </Select>
          </FormControl>
        </Box>
      </Container>

      <ToolsInternalValidationForm currentForm={currentForm} verificationForm={!currentForm?.isEditable}/>
    </Container>
  );
}
