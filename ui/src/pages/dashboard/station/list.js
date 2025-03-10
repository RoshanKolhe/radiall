import { Helmet } from 'react-helmet-async';
// sections
import { StationListView } from 'src/sections/station/view';

// ----------------------------------------------------------------------

export default function StationListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Station List</title>
      </Helmet>

      <StationListView />
    </>
  );
}
