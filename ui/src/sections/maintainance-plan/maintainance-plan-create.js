import PropTypes from "prop-types";
//
import { Stack } from "@mui/material";
//
import ToolInfoCard from "./components/tool-info-card";
import LevelMaintainanceCard from "./components/level-maintainance-card";

// ------------------------------------------------------------------------------------------------------------------------------
export default function CreateMaintainancePlan({currentPlan, toolData}){
    console.log('current plan', currentPlan);
    return(
        <Stack direction='column' spacing={1}>
            <ToolInfoCard toolData={toolData} />
            <LevelMaintainanceCard maintainanceData={currentPlan?.levelOnePlan} levelNo={1} toolData={toolData}/>
            <LevelMaintainanceCard maintainanceData={currentPlan?.levelTwoPlan} levelNo={2} toolData={toolData}/>
        </Stack>
    )
}

CreateMaintainancePlan.propTypes = {
    currentPlan : PropTypes.object,
    toolData : PropTypes.object,
}