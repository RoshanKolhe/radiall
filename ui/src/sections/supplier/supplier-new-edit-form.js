import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {  useEffect, useMemo } from 'react';
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
import FormProvider, {
  RHFTextField,
  RHFSelect,
} from 'src/components/hook-form';
import {  MenuItem } from '@mui/material';
import { COMMON_STATUS_OPTIONS, } from 'src/utils/constants';
import axiosInstance from 'src/utils/axios';
// ----------------------------------------------------------------------

export default function SupplierNewEditForm({ currentSupplier }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewSupplierSchema = Yup.object().shape({
    supplier: Yup.string().required('Supplier Name is required'),
    description: Yup.string(),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      supplier: currentSupplier?.supplier || '',
      description: currentSupplier?.description || '',
      isActive: currentSupplier?.isActive ? '1' : '0' || '1',
    }),
    [currentSupplier]
  );

  const methods = useForm({
    resolver: yupResolver(NewSupplierSchema),
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
        supplier: formData.supplier,
        description: formData.description,
        isActive: currentSupplier ? formData.isActive : true,
      };

      if (!currentSupplier) {
        await axiosInstance.post('/suppliers', inputData);
      } else {
        await axiosInstance.patch(`/suppliers/${currentSupplier.id}`, inputData);
      }
      reset();
      enqueueSnackbar(currentSupplier ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.supplier.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
    }
  });

  useEffect(() => {
    if (currentSupplier) {
      reset(defaultValues);
    }
  }, [currentSupplier, defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {currentSupplier && (
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
                <RHFTextField name="supplier" label="Supplier Name" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="description" label="Description" />
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentSupplier ? 'Create Supplier' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

SupplierNewEditForm.propTypes = {
  currentSupplier: PropTypes.object,
};
