import { Helmet } from 'react-helmet-async';
// sections
import { ToolTypeListView } from 'src/sections/toolType/view';

// ----------------------------------------------------------------------

export default function ToolTypeListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: ToolType List</title>
      </Helmet>

      <ToolTypeListView />
    </>
  );
}
