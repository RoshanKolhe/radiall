import { Helmet } from 'react-helmet-async';
// sections
import { HistoryCardListView } from 'src/sections/historyCard/view';

// ----------------------------------------------------------------------

export default function HistoryCardListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: HistoryCard List</title>
      </Helmet>

      <HistoryCardListView />
    </>
  );
}
