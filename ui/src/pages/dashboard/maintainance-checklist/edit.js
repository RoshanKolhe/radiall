import { Helmet } from 'react-helmet-async';
// sections
import { MaintainanceChecklistEditView } from 'src/sections/maintainance-checklist/view';

// ----------------------------------------------------------------------

export default function MaintainanceCheckpointEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Maintainance Checkpoint Edit</title>
      </Helmet>

      <MaintainanceChecklistEditView />
    </>
  );
}
