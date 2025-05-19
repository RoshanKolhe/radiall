/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// assets
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import { MenuItem } from '@mui/material';
import { COMMON_STATUS_OPTIONS } from 'src/utils/constants';
import axiosInstance from 'src/utils/axios';

// ----------------------------------------------------------------------

export default function RevisionHistoryNewEditForm({ currentRevisionHistory }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewRevisionHistorySchema = Yup.object().shape({
    formName: Yup.string().required('Form name is required'),
    revision: Yup.number().required('Revision is required').min(1, 'Minimum Should Be 1'),
    date: Yup.string().required('Date is required'),
    author: Yup.string().required('Author is required'),
    reason: Yup.string().required('Reason is required'),
    change: Yup.string().required('Change is required'),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      formName: currentRevisionHistory?.formName || '', 
      revision: currentRevisionHistory?.revision || '',
      date: currentRevisionHistory?.date || '',
      author: currentRevisionHistory?.author || '',
      reason: currentRevisionHistory?.reason || '',
      change: currentRevisionHistory?.change || '',
      isActive: currentRevisionHistory ? (currentRevisionHistory?.isActive ? '1' : '0') : '1',
    }),
    [currentRevisionHistory]
  );

  const methods = useForm({
    resolver: yupResolver(NewRevisionHistorySchema),
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
      if (!currentRevisionHistory) {
        await axiosInstance.post('/revision-histories', formData);
      } else {
        await axiosInstance.patch(`/revision-histories/${currentRevisionHistory.id}`, formData);
      }
      reset();
      enqueueSnackbar(currentRevisionHistory ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.revisionHistory.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
    }
  });

  useEffect(() => {
    if (currentRevisionHistory) {
      reset(defaultValues);
    }
  }, [currentRevisionHistory, defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {currentRevisionHistory && (
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

              <Grid item xs={12} md={6}>
                <RHFSelect name='formName' label='Form Name'>
                    <MenuItem value='Installation Form'>Installation Form</MenuItem>
                    <MenuItem value='Internal Validation Form'>Internal Validation Form</MenuItem>
                    <MenuItem value='Scrapping Form'>Scrapping Form</MenuItem>
                    <MenuItem value='Production Means Masterlist'>Production Means Masterlist</MenuItem>
                    <MenuItem value='Maintainance Plan'>Maintainance Plan</MenuItem>
                    <MenuItem value='Maintainance Schedule'>Maintainance Schedule</MenuItem>
                    <MenuItem value='History Card'>History Card</MenuItem>
                    <MenuItem value='Spare List'>Spare List</MenuItem>
                    <MenuItem value='Master Spare List'>Master Spare List</MenuItem>
                </RHFSelect>
              </Grid>


              <Grid item xs={12} sm={6}>
                <RHFTextField name="revision" label="Revision No" type="number" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="date"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label="Date"
                      value={field.value ? new Date(field.value) : null}
                      onChange={(newValue) => {
                        field.onChange(newValue);
                      }}
                      format="dd/MM/yyyy"
                      maxDate={new Date()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="author" label="Author" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="reason" label="Reason" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="change" label="Change" />
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentRevisionHistory ? 'Create Revision Hisotry' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

RevisionHistoryNewEditForm.propTypes = {
  currentRevisionHistory: PropTypes.object,
};
