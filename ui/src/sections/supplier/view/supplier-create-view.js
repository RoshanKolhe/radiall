// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import SupplierNewEditForm from '../supplier-new-edit-form';

// ----------------------------------------------------------------------

export default function SupplierCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Supplier"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Supplier',
            href: paths.dashboard.toolType.root,
          },
          { name: 'New Supplier' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SupplierNewEditForm />
    </Container>
  );
}
