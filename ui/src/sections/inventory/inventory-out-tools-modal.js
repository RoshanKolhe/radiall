import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';

export default function InventoryOutToolsModal({
  data = [],
  mode = 'view',
  onSave,
  columns,
  open,
  onClose,
}) {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');

  const filteredData = data.filter((tool) => {
    const partNumber = tool?.partNumber || '';
    const serialNumber = tool?.serialNumber || '';

    return (
      partNumber.toLowerCase().includes(search.toLowerCase()) ||
      serialNumber.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSelect = (toolId) => {
    setSelected((prevSelected) =>
      prevSelected.includes(toolId)
        ? prevSelected.filter((id) => id !== toolId)
        : [...prevSelected, toolId]
    );
  };

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <DialogTitle>Out Tools</DialogTitle>
      <DialogContent>
        <Paper sx={{ p: 2 }}>
          {/* Search Input */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by Part Number or Serial Number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {/* Show Checkbox only in 'select' mode */}
                  {mode === 'select' && <TableCell>Select</TableCell>}
                  {columns.map((col) => (
                    <TableCell key={col.field}>{col.label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((tool) => (
                  <TableRow key={tool.id}>
                    {/* Checkbox for selection */}
                    {mode === 'select' && (
                      <TableCell>
                        <Checkbox
                          checked={selected.includes(tool.id)}
                          onChange={() => handleSelect(tool.id)}
                        />
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell key={col.field}>{tool[col.field] || 'N/A'}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Show Save button only in 'select' mode */}
          {mode === 'select' && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              disabled={selected.length === 0}
              onClick={() => onSave(selected)}
            >
              Save
            </Button>
          )}
        </Paper>
      </DialogContent>
    </Dialog>
  );
}

InventoryOutToolsModal.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  mode: PropTypes.oneOf(['select', 'view']).isRequired,
  onSave: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
