import { TableRow, TableCell, Tooltip, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';
import PropTypes from 'prop-types';

// Utility function to get nested values safely
const getNestedValue = (obj, path) =>
  path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : '-'), obj);

export default function CommonToolsTableRow({ row, selected, tableHead, actions }) {
  return (
    <TableRow hover selected={selected}>
      {tableHead.map((column) => {
        if (column.id === '') {
          // Empty column for actions
          return (
            <TableCell key="actions" align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
              {actions?.map((action, index) => (
                <Tooltip key={index} title={action.label} placement="top" arrow>
                  <IconButton onClick={() => action.onClick(row)}>
                    <Iconify icon={action.icon} />
                  </IconButton>
                </Tooltip>
              ))}
            </TableCell>
          );
        }

        const value = getNestedValue(row, column.id);
        return (
          <TableCell key={column.id}>{column.render ? column.render(value, row) : value}</TableCell>
        );
      })}
    </TableRow>
  );
}

CommonToolsTableRow.propTypes = {
  tableHead: PropTypes.array.isRequired,
  actions: PropTypes.array,
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
};
