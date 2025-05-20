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
import { useAuthContext } from 'src/auth/hooks';
// ----------------------------------------------------------------------

export default function ToolsNewEditForm({ currentTool }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user: currentUser } = useAuthContext();
  const [allowEdit, setAllowEdit] = useState(false);
  const [ toolTypeData, setToolTypeData ] = useState([]); 
  const [ supplierData, setSupplierData ] = useState([]);
  const [ manufacturersData, setManufacturersData ] = useState([]); 
  const [ toolDepartmentData, setToolDepartmentData ] = useState([]);
  const [ stationData, setStationData ] = useState([]);

  const booleanOptions = [
    {label: 'Yes', value: 'true'},
    {label: 'No', value: 'false'}
  ];

  const statusOptions = [
    { value: true, label: 'Active' },
    { value: false, label: 'Non-Active' },
  ];

  const criticalLevelOptions = [
    { value: "Critical", label: "Critical" },
    { value: "Non Critical", label: "Non Critical"}
  ];

  const toolFamilyOptions = [
    { value: "Tool", label: "Tool" },
    { value: "Equipment", label: "Equipment"}
  ];

  useEffect(() => {
    if(
      currentTool && 
      (currentTool?.installationStatus !== 'approved' && currentUser?.permissions && (currentUser?.permissions?.includes('admin') || currentUser?.permissions?.includes('initiator')))
    ){
      setAllowEdit(true);
    }

    else if(
      currentTool && 
      (currentTool?.installationStatus === 'approved' && currentUser?.permissions && currentUser?.permissions?.includes('admin'))
    ){
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
    .required('Serial number is required')
    .min(1, 'Serial number must be at least 1'),
    individualSerialNumber: Yup.string(),
    toolType: Yup.object().nullable().required('Tool type is required'),
    supplier: Yup.object().nullable().required('Supplier is required'),
    manufacturer: Yup.object().nullable().required('Manufacturer is required'),
    toolDepartment: Yup.object().nullable().required('Tool department is required'),
    station: Yup.object().nullable().required('Station is required'),
    manufacturingDate: Yup.string().required('Manufacturing Date is required'),
    storageLocation: Yup.string().required('Storage Location is required'),
    spareList: Yup.string(),
    calibration: Yup.string(),
    technicalDrawing: Yup.string(), 
    isMaintainancePlanNeeded: Yup.boolean(),
    isInternalValidationNeeded: Yup.boolean(),
    individualManagement: Yup.boolean(),
    designation: Yup.string(),
    criticalLevel: Yup.string(),
    toolFamily: Yup.string(),
    installationChecklist: Yup.boolean(),
    assetNumber: Yup.string(),
    isActive: Yup.boolean(),
    remark: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      partNumber: currentTool?.partNumber || '',
      modelNumber: currentTool?.modelNumber || '',
      description: currentTool?.description || '',
      quantity: currentTool?.quantity || 1, 
      serialNumber: currentTool?.meanSerialNumber || '', 
      individualSerialNumber: currentTool?.individualSerialNumber || '',
      toolType: null,
      productionMeans: currentTool?.productionMeans || '',
      supplier: null,
      manufacturer: null,
      toolDepartment: null,
      station: null,
      manufacturingDate: currentTool?.manufacturingDate || '',
      storageLocation: currentTool?.storageLocation || '',
      spareList: currentTool?.spareList || '',
      calibration: currentTool?.calibration || '',
      technicalDrawing: currentTool?.technicalDrawing || '',
      isMaintainancePlanNeeded: currentTool?.isMaintaincePlanNeeded || false, 
      isInternalValidationNeeded: currentTool?.isInternalValidationNeeded || false, 
      individualManagement: currentTool?.individualManagement || false,
      designation: currentTool?.designation || '',
      criticalLevel: currentTool?.criticalLevel || '',
      toolFamily: currentTool?.toolFamily || '',
      installationChecklist: currentTool?.installationChecklist || false,
      assetNumber: currentTool?.assetNumber || '',
      isActive: currentTool?.isActive || false,
      remark: currentTool?.remark || '',
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
        meanSerialNumber: formData?.serialNumber,
        description: formData.description,
        quantity: formData.quantity,
        balanceQuantity: formData.quantity,
        toolTypeId: formData?.toolType?.id,
        supplierId: formData?.supplier?.id,
        manufacturerId: formData?.manufacturer?.id,
        toolsDepartmentId: formData?.toolDepartment?.id,
        stationId: formData?.station?.id,
        manufacturingDate: formData.manufacturingDate,
        storageLocation: formData.storageLocation,
        productionMeans: formData.productionMeans,
        designation: formData.designation,
        isActive: formData?.isActive || false,
        status: formData?.isActive === true ? 'Operational' : 'Non-Operational',
        installationStatus : 'pending',
        internalValidationStatus : 'pending',
        isInternalValidationNeeded : formData?.isInternalValidationNeeded || true,
        isMaintaincePlanNeeded : formData?.isMaintainancePlanNeeded || false,    // corrected field name.
      };

      if(formData?.individualSerialNumber && formData?.individualSerialNumber !== ''){
        inputData.individualSerialNumber = formData?.individualSerialNumber?.replace(/\(\s*/g, "(").replace(/\s*,\s*/g, ",").trim();
      }

      if(currentTool){
        inputData.calibration = formData.calibration;
        inputData.individualManagement = formData.individualManagement;
        inputData.installationChecklist = formData.installationChecklist;
        inputData.assetNumber = formData.assetNumber;
        inputData.criticalLevel = formData.criticalLevel;
        inputData.toolFamily = formData.toolFamily;
        inputData.spareList = formData.spareList;
        inputData.technicalDrawing = formData.technicalDrawing;
        inputData.isActive = formData.isActive;
        inputData.installationStatus = currentTool?.installationStatus || 'pending';
        inputData.internalValidationStatus = currentTool?.internalValidationStatus || 'pending';
        inputData.remark = formData?.remark || '';
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
      // for tool-type
      const currentToolType = currentTool?.toolType ? currentTool?.toolType : null;
      setValue('toolType', currentToolType);
      setToolTypeData((prev) => [...prev, currentToolType]);

      // for manufacturer
      const currentManufacturer = currentTool?.manufacturer ? currentTool?.manufacturer : null;
      setValue('manufacturer', currentManufacturer);
      setManufacturersData((prev) => [...prev, currentManufacturer]);

      // for supplier
      const currentSupplier = currentTool?.supplier ? currentTool?.supplier : null;
      setValue('supplier', currentSupplier);
      setSupplierData((prev) => [...prev, currentSupplier]);

      // for tool Department
      const currentToolsDepartment = currentTool?.toolsDepartment ? currentTool?.toolsDepartment : null;
      setValue('toolDepartment', currentToolsDepartment);
      setToolDepartmentData((prev) => [...prev, currentToolsDepartment]);

      // for station
      const currentStation = currentTool?.station ? currentTool?.station : null;
      setValue('station', currentStation);
      setStationData((prev) => [...prev, currentStation]);
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
        setValue('toolType', response?.data?.data?.toolType || null, { shouldValidate: true });
        setValue('description', response?.data?.data?.description);
        setValue('serialNumber', Number(response?.data?.data?.meanSerialNumber) + 1, { shouldValidate: true }); 
        setValue('supplier', response?.data?.data?.supplier || null, { shouldValidate: true });
        setValue('manufacturer', response?.data?.data?.manufacturer || null, { shouldValidate: true });
        setValue('station', response?.data?.data?.station || null, { shouldValidate: true });
        setValue('toolDepartment', response?.data?.data?.toolsDepartment || null, { shouldValidate: true });
        setValue('storageLocation', response?.data?.data?.storageLocation);
        setValue('productionMeans', response?.data?.data?.productionMeans);
        setAllowEdit(true);
        enqueueSnackbar('Tool with same part number found',{variant : 'success'});
      }else{
        setValue('serialNumber', 1);
        setAllowEdit(true);
        enqueueSnackbar('No tool with this part number was found. You can proceed to create a new one.',{variant : 'info'});
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


  // fetch users call
  const fetchUsers = async( event, func, path, field ) => {
    try{
      const filter = {
        where: {
          [field]: { like: `%${event?.target?.value}%` }
        }
      };

      const filterString = encodeURIComponent(JSON.stringify(filter));
      const { data } = await axiosInstance.get(`${path}?filter=${filterString}`);
      func(data);
    }catch(error){
      console.error('Error while filtering autocomplete data', error);
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item="true" xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {currentTool && (
                <>
                  <Grid item="true" xs={12} sm={6}>
                    <RHFSelect disabled={allowEdit === true} name="isActive" label="Status">
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
                  <RHFTextField  name="partNumber" label="Tool Part Number" disabled={!allowEdit} />
                </Grid>
              }

              <Grid item="true" xs={12} sm={6}>
                <RHFTextField name="modelNumber" label="Tool Model Number" disabled={!allowEdit} />
              </Grid>

              <Grid item="true" xs={12} sm={6}>
                <RHFTextField name="description" label="Description" disabled={!allowEdit} />
              </Grid>

              <Grid item="true" xs={12} sm={6}>
                <RHFTextField type='number' name="quantity" label="Quantity" disabled />
              </Grid>

              <Grid item="true" xs={12} sm={6}>
                <RHFTextField type='number' name="serialNumber" label="Serial Number" disabled />
              </Grid>

              <Grid item="true" xs={12} sm={6}>
                <RHFTextField name="individualSerialNumber" label="Individual Serial Number" disabled={!allowEdit} />
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
                  options={toolTypeData || []}
                  onInputChange={(event) => fetchUsers(event, setToolTypeData, '/tool-types', 'toolType')}
                  getOptionLabel={(option) => option?.toolType || ''}
                  isOptionEqualToValue={(option, value) => option?.id === value.id}
                  filterOptions={(options, { inputValue }) =>
                      options?.filter((option) => option?.toolType?.toLowerCase().includes(inputValue?.toLowerCase()) || option?.lastName?.toLowerCase().includes(inputValue?.toLowerCase()))
                  }
                  renderOption={(props, option) => (
                      <li {...props}>
                          <Typography variant="subtitle2">{option?.toolType}</Typography>
                      </li>
                  )}
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
                  options={supplierData || []}
                  onInputChange={(event) => fetchUsers(event, setSupplierData, '/suppliers', 'supplier')}
                  getOptionLabel={(option) => option?.supplier || ''}
                  isOptionEqualToValue={(option, value) => option?.id === value.id}
                  filterOptions={(options, { inputValue }) =>
                      options?.filter((option) => option?.supplier?.toLowerCase().includes(inputValue?.toLowerCase()))
                  }
                  renderOption={(props, option) => (
                      <li {...props}>
                          <Typography variant="subtitle2">{option?.supplier}</Typography>
                      </li>
                  )}
                />
              </Grid>

              <Grid item="true" xs={12} sm={6}>
                <RHFAutocomplete
                  disabled={!allowEdit}
                  name="manufacturer"
                  label="Manufacturer"
                  options={manufacturersData || []}
                  onInputChange={(event) => fetchUsers(event, setManufacturersData, '/manufacturers', 'manufacturer')}
                  getOptionLabel={(option) => option?.manufacturer || ''}
                  isOptionEqualToValue={(option, value) => option?.id === value.id}
                  filterOptions={(options, { inputValue }) =>
                      options?.filter((option) => option?.manufacturer?.toLowerCase().includes(inputValue?.toLowerCase()))
                  }
                  renderOption={(props, option) => (
                      <li {...props}>
                          <Typography variant="subtitle2">{option?.manufacturer}</Typography>
                      </li>
                  )}
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
                      maxDate={new Date()}
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
                {/* <RHFAutocomplete
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
                /> */}
                <RHFTextField name='storageLocation' label='Storage Location' disabled={!allowEdit}/>
              </Grid>

              <Grid item="true" xs={12} sm={6}>
                <RHFAutocomplete
                  disabled={!allowEdit}
                  name="toolDepartment"
                  label="Tool Department"
                  options={toolDepartmentData || []}
                  onInputChange={(event) => fetchUsers(event, setToolDepartmentData, '/tools-departments', 'toolDepartment')}
                  getOptionLabel={(option) => option?.toolDepartment || ''}
                  isOptionEqualToValue={(option, value) => option?.id === value.id}
                  filterOptions={(options, { inputValue }) =>
                      options?.filter((option) => option?.toolDepartment?.toLowerCase().includes(inputValue?.toLowerCase()))
                  }
                  renderOption={(props, option) => (
                      <li {...props}>
                          <Typography variant="subtitle2">{option?.toolDepartment}</Typography>
                      </li>
                  )}
                />
              </Grid>

              <Grid item="true" xs={12} sm={6}>
                <RHFAutocomplete
                  disabled={!allowEdit}
                  name="station"
                  label="Station"
                  options={stationData || []}
                  onInputChange={(event) => fetchUsers(event, setStationData, '/stations', 'station')}
                  getOptionLabel={(option) => option?.station || ''}
                  isOptionEqualToValue={(option, value) => option?.id === value.id}
                  filterOptions={(options, { inputValue }) =>
                      options?.filter((option) => option?.station?.toLowerCase().includes(inputValue?.toLowerCase()))
                  }
                  renderOption={(props, option) => (
                      <li {...props}>
                          <Typography variant="subtitle2">{option?.station}</Typography>
                      </li>
                  )}
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
                    <RHFSelect name="technincalDrawing" label="Technical Drawing" disabled={!allowEdit} >
                      {booleanOptions?.length > 0 ? booleanOptions?.map((opt) => (
                        <MenuItem key={opt?.value} value={opt?.value}>{opt?.label}</MenuItem>
                      )) : (
                        <MenuItem disabled value=''>No Options Found</MenuItem>
                      )}
                    </ RHFSelect>
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
                    <RHFSelect name="isInternalValidationNeeded" label="Internal Validation Needed" disabled={!allowEdit} >
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

                  {/* <Grid item="true" xs={12} sm={6}>
                    <RHFTextField name="designation" label="Designation" disabled={!allowEdit} />
                  </Grid> */}

                  <Grid item="true" xs={12} sm={6}>
                    <RHFSelect name="criticalLevel" label="Critical Level" disabled={!allowEdit} >
                      {criticalLevelOptions?.length > 0 ? criticalLevelOptions?.map((opt) => (
                        <MenuItem key={opt?.value} value={opt?.value}>{opt?.label}</MenuItem>
                      )) : (
                        <MenuItem disabled value=''>No Options Found</MenuItem>
                      )}
                    </ RHFSelect>
                  </Grid>

                  <Grid item="true" xs={12} sm={6}>
                    <RHFSelect name="toolFamily" label="Tool Family" disabled={!allowEdit} >
                      {toolFamilyOptions?.length > 0 ? toolFamilyOptions?.map((opt) => (
                        <MenuItem key={opt?.value} value={opt?.value}>{opt?.label}</MenuItem>
                      )) : (
                        <MenuItem disabled value=''>No Options Found</MenuItem>
                      )}
                    </ RHFSelect>
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

                  <Grid item="true" xs={12} sm={6}>
                    <RHFTextField name="remark" label="Comment" />
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
