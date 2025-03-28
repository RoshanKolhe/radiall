/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axiosInstance from 'src/utils/axios';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { Box, Button, Card, Grid, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { useAuthContext } from 'src/auth/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function DimensionsSection({ currentForm, verificationForm, userData }) {
    const isDesktop = useResponsive('up', 'md');
    const { user: currentUser } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const [usersData, setUsersData] = useState([]);
    const [controlUsers, setControlUsers] = useState([]);
    const [initiatorsData, setInitiatorsData] = useState([]);
    const [validatorsData, setValidatorsData] = useState([]);
    const [productionHeadsData, setProductionHeadsData] = useState([]);
    const booleanOptions = [
        { value: true, label: 'Ok' },
        { value: false, label: 'Not Ok' }
    ];
    const NewSupplierSchema = Yup.object().shape({
        partNumber: Yup.string().required('Part Number is required'),
        serialNumber: Yup.string().required('Serial number is required'),
        manufacturer: Yup.string().required('Manufacturer Name is required'),
        supplier: Yup.string().required('Supplier Name is required'),
        initiator: Yup.object().required('Initiator is required'),
        validators: Yup.array(),
        productionHeads: Yup.object().required("At least one Production Head is required"),
        user: Yup.object().required('Please Select User'),
        creationDate: Yup.string(),
        finding: Yup.string().required('Finding is required'),
        result: Yup.boolean().required('Result is required'),
        evidences: Yup.array().min(1, "At least one evidence is required"),
        controlledBy: Yup.object().required('Control User is required'),
        date: Yup.string(),
    });

    const defaultValues = useMemo(() => ({
        partNumber: currentForm?.tools?.partNumber ?? '',
        serialNumber: currentForm?.tools?.meanSerialNumber ?? '',
        manufacturer: currentForm?.tools?.manufacturer?.manufacturer ?? '',
        supplier: currentForm?.tools?.supplier?.supplier ?? '',
        creationDate: currentForm?.tools?.createdAt ? format(new Date(currentForm?.tools?.createdAt), "dd MMMM yyyy, HH:mm") : '',
        initiator: null,
        user: null,
        productionHeads: null,
        validators: [],
        finding: currentForm?.dimensionsQuestionery?.finding || '',
        result: currentForm?.dimensionsQuestionery?.result || false,
        evidences: currentForm?.dimensionsQuestionery?.evidences || [],
        controlledBy: null,
        date: currentForm?.dimensionsQuestionery?.date ? format(new Date(currentForm?.tools?.createdAt), "dd MMMM yyyy, HH:mm") : format(new Date(), "dd MMMM yyyy, HH:mm"),
    }), [currentForm]);

    const methods = useForm({
        resolver: yupResolver(NewSupplierSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        getValues,
        formState: { isSubmitting, errors },
    } = methods;

    console.log('errors', errors);
    const values = watch();

    console.log('values', values);

    const fetchUsers = async (event, func, value) => {
        try {
            const role = value || '';
            if (event && event?.target?.value && event.target.value.length >= 3) {
                let filter = {
                    where: {
                        or: [
                            { email: { like: `%${event.target.value}%` } },
                            { firstName: { like: `%${event.target.value}%` } },
                            { lastName: { like: `%${event.target.value}%` } },
                            { phoneNumber: { like: `%${event.target.value}%` } },
                        ],
                    },
                };

                if(role !== ''){
                    filter = {
                        where: {
                            permissions : [role],
                            or: [
                                { email: { like: `%${event.target.value}%` } },
                                { firstName: { like: `%${event.target.value}%` } },
                                { lastName: { like: `%${event.target.value}%` } },
                                { phoneNumber: { like: `%${event.target.value}%` } },
                            ],
                        },
                    };
                }
                const filterString = encodeURIComponent(JSON.stringify(filter));
                const { data } = await axiosInstance.get(`/api/users/list?filter=${filterString}`);
                func(data);
            } else {
                func([]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const onSubmit = handleSubmit(async (formData) => {
        try {
            const updatedQuestionery = {
                finding: formData?.finding,
                result: formData?.result,
                evidences: formData?.evidences,
                controlledBy: {
                    id : formData?.controlledBy?.id,
                    firstName : formData?.controlledBy?.firstName,
                    lastName : formData?.controlledBy?.lastName ? formData?.controlledBy?.lastName : '',
                    role: formData?.controlledBy?.permissions?.[0] || 'user',
                    department: formData?.controlledBy?.department?.name,
                    email: formData?.controlledBy?.email
                },
                date: formData?.date
            };

            const inputData = {
                dimensionsQuestionery: updatedQuestionery,
                initiatorId: formData?.initiator?.id,
                userId: formData?.user?.id,
                validatorsId: formData?.validators?.map((value) => value?.id),
                productionHeadsId: [formData?.productionHeads?.id]
            };

            const response = await axiosInstance.patch(`/update-dimensions-section/${currentForm?.id}`, inputData);

            if (response?.data?.success) {
                enqueueSnackbar(response?.data?.message, { variant: 'success' });
            } else {
                enqueueSnackbar('Update failed', { variant: 'error' });
            }
        } catch (error) {
            console.error(error);
            enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
                variant: 'error',
            });
        }
    });

    useEffect(() => {
        if (currentForm) {
            reset(defaultValues);
            // initiator...
            const currentInitiator = currentForm?.initiator ? currentForm.initiator : currentUser;
            setValue('initiator', currentInitiator);
            setInitiatorsData((prev) => [...prev, currentInitiator]);
            // user...
            const user = currentForm?.user ? currentForm?.user?.user : null;
            setValue('user', user);
            setUsersData((prev) => [...prev, user]);
            // validator...
            const validatorsArray = currentForm.validators?.map(item => item.user) || [];
            setValidatorsData(validatorsArray);
            setValue('validators', validatorsArray)
            // productionHeads
            const productionHeadsArray = currentForm?.productionHeads?.[0]?.user || null;
            setProductionHeadsData(productionHeadsArray);
            setValue('productionHeads', productionHeadsArray);
            // controled Users..
            const controlUserData = currentForm?.dimensionsQuestionery?.controlledBy ? currentForm?.dimensionsQuestionery?.controlledBy : null;
            setValue('controlledBy', controlUserData);
            setControlUsers((prev) => [...prev, controlUserData]);
        }
    }, [currentForm, currentUser, defaultValues, reset, setValue]);

    const handleUpload = async (files) => {
        console.log('Selected files:', files);
    
        if (!files || files.length === 0) {
            console.error('No files selected');
            return;
        }

        const filesArray = Array.from(files); // Convert FileList to an Array
    
        try {
            // Get previously uploaded files
            const previousFiles = getValues('evidences') || [];
    
            const uploadPromises = filesArray?.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
    
                const response = await axiosInstance.post('/files', formData);
                const filesNewArray = response.data?.files?.map((fileData) => fileData?.fileUrl)
                return filesNewArray || []; // Return uploaded file URLs
            });
    
            // Wait for all uploads to complete
            const uploadedFiles = await Promise.all(uploadPromises);
    
            // Flatten and merge with previous files
            const filesUrl = [...previousFiles, ...uploadedFiles.flat()];
    
            setValue('evidences', filesUrl, {shouldValidate : true}); 
        } catch (error) {
            console.error(error);
        }
    };
    
    
    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <RHFTextField disabled name="partNumber" label="Tool Part Number" />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <RHFTextField disabled name="serialNumber" label="Mean Serial Number" />
                            </Grid>
                        </Grid>

                        <Grid sx={{ my: 1 }} container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <RHFTextField disabled name="supplier" label="Supplier Name" />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <RHFTextField disabled name="manufacturer" label="Manufacturer Name" />
                            </Grid>
                        </Grid>

                        <Grid sx={{ my: 1 }} container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <RHFTextField disabled name="creationDate" label="Creation Date" />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <RHFAutocomplete
                                    disabled
                                    name="initiator"
                                    label="Initiator"
                                    options={initiatorsData || []}
                                    onInputChange={(event) => fetchUsers(event, setInitiatorsData, 'initiator')}
                                    getOptionLabel={(option) => `${option?.firstName} ${option?.lastName}` || ''}
                                    isOptionEqualToValue={(option, value) => option?.id === value.id}
                                    filterOptions={(options, { inputValue }) =>
                                        options?.filter((option) => option?.firstName?.toLowerCase().includes(inputValue?.toLowerCase()) || option?.lastName?.toLowerCase().includes(inputValue?.toLowerCase()))
                                    }
                                    renderOption={(props, option) => (
                                        <li {...props}>
                                            <Typography variant="subtitle2">{`${option?.firstName} ${option?.lastName}`}</Typography>
                                        </li>
                                    )}

                                />
                            </Grid>
                        </Grid>


                        <Grid sx={{ my: 1 }} container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <RHFAutocomplete
                                    disabled={!!verificationForm}
                                    name="user"
                                    label="User"
                                    options={usersData || []}
                                    onInputChange={(event) => fetchUsers(event, setUsersData, '')}
                                    getOptionLabel={(option) => `${option?.firstName} ${option?.lastName}` || ''}
                                    isOptionEqualToValue={(option, value) => option?.id === value.id}
                                    filterOptions={(options, { inputValue }) =>
                                        options?.filter((option) => option?.firstName?.toLowerCase().includes(inputValue?.toLowerCase()) || option?.lastName?.toLowerCase().includes(inputValue?.toLowerCase()))
                                    }
                                    renderOption={(props, option) => (
                                        <li {...props}>
                                            <Typography variant="subtitle2">{`${option?.firstName} ${option?.lastName}`}</Typography>
                                        </li>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <RHFAutocomplete
                                    disabled={!!verificationForm}
                                    name="productionHeads"
                                    label="Production Heads"
                                    onInputChange={(event) => fetchUsers(event, setProductionHeadsData, 'production_head')}
                                    options={productionHeadsData || []}
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
                                                    {`${option.email}`}
                                                </Typography>
                                            </div>
                                        </li>
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <Grid sx={{ my: 1 }} container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <RHFAutocomplete
                                    disabled={!!verificationForm}
                                    multiple
                                    name="validators"
                                    label="Additional Approvals"
                                    onInputChange={(event) => fetchUsers(event, setValidatorsData, 'validator')}
                                    options={validatorsData || []}
                                    getOptionLabel={(option) => `${option?.firstName} ${option?.lastName} (${option?.department?.name})` || ''}
                                    filterOptions={(x) => x}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderOption={(props, option) => (
                                        <li {...props}>
                                            <div>
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    {`${option?.firstName} ${option?.lastName} (${option?.department?.name})`}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {`${option.email}`}
                                                </Typography>
                                            </div>
                                        </li>
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Card>

                    {/* dimensions section  */}
                    <Card sx={{ p: 3, mt: 2 }}>
                        <Box component='div' sx={{ width: '100%', py: 2, px: 1, borderBottom: '2px solid lightGray', mb: 2 }}>
                            <Typography variant='h5'> Dimensions/Specifications as per Drawing/TDS</Typography>
                        </Box>
                        <Grid container spacing={2}>
                            {/* finding */}
                            <Grid item xs={12} md={12}>
                                <Typography variant='body1'>Finding: (For dimensional checking, print the drawing & highlight dimension controlled)</Typography>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <RHFTextField disabled={!!verificationForm} name='finding' placeholder='finding...' multiline minRows={2}/>
                            </Grid>

                            {/* result */}
                            <Grid item xs={6} md={8}>
                                <Typography variant='body1'>Result</Typography>
                            </Grid>
                            <Grid item xs={6} md={4} sx={{ display: "flex", justifyContent: "flex-end" }}>
                                <Controller
                                    name='result'
                                    control={control}
                                    render={({ field }) => (
                                    <ToggleButtonGroup
                                        {...field}
                                        value={typeof field.value === "boolean" ? field.value : booleanOptions[0]?.value}
                                        exclusive
                                        onChange={(e, newValue) => {
                                        if (newValue !== null) {
                                            field.onChange(newValue);
                                        }
                                        }}
                                        sx={{
                                        pointerEvents : verificationForm ? 'none' : 'auto',
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        width: isDesktop ? "40%" : '100%',
                                        maxWidth: 200,
                                        padding: "0px !important",
                                        border: "2px solid #00BBD9",
                                        borderRadius: "8px",
                                        }}
                                    >
                                        {booleanOptions?.map((opt) => (
                                        <ToggleButton
                                            key={opt.value.toString()}
                                            value={opt.value}
                                            sx={{
                                            flex: 1,
                                            padding: '6px',
                                            pointerEvents : verificationForm ? 'none' : 'auto',
                                            backgroundColor: "white",
                                            borderRadius: "0px !important",
                                            border: "1px solid #00BBD9",
                                            margin: "0px !important",
                                            color: "#00BBD9",
                                            transition: "background-color 0.3s ease",
                                            "&.Mui-selected": {
                                                backgroundColor: "#00BBD9",
                                                color: "#fff",
                                            },
                                            }}
                                        >
                                            {opt.label}
                                        </ToggleButton>
                                        ))}
                                    </ToggleButtonGroup>
                                    )}
                                />
                            </Grid>
                            
                            {/* upload */}
                            <Grid item xs={6} md={8}>
                                <Typography variant='body1'>Evidences</Typography>
                            </Grid>
                            <Grid sx={{display : 'flex', justifyContent : 'flex-end'}} item xs={6} md={4}>
                                <Button
                                    component="label"
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<Iconify color="white" icon="eva:cloud-upload-fill" width={30} />}
                                    sx={{
                                    width: 'fit-content',
                                    minWidth: '50px',
                                    boxShadow: 'none',
                                    padding: '5px 10px',
                                    }}
                                >
                                    upload
                                    <VisuallyHiddenInput
                                    type="file"
                                    onChange={(event) => {
                                        console.log('event', event);
                                        handleUpload(event.target.files);
                                        event.target.value = ""; 
                                    }}
                                    multiple
                                    />
                                </Button>
                            </Grid>

                            {/* Evidences Table */}
                            <Grid item xs={12} md={12}>
                                {getValues('evidences')?.length > 0 && <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Evidences</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getValues('evidences')?.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{`Evidence ${index + 1}`}</TableCell>
                                                <TableCell sx={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                                    <p
                                                        onClick={() => window.open(item, '_blank', 'noopener,noreferrer')}
                                                        style={{ cursor: 'pointer', textDecoration: 'underline', color: 'royalblue' }}
                                                    >
                                                        VIEW
                                                    </p>
                                                    <IconButton onClick={() => {
                                                        const newEvidences = getValues('evidences')?.filter((newItem, i) => index !== i);
                                                        console.log('new', newEvidences);
                                                        setValue('evidences', newEvidences);
                                                    }}>
                                                        <Iconify icon="solar:trash-bin-trash-bold" />
                                                    </IconButton>
                                                    </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>}
                            </Grid>

                            {/* controlled by section */}
                            <Grid item xs={12} md={6}>
                                <RHFAutocomplete
                                    disabled={!!verificationForm}
                                    name="controlledBy"
                                    label="Control By"
                                    options={controlUsers || []}
                                    onInputChange={(event) => fetchUsers(event, setControlUsers, 'validator')}
                                    getOptionLabel={(option) => `${option?.firstName} ${option?.lastName}` || ''}
                                    isOptionEqualToValue={(option, value) => option?.id === value.id}
                                    filterOptions={(options, { inputValue }) =>
                                        options?.filter((option) => option?.firstName?.toLowerCase().includes(inputValue?.toLowerCase()) || option?.lastName?.toLowerCase().includes(inputValue?.toLowerCase()))
                                    }
                                    renderOption={(props, option) => (
                                        <li {...props}>
                                            <Typography variant="subtitle2">{`${option?.firstName} ${option?.lastName}`}</Typography>
                                        </li>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                    <RHFTextField disabled name='date' label='Date' />
                            </Grid>

                            <Stack alignItems="flex-end" sx={{ mt: 3, width:'100%', display : 'flex', justifyContent: 'flex-end' }}>
                                {!verificationForm && <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                    Save
                                </LoadingButton>}
                            </Stack>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    )
}

DimensionsSection.propTypes = {
    currentForm: PropTypes.object,
    verificationForm: PropTypes.bool,
    userData: PropTypes.object
};