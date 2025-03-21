import { Helmet } from 'react-helmet-async';
// sections
import { SpareCreateView } from 'src/sections/spare/view';

// ----------------------------------------------------------------------

export default function SpareCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new toolType</title>
      </Helmet>

      <SpareCreateView />
    </>
  );
}
