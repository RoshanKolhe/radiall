import { Helmet } from 'react-helmet-async';
// sections
import { SupplierCreateView } from 'src/sections/supplier/view';

// ----------------------------------------------------------------------

export default function SupplierCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new toolType</title>
      </Helmet>

      <SupplierCreateView />
    </>
  );
}
