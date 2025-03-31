import { Helmet } from 'react-helmet-async';
// sections
import { ToolsDepartmentCreateView } from 'src/sections/tools-department/view';

// ----------------------------------------------------------------------

export default function ToolsDepartmentCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new Tool Department</title>
      </Helmet>

      <ToolsDepartmentCreateView />
    </>
  );
}
