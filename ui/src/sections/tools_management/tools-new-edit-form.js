/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {  useEffect, useMemo, useState } from 'react';
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
import FormProvider, {
  RHFTextField,
  RHFSelect,
} from 'src/components/hook-form';
import {  IconButton, InputAdornment, MenuItem, TextField } from '@mui/material';
import axiosInstance from 'src/utils/axios';
import Iconify from 'src/components/iconify';
import { DatePicker } from '@mui/x-date-pickers';
// ----------------------------------------------------------------------

export default function ToolsNewEditForm({ currentTool, toolTypeData, supplierData, manufacturerData, storageLocationData }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [allowEdit, setAllowEdit] = useState(false);
  const booleanOptions = [
    {label: 'Yes', value: 'true'},
    {label: 'No', value: 'false'}
  ];
  const statusOptions = [
    { value: true, label: 'Active' },
    { value: false, label: 'In-Active' },
  ]

  useEffect(() => {
    if(currentTool){
      setAllowEdit(true);
    }
  }, [currentTool])

  const NewToolSchema = Yup.object().shape({
    partNumber: Yup.string().required('Part Number is required'),
    modelNumber: Yup.string().required('Model Number is required'),
    description: Yup.string().required('Description is required'),
    productionMeans : Yup.string().required('Production Means is required'),
    quantity: Yup.number()
    .nullable()  
    .transform((value, originalValue) => (originalValue === '' ? null : value)) 
    .required('Quantity is required')
    .min(1, 'Quantity must be at least 1'),
    serialNumber: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .required('Serial Number is required')
    .min(1, 'Serial Number must be at least 1'),
    toolType: Yup.number().nullable().transform((value, originalValue) => (originalValue === '' ? null : value)).required('Tool type is required'),
    supplier: Yup.number().nullable().transform((value, originalValue) => (originalValue === '' ? null : value)).required('Supplier is required'),
    manufacturer: Yup.number().nullable().transform((value, originalValue) => (originalValue === '' ? null : value)).required('Manufacturer is required'),
    manufacturingDate: Yup.string().required('Manufacturing Date is required'),
    storageLocation: Yup.number().nullable().transform((value, originalValue) => (originalValue === '' ? null : value)).required('Storage Location is required'),
    spareList: Yup.string(),
    calibration: Yup.string(),
    technicalDrawing: Yup.string(), 
    isMaintainancePlanNeeded: Yup.boolean(),
    individualManagement: Yup.boolean(),
    designation: Yup.string(),
    criticalLevel: Yup.string(),
    toolFamily: Yup.string(),
    installationChecklist: Yup.boolean(),
    assetNumber: Yup.string(),
    isActive: Yup.boolean(),
  });

  console.log(currentTool);

  const defaultValues = useMemo(
    () => ({
      partNumber: currentTool?.partNumber || '',
      modelNumber: currentTool?.modelNumber || '',
      description: currentTool?.description || '',
      quantity: currentTool?.quantity || '', 
      serialNumber: currentTool?.meanSerialNumber || '', 
      toolType: currentTool?.toolTypeId || '',
      productionMeans: currentTool?.productionMeans || '',
      supplier: currentTool?.supplierId || '',
      manufacturer: currentTool?.manufacturerId || '',
      manufacturingDate: currentTool?.manufacturingDate || '',
      storageLocation: currentTool?.storageLocationId || '',
      spareList: currentTool?.spareList || '',
      calibration: currentTool?.calibration || '',
      technicalDrawing: currentTool?.technicalDrawing || '',
      isMaintainancePlanNeeded: currentTool?.isMaintaincePlanNeeded || false, 
      individualManagement: currentTool?.individualManagement || false,
      designation: currentTool?.designation || '',
      criticalLevel: currentTool?.criticalLevel || '',
      toolFamily: currentTool?.toolFamily || '',
      installationChecklist: currentTool?.installationChecklist || false,
      assetNumber: currentTool?.assetNumber || '',
      isActive: currentTool?.isActive || false,
    }),
    [currentTool]
  );
  

  const methods = useForm({
    resolver: yupResolver(NewToolSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  console.log(errors);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const inputData = {
        partNumber: formData.partNumber,
        modelNumber: formData.modelNumber,
        meanSerialNumber: formData.serialNumber,
        description: formData.description,
        quantity: formData.quantity,
        balanceQuantity: formData.quantity,
        toolTypeId: formData.toolType,
        supplierId: formData.supplier,
        manufacturerId: formData.manufacturer,
        manufacturingDate: formData.manufacturingDate,
        storageLocationId: formData.storageLocation,
        productionMeans: formData.productionMeans,
        designation: formData.designation,
        isActive: false,
        installationStatus : 'pending',
        internalValidationStatus : 'pending',
      };

      if(currentTool){
        inputData.calibration = formData.calibration;
        inputData.individualManagement = formData.individualManagement;
        inputData.isMaintainancePlanNeeded = formData.isMaintainancePlanNeeded;
        inputData.installationChecklist = formData.installationChecklist;
        inputData.assetNumber = formData.assetNumber;
        inputData.criticalLevel = formData.criticalLevel;
        inputData.toolFamily = formData.toolFamily;
        inputData.spareList = formData.spareList;
        inputData.technicalDrawing = formData.technicalDrawing;
        inputData.isActive = formData.isActive;
      }

      if (!currentTool) {
        await axiosInstance.post('/tools/create', inputData);
      } else {
        await axiosInstance.patch(`/tools/update/${currentTool.id}`, inputData);
      }
      reset();
      enqueueSnackbar(currentTool ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.tools.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
    }
  });

  useEffect(() => {
    if (currentTool) {
      reset(defaultValues);
    }
  }, [currentTool, defaultValues, reset]);

  console.log('tooltypeData', toolTypeData);

  const onSearch = async (partNumber) => {
    try{
      const response = await axiosInstance.post('/tools/search-tool', {partNumber});

      if(response?.data?.success){
        setValue('modelNumber', response?.data?.data?.modelNumber);
        setValue('toolType', toolTypeData?.find((toolType) => toolType.id === Number(response?.data?.data?.toolTypeId))?.id || undefined, { shouldValidate: true });
        setValue('description', response?.data?.data?.description);
        setValue('serialNumber', Number(response?.data?.data?.meanSerialNumber) + 1, { shouldValidate: true });
        setValue('supplier', supplierData?.find((supplier) => supplier.id === Number(response?.data?.data?.supplierId))?.id || undefined, { shouldValidate: true });
        setValue('manufacturer', manufacturerData?.find((manufacturer) => manufacturer.id === Number(response?.data?.data?.manufacturerId))?.id || undefined, { shouldValidate: true });
        setValue('storageLocation', storageLocationData?.find((location) => location.id === Number(response?.data?.data?.storageLocationId))?.id || undefined, { shouldValidate: true });
        setValue('productionMeans', response?.data?.data?.productionMeans);
        setAllowEdit(true);
        enqueueSnackbar('Tool with same part number found',{variant : 'success'});
      }else{
        setValue('serialNumber', 1);
        setAllowEdit(true);
        enqueueSnackbar('No tool found with same part number found, you can create new one',{variant : 'info'});
      }
    }catch(error){
      console.error(error);
    }
  }

  useEffect(() => {
    if (allowEdit && !currentTool) {
      reset(defaultValues);
      setAllowEdit(false);  
    }
  }, [values.partNumber]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {currentTool && (
                <>
                  <Grid item xs={12} sm={6}>
                    <RHFSelect name="isActive" label="Status">
                      {statusOptions.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          {status.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Grid>
                  <Grid item xs={12} sm={6} />
                </>
              )}

              {/* <Grid item xs={12} sm={6}>
                <RHFTextField name="partNumber" label="Tool Part Number" />
              </Grid> */}

              {!currentTool ? 
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="partNumber"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Tool Part Number"
                        fullWidth
                        variant="outlined"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            onSearch(field.value); // Search when Enter is pressed
                          }
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => onSearch(field.value)} edge="end">
                                <Iconify icon="mdi:magnify" />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        error={!!error}
                        helperText={error && error?.message}
                      />
                    )}
                  />
                </Grid> : 
                <Grid item xs={12} sm={6}>
                  <RHFTextField name="partNumber" label="Tool Part Number" disabled={!allowEdit} />
                </Grid>
              }

              <Grid item xs={12} sm={6}>
                <RHFTextField name="modelNumber" label="Tool Model Number" disabled={!allowEdit} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="description" label="Description" disabled={!allowEdit} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField type='number' name="quantity" label="Qunatity" disabled={!allowEdit} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField type='number' name="serialNumber" label="Mean Serial Number" disabled />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFSelect name="toolType" label="Tool Type" disabled={!allowEdit} >
                  {toolTypeData?.length > 0 ? toolTypeData?.map((toolType) => (
                    <MenuItem key={toolType?.id} value={toolType?.id}>{toolType?.toolType}</MenuItem>
                  )) : (
                    <MenuItem disabled value=''>No Tool Types Found</MenuItem>
                  )}
                </ RHFSelect>
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="productionMeans" label="Production Means" disabled={!allowEdit} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFSelect name="supplier" label="Supplier" disabled={!allowEdit} >
                  {supplierData?.length > 0 ? supplierData?.map((supplier) => (
                    <MenuItem key={supplier?.id} value={supplier?.id}>{supplier?.supplier}</MenuItem>
                  )) : (
                    <MenuItem disabled value=''>No Suppliers Found</MenuItem>
                  )}
                </ RHFSelect>
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFSelect name="manufacturer" label="Manufacturer" disabled={!allowEdit} >
                  {manufacturerData?.length > 0 ? manufacturerData?.map((manufacturer) => (
                    <MenuItem key={manufacturer?.id} value={manufacturer?.id}>{manufacturer?.manufacturer}</MenuItem>
                  )) : (
                    <MenuItem disabled value=''>No Manufacturer Found</MenuItem>
                  )}
                </ RHFSelect>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="manufacturingDate"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label="Manufacturing Date"
                      value={field.value ? new Date(field.value) : null} 
                      onChange={(newValue) =>
                        field.onChange(newValue ? newValue.toISOString() : null)
                      }
                      disabled={!allowEdit}
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
                <RHFSelect name="storageLocation" label="Storage Location" disabled={!allowEdit} >
                  {storageLocationData?.length > 0 ? storageLocationData?.map((location) => (
                    <MenuItem key={location?.id} value={location?.id}>{location?.location}</MenuItem>
                  )) : (
                    <MenuItem disabled value=''>No Locations Found</MenuItem>
                  )}
                </ RHFSelect>
              </Grid>

              {currentTool && (
                <>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="spareList" label="Spare List" disabled={!allowEdit} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="calibration" label="Calibration" disabled={!allowEdit} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="technicalDrawing" label="Technical Drawing" disabled={!allowEdit} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="assetNumber" label="Asset Number" disabled={!allowEdit} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <RHFSelect name="isMaintainancePlanNeeded" label="Maintainance Plan" disabled={!allowEdit} >
                      {booleanOptions?.length > 0 ? booleanOptions?.map((opt) => (
                        <MenuItem key={opt?.value} value={opt?.value}>{opt?.label}</MenuItem>
                      )) : (
                        <MenuItem disabled value=''>No Options Found</MenuItem>
                      )}
                    </ RHFSelect>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <RHFSelect name="individualManagement" label="Individual Management" disabled={!allowEdit} >
                      {booleanOptions?.length > 0 ? booleanOptions?.map((opt) => (
                        <MenuItem key={opt?.value} value={opt?.value}>{opt?.label}</MenuItem>
                      )) : (
                        <MenuItem disabled value=''>No Options Found</MenuItem>
                      )}
                    </ RHFSelect>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="designation" label="Designation" disabled={!allowEdit} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="criticalLevel" label="Critical Level" disabled={!allowEdit} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="toolFamily" label="Tool Family" disabled={!allowEdit} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <RHFSelect name="installationChecklist" label="Installation Checklist" disabled={!allowEdit} >
                      {booleanOptions?.length > 0 ? booleanOptions?.map((opt) => (
                        <MenuItem key={opt?.value} value={opt?.value}>{opt?.label}</MenuItem>
                      )) : (
                        <MenuItem disabled value=''>No Options Found</MenuItem>
                      )}
                    </ RHFSelect>
                  </Grid>
                </>
              )}
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentTool ? 'Create Tool' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

ToolsNewEditForm.propTypes = {
  currentTool: PropTypes.object,
  toolTypeData: PropTypes.array,
  supplierData: PropTypes.array,
  manufacturerData: PropTypes.array,
  storageLocationData: PropTypes.array,
};
