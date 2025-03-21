import { relation, repository } from "@loopback/repository";
import { ApprovalUsersRepository, InstallationFormRepository, UserRepository } from "../repositories";
import { authenticate, AuthenticationBindings } from "@loopback/authentication";
import {UserProfile} from '@loopback/security';
import { PermissionKeys } from "../authorization/permission-keys";
import { get, HttpErrors, param, patch, requestBody } from "@loopback/rest";
import { InstallationForm } from "../models";
import { inject } from "@loopback/core";

export class InstallationFormController {
  constructor(
    @repository(InstallationFormRepository)
    public installationFormRepository : InstallationFormRepository,
    @repository(UserRepository)
    public userRepository : UserRepository,
    @repository(ApprovalUsersRepository)
    public approvalUsersRepository : ApprovalUsersRepository,
  ) {}

  // Get installation form of a tool with tool id...
  @authenticate({
    strategy : 'jwt',
    options : {required : [PermissionKeys.PRODUCTION_HEAD, PermissionKeys.INITIATOR, PermissionKeys.VALIDATOR]}
  })
  @get('/installation-form/form-by-toolId/{toolId}')
  async formByToolId(
    @param.path.number('toolId') toolId : number
  ) : Promise<{
    success : boolean;
    message : string;
    data : object | null;
  }>{
    try{
      const installationForm : any = await this.installationFormRepository.findOne({
        where: { toolsId: toolId },
        include: [
          {
            relation: 'tools',
            scope: {
              include: [
                { relation: 'supplier' },
                { relation: 'manufacturer' }
              ]
            }
          }
        ]
      });
      
      if(!installationForm){
        throw new HttpErrors.NotFound('No installation form against this tool');
      }

      const validatorIds = installationForm.validatorsIds || [];

      let validators : any;

      if (validatorIds.length > 0) {
        validators = await this.approvalUsersRepository.find({
          where: {
            id: { inq: validatorIds }
          },
          include: [
            {
              relation: "user",
              scope: {
                include: [{ relation: "department" }],
              },
            },
          ]
          
        });
      }

      const productionHeadIds = installationForm.productionHeadIds || [];

      let productionHeads : any;

      if (productionHeadIds.length > 0) {
        productionHeads = await this.approvalUsersRepository.find({
          where: {
            id: { inq: productionHeadIds }
          },
          include: [
            {relation : 'user'}
          ]
        });
      }

      const finalData = {
        ...installationForm,
        validators : validators,
        productionHeads : productionHeads
      }

      return{
        success : true,
        message : 'Installation Form Data',
        data : finalData
      }
    }catch(error){
      throw error;
    }
  }

