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
export default function LevelMaintainanceCard({maintainanceData, levelNo, toolData, instructions, maintainanceInstructions}){
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
        maintainanceInstructionsList : Yup.array().min(1,'Maintainance Instructions are required'),
        preparedByUser: Yup.object().nullable().required('Prepared By User is required'),
        description: Yup.string().required('Description is required'),
        date: Yup.string().required('Date is required'),
    });

    const defaultValues = useMemo(
    () => ({
        level: maintainanceData?.level ? maintainanceData?.level : levelNo || '',
        periodicity: maintainanceData?.periodicity || 0,
        responsibleUser: null,
        preparedByUser:null,
        description: maintainanceData?.description || '',
        date: maintainanceData?.createdAt ? format(new Date(maintainanceData?.createdAt), 'dd MM yyyy') : format(new Date(), 'dd MM yyyy'),
        maintainanceInstructionsList: (maintainanceData && maintainanceData?.maintainanceChecklistArray?.length > 0) ?  maintainanceData?.maintainanceChecklistArray : maintainanceInstructions
    }),
    [maintainanceData, levelNo, maintainanceInstructions]
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
        const inputData = {
            toolsId: maintainanceData?.toolsId || toolData?.id,
            level: formData?.level,
            description: formData?.description,
            responsibleUserId: formData?.responsibleUser?.id,
            preparedByUserId: formData?.preparedByUser?.id,
            periodicity: formData?.periodicity,
            isActive: true,
            maintainanceChecklistArray: formData?.maintainanceInstructionsList?.map((item) => item.id)
            };

        if (!maintainanceData) {
            await axiosInstance.post('/maintainance-plan/create', inputData);
        } else {
            await axiosInstance.patch(`/maintainance-plan/update/${maintainanceData?.id}`, inputData);
        }
            enqueueSnackbar(maintainanceData ? 'Update success!' : 'Create success!');
        if(levelNo === 2){
            navigate(paths.dashboard.maintainancePlan.toolList);
        }
        
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
                        departmentId: 5,
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
                            departmentId : 5,
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
  if (values.maintainanceInstructionsList && values.maintainanceInstructionsList.length > 0) {
    const descriptionString = values.maintainanceInstructionsList
      .map((item, index) => `${index + 1}. ${item.checklistPoint}`)
      .join('\n');

    setValue('description', descriptionString);
  }
}, [values.maintainanceInstructionsList, setValue]);

    return(
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Card sx={{ p: 3, mt: 2 }}>
                <Grid item xs={12} md={12}>
                    <Box component='div' sx={{ width: '100%', py: 2, px: 1, borderBottom: '2px solid lightGray' }}>
                        <Typography variant='h5'>{`Level ${levelNo === 1 ? 'One' : 'Two'} Maintainance`}</Typography>
                    </Box>
                    <Grid sx={{mt : 1}} container spacing={1.5}>
                        <Grid item xs={12} md={6}>
                            <RHFSelect disabled name='level' label='Level'>
                                {levelOptions?.map((level) => (
                                    <MenuItem key={level.value} value={level.value}>{level.label}</MenuItem>
                                ))}
                            </RHFSelect>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <RHFTextField name='periodicity' label='Periodicity' type='number'/>
                        </Grid>

                        {/* <Grid item xs={12} sm={6}>
                            <RHFTextField name='responsibleUser' label='Responsible User' />
                        </Grid> */}

                        <Grid item xs={12} sm={6}>
                            <RHFAutocomplete
                                name="responsibleUser"
                                label="Responsible User"
                                options={usersData || []}
                                onInputChange={(event) => fetchUsers(event, setUsersData, 'initiator')}
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
                            <RHFAutocomplete
                                multiple
                                name="maintainanceInstructionsList"
                                label="Maintainance Instructions"
                                options={instructions || []}
                                getOptionLabel={(option) => `${option?.checklistPoint}` || ''}
                                isOptionEqualToValue={(option, value) => option?.id === value.id}
                                filterOptions={(options, { inputValue }) =>
                                    options?.filter((option) => option?.checklistPoint?.toLowerCase().includes(inputValue?.toLowerCase()))
                                }
                                renderOption={(props, option) => (
                                    <li {...props}>
                                        <div>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {`${option?.checklistPoint}`}
                                            </Typography>
                                        </div>
                                    </li>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={12}>
                            <RHFTextField disabled name='description' label='Description' multiline rows={3}/>
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

LevelMaintainanceCard.propTypes = {
    maintainanceData : PropTypes.object,
    levelNo: PropTypes.number,
    toolData: PropTypes.object,
    instructions: PropTypes.array,
    maintainanceInstructions: PropTypes.array,
}