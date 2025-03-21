import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useRouter } from 'src/routes/hook';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axiosInstance from 'src/utils/axios';
import { paths } from 'src/routes/paths';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useGetUsers } from 'src/api/user';
import QuestionerySection from './components/questionery';
// ----------------------------------------------------------------------

export default function FamilyClassificationSection({ currentForm, verificationForm }) {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const [usersData, setUsersData] = useState([]);
    const [questioneryValues, setQuestioneryValues] = useState({});
    const { users, usersEmpty } = useGetUsers();

    useEffect(() => {
        const newValues = currentForm?.familyClassificationQuestionery?.length > 0 ? currentForm?.familyClassificationQuestionery?.map((que) => {
            if(que?.type === 'select'){
                return{
                    [que?.question]: que?.answer !== undefined ? que?.answer :  que?.options[0]
                }
            }

            if (que?.type === 'boolean') {
                return {
                    [que?.question]: que?.answer !== undefined ? que?.answer : true
                };
            }

            return{
                [que?.question] : que?.answer !== undefined ? que?.answer : ''
            }
        }) : {};

        setQuestioneryValues(newValues);
    }, [currentForm?.familyClassificationQuestionery])
    
    useEffect(() => {
        if(users && !usersEmpty){
            setUsersData(users);
        }
    },[users, usersEmpty])
    
    const NewSupplierSchema = Yup.object().shape({
    partNumber: Yup.string().required('Part Number is required'),
    serialNumber: Yup.number()
        .nullable()
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .required('Serial Number is required')
        .min(1, 'Serial Number must be at least 1'),
    manufacturer: Yup.string().required('Manufacturer Name is required'),
    supplier: Yup.string().required('Supplier Name is required'),
    initiator: Yup.number()
        .nullable()
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .required('Please Select Initiator'),
    validators: Yup.array().of(
        Yup.number()
        .nullable()
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .required('At least One Validator is required')
    ),
    productionHeads: Yup.array().of(
        Yup.number()
        .nullable()
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .required('At least One Production Head is required')
    ),
    user: Yup.number()
        .nullable()
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .required('Please Select User'),
    creationDate: Yup.string(),
    });

    const defaultValues = useMemo(() => {
        const structuredQuestioneryValues = Object.entries(questioneryValues || {}).reduce(
            (acc, [_, value]) => ({ ...acc, ...value }), // Flatten indexed objects into a single object
            {}
        );
    
        return {
            partNumber: currentForm?.tools?.partNumber ?? '',
            serialNumber: currentForm?.tools?.meanSerialNumber ?? '',
            manufacturer: currentForm?.tools?.manufacturer?.manufacturer ?? '',
            supplier: currentForm?.tools?.supplier?.supplier ?? '',
            creationDate: currentForm?.tools?.createdAt ?? '',
            initiator: currentForm?.initiatorId ?? null,
            user: currentForm?.userId ?? null,
            validators: currentForm?.validators?.length > 0 ? currentForm?.validators?.map((validator) => validator?.userId ) : [],
            productionHeads: currentForm?.productionHeads?.length > 0 ? currentForm?.productionHeads?.map((head) => head?.userId ) : [] ?? [],
            ...structuredQuestioneryValues // Ensure proper merge
        };
    }, [currentForm, questioneryValues]);

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

    console.log('final values', values);

    const onSubmit = handleSubmit(async (formData) => {
    try {
        const updatedQuestionery = currentForm?.familyClassificationQuestionery?.map((question) => ({
            question: question?.question ?? "", 
            type: question?.type ?? "", 
            options: question?.options ?? [], 
            isFieldChanging: question?.isFieldChanging ?? false, 
            fieldName: question?.fieldName ?? "", 
            answer: formData?.[question?.question] ?? "", 
        }));

        const inputData = {
            familyClassification: updatedQuestionery,
            initiatorId: formData.initiator,
            userId: formData.user,
            validatorsId: formData?.validators,
            productionHeadsId: formData?.productionHeads
        };

        const response = await axiosInstance.patch(`/update-family-classification/${currentForm?.id}`, inputData);

        if(response?.data?.success){
            enqueueSnackbar(response?.data?.message, {variant : 'success'});
        }else{
            enqueueSnackbar('Update failed', {variant : 'error'});
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
    }
    }, [currentForm, defaultValues, reset]);
    
    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <RHFTextField disabled={!!verificationForm} name="partNumber" label="Tool Part Number" />
                            </Grid>
            
                            <Grid item xs={12} sm={6}>
                                <RHFTextField disabled={!!verificationForm} name="serialNumber" label="Mean Serial Number" />
                            </Grid>
                        </Grid>

                        <Grid sx={{my : 1}} container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <RHFTextField disabled={!!verificationForm} name="supplier" label="Supplier Name" />
                            </Grid>
            
                            <Grid item xs={12} sm={6}>
                                <RHFTextField disabled={!!verificationForm} name="manufacturer" label="Manufacturer Name" />
                            </Grid>
                        </Grid>

                        <Grid sx={{my : 1}} container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <RHFTextField disabled={!!verificationForm} name="creationDate" label="Creation Date" />
                            </Grid>
            
                            <Grid item xs={12} sm={6}>
                                <RHFAutocomplete
                                    disabled={!!verificationForm}
                                    name="initiator"
                                    label="Initiator"
                                    options={usersData}
                                    getOptionLabel={(option) => `${option?.firstName} ${option?.lastName}` || ''}
                                    isOptionEqualToValue={(option, value) => option?.id === value}
                                    filterOptions={(options, { inputValue }) =>
                                        options?.filter((option) => option?.firstName?.toLowerCase().includes(inputValue?.toLowerCase()) || option?.lastName?.toLowerCase().includes(inputValue?.toLowerCase()))
                                    }
                                    renderOption={(props, option) => (
                                        <li {...props}>
                                        <Typography variant="subtitle2">{`${option?.firstName} ${option?.lastName}`}</Typography>
                                        </li>
                                    )}
                                    onChange={(event, value) => {
                                        setValue("initiator", value?.id || "");
                                    }}
                                    value={usersData.find((option) => option.id === watch("initiator")) || null}
                                />
                            </Grid>
                        </Grid>


                        <Grid sx={{my : 1}} container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <RHFAutocomplete
                                    disabled={!!verificationForm}
                                    multiple
                                    name="validators"
                                    label="Validators"
                                    options={usersData}
                                    getOptionLabel={(option) => `${option?.firstName} ${option?.lastName}` || ''}
                                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                    filterOptions={(options, { inputValue }) =>
                                        options?.filter((option) =>
                                            option?.firstName?.toLowerCase().includes(inputValue?.toLowerCase()) ||
                                            option?.lastName?.toLowerCase().includes(inputValue?.toLowerCase())
                                        )
                                    }
                                    renderOption={(props, option) => (
                                        <li {...props}>
                                            <Typography variant="subtitle2">
                                                {`${option?.firstName} ${option?.lastName}`}
                                            </Typography>
                                        </li>
                                    )}
                                    onChange={(event, value) => {
                                        setValue("validators", value.map((user) => user.id)); // Store only IDs
                                    }}
                                    value={usersData.filter((option) => watch("validators")?.includes(option.id)) || []}
                                />
                            </Grid>
            
                            <Grid item xs={12} sm={6}>
                                <RHFAutocomplete
                                    disabled={!!verificationForm}
                                    name="user"
                                    label="User"
                                    options={usersData}
                                    getOptionLabel={(option) => `${option?.firstName} ${option?.lastName}` || ''}
                                    isOptionEqualToValue={(option, value) => option?.id === value}
                                    filterOptions={(options, { inputValue }) =>
                                        options?.filter((option) => option?.firstName?.toLowerCase().includes(inputValue?.toLowerCase()) || option?.lastName?.toLowerCase().includes(inputValue?.toLowerCase()))
                                    }
                                    renderOption={(props, option) => (
                                        <li {...props}>
                                        <Typography variant="subtitle2">{`${option?.firstName} ${option?.lastName}`}</Typography>
                                        </li>
                                    )}
                                    onChange={(event, value) => {
                                        setValue("user", value?.id || "");
                                    }}
                                    value={usersData.find((option) => option.id === watch("user")) || null}
                                />
                            </Grid>
                        </Grid>

                        <Grid sx={{my : 1}} container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <RHFAutocomplete
                                    disabled={!!verificationForm}
                                    multiple
                                    name="productionHeads"
                                    label="Production Heads"
                                    options={usersData}
                                    getOptionLabel={(option) => `${option?.firstName} ${option?.lastName}` || ''}
                                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                    filterOptions={(options, { inputValue }) =>
                                        options?.filter((option) =>
                                            option?.firstName?.toLowerCase().includes(inputValue?.toLowerCase()) ||
                                            option?.lastName?.toLowerCase().includes(inputValue?.toLowerCase())
                                        )
                                    }
                                    renderOption={(props, option) => (
                                        <li {...props}>
                                            <Typography variant="subtitle2">
                                                {`${option?.firstName} ${option?.lastName}`}
                                            </Typography>
                                        </li>
                                    )}
                                    onChange={(event, value) => {
                                        setValue("productionHeads", value.map((user) => user.id)); // Store only IDs
                                    }}
                                    value={usersData.filter((option) => watch("productionHeads")?.includes(option.id)) || []}
                                />
                            </Grid>
                        </Grid>
                    </Card>
                    <Card sx={{ p: 3, mt: 2 }}>
                        <Grid item xs={12} md={12}>
                            <Box component='div' sx={{width : '100%', py: 2, px: 1, borderBottom: '2px solid lightGray'}}>
                                <Typography variant='h5'>Family Classification</Typography>
                            </Box>
                            <QuestionerySection formQuestionery={currentForm?.familyClassificationQuestionery} control={control} verificationForm={verificationForm} />
                            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
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

FamilyClassificationSection.propTypes = {
    currentForm: PropTypes.object,
    verificationForm: PropTypes.bool,
};