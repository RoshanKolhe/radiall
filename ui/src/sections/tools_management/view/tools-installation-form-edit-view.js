// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import axiosInstance from 'src/utils/axios';
// mui
import { Box, Button } from '@mui/material';
//
import { useGetInstallationForm } from 'src/api/installation-form';
import ToolsInstallationForm from '../installation-form-view/installation-form';

// ----------------------------------------------------------------------

export default function ToolsInstallationEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

    const handleDownloadInstalltionForm = async (formId) => {
    try {
      const response = await axiosInstance.get(`/download-installation-form/${formId}`, {
        responseType: 'blob', 
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'installation-form.xlsx'); 
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error while downloading installation form', error);
    }
  };

  // always passed tool id to get data of installation form
  const { installationForm : currentForm } = useGetInstallationForm(id);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Container sx={{width: '100%', display: 'flex', alignItems: 'start', justifyContent: 'space-between', flexWrap: 'wrap'}}>
        <CustomBreadcrumbs
          heading={currentForm?.isEditable ? "Installation Form" : "Installation Verification"}
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
              name: `Installation form - ${currentForm?.tools?.partNumber}`,
            },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Box sx={{width: '50%', textAlign: {xs: 'left', md: 'right'}, display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'end'}} component='div'>
          <Button sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}} variant='contained' onClick={() => handleDownloadInstalltionForm(currentForm?.id)} >
            <Iconify icon="mdi:download" width={18}/>            
            Download
          </Button>
        </Box>
      </ Container>

      <ToolsInstallationForm currentForm={currentForm} verificationForm={!currentForm?.isEditable}/>
    </Container>
  );
}
