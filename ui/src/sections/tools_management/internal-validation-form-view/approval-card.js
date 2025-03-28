import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { Box, Card, Grid, Stack, TextField } from "@mui/material";
import { format } from "date-fns";
import axiosInstance from "src/utils/axios";
import { paths } from "src/routes/paths";

// -----------------------------------------------------------------------------------------------------------------

export default function ApprovalSection({ userData, formId, approvalStatus }) {
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const [approvalDate, setApprovalDate] = useState();
    const [userName, setUserName] = useState(null);
    const [department, setDepartment] = useState('');
    const [remark, setRemark] = useState('');
    const [approveLoading, setApproveLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        if(userData){
            setUserName(`${userData?.user?.firstName} ${userData?.user?.lastName ? userData?.user?.lastName : ''}`);
            setDepartment(userData?.user?.department?.name);
            setRemark(userData?.remark || '');
            setApprovalDate( userData?.isApproved ? format(new Date(userData?.approvalDate), "dd MMMM yyyy") : format(new Date(), "dd MMMM yyyy"))
        }
    },[userData]);

    const handleApproved = async () => {
        try{
            setApproveLoading(true);
            const inputData = {
                internalValidationFormId : formId,
                approvedDate : approvalDate,
                remark : remark || ''
            };

            const response = await axiosInstance.post('/internal-validation-form/user-approval', inputData);
            if(response?.data?.success){
                enqueueSnackbar(response?.data?.message,{variant : 'success'});
                navigate(paths.dashboard.tools.list);
            }else{
                enqueueSnackbar(response?.data?.message,{variant : 'error'});
            }

            setApproveLoading(false);
        }catch(error){
            console.error(error);
        }
    }

    const handleCancel = async () => {
        try{
            if(remark === ''){
                enqueueSnackbar('Please add remark', {variant : 'error'});
                return;
            }
            setSaveLoading(true);

            const inputData = {
                internalValidationFormId : formId,
                remark
            };

            const response = await axiosInstance.post('/internal-validation-form/user-saved-form', inputData);
            if(response?.data?.success){
                enqueueSnackbar(response?.data?.message,{variant : 'success'});
                navigate(paths.dashboard.tools.list);
            }else{
                enqueueSnackbar(response?.data?.message,{variant : 'error'});
            }

            setSaveLoading(false);
        }catch(error){
            console.error(error);
        }
    }

    return(
        <Card sx={{ p: 3, mt: 2 }}>
            <Grid item xs={12} md={12}>
                <Grid sx={{mb : 1}} container spacing={1}>
                    <Grid item xs={6} md={8}>
                        Date
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <TextField fullWidth disabled value={approvalDate} />
                    </Grid>
                </Grid>
                <Grid sx={{mb : 1}} container spacing={1}>
                    <Grid item xs={6} md={8}>
                        Approved By
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <TextField fullWidth disabled value={userName} />
                    </Grid>
                </Grid>
                <Grid sx={{mb : 1}} container spacing={1}>
                    <Grid item xs={6} md={8}>
                        Department
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <TextField fullWidth disabled value={department} />
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={6} md={8}>
                        Remark
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <TextField fullWidth disabled={!!approvalStatus} value={remark} onChange={(e) => setRemark(e.target.value)}/>
                    </Grid>
                </Grid>
                {!approvalStatus && <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                    <Box sx={{display: 'flex', gap:'10px', justifyContent: 'flex-end'}}>
                        <LoadingButton onClick={() => handleApproved()} sx={{color : 'success'}} variant="contained" loading={approveLoading}>
                            Approve
                        </LoadingButton>
                        <LoadingButton onClick={() => handleCancel()} variant="contained" loading={saveLoading}>
                            Save
                        </LoadingButton>
                    </Box>
                </Stack>}
            </Grid>
        </Card>
    )
}

ApprovalSection.propTypes = {
    userData: PropTypes.object,
    formId: PropTypes.number,
    approvalStatus: PropTypes.bool
};