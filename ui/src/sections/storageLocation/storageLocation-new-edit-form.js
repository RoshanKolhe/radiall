import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
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

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';

import { COMMON_STATUS_OPTIONS } from 'src/utils/constants';
import axiosInstance from 'src/utils/axios';
import { MenuItem } from '@mui/material';

// ----------------------------------------------------------------------

export default function StorageLocationNewEditForm({ currentStorageLocation }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewStorageLocationSchema = Yup.object().shape({
    storageLocation: Yup.string().required('Storage Location is required'),
    description: Yup.string(),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      storageLocation: currentStorageLocation?.location || '',
      description: currentStorageLocation?.description || '',
      isActive: currentStorageLocation?.isActive ? '1' : '0' || '1',
    }),
    [currentStorageLocation]
  );

  const methods = useForm({
    resolver: yupResolver(NewStorageLocationSchema),
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
        location: formData.storageLocation,
        description: formData.description,
        isActive: currentStorageLocation ? formData.isActive : true,
      };

      if (!currentStorageLocation) {
        await axiosInstance.post('/storage-locations', inputData);
      } else {
        await axiosInstance.patch(`/storage-locations/${currentStorageLocation.id}`, inputData);
      }
      reset();
      enqueueSnackbar(currentStorageLocation ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.storageLocation.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
    }
  });

  useEffect(() => {
    if (currentStorageLocation) {
      reset(defaultValues);
    }
  }, [currentStorageLocation, defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {currentStorageLocation && (
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
                <RHFTextField name="storageLocation" label="Storage Location" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="description" label="Description" />
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentStorageLocation ? 'Create Storage Location' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

StorageLocationNewEditForm.propTypes = {
  currentStorageLocation: PropTypes.object,
};
