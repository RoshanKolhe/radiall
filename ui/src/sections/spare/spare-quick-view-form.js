/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { COMMON_STATUS_OPTIONS } from 'src/utils/constants';
import axiosInstance from 'src/utils/axios';
import { Typography } from '@mui/material';
import { useGetManufacturers } from 'src/api/manufacturer';
import { useGetSuppliers } from 'src/api/supplier';

// ----------------------------------------------------------------------

export default function SpareQuickViewForm({ currentSpare, open, onClose, refreshSpares }) {
  const { enqueueSnackbar } = useSnackbar();

  const { manufacturers, manufacturersEmpty } = useGetManufacturers();
  const { suppliers, suppliersEmpty } = useGetSuppliers();

  const [supplierData, setSupplierData] = useState([]);
  const [manufacturersData, setManufacturersData] = useState([]);

  const NewSpareSchema = Yup.object().shape({
    description: Yup.string().required('Description is required'),
    stock: Yup.number().required('Qty is required').min(1, 'At least 1 quantity is required'),
    supplier: Yup.object().required('Supplier is required'),
    manufacturer: Yup.object().required('Manufacturer  is required'),
    comment: Yup.string(),
    isActive: Yup.boolean(),
  });
  const defaultValues = useMemo(
    () => ({
      description: currentSpare?.description || '',
      stock: currentSpare?.stock || '',
      isActive: currentSpare ? (currentSpare?.isActive ? '1' : '0') : '1',
      manufacturer: currentSpare ? currentSpare?.manufacturer : null,
      supplier: currentSpare ? currentSpare?.supplier : null,
      comment: currentSpare ? currentSpare?.comment : null,
    }),
    [currentSpare]
  );

  const methods = useForm({
    resolver: yupResolver(NewSpareSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const inputData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        permissions: [formData.role],
        phoneNumber: formData.phoneNumber,
        isActive: formData.isActive,
        employeeId: formData.employeeId,
        departmentId: Number(formData.department),
      };
      await axiosInstance.patch(`/api/users/${currentSpare.id}`, inputData);
      refreshSpares();
      reset();
      onClose();
      enqueueSnackbar('Update success!');
    } catch (error) {
      console.error(error);
    }
  });

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
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Quick Update</DialogTitle>

        <DialogContent>
          {!currentSpare?.isActive && (
            <Alert variant="outlined" severity="error" sx={{ mb: 3 }}>
              Spare is In-Active
            </Alert>
          )}

          <Box
            mt={2}
            mb={2}
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFSelect name="isActive" label="Status" disabled>
              {COMMON_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </RHFSelect>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

            <RHFTextField name="description" label="Description" disabled />
            <RHFTextField name="stock" label="Qty Safety Stock" type="number" disabled />
            <RHFAutocomplete
              name="supplier"
              label="Supplier"
              options={supplierData || []}
              getOptionLabel={(option) => option?.supplier || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              filterOptions={(options, { inputValue }) =>
                options.filter((option) =>
                  option.supplier.toLowerCase().includes(inputValue.toLowerCase())
                )
              }
              renderOption={(props, option) => (
                <li {...props}>
                  <Typography variant="subtitle2">{option?.supplier}</Typography>
                </li>
              )}
              disabled
            />
            <RHFAutocomplete
              name="manufacturer"
              label="Manufacturer"
              options={manufacturersData || []}
              getOptionLabel={(option) => option?.manufacturer || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              filterOptions={(options, { inputValue }) =>
                options.filter((option) =>
                  option.manufacturer.toLowerCase().includes(inputValue.toLowerCase())
                )
              }
              renderOption={(props, option) => (
                <li {...props}>
                  <Typography variant="subtitle2">{option?.manufacturer}</Typography>
                </li>
              )}
              disabled
            />
            <RHFTextField name="comment" label="Comment" disabled />
          </Box>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}

SpareQuickViewForm.propTypes = {
  currentSpare: PropTypes.object,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  refreshSpares: PropTypes.func,
};
