import { Helmet } from 'react-helmet-async';
// sections
import { ToolsDepartmentListView } from 'src/sections/tools-department/view';

// ----------------------------------------------------------------------

export default function ToolsDepartmentListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tools Department List</title>
      </Helmet>

      <ToolsDepartmentListView />
    </>
  );
}
