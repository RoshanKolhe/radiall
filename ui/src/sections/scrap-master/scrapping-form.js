import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
//
import { useAuthContext } from 'src/auth/hooks';
import FormSection from './form-section';
import ApprovalUsersSection from './approval-users-table';
import ApprovalSection from './approve-card';

// ----------------------------------------------------------------------

export default function ScrappingForm({ currentForm, verificationForm }) {
    const { user: currentUser } = useAuthContext();
    const [userData, setUserData] = useState(null);
    const [validApprovalUser, setValidApprovalUser] = useState(false);
    const [approvalStatus, setApprovalStatus] = useState(false);
    const [canGiveApproval, setCanGiveApproval] = useState(false);
    const [isInitiator, setIsInitiator] = useState(false);

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

    return (
        <>
            <FormSection currentForm={currentForm} verificationForm={verificationForm} isInitiator={isInitiator}/>
            <ApprovalUsersSection validators={currentForm?.validators} productionHeads={currentForm?.productionHeads} approvalUser={currentForm?.user}/>
            {verificationForm && validApprovalUser && canGiveApproval && <ApprovalSection userData={userData} formId={currentForm?.id} approvalStatus={approvalStatus} />}
        </>
    )
}

ScrappingForm.propTypes = {
    currentForm: PropTypes.object,
    verificationForm: PropTypes.bool,
};