// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetToolTypes } from 'src/api/toolType';
import { useGetManufacturers } from 'src/api/manufacturer';
import { useGetSuppliers } from 'src/api/supplier';
import { useGetStorageLocations } from 'src/api/storageLocation';
import { useEffect, useState } from 'react';
//
import ToolsNewEditForm from '../tools-new-edit-form';

// ----------------------------------------------------------------------

export default function ToolsCreateView() {
  const settings = useSettingsContext();
  const [ toolTypeData, setToolTypeData ] = useState([]); 
  const [ supplierData, setSupplierData ] = useState([]);
  const [ manufacturersData, setManufacturersData ] = useState([]); 
  const [ storageLocationsData, setStorageLocationsData ] = useState([]);
  const { toolTypes, toolTypesEmpty } = useGetToolTypes();
  const { manufacturers, manufacturersEmpty } = useGetManufacturers();
  const { suppliers, suppliersEmpty } = useGetSuppliers();
  const { storageLocations, storageLocationsEmpty } = useGetStorageLocations();

  useEffect(() => {
    if (toolTypes && !toolTypesEmpty) {
      setToolTypeData(toolTypes);
    }
  }, [toolTypes, toolTypesEmpty]);

  useEffect(() => {
    if (suppliers && !suppliersEmpty) {
      setSupplierData(suppliers);
    }
  }, [suppliers, suppliersEmpty]);

  useEffect(() => {
    if (manufacturers && !manufacturersEmpty) {
      setManufacturersData(manufacturers);
    }
  }, [manufacturers, manufacturersEmpty]);

  useEffect(() => {
    if (storageLocations && !storageLocationsEmpty) {
      setStorageLocationsData(storageLocations);
    }
  }, [storageLocations, storageLocationsEmpty]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Tool Entry"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Production Means Master',
            href: paths.dashboard.tools.root,
          },
          { name: 'Tool Entry' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ToolsNewEditForm toolTypeData={toolTypeData} supplierData={supplierData} manufacturerData={manufacturersData} storageLocationData={storageLocationsData}/>
    </Container>
  );
}
