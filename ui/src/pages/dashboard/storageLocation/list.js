import { Helmet } from 'react-helmet-async';
// sections
import { StorageLocationListView } from 'src/sections/storageLocation/view';

// ----------------------------------------------------------------------

export default function StorageLocationListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Storage Location List</title>
      </Helmet>

      <StorageLocationListView />
    </>
  );
}
