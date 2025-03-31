import { Helmet } from 'react-helmet-async';
// sections
import { ToolDepartmentEditView } from 'src/sections/tools-department/view';

// ----------------------------------------------------------------------

export default function ToolsDepartmentEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tool Department Edit</title>
      </Helmet>

      <ToolDepartmentEditView />
    </>
  );
}
