import { Helmet } from 'react-helmet-async';
// sections
import SupplierView from 'src/sections/supplier/view/supplier-view';

// ----------------------------------------------------------------------

export default function SupplierViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Supplier View</title>
      </Helmet>

      <SupplierView />
    </>
  );
}
