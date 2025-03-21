/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Autocomplete, Box, Button, Card, Grid, MenuItem, Select, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useGetUsers } from 'src/api/user';
import Iconify from 'src/components/iconify';
import axiosInstance from 'src/utils/axios';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

// ---------------------------------------------------------------------------------------------------------------------

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

export default function RequirementChecklistSection({ currentForm, verificationForm }) {
    console.log('requirement', verificationForm);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { users, usersEmpty } = useGetUsers();
    const [checkList, setCheckList] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(currentForm?.requirementChecklist?.length > 0){
            const list = currentForm?.requirementChecklist?.map((item) => ({
                ...item,
                critical: item?.critical || 'md',
                nonCritical: item?.critical || 'md',
                toDo: item?.toDo || false,
                done: item?.done || false,
                actionOwner: item?.actionOwner ? item?.actionOwner?.id : undefined
            }))
            setCheckList(list);
        };
    }, [currentForm?.requirementChecklist])

    const tableHeadNames = [
        { value: 'requirement', label: 'Requirement' },
        { value: 'critical', label: 'Critical' },
        { value: 'nonCritical', label: 'Non Critical' },
        { value: 'toDo', label: 'ToDo' },
        { value: 'actionOwner', label: 'Action Owner' },
        { value: 'done', label: 'Done' },
        { value: 'comment', label: 'Comment' },
        { value: 'upload', label: 'Upload' },
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
        if (users && !usersEmpty) {
            setUsersData(users);
        }
    }, [users, usersEmpty]);

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

    const getUserInfo = (id) => {
        const userInfo = usersData.find((user) => user.id === id);

        if(userInfo){
            return{
                id : userInfo?.id,
                fullName: `${userInfo?.firstName} ${userInfo?.lastName}`,
                role: userInfo?.permissions[0],
            }
        }

        return null;
    }

    const onSubmit = async () => {
        try {
            setIsLoading(true);
            const finalCheckList = checkList.map((item) => ({
                requirement: item?.requirement,
                isNeedUpload: item?.isNeedUpload,
                critical: item.critical,
                nonCritical: item.nonCritical,
                toDo: item.toDo,
                actionOwner: item?.actionOwner ? getUserInfo(item?.actionOwner) : null,
                done: item?.done,
                comment: item?.comment || '',
                upload: item?.upload || '',
            }))
            const inputData = {
                requirementChecklist: finalCheckList,
            };
    
            const response = await axiosInstance.patch(`/update-requirement-checklist/${currentForm?.id}`, inputData);
    
            if(response?.data?.success){
                enqueueSnackbar(response?.data?.message, {variant : 'success'});
                setIsLoading(false);
                navigate(paths.dashboard.tools.list);
            }else{
                enqueueSnackbar(response?.data?.message, {variant : 'error'});
            }
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
            variant: 'error',
            });
        }
    }
    
    return (
        <Card sx={{ p: 3, mt: 2 }}>
            <Grid item xs={12} md={12}>
                <Box component="div" sx={{ width: '100%', py: 2, px: 1, borderBottom: '2px solid lightGray' }}>
                    <Typography variant="h5">Requirement Checklist</Typography>
                </Box>
                <Table sx={{mt: 2}}>
                    <TableHead>
                        <TableRow>
                            {tableHeadNames.map((col) => (
                                <TableCell key={col.value}>{col.label}</TableCell>
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
                                            pointerEvents: verificationForm ? "none" : "auto",
                                            outline: 'none',
                                            '&::before': { borderBottom: 'none' }, 
                                            '&::after': { borderBottom: 'none' }, 
                                            '& .MuiSelect-icon': { right: '5px', display : verificationForm ? "none" :  '' }, 
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
                                            color: criticalOptions.find(opt => opt.value === (checkList[index]?.nonCritical ? checkList[index]?.nonCritical : 'md'))?.color || 'black', 
                                        }}
                                        value={checkList[index]?.nonCritical ?? 'md'}
                                        onChange={(e) => handleChangeValue(e.target.value, index, 'nonCritical')}
                                    >
                                        {criticalOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                        ))}
                                    </Select>
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
                                        value={checkList[index]?.toDo ?? false}
                                        onChange={(e) => handleChangeValue(e.target.value, index, 'toDo')}
                                    >
                                        {todoOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                <TableCell>
                                {verificationForm ? 
                                (checkList[index]?.actionOwner === undefined || checkList[index]?.actionOwner === null)  ? 
                                    (
                                        <p>NA</p>
                                    )
                                : (
                                    <p>{usersData.find((user) => user?.id === checkList[index]?.actionOwner)?.firstName}</p>
                                ) : (
                                    <Autocomplete
                                        disabled={!!verificationForm}
                                        fullWidth
                                        options={usersData}
                                        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                                        value={usersData.find(user => user.id === checkList[index]?.actionOwner) || null}
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
                                <TableCell>
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
                                    !verificationForm && 
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
                                            )
                                        }
                                    </div>
                                ) : (
                                    <p>NA</p>
                                )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Grid>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <Box component='div' sx={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    {!verificationForm && (
                        <>
                            <LoadingButton variant="contained" loading={isLoading} onClick={() => onSubmit()}>
                                Save
                            </LoadingButton>
                            <Button onClick={() => navigate(paths.dashboard.tools.list)} variant='contained'>
                                Cancel
                            </Button>
                        </>
                    )}
                </Box>
            </Stack>
        </Card>
    );
}

RequirementChecklistSection.propTypes = {
    currentForm: PropTypes.object,
    verificationForm: PropTypes.bool,
};
