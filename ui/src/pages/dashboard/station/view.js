import { Helmet } from 'react-helmet-async';
// sections
import StationView from 'src/sections/station/view/station-view';

// ----------------------------------------------------------------------

export default function StationViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Station View</title>
      </Helmet>

      <StationView />
    </>
  );
}
