import { Helmet } from 'react-helmet-async';
// sections
import { ToolsInternalValidationEditView } from 'src/sections/tools_management/view';

// ----------------------------------------------------------------------

export default function ToolsInternalValidationEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tool Internal Validation Form</title>
      </Helmet>

      <ToolsInternalValidationEditView />
    </>
  );
}
