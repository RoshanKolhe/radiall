import { Helmet } from 'react-helmet-async';
// sections
import StationEditView from 'src/sections/station/view/station-edit-view';

// ----------------------------------------------------------------------

export default function StationEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Station Edit</title>
      </Helmet>

      <StationEditView />
    </>
  );
}
