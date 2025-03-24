import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
//
import { useAuthContext } from 'src/auth/hooks';
//
import FamilyClassificationSection from './family-classification-section';
import CriticitySection from './criticity-section';
import RequirementChecklistSection from './requirementChecklistSection';
import ApprovalUsersSection from './components/approval-users-table';
import ApprovalSection from './components/approve-card';

// ----------------------------------------------------------------------

export default function ToolsInstallationForm({ currentForm, verificationForm }) {
    const { user: currentUser } = useAuthContext();
    const [userData, setUserData] = useState(null);
    const [validApprovalUser, setValidApprovalUser] = useState(false);
    const [approvalStatus, setApprovalStatus] = useState(false);

    useEffect(() => {
        if (Array.isArray(currentForm?.validators) && Array.isArray(currentForm?.productionHeads) && currentUser) {
            const data = [
                ...(currentForm?.validators ?? []),
                ...(currentForm?.productionHeads ?? [])
            ];
    
            if (data.length > 0) {
                const matchedUser = data.find((item) => item?.userId === currentUser?.id);
            
                if (matchedUser) {
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
            <FamilyClassificationSection currentForm={currentForm} verificationForm={verificationForm} />
            <CriticitySection currentForm={currentForm} verificationForm={verificationForm} />
            <RequirementChecklistSection currentForm={currentForm} verificationForm={verificationForm} />
            <ApprovalUsersSection validators={currentForm?.validators} productionHeads={currentForm?.productionHeads} />
            {verificationForm && validApprovalUser && <ApprovalSection userData={userData} formId={currentForm?.id} approvalStatus={approvalStatus} />}
        </>
    )
}

ToolsInstallationForm.propTypes = {
    currentForm: PropTypes.object,
    verificationForm: PropTypes.bool,
};