import { Helmet } from 'react-helmet-async';
// sections
import { ToolTypeMaintainancePlanCreateView } from 'src/sections/toolType/view';

// ----------------------------------------------------------------------

export default function ToolTypePlanCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new toolType Maintainance Plan</title>
      </Helmet>

      <ToolTypeMaintainancePlanCreateView />
    </>
  );
}