  // Create approval users...
  async createValidatorsAndHeads(
    validatorsId: number[],
    productionHeadsId: number[],
    formId: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Fetch existing records to avoid duplicates
      const existingValidators = await this.approvalUsersRepository.find({
        where: {
          userId: { inq: validatorsId },
          installationFormId: formId,
        },
      });

      const existingValidatorIds = new Set(existingValidators.map((v) => v.userId));

      // Filter out validators that already exist
      const newValidatorsData = validatorsId
        .filter((id) => !existingValidatorIds.has(id))
        .map((id) => ({
          userId: id,
          installationFormId: formId,
          isApproved: false,
        }));

      const approvalValidatorsData = newValidatorsData.length
        ? await this.approvalUsersRepository.createAll(newValidatorsData)
        : [];

      const validatorIds = approvalValidatorsData.map((validator) => validator.id);

      // Fetch existing production heads
      const existingProductionHeads = await this.approvalUsersRepository.find({
        where: {
          userId: { inq: productionHeadsId },
          installationFormId: formId,
        },
      });

      const existingProductionHeadIds = new Set(existingProductionHeads.map((h) => h.userId));

      // Filter out production heads that already exist
      const newProductionHeadsData = productionHeadsId
        .filter((id) => !existingProductionHeadIds.has(id))
        .map((id) => ({
          userId: id,
          installationFormId: formId,
          isApproved: false,
        }));

      const approvalProductionHeadsData = newProductionHeadsData.length
        ? await this.approvalUsersRepository.createAll(newProductionHeadsData)
        : [];

      const productionHeadIds = approvalProductionHeadsData.map((head) => head.id);

      // Update installation form only if new validators or production heads were added
      if (validatorIds.length || productionHeadIds.length) {
        await this.installationFormRepository.updateById(formId, {
          validatorsIds: validatorIds,
          productionHeadIds: productionHeadIds,
        });
      }

      return {
        success: true,
        message: "Validators and production heads created successfully.",
      };
    } catch (error) {
      throw error;
    }
  }
  
  // update family classification section...
  @authenticate({
    strategy : 'jwt',
    options : {required : [PermissionKeys.PRODUCTION_HEAD, PermissionKeys.INITIATOR, PermissionKeys.VALIDATOR]}
  })
  @patch('/update-family-classification/{id}')
  async updateFamilyClassiffication(
    @param.path.number('id') formId : number,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              initiatorId: {
                type : 'number'
              },
              userId: {
                type : 'number'
              },
              validatorsId: {
                type : 'array',
                items : {
                  type : 'number'
                }
              },
              productionHeadsId: {
                type : 'array',
                items : {
                  type : 'number'
                }
              },
              familyClassification: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    question: {
                      type: 'string'
                    },
                    type: {
                      type: 'string'
                    },
                    options: {
                      type: 'array',
                      items: {
                        type: 'string'
                      }
                    },
                    isFieldChanging: {
                      type: 'boolean'
                    },
                    fieldName: {
                      type: 'string'
                    },
                    answer: {
                      oneOf: [
                        { type: 'string' },
                        { type: 'boolean' },
                        { type: 'number' },
                        { type: 'null' } 
                      ]
                    }                    
                  },
                }
              }
            }
          }
        }
      }
    })
    requestBody: {
      initiatorId: number;
      userId: number;
      validatorsId: number[];
      productionHeadsId: number[];
      familyClassification: Array<{
        question: string;
        type: string;
        options: string[];
        isFieldChanging: boolean;
        fieldName: string;
        answer: any;
      }>;
    }
  ):Promise<{
    success : boolean;
    message : string;
  }>{
    try{
      const { familyClassification, initiatorId, userId, validatorsId, productionHeadsId } = requestBody;

      await this.installationFormRepository.updateById(formId, {
        familyClassificationQuestionery : familyClassification,
        isFamilyClassificationSectionDone : true,
        initiatorId : initiatorId,
        userId : userId,
      });

      const response = await this.createValidatorsAndHeads(validatorsId, productionHeadsId, formId);

      if(response.success){
        return{
          success : true,
          message : 'form saved in draft'
        }
      }

      return{
        success : true,
        message : 'something went wrong'
      }
    }catch(error){
      throw error;
    }
  }

  // update Criticity section...
  @authenticate({
    strategy : 'jwt',
    options : {required : [PermissionKeys.PRODUCTION_HEAD, PermissionKeys.INITIATOR, PermissionKeys.VALIDATOR]}
  })
  @patch('/update-criticity/{id}')
  async updateCriticityClassiffication(
    @param.path.number('id') formId : number,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              criticity: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    question: {
                      type: 'string'
                    },
                    type: {
                      type: 'string'
                    },
                    options: {
                      type: 'array',
                      items: {
                        type: 'string'
                      }
                    },
                    isFieldChanging: {
                      type: 'boolean'
                    },
                    fieldName: {
                      type: 'string'
                    },
                    answer: {
                      oneOf: [
                        { type: 'string' },
                        { type: 'boolean' },
                        { type: 'number' },
                        { type: 'null' } 
                      ]
                    }                    
                  },
                }
              }
            }
          }
        }
      }
    })
    requestBody: {
      criticity: Array<{
        question: string;
        type: string;
        options: string[];
        isFieldChanging: boolean;
        fieldName: string;
        answer: any;
      }>;
    }
  ):Promise<{
    success : boolean;
    message : string;
  }>{
    try{
      const { criticity } = requestBody;

      await this.installationFormRepository.updateById(formId, {
        criticityQuestionery : criticity,
        isCriticitySectionDone : true,
      });

      return{
        success : true,
        message : 'form saved in draft'
      }
    }catch(error){
      throw error;
    }
  }

  // update Criticity section...
  @authenticate({
    strategy : 'jwt',
    options : {required : [PermissionKeys.PRODUCTION_HEAD, PermissionKeys.INITIATOR, PermissionKeys.VALIDATOR]}
  })
  @patch('/update-requirement-checklist/{id}')
  async updateRequirementCheckllist(
    @param.path.number('id') formId : number,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              requirementChecklist: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    requirement: {
                      type: 'string',
                    },
                    isNeedUpload: {
                      type: 'boolean',
                    },
                    critical: {
                      type: 'string',
                    },
                    nonCritical: {
                      type: 'string',
                    },
                    toDo: {
                      type: 'boolean',
                    },
                    actionOwner: {
                      oneOf: [
                        {
                          type: 'object',
                          properties: {
                            id: { type: 'number' },
                            fullName: { type: 'string' },
                            role: { type: 'string' },
                          },
                          required: ['id', 'fullName', 'role'],
                        },
                        { type: 'null' },
                      ],
                    },
                    done: {
                      type: 'boolean',
                    },
                    comment: {
                      type: 'string',
                    },
                    upload: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      },
    })
    requestBody: {
      requirementChecklist: Array<{
        requirement: string;
        isNeedUpload: boolean;
        critical: string;
        nonCritical: string;
        toDo: boolean;
        actionOwner: any;
        done: boolean;
        comment: string;
        upload: string;
      }>;
    }
  ):Promise<{
    success : boolean;
    message : string;
  }>{
    try{
      const { requirementChecklist } = requestBody;

      const form = await this.installationFormRepository.findById(formId);

      if(form && (!form.isFamilyClassificationSectionDone || !form.isCriticitySectionDone)){
        return{
          success : false,
          message : 'Please Complete all sections'
        }
      }

      await this.installationFormRepository.updateById(formId, {
        requirementChecklist : requirementChecklist,
        isRequirementChecklistSectionDone : true,
        isEditable : false,
      });

      // make function to send notification and emails to validators for approval...

      return{
        success : true,
        message : 'Installation form completed'
      }
    }catch(error){
      throw error;
    }
  }

}
