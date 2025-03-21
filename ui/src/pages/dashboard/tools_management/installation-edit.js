import { Helmet } from 'react-helmet-async';
// sections
import { ToolsInstallationEditView } from 'src/sections/tools_management/view';

// ----------------------------------------------------------------------

export default function ToolsInstallationEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Tool Installation Edit Form</title>
      </Helmet>

      <ToolsInstallationEditView />
    </>
  );
}
