// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetScrappingForm } from 'src/api/scrapping-form';
import ScrappingForm from '../scrapping-form';

// ----------------------------------------------------------------------

export default function ScrappingFormEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  // always passed tool id to get data of installation form
  const { scrappingForm : currentForm } = useGetScrappingForm(id);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={currentForm?.isEditable ? "Scrapping Entry Form" : "Scrapping Form Verification"}
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Tools',
            href: paths.dashboard.tools.root,
          },
          {
            name: `Scrapping form - ${currentForm?.tools?.partNumber}`,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ScrappingForm currentForm={currentForm} verificationForm={!currentForm?.isEditable} />

    </Container>
  );
}
