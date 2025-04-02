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

// ----------------------------------------------------------------------

export default function InventoryViewForm({ currentInventory }) {
  const NewInventorySchema = Yup.object().shape({
    inventory: Yup.string().required('Tool Type is required'),
    description: Yup.string(),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      inventory: currentInventory?.inventory || '',
      description: currentInventory?.description || '',
      isActive: currentInventory?.isActive ? '1' : '0' || '1',
    }),
    [currentInventory]
  );

  const methods = useForm({
    resolver: yupResolver(NewInventorySchema),
    defaultValues,
  });

  const { reset, watch } = methods;

  const values = watch();
  useEffect(() => {
    if (currentInventory) {
      reset(defaultValues);
    }
  }, [currentInventory, defaultValues, reset]);

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {currentInventory && (
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
                <RHFTextField name="inventory" label="Tool Type" disabled />
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

InventoryViewForm.propTypes = {
  currentInventory: PropTypes.object,
};
