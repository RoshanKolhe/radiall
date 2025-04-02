import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
// components
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { Box, Stack, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import axiosInstance from 'src/utils/axios';
import { useSnackbar } from 'notistack';
import InventoryOutToolsModal from './inventory-out-tools-modal';

// ----------------------------------------------------------------------

const toolColumns = [
  { field: 'partNumber', label: 'Tool Part Number' },
  { field: 'meanSerialNumber', label: 'Serial Number' },
];

export default function InventoryInEntryForm({ currentInventory }) {
  const { enqueueSnackbar } = useSnackbar();
  const [userOptions, setUserOptions] = useState([]);
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);

  const handleCloseToolModal = () => setIsToolModalOpen(false);
  const handleOpenToolModal = () => setIsToolModalOpen(true);

  const NewInventorySchema = Yup.object().shape({
    returnDate: Yup.string().required('Return Date is Required'),
    quantity: Yup.number()
      .required('Quantity is Required')
      .min(1, 'Quantity should be greater than 0'),
    receivedFrom: Yup.object().required('Received From is Required'),
    receivedBy: Yup.object().required('Received By is Required'),
    remark: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      returnDate: '',
      quantity: 0,
      receivedFrom: null,
      receivedBy: null,
      remark: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewInventorySchema),
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
      console.log(currentInventory.tools.length);
      if (formData.quantity > currentInventory.tools.length) {
        enqueueSnackbar(`Quantity cannot exceed ${currentInventory.tools.length}`, {
          variant: 'error',
        });

        return;
      }
      console.log(formData);
      handleOpenToolModal();
    } catch (error) {
      console.error(error);
    }
  });

  const fetchUsers = async (event) => {
    try {
      if (event && event?.target?.value && event.target.value.length >= 3) {
        const filter = {
          where: {
            or: [
              { email: { like: `%${event.target.value}%` } },
              { firstName: { like: `%${event.target.value}%` } },
              { lastName: { like: `%${event.target.value}%` } },
            ],
          },
        };
        const filterString = encodeURIComponent(JSON.stringify(filter));
        const { data } = await axiosInstance.get(`/api/users/list?filter=${filterString}`);
        setUserOptions(data);
      } else {
        setUserOptions([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitInIntry = async (selectedIds) => {
    console.log(selectedIds, values);
    try {
      if (values.quantity !== selectedIds.length) {
        enqueueSnackbar(`Please select only ${values.quantity} tools`, {
          variant: 'error',
        });
        return;
      }
      const inputData = {
        inventoryInEntries: {
          quantity: values.quantity,
          returnDate: new Date(values.returnDate).toISOString(),
          status: 1,
          remark: values.remark,
          inventoryOutEntriesId: currentInventory.id,
          receivedFrom: values?.receivedFrom.id,
          returnBy: values?.receivedBy?.id,
        },
        toolsIds: selectedIds,
      };
      await axiosInstance.post(`/inventory-in-entries`, inputData);
      reset();
      enqueueSnackbar('In Entry Submitted Successfully!');
      handleCloseToolModal();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    if (currentInventory) {
      reset(defaultValues);
    }
  }, [currentInventory, defaultValues, reset]);

  return (
    <>
      {currentInventory && (
        <Card sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} display="flex" alignItems="center">
              <Typography variant="subtitle2" sx={{ mr: 1 }}>
                MO Part Number:
              </Typography>
              <Typography variant="body1">{currentInventory?.tools?.partNumber || 'NA'}</Typography>
            </Grid>

            <Grid item xs={12} sm={4} display="flex" alignItems="center">
              <Typography variant="subtitle2" sx={{ mr: 1 }}>
                Manufacturer:
              </Typography>
              <Typography variant="body1">
                {currentInventory?.tools?.manufacturer?.manufacturer || 'NA'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4} display="flex" alignItems="center">
              <Typography variant="subtitle2" sx={{ mr: 1 }}>
                Serial Number:
              </Typography>
              <Typography variant="body1">{currentInventory?.serialNumber || 'NA'}</Typography>
            </Grid>

            <Grid item xs={12} sm={4} display="flex" alignItems="center">
              <Typography variant="subtitle2" sx={{ mr: 1 }}>
                Supplier:
              </Typography>
              <Typography variant="body1">
                {currentInventory?.tools?.supplier?.supplier || 'NA'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4} display="flex" alignItems="center">
              <Typography variant="subtitle2" sx={{ mr: 1 }}>
                MO Number:
              </Typography>
              <Typography variant="body1">{currentInventory?.moNumber || 'NA'}</Typography>
            </Grid>

            <Grid item xs={12} sm={4} display="flex" alignItems="center">
              <Typography variant="subtitle2" sx={{ mr: 1 }}>
                MO Quantity:
              </Typography>
              <Typography variant="body1">{currentInventory?.moQuantity || 'NA'}</Typography>
            </Grid>

            <Grid item xs={12} sm={4} display="flex" alignItems="center">
              <Typography variant="subtitle2" sx={{ mr: 1 }}>
                Issued Date Time:
              </Typography>
              <Typography variant="body1">{`${format(
                new Date(currentInventory?.issuedDate),
                'dd MMM yyyy'
              )}`}</Typography>
            </Grid>
          </Grid>
        </Card>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3, mt: 2 }}>
              <Grid item xs={12} md={12}>
                <Grid container spacing={1}>
                  <Grid item xs={6} md={8} display="flex" alignItems="center">
                    Return Date
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Controller
                      name="returnDate"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
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
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={6} md={8} display="flex" alignItems="center">
                    Quantity
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <RHFTextField name="quantity" type="number" fullWidth />
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={6} md={8} display="flex" alignItems="center">
                    Received From
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <RHFAutocomplete
                      name="receivedFrom"
                      onInputChange={(event) => fetchUsers(event)}
                      options={userOptions}
                      getOptionLabel={(option) => `${option?.firstName} ${option?.lastName}` || ''}
                      filterOptions={(x) => x}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                        <li {...props}>
                          <div>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {`${option?.firstName} ${option?.lastName}`}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {option.email}
                            </Typography>
                          </div>
                        </li>
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={6} md={8} display="flex" alignItems="center">
                    Return By
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <RHFAutocomplete
                      name="receivedBy"
                      onInputChange={(event) => fetchUsers(event)}
                      options={userOptions}
                      getOptionLabel={(option) => `${option?.firstName} ${option?.lastName}` || ''}
                      filterOptions={(x) => x}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                        <li {...props}>
                          <div>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {`${option?.firstName} ${option?.lastName}`}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {option.email}
                            </Typography>
                          </div>
                        </li>
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={6} md={8} display="flex" alignItems="center">
                    Remark
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <TextField fullWidth />
                  </Grid>
                </Grid>
                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <LoadingButton type="submit " variant="contained" loading={isSubmitting}>
                      Save
                    </LoadingButton>
                  </Box>
                </Stack>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>

      <InventoryOutToolsModal
        data={currentInventory?.tools}
        open={isToolModalOpen}
        onClose={handleCloseToolModal}
        mode="select"
        columns={toolColumns}
        onSave={(selectedIds) => handleSubmitInIntry(selectedIds)}
      />
    </>
  );
}

InventoryInEntryForm.propTypes = {
  currentInventory: PropTypes.object,
};
