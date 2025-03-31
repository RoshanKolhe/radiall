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

export default function ToolsDepartmentNewEditForm({ currentToolDepartment }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewToolDepartmentSchema = Yup.object().shape({
    toolDepartment: Yup.string().required('Storage Location is required'),
    description: Yup.string(),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      toolDepartment: currentToolDepartment?.location || '',
      description: currentToolDepartment?.description || '',
      isActive: currentToolDepartment?.isActive ? '1' : '0' || '1',
    }),
    [currentToolDepartment]
  );

  const methods = useForm({
    resolver: yupResolver(NewToolDepartmentSchema),
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
        toolDepartment: formData.toolDepartment,
        description: formData.description,
        isActive: currentToolDepartment ? formData.isActive : true,
      };

      if (!currentToolDepartment) {
        await axiosInstance.post('/tools-departments', inputData);
      } else {
        await axiosInstance.patch(`/tools-departments/${currentToolDepartment.id}`, inputData);
      }
      reset();
      enqueueSnackbar(currentToolDepartment ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.toolsDepartment.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
    }
  });

  useEffect(() => {
    if (currentToolDepartment) {
      reset(defaultValues);
    }
  }, [currentToolDepartment, defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {currentToolDepartment && (
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
                <RHFTextField name="toolDepartment" label="Tool Department" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="description" label="Description" />
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentToolDepartment ? 'Create Tool Department' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

ToolsDepartmentNewEditForm.propTypes = {
  currentToolDepartment: PropTypes.object,
};
