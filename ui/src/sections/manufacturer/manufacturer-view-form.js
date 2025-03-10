import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
// components
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import { MenuItem } from '@mui/material';
import { COMMON_STATUS_OPTIONS } from 'src/utils/constants';
import { useGetDepartments } from 'src/api/department';

// ----------------------------------------------------------------------

export default function ManufacturerViewForm({ currentManufacturer }) {

  const { departments, departmentsLoading, departmentsEmpty, refreshDepartments } =
    useGetDepartments();


  const NewManufacturerSchema = Yup.object().shape({
    manufacturer: Yup.string().required('Tool Type is required'),
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
  useEffect(() => {
    if (currentManufacturer) {
      reset(defaultValues);
    }
  }, [currentManufacturer, defaultValues, reset]);

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {currentManufacturer && (
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
                <RHFTextField name="manufacturer" label="Tool Type" disabled />
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

ManufacturerViewForm.propTypes = {
  currentManufacturer: PropTypes.object,
};
