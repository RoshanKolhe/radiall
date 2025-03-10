import { Helmet } from 'react-helmet-async';
// sections
import { StorageLocationCreateView } from 'src/sections/storageLocation/view';

// ----------------------------------------------------------------------

export default function StorageLocationCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new Storage Location</title>
      </Helmet>

      <StorageLocationCreateView />
    </>
  );
}
