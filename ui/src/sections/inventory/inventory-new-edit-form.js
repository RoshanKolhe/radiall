/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import { DatePicker } from '@mui/x-date-pickers';
import { useAuthContext } from 'src/auth/hooks';
import InventoryOutEntries from './inventory-out-entries-table';
// ----------------------------------------------------------------------

export default function InventoryNewEditForm({ currentInventory }) {
  const { user } = useAuthContext();
  const [userOptions, setUserOptions] = useState([]);
  const [issuedByUserOptions, setIssuedByUserOptions] = useState([]);
  const [inventoryEntries, setInventoryEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [outEntrySubmitLoading, setOutEntrySubmitLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const NewInventorySchema = Yup.object().shape({
    toolPartNumber: Yup.string().required('Tool Part Number is required'),
    moPartNumber: Yup.string().required('MO Part Number is required'),
    moNumber: Yup.number().min(1, 'Value must be greater than 0').required('MO Number is required'),
    moQuantity: Yup.number()
      .min(1, 'Value must be greater than 0')
      .required('MO Quantity is required'),
    requiredDays: Yup.number()
      .min(1, 'Value must be greater than 0')
      .required('Required Days is required'),
    issuedDate: Yup.string().required('Issued Date is required'),
    issuedTo: Yup.object().required('Issued To is required'),
    issuedBy: Yup.object().required('Issued By is required'),
    department: Yup.string().required('Department is required'),
  });

  const defaultValues = useMemo(
    () => ({
      toolPartNumber: currentInventory?.tools || '',
      moPartNumber: currentInventory?.moPartNumber || '',
      moNumber: currentInventory?.moNumber || 0,
      moQuantity: currentInventory?.moQuantity || 0,
      requiredDays: currentInventory?.requiredDays || 0,
      issuedTo: currentInventory?.issuedTo || null,
      issuedBy: currentInventory?.issuedBy || null,
      department: currentInventory?.department || '',
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

  const issuedTo = watch('issuedTo');
  const handleEdit = (entry) => {
    setEditingEntry(entry);
    reset({
      toolPartNumber: entry.toolPartNumber || '',
      moPartNumber: entry.moPartNumber || '',
      moNumber: entry.moNumber || '',
      moQuantity: entry.moQuantity || 0,
      requiredDays: entry.requiredDays || 0,
      issuedDate: entry.issuedDate || '',
      issuedTo: entry.issuedTo || null,
      issuedBy: entry.issuedBy || null,
      department: entry.department,
    });
  };

  const handleDelete = (id) => {
    setInventoryEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

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

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const { toolPartNumber, moQuantity, moPartNumber, moNumber, issuedBy } = formData;

      const { data } = await axiosInstance.post('/tools/available-serials', {
        partNumber: toolPartNumber,
        quantity: moQuantity,
      });

      if (!data.length) {
        enqueueSnackbar(`Only ${data.length} tools available for part number ${toolPartNumber}.`, {
          variant: 'error',
        });
        return;
      }

      setInventoryEntries((prev) => [
        ...prev,
        {
          ...formData,
          id: Date.now(),
          serials: data,
        },
      ]);

      reset({
        toolPartNumber: '',
        moQuantity: 0,
        requiredDays: 0,
        issuedDate: '',
        issuedTo: null,
        department: '',
        moPartNumber, // Retaining the value
        moNumber, // Retaining the value
        issuedBy, // Retaining the value
      });

      setEditingEntry(null);
      enqueueSnackbar(editingEntry ? 'Entry updated successfully!' : 'Entry added successfully!');
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
    }
  });

  const submitInventoryOutEntry = async () => {
    console.log('here', inventoryEntries);
    setOutEntrySubmitLoading(true);
    try {
      const inputData = inventoryEntries.map(({ serials, ...rest }) => ({
        ...rest,
        issuedBy: rest.issuedBy.id,
        issuedTo: rest.issuedTo.id,
        issuedDate: new Date(rest.issuedDate).toISOString(),
        tools: serials?.map((serial) => serial.toolId) || [],
      }));

      console.log(inputData);
      await axiosInstance.post(`/inventory-out-entries`, inputData);
      enqueueSnackbar('Out Entry Created Successfully');
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
    } finally {
      setOutEntrySubmitLoading(false);
    }
  };

  useEffect(() => {
    if (issuedTo) {
      setValue('department', issuedTo?.department?.name);
    } else {
      setValue('department', '');
    }
  }, [issuedTo, setValue]);

  useEffect(() => {
    if (user) {
      console.log(user);
      setIssuedByUserOptions([user]);
      setValue('issuedBy', user);
    }
  }, [setValue, user]);

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <RHFTextField name="toolPartNumber" label="Tool Part Number" />
                </Grid>
                <Grid item xs={12} sm={6} />

                <Grid item xs={12} sm={6}>
                  <RHFTextField
                    name="moPartNumber"
                    label="Mo Part Number"
                    disabled={inventoryEntries.length > 0}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <RHFTextField
                    name="moNumber"
                    label="Mo Number"
                    type="number"
                    disabled={inventoryEntries.length > 0}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <RHFTextField name="moQuantity" label="Mo Quantity" type="number" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="issuedDate"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        label="Issued Date"
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
                  <RHFTextField name="requiredDays" label="Required Days" type="number" />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <RHFAutocomplete
                    name="issuedTo"
                    label="Issued To"
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
                <Grid item xs={12} sm={6}>
                  <RHFTextField name="department" label="Department" disabled />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFAutocomplete
                    name="issuedBy"
                    label="Issued By"
                    options={issuedByUserOptions}
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
                    disabled
                  />
                </Grid>
              </Grid>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {editingEntry ? 'Update' : 'Add'}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
      <InventoryOutEntries
        inventoryOutEntries={inventoryEntries}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Stack alignItems="flex-end" sx={{ mt: 3 }}>
        <LoadingButton
          type="button"
          variant="contained"
          loading={outEntrySubmitLoading}
          onClick={submitInventoryOutEntry}
        >
          Save
        </LoadingButton>
      </Stack>
    </>
  );
}

InventoryNewEditForm.propTypes = {
  currentInventory: PropTypes.object,
};
