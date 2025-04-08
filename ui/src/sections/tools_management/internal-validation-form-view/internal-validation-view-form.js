import PropTypes from "prop-types";
import ApprovalUsersSection from "../installation-form-view/components/approval-users-table";
import DimensionsSection from "./dimensions-section";
import FunctionalTestingSection from "./functional-testing-section";
import OtherSection from "./other-section";

// ------------------------------------------------------------------------------------------------------------------------------------

export default function InternalValidationViewForm({ currentForm, verificationForm }){
    console.log('user', currentForm?.user);

    return(
        <>
            <DimensionsSection currentForm={currentForm} verificationForm={verificationForm} />
            <FunctionalTestingSection currentForm={currentForm} verificationForm={verificationForm} />
            <OtherSection currentForm={currentForm} verificationForm={verificationForm} />
            <ApprovalUsersSection validators={currentForm?.validators} productionHeads={currentForm?.productionHeads} approvalUser={currentForm?.user}/>
        </>
    )
}

InternalValidationViewForm.propTypes = {
    currentForm: PropTypes.object,
    verificationForm: PropTypes.bool,
};