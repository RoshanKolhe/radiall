// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetTool } from 'src/api/tools';
import { useEffect, useState } from 'react';
import { useGetStorageLocations } from 'src/api/storageLocation';
import { useGetManufacturers } from 'src/api/manufacturer';
import { useGetSuppliers } from 'src/api/supplier';
import { useGetToolTypes } from 'src/api/toolType';
//
import ToolsNewEditForm from '../tools-new-edit-form';

// ----------------------------------------------------------------------

export default function ToolsEditView() {
  const settings = useSettingsContext();
  const params = useParams();
  const { id } = params;
  const { tool : currentTool} = useGetTool(id);
  const { toolTypes, toolTypesEmpty } = useGetToolTypes();
  const { manufacturers, manufacturersEmpty } = useGetManufacturers();
  const { suppliers, suppliersEmpty } = useGetSuppliers();
  const { storageLocations, storageLocationsEmpty } = useGetStorageLocations();

  const [ toolTypeData, setToolTypeData ] = useState([]); 
  const [ supplierData, setSupplierData ] = useState([]);
  const [ manufacturersData, setManufacturersData ] = useState([]); 
  const [ storageLocationsData, setStorageLocationsData ] = useState([]);
  
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
        heading="Tool Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Production Means Master',
            href: paths.dashboard.tools.root,
          },
          {
            name: `edit - ${currentTool?.partNumber}`,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ToolsNewEditForm 
        currentTool={currentTool}
        toolTypeData={toolTypeData}
        manufacturerData={manufacturersData}
        supplierData={supplierData}
        storageLocationData={storageLocationsData} 
      />
    </Container>
  );
}
