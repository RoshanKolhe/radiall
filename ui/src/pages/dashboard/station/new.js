import { Helmet } from 'react-helmet-async';
// sections
import { StationCreateView } from 'src/sections/station/view';

// ----------------------------------------------------------------------

export default function StationCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new toolType</title>
      </Helmet>

      <StationCreateView />
    </>
  );
}
