import { Helmet } from 'react-helmet-async';
// sections
import SpareView from 'src/sections/spare/view/spare-view';

// ----------------------------------------------------------------------

export default function SpareViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Spare View</title>
      </Helmet>

      <SpareView />
    </>
  );
}
