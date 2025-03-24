import { Helmet } from 'react-helmet-async';
// sections
import InventoryView from 'src/sections/inventory/view/inventory-view';

// ----------------------------------------------------------------------

export default function InventoryViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Inventory View</title>
      </Helmet>

      <InventoryView />
    </>
  );
}
