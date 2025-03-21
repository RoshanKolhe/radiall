import { Helmet } from 'react-helmet-async';
// sections
import { SpareListView } from 'src/sections/spare/view';

// ----------------------------------------------------------------------

export default function SpareListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Spare List</title>
      </Helmet>

      <SpareListView />
    </>
  );
}
