import { Helmet } from 'react-helmet-async';
// sections
import ToolTypeEditView from 'src/sections/toolType/view/toolType-edit-view';

// ----------------------------------------------------------------------

export default function ToolTypeEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: ToolType Edit</title>
      </Helmet>

      <ToolTypeEditView />
    </>
  );
}
