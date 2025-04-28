import { Helmet } from 'react-helmet-async';
// sections
import RevisionHistoryEditView from 'src/sections/revisionHistory/view/revisionHistory-edit-view';

// ----------------------------------------------------------------------

export default function RevisionHistoryEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: RevisionHistory Edit</title>
      </Helmet>

      <RevisionHistoryEditView />
    </>
  );
}
