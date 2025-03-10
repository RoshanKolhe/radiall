import { Helmet } from 'react-helmet-async';
// sections
import { SupplierListView } from 'src/sections/supplier/view';

// ----------------------------------------------------------------------

export default function SupplierListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Supplier List</title>
      </Helmet>

      <SupplierListView />
    </>
  );
}
