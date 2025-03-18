import { Helmet } from 'react-helmet-async';
// sections
import { ToolsEditView } from 'src/sections/tools_management/view';

// ----------------------------------------------------------------------

export default function ToolsEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tool Edit</title>
      </Helmet>

      <ToolsEditView />
    </>
  );
}
