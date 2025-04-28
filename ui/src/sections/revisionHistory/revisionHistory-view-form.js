/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Card from '@mui/material/Card';

import Grid from '@mui/material/Unstable_Grid2';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import { MenuItem } from '@mui/material';
import { COMMON_STATUS_OPTIONS } from 'src/utils/constants';

// ----------------------------------------------------------------------

export default function RevisionHistoryViewForm({ currentRevisionHistory }) {
  const { enqueueSnackbar } = useSnackbar();

  const NewRevisionHistorySchema = Yup.object().shape({
    revision: Yup.number().required('Revision is required').min(1, 'Minimum Should Be 1'),
    date: Yup.string().required('Date is required'),
    author: Yup.string().required('Author is required'),
    reason: Yup.string().required('Reason is required'),
    change: Yup.string().required('Change is required'),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      console.info('DATA', formData);
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
                    <RHFSelect name="isActive" label="Status" disabled>
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
                <RHFTextField name="revision" label="Revision No" type="number" disabled />
              </Grid>

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
                      disabled
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="author" label="Author" disabled />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="reason" label="Reason" disabled />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="change" label="Change" disabled />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

RevisionHistoryViewForm.propTypes = {
  currentRevisionHistory: PropTypes.object,
};
