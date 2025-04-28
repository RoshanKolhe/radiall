import { Helmet } from 'react-helmet-async';
// sections
import { RevisionHistoryListView } from 'src/sections/revisionHistory/view';

// ----------------------------------------------------------------------

export default function RevisionHistoryListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: RevisionHistory List</title>
      </Helmet>

      <RevisionHistoryListView />
    </>
  );
}
