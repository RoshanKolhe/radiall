import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
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
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import { Typography } from '@mui/material';
import axiosInstance from 'src/utils/axios';
// ----------------------------------------------------------------------

export default function InventoryNewEditForm({ currentInventory }) {
  const router = useRouter();
  const [toolOptions, setToolOptions] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const NewInventorySchema = Yup.object().shape({
    moPartNumber: Yup.object().required('Mo Part Number is required'),
    serialNumber: Yup.string().required('Serial Number is required'),
    moNumber: Yup.string().required('MO Number is required'),
    moQuantity: Yup.string().required('MO Quantity is required'),
    description: Yup.string(),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      moPartNumber: currentInventory?.tools || '',
      serialNumber: currentInventory?.serialNumber || '',
      moNumber: currentInventory?.moNumber || '',
      moQuantity: currentInventory?.moQuantity || '',
      description: currentInventory?.description || '',
      isActive: currentInventory?.isActive ? '1' : '0' || '1',
    }),
    [currentInventory]
  );

  const methods = useForm({
    resolver: yupResolver(NewInventorySchema),
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

  const partNumber = watch('moPartNumber');

  const fetchTools = async (event) => {
    try {
      if (event && event?.target?.value && event.target.value.length >= 3) {
        const filter = {
          where: {
            or: [
              { partNumber: { like: `%${event.target.value}%` } },
              { modelNumber: { like: `%${event.target.value}%` } },
            ],
          },
        };
        const filterString = encodeURIComponent(JSON.stringify(filter));
        const { data } = await axiosInstance.get(`/tools/list?filter=${filterString}`);
        setToolOptions(data?.data || []);
        console.log(data);
      } else {
        setToolOptions([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = handleSubmit(async (formData) => {
    try {
      console.info('DATA', formData);

      const inputData = {
        inventory: formData.inventory,
        description: formData.description,
        isActive: currentInventory ? formData.isActive : true,
      };

      if (!currentInventory) {
        await axiosInstance.post('/inventorys', inputData);
      } else {
        await axiosInstance.patch(`/inventorys/${currentInventory.id}`, inputData);
      }
      reset();
      enqueueSnackbar(currentInventory ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.inventory.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
    }
  });

  useEffect(() => {
    console.log(partNumber);
    if (partNumber) {
      setValue('serialNumber', partNumber.meanSerialNumber);
    }
  }, [partNumber, setValue]);

  useEffect(() => {
    if (currentInventory) {
      reset(defaultValues);
    }
  }, [currentInventory, defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <RHFAutocomplete
                  name="moPartNumber"
                  label="MO Part Number"
                  onInputChange={(event) => fetchTools(event)}
                  options={toolOptions}
                  getOptionLabel={(option) => `${option?.partNumber}` || ''}
                  filterOptions={(x) => x}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <div>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {`${option?.partNumber}`}
                        </Typography>
                        <Typography variant="subtitle2">
                          {`Serial No: ${option?.meanSerialNumber}`}
                        </Typography>
                      </div>
                    </li>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} />

              <Grid item xs={12} sm={6}>
                <RHFTextField name="serialNumber" label="Mean Serial No" disabled />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="moNumber" label="Mo Number" disabled />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="moQuantity" label="Mo Quantity" disabled />
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentInventory ? 'Create Inventory' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

InventoryNewEditForm.propTypes = {
  currentInventory: PropTypes.object,
};
