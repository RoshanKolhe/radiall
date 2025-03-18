import { Helmet } from 'react-helmet-async';
// sections
import { ToolsCreateView } from 'src/sections/tools_management/view';

// ----------------------------------------------------------------------

export default function ToolsCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new tool</title>
      </Helmet>

      <ToolsCreateView />
    </>
  );
}
