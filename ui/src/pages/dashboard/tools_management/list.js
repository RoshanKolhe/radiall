import { Helmet } from 'react-helmet-async';
// sections
import { ToolsListView } from 'src/sections/tools_management/view';
// ----------------------------------------------------------------------

export default function ToolsListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tools List</title>
      </Helmet>

      <ToolsListView />
    </>
  );
}
