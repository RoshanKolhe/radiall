import { Helmet } from 'react-helmet-async';
// sections
import ManufacturerView from 'src/sections/manufacturer/view/manufacturer-view';

// ----------------------------------------------------------------------

export default function ManufacturerViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Manufacturer View</title>
      </Helmet>

      <ManufacturerView />
    </>
  );
}
