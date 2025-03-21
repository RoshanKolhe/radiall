/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFSelect, RHFAutocomplete } from 'src/components/hook-form';
import { MenuItem, Typography } from '@mui/material';
import { COMMON_STATUS_OPTIONS } from 'src/utils/constants';
import axiosInstance from 'src/utils/axios';
import { useGetManufacturers } from 'src/api/manufacturer';
import { useGetSuppliers } from 'src/api/supplier';
// ----------------------------------------------------------------------

export default function SpareNewEditForm({ currentSpare, toolId }) {
  console.log(toolId);
  const router = useRouter();

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
  console.log(currentSpare);
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

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

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
      router.push(paths.dashboard.spare.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
    }
  });

  useEffect(() => {
    if (currentSpare) {
      reset(defaultValues);
    }
  }, [currentSpare, defaultValues, reset]);

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
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {currentSpare && (
                <>
                  <Grid item xs={12} sm={6}>
                    <RHFSelect name="isActive" label="Status">
                      {COMMON_STATUS_OPTIONS.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          {status.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Grid>
                  <Grid item xs={12} sm={6} />
                </>
              )}

              <Grid item xs={12} sm={6}>
                <RHFTextField name="description" label="Description" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="stock" label="Qty Safety Stock" type="number" />
              </Grid>
              <Grid item xs={12} sm={6}>
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
              </Grid>
              <Grid item xs={12} sm={6}>
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
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="comment" label="Comment" />
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentSpare ? 'Create Spare' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

SpareNewEditForm.propTypes = {
  currentSpare: PropTypes.object,
  toolId: PropTypes.any,
};
