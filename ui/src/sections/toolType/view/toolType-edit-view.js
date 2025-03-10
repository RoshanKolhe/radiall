// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetToolType } from 'src/api/toolType';
import Iconify from 'src/components/iconify';
import { Tab, Tabs } from '@mui/material';
import { useCallback, useState } from 'react';
import ToolTypeNewEditForm from '../toolType-new-edit-form';

// ----------------------------------------------------------------------

export default function ToolTypeEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { toolType: currentToolType } = useGetToolType(id);

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
            name: 'Tool Type',
            href: paths.dashboard.toolType.root,
          },
          {
            name: currentToolType?.toolType,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ToolTypeNewEditForm currentToolType={currentToolType} />
    </Container>
  );
}
