import { Helmet } from 'react-helmet-async';
// sections
import { MaintainanceEntriesListView } from 'src/sections/maintainance-plan/view';

// ----------------------------------------------------------------------

export default function MaintainanceEntriesPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Maintainance Entries</title>
      </Helmet>

      <MaintainanceEntriesListView />
    </>
  );
}
