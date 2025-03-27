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

export default function SpareQuickEditForm({
  currentSpare,
  open,
  onClose,
  refreshSpares,
  toolId,
  tool,
}) {
  console.log(tool);
  const { enqueueSnackbar } = useSnackbar();

  const { manufacturers, manufacturersEmpty } = useGetManufacturers();
  const { suppliers, suppliersEmpty } = useGetSuppliers();

  const [supplierData, setSupplierData] = useState([]);
  const [manufacturersData, setManufacturersData] = useState([]);

  const NewSpareSchema = Yup.object().shape({
    partNumber: Yup.string().required('Part Number is required'),
    description: Yup.string().required('Description is required'),
    stock: Yup.number()
      .required('Safety Stock is required')
      .min(1, 'At least 1 quantity is required'),
    stockInHand: Yup.number()
      .required('Stock in hand is required')
      .min(0, 'Stock in hand cannot be negative'),
    unit: Yup.string().required('Unit is required'),
    supplier: Yup.object().required('Supplier is required'),
    manufacturer: Yup.object().required('Manufacturer  is required'),
    comment: Yup.string(),
    isActive: Yup.boolean(),
  });
  const defaultValues = useMemo(
    () => ({
      description: currentSpare?.description || '',
      partNumber: currentSpare?.partNumber || '',
      stock: currentSpare?.stock || '',
      stockInHand: currentSpare?.stockInHand || '',
      unit: currentSpare?.unit || '',
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
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      console.info('DATA', formData);
      const inputData = {
        partNumber: formData.partNumber,
        description: formData.description,
        comment: formData.comment,
        stock: formData.stock,
        stockInHand: formData.stockInHand,
        unit: formData.unit,
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

  useEffect(() => {
    if (tool && !currentSpare) {
      setValue('supplier', tool?.supplier);
      setValue('manufacturer', tool?.manufacturer);
    }
  }, [currentSpare, setValue, tool]);

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
            <RHFTextField name="partNumber" label="Part Number" />
            <RHFTextField name="description" label="Description" />
            <RHFTextField name="stock" label="Qty Safety Stock" type="number" />
            <RHFTextField
              name="stockInHand"
              label="Stock In Hand"
              type="number"
              value={values.stockInHand || 0}
            />
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
            <RHFTextField name="unit" label="Unit" />
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
  tool: PropTypes.object,
};
