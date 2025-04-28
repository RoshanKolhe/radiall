import { Helmet } from 'react-helmet-async';
// sections
import { HistoryCardCreateView } from 'src/sections/historyCard/view';

// ----------------------------------------------------------------------

export default function HistoryCardCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new History Card</title>
      </Helmet>

      <HistoryCardCreateView />
    </>
  );
}
