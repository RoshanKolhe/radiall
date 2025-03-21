import PropTypes from 'prop-types';
import FamilyClassificationSection from './family-classification-section';
import CriticitySection from './criticity-section';
import RequirementChecklistSection from './requirementChecklistSection';
import ApprovalUsersSection from './components/approval-users-table';

// ----------------------------------------------------------------------

export default function ToolsInstallationForm({ currentForm, verificationForm }) {
    console.log('value of verification form',verificationForm);
    return (
        <>
            <FamilyClassificationSection currentForm={currentForm} verificationForm={verificationForm} />
            <CriticitySection currentForm={currentForm} verificationForm={verificationForm} />
            <RequirementChecklistSection currentForm={currentForm} verificationForm={verificationForm} />
            <ApprovalUsersSection validators={currentForm?.validators} productionHeads={currentForm?.productionHeads} />
        </>
    )
}

ToolsInstallationForm.propTypes = {
    currentForm: PropTypes.object,
    verificationForm: PropTypes.bool,
};