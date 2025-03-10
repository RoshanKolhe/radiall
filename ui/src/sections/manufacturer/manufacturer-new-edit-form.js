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

export default function ManufacturerNewEditForm({ currentManufacturer }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewManufacturerSchema = Yup.object().shape({
    manufacturer: Yup.string().required('Manufacturer Name is required'),
    description: Yup.string(),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      manufacturer: currentManufacturer?.manufacturer || '',
      description: currentManufacturer?.description || '',
      isActive: currentManufacturer?.isActive ? '1' : '0' || '1',
    }),
    [currentManufacturer]
  );

  const methods = useForm({
    resolver: yupResolver(NewManufacturerSchema),
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
        manufacturer: formData.manufacturer,
        description: formData.description,
        isActive: currentManufacturer ? formData.isActive : true,
      };

      if (!currentManufacturer) {
        await axiosInstance.post('/manufacturers', inputData);
      } else {
        await axiosInstance.patch(`/manufacturers/${currentManufacturer.id}`, inputData);
      }
      reset();
      enqueueSnackbar(currentManufacturer ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.manufacturer.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
    }
  });

  useEffect(() => {
    if (currentManufacturer) {
      reset(defaultValues);
    }
  }, [currentManufacturer, defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {currentManufacturer && (
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
                <RHFTextField name="manufacturer" label="Manufacturer Name" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="description" label="Description" />
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentManufacturer ? 'Create Manufacturer' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

ManufacturerNewEditForm.propTypes = {
  currentManufacturer: PropTypes.object,
};
