import { Helmet } from 'react-helmet-async';
// sections
import { ManufacturerCreateView } from 'src/sections/manufacturer/view';

// ----------------------------------------------------------------------

export default function ManufacturerCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new toolType</title>
      </Helmet>

      <ManufacturerCreateView />
    </>
  );
}
