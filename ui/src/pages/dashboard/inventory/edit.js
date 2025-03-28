import { Helmet } from 'react-helmet-async';
// sections
import InventoryEditView from 'src/sections/inventory/view/inventory-edit-view';

// ----------------------------------------------------------------------

export default function InventoryEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Inventory Edit</title>
      </Helmet>

      <InventoryEditView />
    </>
  );
}
