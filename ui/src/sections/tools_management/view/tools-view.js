// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetTool } from 'src/api/tools';

import { Box, Button } from '@mui/material';
import Iconify from 'src/components/iconify';
import axiosInstance from 'src/utils/axios';
import ToolsViewForm from '../tools-view-form';

// ----------------------------------------------------------------------

export default function ToolsView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { tool : currentTool} = useGetTool(id);

  const handleDownloadPassport = async(toolId) => {
    try {
      const response = await axiosInstance.get(`/download-passport/${toolId}`, {
        responseType: 'blob', 
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'passsport.xlsx'); 
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error while downloading internal validation form', error);
    }
  }
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Container sx={{width: '100%', display: 'flex', alignItems: 'start', justifyContent: 'space-between', flexWrap: 'wrap'}}>
        <CustomBreadcrumbs
          heading="Passport"
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
              name: `Passport - ${currentTool?.partNumber}`,
            },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Box sx={{width: '50%', textAlign: {xs: 'left', md: 'right'}, display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'end'}} component='div'>
          <Button sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}} variant='contained' onClick={() => handleDownloadPassport(currentTool?.id)} >
            <Iconify icon="mdi:download" width={18}/>            
            Download
          </Button>
        </Box>
      </Container>
      <ToolsViewForm currentTool={currentTool} />
    </Container>
  );
}
