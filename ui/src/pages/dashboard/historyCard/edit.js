import { Helmet } from 'react-helmet-async';
// sections
import HistoryCardEditView from 'src/sections/historyCard/view/historyCard-edit-view';

// ----------------------------------------------------------------------

export default function HistoryCardEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: HistoryCard Edit</title>
      </Helmet>

      <HistoryCardEditView />
    </>
  );
}
