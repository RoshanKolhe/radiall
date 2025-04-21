import PropTypes from "prop-types";
//
import { Stack } from "@mui/material";
//
import LevelMaintainanceCard from "./level-maintainance-card";

// ------------------------------------------------------------------------------------------------------------------------------
export default function CreateMaintainancePlan({currentPlan, toolData}){
    return(
        <Stack direction='column' spacing={1}>
            <LevelMaintainanceCard maintainanceData={currentPlan} levelNo={1} toolData={toolData}/>
        </Stack>
    )
}

CreateMaintainancePlan.propTypes = {
    currentPlan : PropTypes.object,
    toolData : PropTypes.object,
}