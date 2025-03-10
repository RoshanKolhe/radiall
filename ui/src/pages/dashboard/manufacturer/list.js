import { Helmet } from 'react-helmet-async';
// sections
import { ManufacturerListView } from 'src/sections/manufacturer/view';

// ----------------------------------------------------------------------

export default function ManufacturerListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Manufacturer List</title>
      </Helmet>

      <ManufacturerListView />
    </>
  );
}
