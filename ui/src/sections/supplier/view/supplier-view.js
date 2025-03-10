// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetSupplier } from 'src/api/supplier';

import SupplierViewForm from '../supplier-view-form';

// ----------------------------------------------------------------------

export default function SupplierView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { supplier: currentSupplier } = useGetSupplier(id);

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
            name: 'Supplier',
            href: paths.dashboard.supplier.root,
          },
          {
            name: currentSupplier?.supplier,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SupplierViewForm currentSupplier={currentSupplier} />
    </Container>
  );
}
