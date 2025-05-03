import { Helmet } from 'react-helmet-async';
// sections
import { MaintainanceChecklistCreateView } from 'src/sections/maintainance-checklist/view';

// ----------------------------------------------------------------------

export default function MaintainanceChecklistCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create Checkpoint</title>
      </Helmet>

      <MaintainanceChecklistCreateView />
    </>
  );
}
