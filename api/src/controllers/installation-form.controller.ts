import { relation, repository } from "@loopback/repository";
import { ApprovalUsersRepository, InstallationFormRepository, ToolsRepository, UserRepository } from "../repositories";
import { authenticate, AuthenticationBindings } from "@loopback/authentication";
import {UserProfile} from '@loopback/security';
import { PermissionKeys } from "../authorization/permission-keys";
import { get, HttpErrors, param, patch, post, requestBody } from "@loopback/rest";
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
    @repository(ToolsRepository)
    public toolsRepository : ToolsRepository,
  ) {}

  // Get installation form of a tool with tool id...
  @authenticate({
    strategy : 'jwt',
    options : {required : [PermissionKeys.ADMIN, PermissionKeys.INITIATOR, PermissionKeys.VALIDATOR]}
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
                { relation: 'manufacturer' },
              ]
            }
          },
          { relation : 'initiator'},
          { relation : 'user', scope : {include : [{relation : 'user', scope : {include : [{relation : 'department'}]}}]}}
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
            {
              relation : 'user',
              scope: {
                include: [{ relation: "department" }],
              },
            }
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
    userId: number,
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

      const validatorIds = approvalValidatorsData?.map((validator) => validator.id) || [];

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

      const productionHeadIds = approvalProductionHeadsData?.map((head) => head.id) || [];

      // check existing record for userId
      const existingUser = await this.approvalUsersRepository.findOne({
        where : {
          userId : userId,
          installationFormId : formId
        }
      });

      if(existingUser){
        await this.installationFormRepository.updateById(formId, {
          userId : existingUser?.id
        });
      }else{
        const userApproval = await this.approvalUsersRepository.create({
          userId: userId,
          installationFormId: formId,
          isApproved: false,
        });

        if(userApproval){
          await this.installationFormRepository.updateById(formId, {
            userId : userApproval?.id
          });
        }
      }

      // Update installation form only if new validators or production heads were added
      if (validatorIds.length  || productionHeadIds.length) {
        if(validatorIds.length <= 0){
          await this.installationFormRepository.updateById(formId, {
            isAllValidatorsApprovalDone : true
          })
        }
        await this.installationFormRepository.updateById(formId, {
          validatorsIds: validatorIds,
          productionHeadIds: productionHeadIds,
        });
      }

      return {
        success: true,
        message: "Validators and production heads and user approval created successfully.",
      };
    } catch (error) {
      throw error;
    }
  }
  
  // update family classification section...
  @authenticate({
    strategy : 'jwt',
    options : {required : [PermissionKeys.ADMIN, PermissionKeys.INITIATOR, PermissionKeys.VALIDATOR]}
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

      const form = await this.installationFormRepository.findById(formId);
      await this.checkFieldValues(form);

      const response = await this.createValidatorsAndHeads(validatorsId, productionHeadsId, userId, formId);

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
    options : {required : [PermissionKeys.ADMIN, PermissionKeys.INITIATOR, PermissionKeys.VALIDATOR]}
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

      const form = await this.installationFormRepository.findById(formId);

      await this.installationFormRepository.updateById(formId, {
        criticityQuestionery : criticity,
        isCriticitySectionDone : true,
      });

      await this.checkFieldValues(form);

      return{
        success : true,
        message : 'form saved in draft'
      }
    }catch(error){
      throw error;
    }
  }

  // update requirement checklist section...
  @authenticate({
    strategy : 'jwt',
    options : {required : [PermissionKeys.ADMIN, PermissionKeys.INITIATOR, PermissionKeys.VALIDATOR]}
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
                            firstName: { type: 'string' },
                            lastName: { type: 'string' },
                            role: { type: 'string' },
                            email: { type: 'string' },
                            department: { 
                              type: 'object',
                            },
                          },
                          required: ['id', 'firstName', 'lastName', 'email', 'role', 'department'],
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
                    routes: {
                      oneOf : [
                        {type : 'object'},
                        {type : 'null'}
                      ]
                    }
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
        actionOwner: {
          id: number;
          firstName: string;
          lastName: string;
          role: string;
          email: string;
          department: object;
        } | any;
        done: boolean;
        comment: string;
        upload: string;
        routes: any;
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

  // Check if all validators have approved
  async checkValidatorsApproval(ids: number[]): Promise<boolean> {
    try {
      const approvalUsers = await this.approvalUsersRepository.find({
        where: { id: { inq: ids } }
      });

      if (approvalUsers.length > 0) {
        const isAllApproved = approvalUsers.every(user => user.isApproved === true);

        if (isAllApproved) {
          // Send email and notifications to production heads
          return true;
        }else{
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error in validators approval:', error);
      return false;
    }
  }

  // Check if all Production Heads have approved
  async checkProductionHeadsApproval(ids: number[]): Promise<boolean> {
    try {
      const approvalUsers = await this.approvalUsersRepository.find({
        where: { id: { inq: ids } }
      });

      if (approvalUsers.length > 0) {
        const isAllApproved = approvalUsers.every(user => user.isApproved === true);

        if (isAllApproved) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error in Production heads approval:', error);
      return false;
    }
  }

  // Check if User have approved
  async checkUserApproval(id: number): Promise<boolean> {
    try {
      const approvalUser = await this.approvalUsersRepository.findById(id);

      if (approvalUser) {
        const isApproved = approvalUser.isApproved === true;

        if (isApproved) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error in User approval:', error);
      return false;
    }
  }

  // check for field values in questionery and change it...
  async checkFieldValues(form: InstallationForm): Promise<void>{
    try{
      if(form){
        const fieldValues = form?.familyClassificationQuestionery
        ?.filter((question) => question?.isFieldChanging)
        ?.map((question) => ({
          fieldValue: question?.fieldName,
          answer: question?.answer
        }));
      
        if (fieldValues?.length > 0) {
          const updatedValues: Record<string, any> = fieldValues.reduce((acc, field) => {
            acc[field.fieldValue] = field.answer;
            return acc;
          }, {} as Record<string, any>);
        
          await this.toolsRepository.updateById(form?.toolsId, updatedValues);
        }      

        const criticityValues = form?.criticityQuestionery
        ?.filter((question) => question?.isFieldChanging)
        ?.map((question) => ({
          fieldValue: question?.fieldName,
          answer: question?.answer
        }));
      
        if (criticityValues?.length > 0) {
          const updatedValues: Record<string, any> = criticityValues.reduce((acc, field) => {
            acc[field.fieldValue] = field.answer;
            return acc;
          }, {} as Record<string, any>);
        
          await this.toolsRepository.updateById(form?.toolsId, updatedValues);
        }      
      }
    }catch(error){
      throw error
    }
  }

  // Check form approval status
  async checkFormApproveStatus(formId: number): Promise<void> {
    try {
      const form = await this.installationFormRepository.findById(formId);
      if (!form) {
        throw new HttpErrors.NotFound('Form not found');
      }

      const allValidatorsApproved = await this.checkValidatorsApproval(form.validatorsIds);

      if (allValidatorsApproved) {
        await this.installationFormRepository.updateById(formId, { isAllValidatorsApprovalDone: true });
      }

      // Await production heads approval check
      const allProductionHeadsApproved = await this.checkProductionHeadsApproval(form.productionHeadIds);

      if(allProductionHeadsApproved){
        await this.installationFormRepository.updateById(formId, { isAllProductionHeadsApprovalDone: true, status: 'approved' });
      };

      // Check User Approval...
      const userApproval = await this.checkUserApproval(form.userId);
      if(userApproval){
        await this.installationFormRepository.updateById(formId, {isUsersApprovalDone : true});
      }

      if(allValidatorsApproved && allProductionHeadsApproved && userApproval){
        await this.checkFieldValues(form);
        const updatedValues = {
          installationStatus : 'approved',
          installationDate : new Date()
        }

        await this.toolsRepository.updateById(form?.id, updatedValues);
        const savedTool = await this.toolsRepository.findById(form?.id);

        if(savedTool && savedTool.installationStatus.toLowerCase() === 'approved' && savedTool.internalValidationStatus.toLowerCase() === 'approved'){
          await this.toolsRepository.updateById(form?.id, {isActive : true, status : 'Operational'});
        }
      }

    } catch (error) {
      console.error('Error in form approval:', error);
    }
  }

  // approval user from approve api....
  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.VALIDATOR] }
  })
  @post('/user-approval')
  async userApproval(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              installationFormId: { type: 'number' },
              approvedDate: { type: 'string' },
              remark: { type: 'string' }
            },
            required: ['installationFormId', 'approvedDate']
          }
        }
      }
    })
    requestBody: {
      installationFormId: number;
      approvedDate: string;
      remark?: string;
    }
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { installationFormId, approvedDate, remark } = requestBody;
  
      const user = await this.userRepository.findById(currentUser.id);
      if (!user) {
        throw new HttpErrors.BadRequest('User not found');
      }
  
      const installationForm = await this.installationFormRepository.findById(installationFormId);
      if (!installationForm) {
        throw new HttpErrors.NotFound('Installation form for this tool not found');
      }
  
      const approvedUser = await this.approvalUsersRepository.findOne({
        where: {
          installationFormId: installationForm.id,
          userId: user.id
        }
      });
  
      if (!approvedUser) {
        throw new HttpErrors.BadRequest('User not found');
      }
  
      await this.approvalUsersRepository.updateById(approvedUser.id, {
        approvalDate: approvedDate,
        isApproved: true,
        remark: remark || ''
      });

      this.checkFormApproveStatus(installationFormId);

      return { success: true, message: 'Approved successfully.' };
  
    } catch (error) {
      throw error;
    }
  }

  // approval user from save api....
  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.VALIDATOR] }
  })
  @post('/user-saved-form')
    async saveFrom(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              installationFormId: { type: 'number' },
              remark: { type: 'string' }
            },
            required: ['installationFormId', 'remark']
          }
        }
      }
    })
    requestBody: {
      installationFormId: number;
      remark: string;
    }
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { installationFormId, remark } = requestBody;

      const user = await this.userRepository.findById(currentUser.id);
      if (!user) {
        throw new HttpErrors.BadRequest('User not found');
      }

      const installationForm = await this.installationFormRepository.findById(installationFormId);
      if (!installationForm) {
        throw new HttpErrors.NotFound('Installation form for this tool not found');
      }

      const approvedUser = await this.approvalUsersRepository.findOne({
        where: {
          installationFormId: installationForm.id,
          userId: user.id
        }
      });

      if (!approvedUser) {
        throw new HttpErrors.BadRequest('User not found');
      }

      await this.approvalUsersRepository.updateById(approvedUser.id, {
        remark: remark
      });

      await this.installationFormRepository.updateById(installationFormId, {isEditable : true});

      // send mail to initiator...

      return { success: true, message: 'Saved successfully.' };

    } catch (error) {
      throw error;
    }
  }
} 
