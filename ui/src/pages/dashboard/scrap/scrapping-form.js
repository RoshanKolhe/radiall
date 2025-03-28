import { Helmet } from 'react-helmet-async';
// sections
import { ScrappingFormEditView } from 'src/sections/scrap-master/view';
// ----------------------------------------------------------------------

export default function ScrappingFormEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Scrapping Form</title>
      </Helmet>

      <ScrappingFormEditView />
    </>
  );
}
