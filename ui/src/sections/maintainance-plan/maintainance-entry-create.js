import PropTypes from "prop-types";
//
import { Stack } from "@mui/material";
//
import ToolInfoCard from "./components/tool-info-card";
import LevelMaintainanceEntryCard from "./components/maintainanceEntryCard";

// ------------------------------------------------------------------------------------------------------------------------------
export default function CreateMaintainanceEntry({currentPlan, toolData}){
    return(
        <Stack direction='column' spacing={1}>
            <ToolInfoCard toolData={toolData} />
            <LevelMaintainanceEntryCard maintainanceData={currentPlan} toolData={toolData}/>
        </Stack>
    )
}

CreateMaintainanceEntry.propTypes = {
    currentPlan : PropTypes.object,
    toolData : PropTypes.object,
}