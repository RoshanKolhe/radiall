import { DefaultTransactionalRepository, IsolationLevel, repository } from "@loopback/repository";
import { inject } from "@loopback/core";
import { authenticate } from "@loopback/authentication";
import { PermissionKeys } from "../authorization/permission-keys";
import { get, getModelSchemaRef, param, patch, post, requestBody, response } from "@loopback/rest";
import { RadiallDataSource } from "../datasources";
import { ChecklistRepository, InstallationFormRepository, QuestioneryRepository, ToolsRepository } from "../repositories";
import { Tools } from "../models";
import { QuestionSectionKeys } from "../questionery-section/questionery-section";
import { FormNameKeys } from "../form-name/form-name";

export class ToolsManagementController {
  constructor(
    @inject('datasources.radiall')
    public dataSource: RadiallDataSource,
    @repository(ToolsRepository)
    public toolsRepository : ToolsRepository,
    @repository(InstallationFormRepository)
    public installationFormRepository: InstallationFormRepository,
    @repository(QuestioneryRepository)
    public questioneryRepository: QuestioneryRepository,
    @repository(ChecklistRepository)
    public checklistRepository: ChecklistRepository,
  ) {}

  // creation of tool for tool entry form...
  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.PRODUCTION_HEAD, PermissionKeys.INITIATOR, PermissionKeys.VALIDATOR]},
  })
  @post('/tools/create')
  @response(200, {
    description: 'ToolType model instance',
    content: {'application/json': {schema: getModelSchemaRef(Tools)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tools, {
            exclude: ['id'],
          }),
        },
      },
    })
    toolData: Omit<Tools, 'id'>,
  ): Promise<{ success: boolean; message: string }> {
    const tx = await this.toolsRepository.dataSource.beginTransaction(IsolationLevel.READ_COMMITTED);
    try {
      const savedTool = await this.toolsRepository.create(toolData);
  
      if (savedTool) {
        // creating installation form for new tool
        const familyClassificationQuestionery = await this.questioneryRepository.find({
          where: { sectionName: QuestionSectionKeys.FAMILY_CLASSIFICATION },
        });
  
        const criticityQuestionery = await this.questioneryRepository.find({
          where: { sectionName: QuestionSectionKeys.CRITICITY },
        });
  
        const requirementChecklist = await this.checklistRepository.find({
          where: { formName: FormNameKeys.INSTALLATION_FORM },
        });
  
        const installationFormData = {
          toolsId: savedTool.id,
          familyClassificationQuestionery: familyClassificationQuestionery.map((question) =>({
            question: question.question,
            type: question.type,
            options: question.options,
            isFieldChanging: question.isFieldChanging,
            fieldName: question.fieldName,
            answer: undefined,
          })),
          isFamilyClassificationSectionDone: false,
          criticityQuestionery: criticityQuestionery.map((question) =>({
            question: question.question,
            type: question.type,
            options: question.options,
            isFieldChanging: question.isFieldChanging,
            fieldName: question.fieldName,
            answer: undefined,
          })),
          isCriticitySecctionDone: false,
          requirementChecklist: requirementChecklist.map((requirement) => ({
            requirement: requirement.requirement,
            isNeedUpload: requirement.isNeedUpload,
            critical: undefined,
            nonCritical: undefined,
            toDo: undefined,
            actionOwner: undefined,
            done: undefined,
            comment: undefined,
            upload: undefined,
          })),
          isRequirementChecklistSectionDone: false,
          isAllValidatorsApprovalDone: false,
          isAllProductionHeadsApprovalDone: false,
          isEditable: true,
          status: 'pending',
        };
  
        await this.installationFormRepository.create(installationFormData);
      }
  
      await tx.commit(); 
      return { success: true, message: 'Tool created successfully' };
    } catch (error) {
      await tx.rollback(); 
      throw error;
    }
  }
  
  // searching tool before making new entry...
  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.PRODUCTION_HEAD, PermissionKeys.INITIATOR, PermissionKeys.VALIDATOR] },
  })
  @post('/tools/search-tool')
  async searchTool(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              partNumber: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    requestBody: { partNumber: string }
  ): Promise<{
    success: boolean;
    message: string;
    data?: object;
  }> {
    try {
      const tools = await this.toolsRepository.find({
        where: { partNumber: requestBody.partNumber },
        order: ['createdAt DESC'], 
        limit: 1, 
      });
  
      if (tools.length > 0) {
        return {
          success: true,
          message: 'Tool found',
          data: tools[0], 
        };
      } else {
        return {
          success: false,
          message: 'Tool not found',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  // fetch tools list...
  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.PRODUCTION_HEAD, PermissionKeys.INITIATOR, PermissionKeys.VALIDATOR] },
  })
  @get('/tools/list')
  async fetchToolsList(): Promise<{
    success : boolean;
    message : string;
    data : Tools[];
  }> {
    try{
      const tools = await this.toolsRepository.find({ order: ['createdAt DESC'], include : [{relation : 'toolType'}, {relation : 'storageLocation'}] });

      return{
        success : true,
        message : 'Tools list',
        data : tools
      }
    }catch(error){
      throw error;
    }
  }

  // update tool by id...
  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.PRODUCTION_HEAD]},
  })
  @patch('/tools/update/{id}')
  @response(204, {
    description: 'ToolType PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tools, {partial: true}),
        },
      },
    })
    toolData: Tools,
  ): Promise<{
    success : boolean;
    message : string;
  }> {
    try{
      await this.toolsRepository.updateById(id, toolData);

      return{
        success : true,
        message : 'update success'
      }
    }catch(error){
      throw error;
    }
  }

  // get tool by id...
  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.PRODUCTION_HEAD, PermissionKeys.INITIATOR, PermissionKeys.VALIDATOR] },
  })
  @get('/tools/{id}')
  async getToolById(
    @param.path.number('id') toolId : number
  ):Promise<{
    success : boolean;
    message : string;
    data : Tools | null;
  }>{
    try{
      const toolData = await this.toolsRepository.findOne(
        {where : 
          {id : toolId}, 
          include : [
            {relation : 'toolType'}, 
            {relation : 'manufacturer'}, 
            {relation : 'supplier'}, 
            {relation : 'storageLocation'}
          ]
        }
      );

      return{
        success : true,
        message : 'Tool Data',
        data : toolData
      }
    }catch(error){
      throw error;
    }
  }
}  
