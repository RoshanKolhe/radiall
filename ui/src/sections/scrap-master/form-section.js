/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-undef */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axiosInstance from 'src/utils/axios';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { Autocomplete, Box, Button, Card, Grid, IconButton, MenuItem, Select, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { useAuthContext } from 'src/auth/hooks';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
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

export default function FormSection({ currentForm, verificationForm, userData }) {
    const navigate = useNavigate();
    const { user: currentUser } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const [checkList, setCheckList] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [initiatorsData, setInitiatorsData] = useState([]);
    const [validatorsData, setValidatorsData] = useState([]);
    const [productionHeadsData, setProductionHeadsData] = useState([]);
    const tableHeadNames = [
        { value: 'requirement', label: 'Requirement', visible: true },
        { value: 'critical', label: 'Critical', visible: true },
        // { value: 'nonCritical', label: 'Non Critical', visible: true },
        { value: 'toDo', label: 'ToDo', visible: true },
        { value: 'actionOwner', label: 'Action Owner', visible: true },
        { value: 'done', label: 'Done', visible: true },
        { value: 'comment', label: 'Comment', visible: true },
        { value: 'upload', label: 'Upload', visible: true },
        // { value: '', label: 'Path', visible: false}
    ];
    const criticalOptions = [
        { value: 'md', label: 'MD', color: 'royalblue' },
        { value: 'apr', label: 'APR', color: 'red' },
    ];

    const todoOptions = [
        { value: true, label: 'X' },
        { value: false, label: 'NA' }
    ];

    useEffect(() => {
        if(currentForm?.requirementChecklist?.length > 0){
            const list = currentForm?.requirementChecklist?.map((item) => ({
                ...item,
                critical: item?.critical || 'md',
                // nonCritical: item?.nonCritical || 'md',
                toDo: item?.toDo || false,
                done: item?.done || false,
                actionOwner: item?.actionOwner ? item?.actionOwner?.id : undefined
            }))
            setCheckList(list);
        };
    }, [currentForm?.requirementChecklist])

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
        justification: Yup.string().required('Justification is required'),
    });

    const defaultValues = useMemo(() => ({
        partNumber: currentForm?.tools?.partNumber ?? '',
        serialNumber: currentForm?.tools?.meanSerialNumber ?? '',
        manufacturer: currentForm?.tools?.manufacturer?.manufacturer ?? '',
        supplier: currentForm?.tools?.supplier?.supplier ?? '',
        creationDate: currentForm?.tools?.createdAt ? format(new Date(currentForm?.tools?.createdAt), "dd MMMM yyyy, HH:mm") : '',
        justification: currentForm?.justification,
        initiator: null,
        user: null,
        productionHeads: null,
        validators: [],
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
        formState: { isSubmitting },
    } = methods;

    const values = watch();

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
            const inputData = {
                justification: formData?.justification,
                requirementChecklist: checkList,
                initiatorId: formData?.initiator?.id,
                userId: formData?.user?.id,
                validatorsId: formData?.validators?.map((value) => value?.id),
                productionHeadsId: [formData?.productionHeads?.id]
            };

            const response = await axiosInstance.patch(`/scrapping-form-submission/${currentForm?.id}`, inputData);

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

        }
    }, [currentForm, currentUser, defaultValues, reset, setValue]);

    const handleChangeValue = (value, i, fieldName) => {
        const updatedValues = checkList.map((field, index) => 
            index === i ? { ...field, [fieldName]: value } : field
        );
        setCheckList(updatedValues);
    };

    const handleUpload = async (file, i) => {
        console.log('Selected file:', file);
        if (!file) {
            console.error('No file selected');
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append('file', file);
    
            const response = await axiosInstance.post('/files', formData);
            const { data } = response;
            console.log(data);
    
            const updatedValues = checkList.map((field, index) =>
                index === i ? { ...field, upload: data?.files[0].fileUrl } : field
            );
            setCheckList(updatedValues);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteFile = async (index) => {
        const updatedValues = checkList?.map((field, i) => index === i ? { ...field, upload: '' } : field);

        setCheckList(updatedValues);
    }

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
                                    onInputChange={(event) => fetchUsers(event, setUsersData, 'validator')}
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

                    {/* justification section */}
                    <Card sx={{ p: 3, mt: 2 }}>
                        <Grid item xs={12} md={12}>
                            <Box component='div' sx={{ width: '100%', py: 2, px: 1, borderBottom: '2px solid lightGray', mb: 2 }}>
                                <Typography variant='h5'>Justification</Typography>
                            </Box>

                            {/* Justification */}
                            <Grid sx={{mb:1}} item xs={12} md={12}>
                                <Typography variant='body1'>Reason to scrap the tool/equipent:</Typography>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <RHFTextField disabled={!!verificationForm} name='justification' placeholder='justification...' multiline minRows={3}/>
                            </Grid>
                        </Grid>
                    </Card>

                    {/* Action Checklist */}
                    <Card sx={{ p: 3, mt: 2 }}>
                        <Grid item xs={12} md={12}>
                            <Box component='div' sx={{ width: '100%', py: 2, px: 1, borderBottom: '2px solid lightGray', mb: 2 }}>
                                <Typography variant='h5'>Action Checklist</Typography>
                            </Box>
                            <Table sx={{mt: 2}}>
                                <TableHead>
                                    <TableRow>
                                    {tableHeadNames.map((col) => (
                                        (verificationForm || col?.visible) && (
                                            <TableCell key={col.value}>{col.label}</TableCell>
                                        )
                                    ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {checkList.map((requirement, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{requirement?.requirement}</TableCell>
                                            <TableCell>
                                                <Select
                                                    variant='standard'
                                                    disableUnderline
                                                    sx={{
                                                        border: 'none',
                                                        pointerEvents: "none",
                                                        outline: 'none',
                                                        '&::before': { borderBottom: 'none' }, 
                                                        '&::after': { borderBottom: 'none' }, 
                                                        '& .MuiSelect-icon': { right: '5px', display : "none" }, 
                                                        color: criticalOptions.find(opt => opt.value === (checkList[index]?.critical ? checkList[index]?.critical : 'md'))?.color || 'black', 
                                                    }}
                                                    value={checkList[index]?.critical ?? 'md'}
                                                    onChange={(e) => handleChangeValue(e.target.value, index, 'critical')}
                                                >
                                                    {criticalOptions.map((opt) => (
                                                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                                    ))}
                                                </Select>
                                            </TableCell>
                                            {/* <TableCell>
                                                <Select
                                                    variant='standard'
                                                    disableUnderline
                                                    sx={{
                                                        border: 'none',
                                                        outline: 'none',
                                                        pointerEvents: "none",
                                                        '&::before': { borderBottom: 'none' }, 
                                                        '&::after': { borderBottom: 'none' }, 
                                                        '& .MuiSelect-icon': { right: '5px', display : "none" }, 
                                                        color: criticalOptions.find(opt => opt.value === (checkList[index]?.nonCritical ? checkList[index]?.nonCritical : 'md'))?.color || 'black', 
                                                    }}
                                                    value={checkList[index]?.nonCritical ?? 'md'}
                                                    onChange={(e) => handleChangeValue(e.target.value, index, 'nonCritical')}
                                                >
                                                    {criticalOptions.map((opt) => (
                                                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                                    ))}
                                                </Select>
                                            </TableCell> */}
                                            <TableCell>
                                                <Select
                                                    variant='standard'
                                                    disableUnderline
                                                    sx={{
                                                        border: 'none',
                                                        outline: 'none',
                                                        pointerEvents: verificationForm ? "none" : "auto",
                                                        '&::before': { borderBottom: 'none' }, 
                                                        '&::after': { borderBottom: 'none' }, 
                                                        '& .MuiSelect-icon': { right: '5px', display : verificationForm ? "none" : '' }, 
                                                    }}
                                                    value={checkList[index]?.toDo ?? false}
                                                    onChange={(e) => handleChangeValue(e.target.value, index, 'toDo')}
                                                >
                                                    {todoOptions.map((opt) => (
                                                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                                    ))}
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                            {/* eslint-disable-next-line no-nested-ternary */}
                                            {verificationForm ? 
                                            (checkList[index]?.actionOwner === undefined || checkList[index]?.actionOwner === null)  ? 
                                                (
                                                    <p>NA</p>
                                                )
                                            : (
                                                <p>{usersData?.find((user) => user?.id === checkList[index]?.actionOwner)?.firstName}</p>
                                            ) : (
                                                <Autocomplete
                                                    disabled={!!verificationForm}
                                                    fullWidth
                                                    options={usersData || []}
                                                    getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                                                    value={usersData?.find(user => user?.id === checkList[index]?.actionOwner?.id) || null}
                                                    onChange={(event, newValue) => handleChangeValue(newValue?.id || '', index, 'actionOwner')}
                                                    renderInput={(params) => <TextField {...params} placeholder="Search User" variant="outlined" />}
                                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                                />
                                            )}
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    variant='standard'
                                                    disableUnderline
                                                    sx={{
                                                        border: 'none',
                                                        outline: 'none',
                                                        pointerEvents: verificationForm ? "none" : "auto",
                                                        '&::before': { borderBottom: 'none' }, 
                                                        '&::after': { borderBottom: 'none' }, 
                                                        '& .MuiSelect-icon': { right: '5px', display : verificationForm ? "none" : '' }, 
                                                    }}
                                                    value={checkList[index]?.done ?? false}
                                                    onChange={(e) => handleChangeValue(e.target.value, index, 'done')}
                                                >
                                                    {todoOptions.map((opt) => (
                                                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                                    ))}
                                                </Select>
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    whiteSpace: "nowrap", 
                                                    overflow: "hidden", 
                                                    textOverflow: "ellipsis", 
                                                    width: '100%',
                                                    maxWidth: 150,
                                                    display: "block"
                                                }}
                                            >    
                                                {verificationForm ? 
                                                    <Tooltip title={checkList[index]?.comment ?? ''} placement="top" arrow>
                                                        <p>{checkList[index]?.comment !== '' ? checkList[index]?.comment : 'NA'}</p>
                                                    </Tooltip>
                                                : 
                                                <TextField 
                                                    disabled={!!verificationForm}
                                                    value={checkList[index]?.comment ?? ''} 
                                                    placeholder="comment" 
                                                    onChange={(e) => handleChangeValue(e.target.value, index, 'comment')} 
                                                />}
                                            </TableCell>
                                            <TableCell>
                                            {requirement?.isNeedUpload ? 
                                                !requirement?.upload ? (
                                                !verificationForm ? 
                                                (
                                                    <Button
                                                        component="label"
                                                        role={undefined}
                                                        variant="contained"
                                                        tabIndex={-1}
                                                        startIcon={<Iconify color="black" icon="eva:cloud-upload-fill" width={30} />}
                                                        sx={{
                                                        width: 'fit-content',
                                                        minWidth: '50px',
                                                        backgroundColor: 'transparent',
                                                        boxShadow: 'none',
                                                        padding: '5px 10px',
                                                        '&:hover': { backgroundColor: 'transparent' },
                                                        }}
                                                    >
                                                        <VisuallyHiddenInput
                                                        type="file"
                                                        onChange={(event) => handleUpload(event.target.files[0], index)}
                                                        multiple={false}
                                                        />
                                                    </Button>
                                                ) : 
                                                <p>NA</p>
                                                ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <p
                                                        onClick={() => window.open(requirement?.upload, '_blank', 'noopener,noreferrer')}
                                                        style={{ cursor: 'pointer', textDecoration: 'underline', color: 'royalblue' }}
                                                    >
                                                        VIEW
                                                    </p>
                                                    {!verificationForm && 
                                                        (
                                                            <>
                                                                <IconButton onClick={() => handleDeleteFile(index)}>
                                                                    <Iconify icon="eva:close-fill" color='black' width={24} />
                                                                </IconButton>
                                                                <Button
                                                                component="label"
                                                                role={undefined}
                                                                variant="contained"
                                                                tabIndex={-1}
                                                                startIcon={<Iconify color="black" icon="eva:cloud-upload-fill" width={30} />}
                                                                sx={{
                                                                    width: 'fit-content',
                                                                    minWidth: '50px',
                                                                    backgroundColor: 'transparent',
                                                                    boxShadow: 'none',
                                                                    padding: '5px 10px',
                                                                    '&:hover': { backgroundColor: 'transparent' },
                                                                }}
                                                                >
                                                                <VisuallyHiddenInput
                                                                    type="file"
                                                                    onChange={(event) => {
                                                                        console.log('onChange triggered', event.target.files);
                                                                        handleUpload(event.target.files, index);
                                                                    }}
                                                                    multiple
                                                                />
                                                                </Button>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            ) : (
                                                <p>NA</p>
                                            )}
                                            </TableCell>
                                            {/* {verificationForm && <TableCell>
                                                {checkList[index]?.routes !== undefined && checkList[index]?.routes !== null ? (
                                                    <p
                                                        onClick={() => {
                                                            const dynamicUrl = handleDynamicRoute(
                                                                checkList[index]?.routes?.route,
                                                                checkList[index]?.routes?.params, 
                                                            );
                                                            navigate(`/dashboard/${dynamicUrl}`);
                                                        }}
                                                        style={{ cursor: 'pointer', textDecoration: 'underline', color: 'royalblue' }}
                                                    >
                                                        GO
                                                    </p>
                                                ) : <p>NA</p>}
                                            </TableCell>} */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Stack 
                                sx={{ 
                                    mt: 3, 
                                    width: '100%', 
                                    display: 'flex', 
                                    gap: '10px', 
                                    justifyContent: 'flex-end', 
                                    flexDirection: 'row'  // ✅ Align buttons in a row
                                }}
                            >
                                {!verificationForm && (
                                    <>
                                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                            Save
                                        </LoadingButton>
                                        <Button onClick={() => navigate(paths.dashboard.scrap.toolList)} variant="contained">
                                            Cancel
                                        </Button>
                                    </>
                                )}
                            </Stack>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    )
}

FormSection.propTypes = {
    currentForm: PropTypes.object,
    verificationForm: PropTypes.bool,
    userData: PropTypes.object
};