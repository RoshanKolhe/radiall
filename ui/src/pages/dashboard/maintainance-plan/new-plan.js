import { Helmet } from 'react-helmet-async';
// sections
import { MaintainancePlanCreateView } from 'src/sections/maintainance-plan/view';

// ----------------------------------------------------------------------

export default function MaintainancePlanCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new maintainance plan</title>
      </Helmet>

      <MaintainancePlanCreateView />
    </>
  );
}
