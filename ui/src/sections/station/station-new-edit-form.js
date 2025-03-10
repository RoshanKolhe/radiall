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

export default function StationNewEditForm({ currentStation }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewStationSchema = Yup.object().shape({
    station: Yup.string().required('Station Name is required'),
    description: Yup.string(),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      station: currentStation?.station || '',
      description: currentStation?.description || '',
      isActive: currentStation?.isActive ? '1' : '0' || '1',
    }),
    [currentStation]
  );

  const methods = useForm({
    resolver: yupResolver(NewStationSchema),
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
        station: formData.station,
        description: formData.description,
        isActive: currentStation ? formData.isActive : true,
      };

      if (!currentStation) {
        await axiosInstance.post('/stations', inputData);
      } else {
        await axiosInstance.patch(`/stations/${currentStation.id}`, inputData);
      }
      reset();
      enqueueSnackbar(currentStation ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.station.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
    }
  });

  useEffect(() => {
    if (currentStation) {
      reset(defaultValues);
    }
  }, [currentStation, defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {currentStation && (
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
                <RHFTextField name="station" label="Station Name" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="description" label="Description" />
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentStation ? 'Create Station' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

StationNewEditForm.propTypes = {
  currentStation: PropTypes.object,
};
