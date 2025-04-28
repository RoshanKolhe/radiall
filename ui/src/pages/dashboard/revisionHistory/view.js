import { Helmet } from 'react-helmet-async';
// sections
import RevisionHistoryView from 'src/sections/revisionHistory/view/revisionHistory-view';

// ----------------------------------------------------------------------

export default function RevisionHistoryViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: RevisionHistory View</title>
      </Helmet>

      <RevisionHistoryView />
    </>
  );
}
