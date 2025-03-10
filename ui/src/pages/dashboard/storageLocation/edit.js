import { Helmet } from 'react-helmet-async';
// sections
import StorageLocationEditView from 'src/sections/storageLocation/view/storageLocation-edit-view';

// ----------------------------------------------------------------------

export default function StorageLocationEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Storage Location Edit</title>
      </Helmet>

      <StorageLocationEditView />
    </>
  );
}
