import { Helmet } from 'react-helmet-async';
// sections
import { RevisionHistoryCreateView } from 'src/sections/revisionHistory/view';

// ----------------------------------------------------------------------

export default function RevisionHistoryCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new revisionHistory</title>
      </Helmet>

      <RevisionHistoryCreateView />
    </>
  );
}
