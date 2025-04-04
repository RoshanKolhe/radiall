import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Card, Grid, MenuItem, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types"
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthContext } from "src/auth/hooks";
import FormProvider, { RHFAutocomplete, RHFSelect, RHFTextField } from "src/components/hook-form";
import axiosInstance from 'src/utils/axios';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

// -----------------------------------------------------------------------------------------------------------------
export default function LevelMaintainanceEntryCard({maintainanceData, toolData}){
    const { user: currentUser } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [usersData, setUsersData] = useState([]);
    const levelOptions = [
        {value: 1, label: 'Level 1'},
        {value: 2, label: 'Level 2'}
    ];
    const maintainanceSchema = Yup.object().shape({
        level: Yup.number().required('Please Select level'),
        periodicity: Yup.number().required('Periodicity is required'),
        responsibleUser: Yup.object().nullable().required('Responsible user is required'),
        preparedByUser: Yup.object().nullable().required('Prepared By User is required'),
        description: Yup.string().required('Description is required'),
        date: Yup.string().required('Date is required'),
    });

    const defaultValues = useMemo(
    () => ({
        level: '',
        periodicity: '',
        responsibleUser: null,
        preparedByUser:null,
        description: '',
        date: '',
    }),
    []
    );

    const methods = useForm({
    resolver: yupResolver(maintainanceSchema),
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
        console.info('DATA', formData);

      const inputData = {
        toolsId: toolData?.id,
        maintainancePlanId: formData.level === 1 ? maintainanceData?.levelOnePlan?.id : maintainanceData?.levelTwoPlan?.id,
        isActive: true,
      };

    await axiosInstance.post('/maintainance-entries', inputData);
      enqueueSnackbar('Entry Added');
      navigate(paths.dashboard.maintainancePlan.entries(toolData?.id));
      
    } catch (error) {
        console.error(error);
        enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
            variant: 'error',
        });
    }
    });

    // for autocomplete
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

    useEffect(() => {
        if (maintainanceData) {
            reset(defaultValues);
            // Responsible User...
            const responsibleUserData = maintainanceData?.responsibleUser ? maintainanceData?.responsibleUser : null;
            setUsersData((prev) => [...prev, responsibleUserData]);
            setValue('responsibleUser', responsibleUserData);

            // Prepared By user...
            const preparedByUserData = maintainanceData?.preparedByUser ? maintainanceData?.preparedByUser : currentUser;
            setUsersData((prev) => [...prev, preparedByUserData]);
            setValue('preparedByUser', preparedByUserData);
        }

        if(!maintainanceData){
            const preparedByUserData = currentUser;
            setUsersData((prev) => [...prev, preparedByUserData]);
            setValue('preparedByUser', preparedByUserData);  
        }
    }, [maintainanceData, currentUser, defaultValues, reset, setValue]);

    useEffect(() => {
        if(values.level === 1){
            setValue('date', format(new Date(maintainanceData?.levelOnePlan?.createdAt), 'dd MM yyyy'));
            setValue('description', maintainanceData?.levelOnePlan?.description);
            setValue('periodicity', maintainanceData?.levelOnePlan?.periodicity);
            setValue('responsibleUser', maintainanceData?.levelOnePlan?.responsibleUser);
            setValue('preparedByUser', maintainanceData?.levelOnePlan?.preparedByUser);
        }

        if(values.level === 2){
            setValue('date', format(new Date(maintainanceData?.levelTwoPlan?.createdAt)));
            setValue('description', maintainanceData?.levelTwoPlan?.description);
            setValue('periodicity', maintainanceData?.levelTwoPlan?.periodicity);
            setValue('responsibleUser', maintainanceData?.levelTwoPlan?.responsibleUser);
            setValue('preparedByUser', maintainanceData?.levelTwoPlan?.preparedByUser);
        }
    },[values.level, maintainanceData, setValue])

    return(
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Card sx={{ p: 3, mt: 2 }}>
                <Grid item xs={12} md={12}>
                    <Grid sx={{mt : 1}} container spacing={1.5}>
                        <Grid item xs={12} md={6}>
                            <RHFSelect name='level' label='Level'>
                                {levelOptions?.map((level) => (
                                    <MenuItem key={level.value} value={level.value}>{level.label}</MenuItem>
                                ))}
                            </RHFSelect>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <RHFTextField name='periodicity' label='Periodicity' type='number'/>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <RHFAutocomplete
                                name="responsibleUser"
                                label="Responsible"
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
                                disabled
                                name="preparedByUser"
                                label="Prepared By"
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

                        <Grid item xs={12} md={6}>
                            <RHFTextField disabled name='date' label='Date' />
                        </Grid>

                        <Grid item xs={12} md={12}>
                            <RHFTextField name='description' label='Description' multiline rows={3}/>
                        </Grid>
                    </Grid>
                    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            Save
                        </LoadingButton>
                    </Stack>
                </Grid>
            </Card>
        </FormProvider>        
    )
};

LevelMaintainanceEntryCard.propTypes = {
    maintainanceData : PropTypes.object,
    levelNo: PropTypes.number,
    toolData: PropTypes.object,
}