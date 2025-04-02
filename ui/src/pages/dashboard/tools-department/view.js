import { Helmet } from 'react-helmet-async';
// sections
import ToolsDepartmentView from 'src/sections/tools-department/view/toolsDepartment-view';

// ----------------------------------------------------------------------

export default function ToolsDepartmentViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tools Department View</title>
      </Helmet>

      <ToolsDepartmentView />
    </>
  );
}
