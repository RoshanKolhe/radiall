import { useNavigate } from 'react-router';
import { format } from 'date-fns';
// @mui
import Container from '@mui/material/Container';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import axiosInstance from 'src/utils/axios';
//
import { useGetInternalValidationForm } from 'src/api/internal-validation-form';

import ToolsInternalValidationForm from '../internal-validation-form-view/internal-validation-form';

// ----------------------------------------------------------------------

export default function ToolsInternalValidationEditView() {
  const navigate = useNavigate();
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const handleDownloadInternalValidationForm = async (formId) => {
    try {
      const response = await axiosInstance.get(`/download-internal-validation-form/${formId}`, {
        responseType: 'blob', 
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'internal-validation-form.xlsx'); 
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error while downloading internal validation form', error);
    }
  };

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

        <Box sx={{width: '50%', textAlign: {xs: 'left', md: 'right'}, display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'end'}} component='div'>
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
          <Button sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}} variant='contained' onClick={() => handleDownloadInternalValidationForm(currentForm?.id)} >
            <Iconify icon="mdi:download" width={18}/>            
            Download
          </Button>
        </Box>
      </Container>

      <ToolsInternalValidationForm currentForm={currentForm} verificationForm={!currentForm?.isEditable}/>
    </Container>
  );
}
