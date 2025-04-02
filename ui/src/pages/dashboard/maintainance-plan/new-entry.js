import { Helmet } from 'react-helmet-async';
// sections
import { MaintainanceEntryCreateView } from 'src/sections/maintainance-plan/view';

// ----------------------------------------------------------------------

export default function MaintainanceEntryCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new maintainance Entry</title>
      </Helmet>

      <MaintainanceEntryCreateView />
    </>
  );
}
