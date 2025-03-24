import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axiosInstance from 'src/utils/axios';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAuthContext } from 'src/auth/hooks';
import QuestionerySection from './components/questionery';
// ----------------------------------------------------------------------

export default function FamilyClassificationSection({ currentForm, verificationForm, userData }) {

    const { user: currentUser } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const [usersData, setUsersData] = useState([]);
    const [initiatorsData, setInitiatorsData] = useState([]);
    const [validatorsData, setValidatorsData] = useState([]);
    const [productionHeadsData, setProductionHeadsData] = useState([]);
    const [structuredQuestioneryValues, setStructuredQuestioneryValues] = useState([]);

    useEffect(() => {
        const newValues = currentForm?.familyClassificationQuestionery?.length > 0 ? currentForm?.familyClassificationQuestionery?.map((que) => {
            if (que?.type === 'select') {
                return {
                    [que?.question]: que?.answer !== undefined ? que?.answer : que?.options[0]
                }
            }

            if (que?.type === 'boolean') {
                return {
                    [que?.question]: que?.answer !== undefined ? que?.answer : true
                };
            }

            return {
                [que?.question]: que?.answer !== undefined ? que?.answer : ''
            }
        }) : {};
        const newStructuredQuestioneryValues = Object.entries(newValues || {}).reduce(
            (acc, [_, value]) => ({ ...acc, ...value }), // Flatten indexed objects into a single object
            {}
        );
        setStructuredQuestioneryValues(newStructuredQuestioneryValues);
    }, [currentForm?.familyClassificationQuestionery])

    const NewSupplierSchema = Yup.object().shape({
        partNumber: Yup.string().required('Part Number is required'),
        serialNumber: Yup.number()
            .nullable()
            .transform((value, originalValue) => (originalValue === '' ? null : value))
            .required('Serial Number is required')
            .min(1, 'Serial Number must be at least 1'),
        manufacturer: Yup.string().required('Manufacturer Name is required'),
        supplier: Yup.string().required('Supplier Name is required'),
        initiator: Yup.object().required('Initiator is required'),
        validators: Yup.array()
            .min(1, "At least one Validator is required"),
        productionHeads: Yup.array()
            .min(1, "At least one Production Head is required"),
        user: Yup.object().required('Please Select User'),
        creationDate: Yup.string(),
    });

    const defaultValues = useMemo(() => ({
            partNumber: currentForm?.tools?.partNumber ?? '',
            serialNumber: currentForm?.tools?.meanSerialNumber ?? '',
            manufacturer: currentForm?.tools?.manufacturer?.manufacturer ?? '',
            supplier: currentForm?.tools?.supplier?.supplier ?? '',
            creationDate: currentForm?.tools?.createdAt ? format(new Date(currentForm?.tools?.createdAt), "dd MMMM yyyy, HH:mm") : '',
            initiator: null,
            user: null,
            productionHeads: currentForm?.productionHeads || [],
            validators: [],
            ...structuredQuestioneryValues // Ensure proper merge
        }), [currentForm, structuredQuestioneryValues]);

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
                initiatorId: formData?.initiator?.id,
                userId: formData?.user?.id,
                validatorsId: formData?.validators?.map((value) => value?.id),
                productionHeadsId: formData?.productionHeads?.map((value) => value?.id)
            };

            const response = await axiosInstance.patch(`/update-family-classification/${currentForm?.id}`, inputData);

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
            const user = currentForm?.user ? currentForm.user : null;
            setValue('user', user);
            setUsersData((prev) => [...prev, user]);
            // validator...
            const validatorsArray = currentForm.validators?.map(item => item.user) || [];
            setValidatorsData(validatorsArray);
            setValue('validators', validatorsArray)
            // productionHeads
            const productionHeadsArray = currentForm.productionHeads?.map(item => item.user) || [];
            setProductionHeadsData(productionHeadsArray);
            setValue('productionHeads', productionHeadsArray);

        }
    }, [currentForm, currentUser, defaultValues, reset, setValue]);

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
                                    multiple
                                    name="validators"
                                    label="Validators"
                                    onInputChange={(event) => fetchUsers(event, setValidatorsData, 'validator')}
                                    options={validatorsData}
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
                        </Grid>

                        <Grid sx={{ my: 1 }} container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <RHFAutocomplete
                                    disabled={!!verificationForm}
                                    multiple
                                    name="productionHeads"
                                    label="Production Heads"
                                    onInputChange={(event) => fetchUsers(event, setProductionHeadsData, 'production_head')}
                                    options={productionHeadsData}
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
                    </Card>
                    <Card sx={{ p: 3, mt: 2 }}>
                        <Grid item xs={12} md={12}>
                            <Box component='div' sx={{ width: '100%', py: 2, px: 1, borderBottom: '2px solid lightGray' }}>
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
    userData: PropTypes.object
};