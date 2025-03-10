import { Helmet } from 'react-helmet-async';
// sections
import SupplierEditView from 'src/sections/supplier/view/supplier-edit-view';

// ----------------------------------------------------------------------

export default function SupplierEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Supplier Edit</title>
      </Helmet>

      <SupplierEditView />
    </>
  );
}
