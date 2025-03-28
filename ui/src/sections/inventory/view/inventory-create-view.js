// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import InventoryNewEditForm from '../inventory-new-edit-form';

// ----------------------------------------------------------------------

export default function InventoryCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Inventory"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Inventory',
            href: paths.dashboard.toolType.root,
          },
          { name: 'New Inventory' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <InventoryNewEditForm />
    </Container>
  );
}
