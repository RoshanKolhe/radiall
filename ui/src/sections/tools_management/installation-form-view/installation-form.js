import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
// mui
import { Box, Button, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// 
import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/hooks';
import axiosInstance from 'src/utils/axios';
// components
import FamilyClassificationSection from './family-classification-section';
import CriticitySection from './criticity-section';
import RequirementChecklistSection from './requirementChecklistSection';
import ApprovalUsersSection from './components/approval-users-table';
import ApprovalSection from './components/approve-card';


// ----------------------------------------------------------------------

export default function ToolsInstallationForm({ currentForm, verificationForm }) {
    const { user: currentUser } = useAuthContext();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [userData, setUserData] = useState(null);
    const [validApprovalUser, setValidApprovalUser] = useState(false);
    const [approvalStatus, setApprovalStatus] = useState(false);
    const [canGiveApproval, setCanGiveApproval] = useState(false);
    const [isInitiator, setIsInitiator] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if(currentUser?.permissions && (currentUser?.permissions?.includes('admin') || (currentUser?.permissions?.includes('initiator')))){
            setIsInitiator(true);
        }
        const validatorsArray = currentForm?.validators || [] ;
        if (Array.isArray(validatorsArray) && Array.isArray(currentForm?.productionHeads) && currentUser && currentForm?.user) {
            const data = [
                ...(currentForm?.validators ?? []),
                ...(currentForm?.productionHeads ?? []),
                ...(currentForm?.user ? [currentForm.user] : [])
            ];            
    
            if (data.length > 0) {
                const matchedUser = data.find((item) => item?.userId === currentUser?.id);
            
                if (matchedUser) {
                    const role = matchedUser?.user?.permissions;
                    if(role?.length > 0 && role?.includes('production_head')){
                        if(currentForm?.isUsersApprovalDone && currentForm?.isAllValidatorsApprovalDone && !currentForm?.isEditable){
                            setCanGiveApproval(true);
                        }
                    }

                    if(role?.length > 0 && role?.includes('validator')){
                        if(currentForm?.user?.id === matchedUser?.id){
                            setCanGiveApproval(true);
                        }

                        else if(currentForm?.isUsersApprovalDone){
                            setCanGiveApproval(true);
                        }
                    }

                    setUserData(matchedUser);
                    setValidApprovalUser(true);
                    setApprovalStatus(!!matchedUser.isApproved);
                } else {
                    setValidApprovalUser(false);
                }
            }            
        }
    }, [currentUser, currentForm]);

    const onSubmit = async() => {
        try{
            setIsLoading(true);
            const response = await axiosInstance.post(`/save-installation-form/${currentForm?.id}`);
            if(response?.data?.success){
                setIsLoading(false);
                enqueueSnackbar(response?.data?.message, {variant : 'success'});
                navigate(paths.dashboard.tools.list);
            }

            else if(!response?.data?.success){
                setIsLoading(false);
                enqueueSnackbar(response?.data?.message, {variant : 'error'});
            }
        }catch(error){
            console.error(error);
        }
    };

    return (
        <>
            <FamilyClassificationSection currentForm={currentForm} verificationForm={verificationForm} isInitiator={isInitiator} />
            <CriticitySection currentForm={currentForm} verificationForm={verificationForm} isInitiator={isInitiator}/>
            <RequirementChecklistSection currentForm={currentForm} verificationForm={verificationForm} isInitiator={isInitiator}/>
            <ApprovalUsersSection validators={currentForm?.validators} productionHeads={currentForm?.productionHeads} approvalUser={currentForm?.user}/>
            {!verificationForm && <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <Box component='div' sx={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    {(!verificationForm && !!isInitiator) && (
                        <>
                            <LoadingButton variant="contained" loading={isLoading} onClick={() => onSubmit()}>
                                Submit
                            </LoadingButton>
                            <Button onClick={() => navigate(paths.dashboard.tools.list)} variant='contained'>
                                Cancel
                            </Button>
                        </>
                    )}
                </Box>
            </Stack>}
            {verificationForm && validApprovalUser && canGiveApproval && <ApprovalSection userData={userData} formId={currentForm?.id} approvalStatus={approvalStatus} />}
        </>
    )
}

ToolsInstallationForm.propTypes = {
    currentForm: PropTypes.object,
    verificationForm: PropTypes.bool,
};