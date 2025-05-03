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

export default function CheckpointNewEditForm({ currentCheckpoint }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewStationSchema = Yup.object().shape({
    checkpoint: Yup.string().required('Checkpoint Name is required'),
    description: Yup.string(),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      checkpoint: currentCheckpoint?.checklistPoint || '',
      description: currentCheckpoint?.description || '',
      isActive: currentCheckpoint?.isActive ? '1' : '0' || '1',
    }),
    [currentCheckpoint]
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
        checklistPoint: formData.checkpoint,
        description: formData.description,
        isActive: currentCheckpoint ? formData.isActive : true,
      };

      if (!currentCheckpoint) {
        await axiosInstance.post('/maintainance-checklists', inputData);
      } else {
        await axiosInstance.patch(`/maintainance-checklists/${currentCheckpoint.id}`, inputData);
      }
      reset();
      enqueueSnackbar(currentCheckpoint ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.maintainanceChecklist.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
    }
  });

  useEffect(() => {
    if (currentCheckpoint) {
      reset(defaultValues);
    }
  }, [currentCheckpoint, defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {currentCheckpoint && (
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
                <RHFTextField name="checkpoint" label="Checkpoint Name" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="description" label="Description" />
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentCheckpoint ? 'Create Checkpoint' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

CheckpointNewEditForm.propTypes = {
  currentCheckpoint: PropTypes.object,
};
