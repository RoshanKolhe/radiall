import { Helmet } from 'react-helmet-async';
// sections
import { ToolTypeCreateView } from 'src/sections/toolType/view';

// ----------------------------------------------------------------------

export default function ToolTypeCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new toolType</title>
      </Helmet>

      <ToolTypeCreateView />
    </>
  );
}
