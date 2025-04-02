import {
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';

export default function InventoryOutEntries({ inventoryOutEntries, onEdit, onDelete }) {
  console.log(inventoryOutEntries);
  const columnNames = [
    { value: 'toolPartNo', label: 'Tool Part No.' },
    { value: 'moNumber', label: 'Mo Number' },
    { value: 'moQuantity', label: 'Mo Qty' },
    { value: 'action', label: 'Action' },
  ];

  return (
    <Card sx={{ p: 3, mt: 2 }}>
      <Grid item xs={12} md={12}>
        <Table>
          <TableHead>
            <TableRow>
              {columnNames.map((col) => (
                <TableCell key={col.value}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryOutEntries.length > 0 &&
              inventoryOutEntries.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item?.toolPartNumber}</TableCell>
                  <TableCell>{item?.moNumber}</TableCell>
                  <TableCell>{item.moQuantity}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => onEdit(item)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => onDelete(item.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Grid>
    </Card>
  );
}

InventoryOutEntries.propTypes = {
  inventoryOutEntries: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
