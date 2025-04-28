// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetHistoryCard } from 'src/api/historyCard';
import HistoryCardViewForm from '../historyCard-view-form';


// ----------------------------------------------------------------------

export default function HistoryCardView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { historyCard: currentHistoryCard } = useGetHistoryCard(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="View"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'HistoryCard',
            href: paths.dashboard.historyCard.root,
          },
          {
            name: `${currentHistoryCard?.revision}`,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <HistoryCardViewForm currentHistoryCard={currentHistoryCard} />
    </Container>
  );
}
