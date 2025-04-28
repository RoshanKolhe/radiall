import { Helmet } from 'react-helmet-async';
// sections
import HistoryCardView from 'src/sections/historyCard/view/historyCard-view';

// ----------------------------------------------------------------------

export default function HistoryCardViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: HistoryCard View</title>
      </Helmet>

      <HistoryCardView />
    </>
  );
}
