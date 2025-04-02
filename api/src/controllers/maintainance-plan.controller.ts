import { repository } from "@loopback/repository";
import { MaintainancePlanRepository, ToolsRepository } from "../repositories";
import { authenticate } from "@loopback/authentication";
import { PermissionKeys } from "../authorization/permission-keys";
import { get, getModelSchemaRef, HttpErrors, param, patch, post, requestBody, response } from "@loopback/rest";
import { MaintainancePlan } from "../models";

export class MaintainancePlanController {
  constructor(
    @repository(MaintainancePlanRepository)
    public maintainancePlanRepository: MaintainancePlanRepository,
    @repository(ToolsRepository)
    public toolsRepository: ToolsRepository
  ) {}

  // create new maintainance plan...
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.PRODUCTION_HEAD, PermissionKeys.INITIATOR, PermissionKeys.VALIDATOR],
    },
  })
  @post('/maintainance-plan/create')
  @response(200, {
    description: 'Maintenance Plan instance',
    content: {'application/json': {schema: getModelSchemaRef(MaintainancePlan)}},
  })
  async createMaintainancePlan(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MaintainancePlan, {
            title: 'NewMaintainancePlan',
            exclude: ['id'],
          }),
        },
      },
    })
    maintainancePlan: Omit<MaintainancePlan, 'id'>,
  ): Promise<{success: boolean; message: string}> {
    try {
      const createdPlan = await this.maintainancePlanRepository.create(maintainancePlan);

      if(createdPlan){
        if(createdPlan.level === 1){
          await this.toolsRepository.updateById(createdPlan?.toolsId, {levelOneMaintainanceId : createdPlan?.id});
        }

        if(createdPlan?.level === 2){
          await this.toolsRepository.updateById(createdPlan?.toolsId, {levelTwoMaintainanceId : createdPlan?.id});
        }
      }
      return { 
        success: true, 
        message: 'Maintenance Plan created successfully' 
      };
    } catch (error) {
      throw error;
    }
  }

  // update maintainance plan...
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.PRODUCTION_HEAD, PermissionKeys.INITIATOR, PermissionKeys.VALIDATOR],
    },
  })
  @patch('/maintainance-plan/update/{id}')
  async updateMaintainancePlan(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MaintainancePlan, {partial: true}),
        },
      },
    })
    maintainancePlan: MaintainancePlan,
  ): Promise<{success : boolean;  message : string}>{
    try{
      await this.maintainancePlanRepository.updateById(id, maintainancePlan);
      return{
        success : true,
        message : 'Maintaince Plan updated'
      }
    }catch(error){
      throw error;
    }
  }

  // fetch maintainance plan with toolId
  @get('/maintainance-plan-by-toolId/{toolId}')
  async getMaintainancePlanByToolId(
    @param.path.number('toolId') toolId: number
  ): Promise<{success : boolean; message: string; data : {levelOnePlan: MaintainancePlan | null, levelTwoPlan: MaintainancePlan | null}}>{
    try{
      console.log('toolId', toolId);
      const tool = await this.toolsRepository.findById(toolId);

      if(!tool){
        throw new HttpErrors.NotFound('Tool not found');
      }

      let levelOnePlan = null;
      let levelTwoPlan = null;
      if(tool?.levelOneMaintainanceId){
        levelOnePlan = await this.maintainancePlanRepository.findById(tool.levelOneMaintainanceId, {include : [{relation : 'responsibleUser'}, {relation : 'preparedByUser'}]});
      }

      if(tool?.levelTwoMaintainanceId){
        levelTwoPlan = await this.maintainancePlanRepository.findById(tool.levelTwoMaintainanceId, {include : [{relation : 'responsibleUser'}, {relation : 'preparedByUser'}]});
      }

      return{
        success : true,
        message : 'Maintainance plan data',
        data : {
          levelOnePlan : levelOnePlan,
          levelTwoPlan : levelTwoPlan
        }
      }
    }catch(error){
      throw error;
    }
  }
}
