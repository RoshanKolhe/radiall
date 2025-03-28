// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetInventory } from 'src/api/inventory';
import InventoryNewEditForm from '../inventory-new-edit-form';

// ----------------------------------------------------------------------

export default function InventoryEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { inventory: currentInventory } = useGetInventory(id);

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
            name: 'Inventory',
            href: paths.dashboard.inventory.root,
          },
          {
            name: currentInventory?.inventory,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <InventoryNewEditForm currentInventory={currentInventory} />
    </Container>
  );
}
