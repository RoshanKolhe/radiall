import { Helmet } from 'react-helmet-async';
// sections
import { MaintainanceChecklistView } from 'src/sections/maintainance-checklist/view';

// ----------------------------------------------------------------------

export default function MaintainanceChecklistPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Maintainance Checklist</title>
      </Helmet>

      <MaintainanceChecklistView />
    </>
  );
}
