import { Helmet } from 'react-helmet-async';
// sections
import ToolTypeView from 'src/sections/toolType/view/toolType-view';

// ----------------------------------------------------------------------

export default function ToolTypeViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: ToolType View</title>
      </Helmet>

      <ToolTypeView />
    </>
  );
}
