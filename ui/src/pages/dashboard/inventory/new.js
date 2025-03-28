import { Helmet } from 'react-helmet-async';
// sections
import { InventoryCreateView } from 'src/sections/inventory/view';

// ----------------------------------------------------------------------

export default function InventoryCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new toolType</title>
      </Helmet>

      <InventoryCreateView />
    </>
  );
}
