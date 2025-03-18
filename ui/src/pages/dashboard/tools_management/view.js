import { Helmet } from 'react-helmet-async';
// sections
import ToolsView from 'src/sections/tools_management/view/tools-view';

// ----------------------------------------------------------------------

export default function ToolsViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tool Passport</title>
      </Helmet>

      <ToolsView />
    </>
  );
}
