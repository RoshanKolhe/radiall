/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { USER_STATUS_OPTIONS } from 'src/utils/constants';
import axiosInstance from 'src/utils/axios';
import { Typography } from '@mui/material';
import { useGetManufacturers } from 'src/api/manufacturer';
import { useGetSuppliers } from 'src/api/supplier';

// ----------------------------------------------------------------------

export default function SpareQuickEditForm({ currentSpare, open, onClose, refreshSpares, toolId }) {
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
      comment: currentSpare ? currentSpare?.comment : '',
    }),
    [currentSpare]
  );

  const methods = useForm({
    resolver: yupResolver(NewSpareSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    try {
      console.info('DATA', formData);
      const inputData = {
        description: formData.description,
        comment: formData.comment,
        stock: formData.stock,
        manufacturerId: formData.manufacturer.id,
        supplierId: formData.supplier.id,
        isActive: currentSpare ? formData.isActive : true,
        toolsId: Number(toolId),
      };

      if (!currentSpare) {
        await axiosInstance.post('/spares', inputData);
      } else {
        await axiosInstance.patch(`/spares/${currentSpare.id}`, inputData);
      }
      reset();
      enqueueSnackbar(currentSpare ? 'Update success!' : 'Create success!');
      onClose();
      refreshSpares();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
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
          {currentSpare && !currentSpare?.isActive && (
            <Alert variant="outlined" severity="error" sx={{ mb: 3 }}>
              Spare is In-Active
            </Alert>
          )}

          <Box
            mt={2}
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            {currentSpare ? (
              <>
                <RHFSelect name="isActive" label="Status">
                  {USER_STATUS_OPTIONS.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }} />
              </>
            ) : null}

            <RHFTextField name="description" label="Description" />
            <RHFTextField name="stock" label="Qty Safety Stock" type="number" />
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
            />
            <RHFTextField name="comment" label="Comment" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {!currentSpare ? 'Create' : 'Update'}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

SpareQuickEditForm.propTypes = {
  currentSpare: PropTypes.object,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  refreshSpares: PropTypes.func,
  toolId: PropTypes.any,
};
