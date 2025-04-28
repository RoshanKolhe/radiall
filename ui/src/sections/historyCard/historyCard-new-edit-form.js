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

export default function HistoryCardNewEditForm({ currentHistoryCard }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewHistoryCardSchema = Yup.object().shape({
    date: Yup.string().required('Date is required'),
    nature: Yup.string().required('Nature is required'),
    description: Yup.string().required('Description is required'),
    attendedBy: Yup.string().required('Attended By is required'),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      date: currentHistoryCard?.date || '',
      nature: currentHistoryCard?.nature || '',
      description: currentHistoryCard?.description || '',
      attendedBy: currentHistoryCard?.attendedBy || '',
      isActive: currentHistoryCard ? (currentHistoryCard?.isActive ? '1' : '0') : '1',
    }),
    [currentHistoryCard]
  );

  const methods = useForm({
    resolver: yupResolver(NewHistoryCardSchema),
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

      if (!currentHistoryCard) {
        await axiosInstance.post('/history-cards', formData);
      } else {
        await axiosInstance.patch(`/history-cards/${currentHistoryCard.id}`, formData);
      }
      reset();
      enqueueSnackbar(currentHistoryCard ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.historyCard.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
    }
  });

  useEffect(() => {
    if (currentHistoryCard) {
      reset(defaultValues);
    }
  }, [currentHistoryCard, defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {currentHistoryCard && (
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
                <Controller
                  name="date"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label="Date"
                      value={new Date(field.value)}
                      onChange={(newValue) => {
                        field.onChange(newValue);
                      }}
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
                <RHFTextField name="nature" label="Nature" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="description" label="Description" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="attendedBy" label="Attended By" />
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentHistoryCard ? 'Create Hisotry Card' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

HistoryCardNewEditForm.propTypes = {
  currentHistoryCard: PropTypes.object,
};
