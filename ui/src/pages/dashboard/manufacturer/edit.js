import { Helmet } from 'react-helmet-async';
// sections
import ManufacturerEditView from 'src/sections/manufacturer/view/manufacturer-edit-view';

// ----------------------------------------------------------------------

export default function ManufacturerEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Manufacturer Edit</title>
      </Helmet>

      <ManufacturerEditView />
    </>
  );
}
