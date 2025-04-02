import { Helmet } from 'react-helmet-async';
import InventoryInEntry from 'src/sections/inventory/view/inventory-in-entry';
// sections

// ----------------------------------------------------------------------

export default function InventoryInEntryPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Inventory In Entry</title>
      </Helmet>

      <InventoryInEntry />
    </>
  );
}
