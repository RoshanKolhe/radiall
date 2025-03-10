import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
// utils
import { fData } from 'src/utils/format-number';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// assets
import { countries } from 'src/assets/data';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
  RHFSelect,
} from 'src/components/hook-form';
import { IconButton, InputAdornment, MenuItem } from '@mui/material';
import { COMMON_STATUS_OPTIONS, states } from 'src/utils/constants';
import axiosInstance from 'src/utils/axios';
import { useBoolean } from 'src/hooks/use-boolean';
import { useGetDepartments } from 'src/api/department';

// ----------------------------------------------------------------------

export default function ToolTypeViewForm({ currentToolType }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { departments, departmentsLoading, departmentsEmpty, refreshDepartments } =
    useGetDepartments();

  const password = useBoolean();

  const NewToolTypeSchema = Yup.object().shape({
    toolType: Yup.string().required('Tool Type is required'),
    description: Yup.string(),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      toolType: currentToolType?.toolType || '',
      description: currentToolType?.description || '',
      isActive: currentToolType?.isActive ? '1' : '0' || '1',
    }),
    [currentToolType]
  );

  const methods = useForm({
    resolver: yupResolver(NewToolTypeSchema),
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
  useEffect(() => {
    if (currentToolType) {
      reset(defaultValues);
    }
  }, [currentToolType, defaultValues, reset]);

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {currentToolType && (
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
                <RHFTextField name="toolType" label="Tool Type" disabled />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="description" label="Description" disabled />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

ToolTypeViewForm.propTypes = {
  currentToolType: PropTypes.object,
};
