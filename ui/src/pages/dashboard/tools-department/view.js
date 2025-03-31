import { Helmet } from 'react-helmet-async';
// sections
import StorageLocationView from 'src/sections/storageLocation/view/storageLocation-view';

// ----------------------------------------------------------------------

export default function StorageLocationViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: StorageLocation View</title>
      </Helmet>

      <StorageLocationView />
    </>
  );
}
