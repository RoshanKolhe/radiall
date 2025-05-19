import PropTypes from "prop-types";
import { useEffect, useState } from "react";
//
import { Stack } from "@mui/material";
//
import { useGetMaintainanceChecklistWithFilter } from "src/api/maintainance-checklist";
import ToolInfoCard from "./components/tool-info-card";
import LevelMaintainanceCard from "./components/level-maintainance-card";

// ------------------------------------------------------------------------------------------------------------------------------
export default function CreateMaintainancePlan({currentPlan, toolData}){
    const [levelOneMaintainanceInstructions, setLevelOneMaintainanceInstructions] = useState([]);
    const [levelTwoMaintainanceInstructions, setLevelTwoMaintainanceInstructions] = useState([]);

      const filterLevelOneString = encodeURIComponent(JSON.stringify({ where: { isLevelTwoCheckpoint: false } }));
      const filterLevelTwoString = encodeURIComponent(JSON.stringify({ where: { isLevelTwoCheckpoint: true } }));
    
      const { maintainanceChecklists: levelOneInstructions } = useGetMaintainanceChecklistWithFilter(filterLevelOneString);
      const { maintainanceChecklists: levelTwoInstructions } = useGetMaintainanceChecklistWithFilter(filterLevelTwoString);

      useEffect(() => {
        if(levelOneInstructions){
            setLevelOneMaintainanceInstructions(levelOneInstructions);
        }
      },[levelOneInstructions])

      useEffect(() => {
        if(levelTwoInstructions){
            setLevelTwoMaintainanceInstructions(levelTwoInstructions);
        }
      },[levelTwoInstructions])

    return(
        <Stack direction='column' spacing={1}>
            <ToolInfoCard toolData={toolData} />
            <LevelMaintainanceCard maintainanceData={currentPlan?.levelOnePlan} levelNo={1} toolData={toolData} instructions={levelOneMaintainanceInstructions} maintainanceInstructions={currentPlan?.levelOneInstructions}/>
            {toolData?.isMaintaincePlanNeeded && <LevelMaintainanceCard maintainanceData={currentPlan?.levelTwoPlan} levelNo={2} toolData={toolData} instructions={levelTwoMaintainanceInstructions} maintainanceInstructions={currentPlan?.levelTwoInstructions}/>}
        </Stack>
    )
}

CreateMaintainancePlan.propTypes = {
    currentPlan : PropTypes.object,
    toolData : PropTypes.object,
}