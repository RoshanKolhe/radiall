import PropTypes from 'prop-types';
// components
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

// ----------------------------------------------------------------------

export default function ToolsViewForm({ currentTool }) {
  const identificationSectionColumns = [
    { label: 'Designation:', value: 'designation' },
    { label: 'Serial Number:', value: 'meanSerialNumber' },
    { label: 'Part Number:', value: 'partNumber' },
    { label: 'Asset Number:', value: 'assetNumber' },
    { label: 'Supplier:', value: 'supplier.supplier' },
    { label: 'Manufacturer:', value: 'manufacturer.manufacturer' },
    { label: 'Date of Manufacturing:', value: 'manufacturingDate' },
  ];

  const managementSectionColumns = [
    { label: 'Family:', value: 'toolFamily' },
    { label: 'Critical:', value: 'criticalLevel' },
    { label: 'Individual Management:', value: 'individualManagement' },
    { label: 'Quantity:', value: 'quantity' },
    { label: 'Maintainance Plan:', value: 'isMaintaincePlanNeeded' },
    { label: 'Calibration:', value: 'calibration' },
    { label: 'Spares List:', value: 'spareList' },
  ];

  const historySectionColumns = [
    { label: 'Date of Creation:', value: 'createdAt' },
    { label: 'Date of Installation:', value: 'installationDate' },
    { label: 'Area/Location:', value: 'storageLocation.location' },
    { label: 'Status:', value: 'status' },
    { label: 'Date of disposal/scrapping:', value: 'scrapDate' },
  ];

  const getNestedValue = (obj, path, defaultValue = 'NA') => {
    if (!obj || !path) return defaultValue;
  
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
  
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };
  
  const getValue = (key) => {
    if (key === 'isActive') {
      return currentTool?.isActive ? 'Active' : 'In-Active';
    }
  
    const value = getNestedValue(currentTool, key);
  
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
  
    // Automatically detect and format all valid date strings
    if (typeof value === 'string' && !Number.isNaN(Date.parse(value))) {
      return formatDate(value);
    }
  
    return value !== undefined && value !== null && value !== '' ? value : 'NA';
  };
    
  
  return (
    <Table sx={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
      <TableHead>
        <TableRow>
          <TableCell
            colSpan={3}
            sx={{
              border: '1px solid black !important',
              textAlign: 'center',
              fontWeight: 'bold',
              backgroundColor: 'white',
              color: 'black',
            }}
          >
            PASSPORT
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {/* Identification Section */}
        <TableRow>
          <TableCell
            rowSpan={identificationSectionColumns.length + 1}
            sx={{
              writingMode: 'vertical-lr',
              textAlign: 'center',
              border: '1px solid black',
              fontWeight: 'bold',
            }}
          >
            IDENTIFICATION
          </TableCell>
        </TableRow>
        {identificationSectionColumns.map((item) => (
          <TableRow key={item.value}>
            <TableCell sx={{ border: '1px solid black', textDecoration: 'underline', textUnderlineOffset : '4px' }}>{item.label}</TableCell>
            <TableCell sx={{ border: '1px solid black' }}>{getValue(item.value) || 'NA'}</TableCell>
          </TableRow>
        ))}

        {/* Management Section */}
        <TableRow>
          <TableCell
            rowSpan={managementSectionColumns.length + 1}
            sx={{
              writingMode: 'vertical-lr',
              textAlign: 'center',
              border: '1px solid black',
              fontWeight: 'bold',
            }}
          >
            MANAGEMENT
          </TableCell>
        </TableRow>
        {managementSectionColumns.map((item) => (
          <TableRow key={item.value}>
            <TableCell sx={{ border: '1px solid black', textDecoration: 'underline', textUnderlineOffset : '4px' }}>{item.label}</TableCell>
            <TableCell sx={{ border: '1px solid black' }}>{getValue(item.value) || 'NA'}</TableCell>
          </TableRow>
        ))}

        {/* History Section */}
        <TableRow>
          <TableCell
            rowSpan={historySectionColumns.length + 1}
            sx={{
              writingMode: 'vertical-lr',
              textAlign: 'center',
              border: '1px solid black',
              fontWeight: 'bold',
            }}
          >
            HISTORY
          </TableCell>
        </TableRow>
        {historySectionColumns.map((item, index) => (
          <TableRow key={item.value}>
            <TableCell sx={{ border: '1px solid black !important', textDecoration: 'underline', textUnderlineOffset : '4px' }}>{item.label}</TableCell>
            <TableCell sx={{ border: '1px solid black !important' }}>{getValue(item.value) || 'NA'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

ToolsViewForm.propTypes = {
  currentTool: PropTypes.object,
};
