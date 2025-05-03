/* eslint-disable no-nested-ternary */
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetInEntriesWithOutEntry, useGetInventory } from 'src/api/inventory';

import InventoryInEntryForm from '../inventory-in-entry-form';
import EntriesTable from '../entriesTable';

// ----------------------------------------------------------------------

export default function InventoryInEntry() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;
  const { inventory: currentInventory } = useGetInventory(id);
  const { entries } = useGetInEntriesWithOutEntry(id); 

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Inventory',
            href: paths.dashboard.inventory.root,
          },
          {
            name: currentInventory?.inventory,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {currentInventory?.status === 0 ? (
        <InventoryInEntryForm currentInventory={currentInventory} />
      ) : currentInventory?.status === 1 ? (
        <EntriesTable entries={entries}/>
      ) : (
        <>
          <InventoryInEntryForm currentInventory={currentInventory} />
          <EntriesTable entries={entries}/>
        </>
      )}
    </Container>
  );
}
