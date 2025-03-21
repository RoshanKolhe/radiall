import { Helmet } from 'react-helmet-async';
// sections
import SpareEditView from 'src/sections/spare/view/spare-edit-view';

// ----------------------------------------------------------------------

export default function SpareEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Spare Edit</title>
      </Helmet>

      <SpareEditView />
    </>
  );
}
