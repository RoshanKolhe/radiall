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
  RHFAutocomplete,
} from 'src/components/hook-form';
import {  IconButton, InputAdornment, MenuItem, TextField, Typography } from '@mui/material';
import axiosInstance from 'src/utils/axios';
import Iconify from 'src/components/iconify';
import { DatePicker } from '@mui/x-date-pickers';
import { useGetToolTypes } from 'src/api/toolType';
import { useGetManufacturers } from 'src/api/manufacturer';
import { useGetSuppliers } from 'src/api/supplier';
import { useGetStorageLocations } from 'src/api/storageLocation';
// ----------------------------------------------------------------------

export default function ToolsNewEditForm({ currentTool }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [allowEdit, setAllowEdit] = useState(false);
  const [ toolTypeData, setToolTypeData ] = useState([]); 
  const [ supplierData, setSupplierData ] = useState([]);
  const [ manufacturersData, setManufacturersData ] = useState([]); 
  const [ storageLocationsData, setStorageLocationsData ] = useState([]);
  const { toolTypes, toolTypesEmpty } = useGetToolTypes();
  const { manufacturers, manufacturersEmpty } = useGetManufacturers();
  const { suppliers, suppliersEmpty } = useGetSuppliers();
  const { storageLocations, storageLocationsEmpty } = useGetStorageLocations();
  const booleanOptions = [
    {label: 'Yes', value: 'true'},
    {label: 'No', value: 'false'}
  ];
  const statusOptions = [
    { value: true, label: 'Active' },
    { value: false, label: 'Non-Active' },
  ];

  useEffect(() => {
    if (toolTypes && !toolTypesEmpty) {
      setToolTypeData(toolTypes);
    }
  }, [toolTypes, toolTypesEmpty]);

  useEffect(() => {
    if (suppliers && !suppliersEmpty) {
      setSupplierData(suppliers);
    }
  }, [suppliers, suppliersEmpty]);

  useEffect(() => {
    if (manufacturers && !manufacturersEmpty) {
      setManufacturersData(manufacturers);
    }
  }, [manufacturers, manufacturersEmpty]);

  useEffect(() => {
    if (storageLocations && !storageLocationsEmpty) {
      setStorageLocationsData(storageLocations);
    }
  }, [storageLocations, storageLocationsEmpty]);

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
    serialNumber: Yup.string()
    .required('Serial Number is required'),
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

  const defaultValues = useMemo(
    () => ({
      partNumber: currentTool?.partNumber || '',
      modelNumber: currentTool?.modelNumber || '',
      description: currentTool?.description || '',
      quantity: currentTool?.quantity || 1, 
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
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const inputData = {
        partNumber: formData.partNumber,
        modelNumber: formData.modelNumber,
        meanSerialNumber: formData?.serialNumber?.replace(/\(\s*/g, "(").replace(/\s*,\s*/g, ",").trim(),
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
        isActive: formData?.isActive || false,
        status: formData?.isActive === true ? 'Operational' : 'Non-Operational',
        installationStatus : 'pending',
        internalValidationStatus : 'pending',
      };

      if(currentTool){
        inputData.calibration = formData.calibration;
        inputData.individualManagement = formData.individualManagement;
        inputData.isMaintaincePlanNeeded = formData.isMaintainancePlanNeeded;
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

  const onSearch = async (partNumber) => {
    try{
      if(partNumber === undefined || partNumber === null || partNumber === ''){
        enqueueSnackbar('Please Enter Part number to search',{variant : 'error'});
        return;
      }
      const response = await axiosInstance.post('/tools/search-tool', {partNumber});

      if(response?.data?.success){
        setValue('modelNumber', response?.data?.data?.modelNumber);
        setValue('toolType', toolTypeData?.find((toolType) => toolType.id === Number(response?.data?.data?.toolTypeId))?.id || undefined, { shouldValidate: true });
        setValue('description', response?.data?.data?.description);
        // setValue('serialNumber', response?.data?.data?.meanSerialNumber, { shouldValidate: true });  // removing + 1
        setValue('supplier', supplierData?.find((supplier) => supplier.id === Number(response?.data?.data?.supplierId))?.id || undefined, { shouldValidate: true });
        setValue('manufacturer', manufacturersData?.find((manufacturer) => manufacturer.id === Number(response?.data?.data?.manufacturerId))?.id || undefined, { shouldValidate: true });
        setValue('storageLocation', storageLocationsData?.find((location) => location.id === Number(response?.data?.data?.storageLocationId))?.id || undefined, { shouldValidate: true });
        setValue('productionMeans', response?.data?.data?.productionMeans);
        setAllowEdit(true);
        enqueueSnackbar('Tool with same part number found',{variant : 'success'});
      }else{
        // setValue('serialNumber', 1);
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
        <Grid item="true" xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {currentTool && (
                <>
                  <Grid item="true" xs={12} sm={6}>
                    <RHFSelect name="isActive" label="Status">
                      {statusOptions.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          {status.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Grid>
                  <Grid item="true" xs={12} sm={6} />
                </>
              )}

              {/* <Grid item xs={12} sm={6}>
                <RHFTextField name="partNumber" label="Tool Part Number" />
              </Grid> */}

              {!currentTool ? 
                <Grid item="true" xs={12} sm={6}>
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
                <Grid item="true" xs={12} sm={6}>
                  <RHFTextField name="partNumber" label="Tool Part Number" disabled={!allowEdit} />
                </Grid>
              }

              <Grid item="true" xs={12} sm={6}>
                <RHFTextField name="modelNumber" label="Tool Model Number" disabled={!allowEdit} />
              </Grid>

              <Grid item="true" xs={12} sm={6}>
                <RHFTextField name="description" label="Description" disabled={!allowEdit} />
              </Grid>

              <Grid item="true" xs={12} sm={6}>
                <RHFTextField type='number' name="quantity" label="Qunatity" disabled />
              </Grid>

              <Grid item="true" xs={12} sm={6}>
                <RHFTextField name="serialNumber" label="Mean Serial Number" disabled={!allowEdit} />
              </Grid>

              {/* <Grid item="true" xs={12} sm={6}>
                <RHFSelect name="toolType" label="Tool Type" disabled={!allowEdit} >
                  {toolTypeData?.length > 0 ? toolTypeData?.map((toolType) => (
                    <MenuItem key={toolType?.id} value={toolType?.id}>{toolType?.toolType}</MenuItem>
                  )) : (
                    <MenuItem disabled value=''>No Tool Types Found</MenuItem>
                  )}
                </ RHFSelect>
              </Grid> */}

              <Grid item="true" xs={12} sm={6}>
                <RHFAutocomplete
                  disabled={!allowEdit}
                  name="toolType"
                  label="Tool Type"
                  options={toolTypeData}
                  getOptionLabel={(option) => option?.toolType || ''}
                  isOptionEqualToValue={(option, value) => option?.id === value}
                  filterOptions={(options, { inputValue }) =>
                    options?.filter((option) => option?.toolType?.toLowerCase().includes(inputValue?.toLowerCase()))
                  }
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Typography variant="subtitle2">{option?.toolType}</Typography>
                    </li>
                  )}
                  onChange={(event, value) => {
                    setValue("toolType", value?.id || "");
                  }}
                  value={toolTypeData.find((option) => option.id === watch("toolType")) || null}
                />
              </Grid>

              <Grid item="true" xs={12} sm={6}>
                <RHFTextField name="productionMeans" label="Production Means" disabled={!allowEdit} />
              </Grid>

              <Grid item="true" xs={12} sm={6}>
                <RHFAutocomplete
                  disabled={!allowEdit}
                  name="supplier"
                  label="Supplier"
                  options={supplierData}
                  getOptionLabel={(option) => option?.supplier || ''}
                  isOptionEqualToValue={(option, value) => option?.id === value}
                  filterOptions={(options, { inputValue }) =>
                    options?.filter((option) => option?.supplier?.toLowerCase().includes(inputValue?.toLowerCase()))
                  }
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Typography variant="subtitle2">{option?.supplier}</Typography>
                    </li>
                  )}
                  onChange={(event, value) => {
                    setValue("supplier", value?.id || "");
                  }}
                  value={supplierData.find((option) => option.id === watch("supplier")) || null}
                />
              </Grid>

              <Grid item="true" xs={12} sm={6}>
                <RHFAutocomplete
                  disabled={!allowEdit}
                  name="manufacturer"
                  label="Manufacturer"
                  options={manufacturersData}
                  getOptionLabel={(option) => option?.manufacturer || ''}
                  isOptionEqualToValue={(option, value) => option?.id === value}
                  filterOptions={(options, { inputValue }) =>
                    options?.filter((option) => option?.manufacturer?.toLowerCase().includes(inputValue?.toLowerCase()))
                  }
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Typography variant="subtitle2">{option?.manufacturer}</Typography>
                    </li>
                  )}
                  onChange={(event, value) => {
                    setValue("manufacturer", value?.id || "");
                  }}
                  value={manufacturersData.find((option) => option.id === watch("manufacturer")) || null}
                />
              </Grid>

              <Grid item="true" xs={12} sm={6}>
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

              <Grid item="true" xs={12} sm={6}>
                <RHFAutocomplete
                  disabled={!allowEdit}
                  name="storageLocation"
                  label="Storage Location"
                  options={storageLocationsData}
                  getOptionLabel={(option) => option?.location || ''}
                  isOptionEqualToValue={(option, value) => option?.id === value}
                  filterOptions={(options, { inputValue }) =>
                    options?.filter((option) => option?.location?.toLowerCase().includes(inputValue?.toLowerCase()))
                  }
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Typography variant="subtitle2">{option?.location}</Typography>
                    </li>
                  )}
                  onChange={(event, value) => {
                    setValue("storageLocation", value?.id || "");
                  }}
                  value={storageLocationsData.find((option) => option.id === watch("storageLocation")) || null}
                />
              </Grid>

              {currentTool && (
                <>
                  <Grid item="true" xs={12} sm={6}>
                    <RHFTextField name="spareList" label="Spare List" disabled={!allowEdit} />
                  </Grid>

                  <Grid item="true" xs={12} sm={6}>
                    <RHFTextField name="calibration" label="Calibration" disabled={!allowEdit} />
                  </Grid>

                  <Grid item="true" xs={12} sm={6}>
                    <RHFTextField name="technicalDrawing" label="Technical Drawing" disabled={!allowEdit} />
                  </Grid>

                  <Grid item="true" xs={12} sm={6}>
                    <RHFTextField name="assetNumber" label="Asset Number" disabled={!allowEdit} />
                  </Grid>

                  <Grid item="true" xs={12} sm={6}>
                    <RHFSelect name="isMaintainancePlanNeeded" label="Maintainance Plan" disabled={!allowEdit} >
                      {booleanOptions?.length > 0 ? booleanOptions?.map((opt) => (
                        <MenuItem key={opt?.value} value={opt?.value}>{opt?.label}</MenuItem>
                      )) : (
                        <MenuItem disabled value=''>No Options Found</MenuItem>
                      )}
                    </ RHFSelect>
                  </Grid>

                  <Grid item="true" xs={12} sm={6}>
                    <RHFSelect name="individualManagement" label="Individual Management" disabled={!allowEdit} >
                      {booleanOptions?.length > 0 ? booleanOptions?.map((opt) => (
                        <MenuItem key={opt?.value} value={opt?.value}>{opt?.label}</MenuItem>
                      )) : (
                        <MenuItem disabled value=''>No Options Found</MenuItem>
                      )}
                    </ RHFSelect>
                  </Grid>

                  <Grid item="true" xs={12} sm={6}>
                    <RHFTextField name="designation" label="Designation" disabled={!allowEdit} />
                  </Grid>

                  <Grid item="true" xs={12} sm={6}>
                    <RHFTextField name="criticalLevel" label="Critical Level" disabled={!allowEdit} />
                  </Grid>

                  <Grid item="true" xs={12} sm={6}>
                    <RHFTextField name="toolFamily" label="Tool Family" disabled={!allowEdit} />
                  </Grid>

                  <Grid item="true" xs={12} sm={6}>
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
};
