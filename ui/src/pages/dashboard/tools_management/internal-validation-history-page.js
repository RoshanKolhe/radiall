import { Helmet } from 'react-helmet-async';
// sections
import ToolsPreviousInternalValidationView from 'src/sections/tools_management/view/tools-previous-year-form-view';

// ----------------------------------------------------------------------

export default function ToolsInternalValidationHistoryPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tool Internal Validation Form History</title>
      </Helmet>

      <ToolsPreviousInternalValidationView />
    </>
  );
}
