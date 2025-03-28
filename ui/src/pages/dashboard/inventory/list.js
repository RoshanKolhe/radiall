import { Helmet } from 'react-helmet-async';
// sections
import { InventoryListView } from 'src/sections/inventory/view';

// ----------------------------------------------------------------------

export default function InventoryListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Inventory List</title>
      </Helmet>

      <InventoryListView />
    </>
  );
}
