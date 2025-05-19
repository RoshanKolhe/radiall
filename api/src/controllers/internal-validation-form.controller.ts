import { repository } from "@loopback/repository";
import { authenticate, AuthenticationBindings } from "@loopback/authentication";
import { get, HttpErrors, param, patch, post, requestBody } from "@loopback/rest";
import { PermissionKeys } from "../authorization/permission-keys";
import { ApprovalUsersRepository, HistoryCardRepository, InternalValidationFormRepository, InternalValidationHistoryRepository, ToolsRepository, UserRepository } from "../repositories";
import { UserProfile } from "@loopback/security";
import { inject } from "@loopback/core";
import { EventSchedular } from "../services/event-schedular.service";
import { NotificationService } from "../services/notification.service";

export class InternalValidationFormController {
  constructor(
      @repository(InternalValidationFormRepository)
      public internalValidationFormRepository : InternalValidationFormRepository,
      @repository(UserRepository)
      public userRepository : UserRepository,
      @repository(ApprovalUsersRepository)
      public approvalUsersRepository : ApprovalUsersRepository,
      @repository(ToolsRepository)
      public toolsRepository : ToolsRepository,
      @repository(InternalValidationHistoryRepository)
      public internalValidationHistoryRepository: InternalValidationHistoryRepository, 
      @inject('service.eventScheduler.service')
      public eventSchedulerService: EventSchedular,
      @inject('service.notification.service')
      public notificationService: NotificationService,
      @repository(HistoryCardRepository)
      public historyCardRepository: HistoryCardRepository
    ) {}
  
    // Get internal validation form of a tool with tool id...
    @authenticate({
      strategy : 'jwt',
      options : {required : [PermissionKeys.ADMIN, PermissionKeys.INITIATOR, PermissionKeys.VALIDATOR]}
    })
    @get('/internal-validation-form/form-by-toolId/{toolId}')
    async formByToolId(
      @param.path.number('toolId') toolId : number
    ) : Promise<{
      success : boolean;
      message : string;
      data : object | null;
    }>{
      try{
        const internalValidationForm : any = await this.internalValidationFormRepository.findOne({
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
            { relation : 'initiator' },
            { relation : 'user', scope : {include : [{relation : 'user', scope : {include : [{relation : 'department'}]}}]}}
          ]
        });
        
        if(!internalValidationForm){
          throw new HttpErrors.NotFound('No internal validation form against this tool');
        }
  
        const validatorIds = internalValidationForm.validatorsIds || [];
  
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
  
        const productionHeadIds = internalValidationForm.productionHeadIds || [];
  
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

        const previousForms : any = [];

        const previousFormsData = await this.internalValidationHistoryRepository.find({where : {toolsId : toolId}});

        if(previousFormsData?.length > 0){
          await Promise.all(previousFormsData?.map((form) => {
            if(form?.createdAt){
              const date = new Date(form.createdAt);
              previousForms.push({formId: form?.id, date: date});
            }
          }))
        }
  
        const finalData = {
          ...internalValidationForm,
          validators : validators,
          productionHeads : productionHeads,
          previousYearForms : previousForms
        }
  
        return{
          success : true,
          message : 'Internal validation Form Data',
          data : finalData,
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
            internalValidationFormId: formId,
          },
        });

        const existingValidatorIds = new Set(existingValidators.map((v) => v.userId));

        // Filter out validators that already exist
        const newValidatorsData = validatorsId
          .filter((id) => !existingValidatorIds.has(id))
          .map((id) => ({
            userId: id,
            internalValidationFormId: formId,
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
            internalValidationFormId: formId,
          },
        });

        const existingProductionHeadIds = new Set(existingProductionHeads.map((h) => h.userId));

        // Filter out production heads that already exist
        const newProductionHeadsData = productionHeadsId
          .filter((id) => !existingProductionHeadIds.has(id))
          .map((id) => ({
            userId: id,
            internalValidationFormId: formId,
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
            internalValidationFormId : formId
          }
        });

        if(existingUser){
          await this.internalValidationFormRepository.updateById(formId, {
            userId : existingUser?.id
          });
        }else{
          const userApproval = await this.approvalUsersRepository.create({
            userId: userId,
            internalValidationFormId: formId,
            isApproved: false,
          });

          if(userApproval){
            await this.internalValidationFormRepository.updateById(formId, {
              userId : userApproval?.id
            });
          }
        }

        // Update installation form only if new validators or production heads were added
        if (validatorIds.length  || productionHeadIds.length) {
          if(validatorIds.length <= 0){
            await this.internalValidationFormRepository.updateById(formId, {
              isAllValidatorsApprovalDone : true
            })
          }
          await this.internalValidationFormRepository.updateById(formId, {
            validatorsIds: validatorIds,
            productionHeadIds: productionHeadIds,
          });
        }

        return {
          success: true,
          message: "Validators and production heads approval created successfully.",
        };
      } catch (error) {
        throw error;
      }
    } 

    // update dimension section...
    @authenticate({
      strategy : 'jwt',
      options : {required : [PermissionKeys.ADMIN, PermissionKeys.INITIATOR, PermissionKeys.VALIDATOR]}
    })
    @patch('/update-dimensions-section/{id}')
    async updateDimensionsSection(
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
                dimensionsQuestionery: {
                  type: 'object',
                  properties: {
                    finding: {
                      type: 'string'
                    },
                    result: {
                      type: 'boolean'
                    },
                    evidences: {
                      type: 'array',
                      items: {
                        type: 'string'
                      }
                    },
                    controlledBy: {
                      type: 'object',
                      properties : {
                        id : {
                          type : 'number'
                        },
                        firstName : {
                          type : 'string'
                        },
                        lastName : {
                          type : 'string'
                        },
                        role : {
                          type : 'string'
                        },
                        department: {
                          type : 'string'
                        },
                        email: {
                          type : 'string'
                        }
                      }
                    },
                    date: {
                      type: 'string'
                    }
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
        dimensionsQuestionery: {
          finding: string;
          result: boolean;
          evidences: string[];
          controlledBy: {
            id : number,
            firstName : string,
            lastName : string,
            role: string;
            department: string;
            email: string;
          };
          date: Date;
        };
      }
    ):Promise<{
      success : boolean;
      message : string;
    }>{
      try{
        const { dimensionsQuestionery, initiatorId, userId, validatorsId, productionHeadsId } = requestBody;
  
        await this.internalValidationFormRepository.updateById(formId, {
          dimensionsQuestionery : dimensionsQuestionery,
          isDimensionsSectionDone : true,
          initiatorId : initiatorId,
          userId : userId,
        });
  
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

    // update functional testing section...
    @authenticate({
      strategy : 'jwt',
      options : {required : [PermissionKeys.ADMIN, PermissionKeys.INITIATOR, PermissionKeys.VALIDATOR]}
    })
    @patch('/update-functional-testing-section/{id}')
    async functionalTestingSection(
      @param.path.number('id') formId : number,
      @requestBody({
        content: {
          'application/json': {
            schema: {
              properties: {
                functionalTesting: {
                  type: 'object',
                  properties: {
                    finding: {
                      type: 'string'
                    },
                    result: {
                      type: 'boolean'
                    },
                    description: {
                      type: 'string'
                    },
                    evidences: {
                      type: 'array',
                      items: {
                        type: 'string'
                      }
                    },
                    controlledBy: {
                      type: 'object',
                      properties : {
                        id : {
                          type : 'number'
                        },
                        firstName : {
                          type : 'string'
                        },
                        lastName : {
                          type : 'string'
                        },
                        role : {
                          type : 'string'
                        },
                        department: {
                          type : 'string'
                        },
                        email: {
                          type : 'string'
                        }
                      }
                    },
                    moNumber: {
                      type: 'string'
                    },
                    moPartNumber: {
                      type: 'string'
                    },
                    testingQuantity: {
                      type: 'number'
                    },
                    totalQuantity: {
                      type: 'number'
                    },
                    date: {
                      type: 'string'
                    }
                  }                    
                }
              }
            }
          }
        }
      })
      requestBody: {
        functionalTesting: {
          finding: string;
          result: boolean;
          description: string;
          evidences: string[];
          controlledBy: {
            id : number,
            firstName : string,
            lastName : string,            
            role: string;
            department: string;
            email: string;
          };
          moNumber: string;
          moPartNumber: string;
          testingQuantity: number;
          totalQuantity: number;
          date: Date;
        };
      }
    ):Promise<{
      success : boolean;
      message : string;
    }>{
      try{
        const { functionalTesting } = requestBody;
  
        await this.internalValidationFormRepository.updateById(formId, {
          functionalTestingQuestionery : functionalTesting,
          isFunctionalTestingSectionDone : true,
        });
     
        return{
          success : true,
          message : 'form saved in draft'
        }
      }catch(error){
        throw error;
      }
    }

    // update other section...
    @authenticate({
      strategy : 'jwt',
      options : {required : [PermissionKeys.ADMIN, PermissionKeys.INITIATOR, PermissionKeys.VALIDATOR]}
    })
    @patch('/update-other-section/{id}')
    async updateInternalValidationForm(
      @param.path.number('id') formId: number,
      @requestBody({
        content: {
          'application/json': {
            schema: {
              properties: {
                otherSection: {
                  type: 'object',
                  properties: {
                    finding: { type: 'string' },
                    result: { type: 'boolean' },
                    description: { type: 'string' },
                    evidences: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                    controlledBy: {
                      oneOf: [
                        { type: 'null' },  // Allow null value
                        {
                          type: 'object',
                          properties: {
                            id: { type: 'number' },
                            firstName: { type: 'string' },
                            lastName: { type: 'string' },
                            role: { type: 'string' },
                            department: { type: 'string' },
                            email: { type: 'string' },
                          },
                        },
                      ],
                    },
                    moNumber: {
                      oneOf : [
                        { type: 'string' },
                        { type: 'null'}
                      ]
                    },
                    moPartNumber: {
                      oneOf : [
                        { type: 'string' },
                        { type: 'null'}
                      ]
                    },
                    testingQuantity: {
                      oneOf : [
                        { type: 'number' },
                        { type: 'null'}
                      ]
                    },
                    totalQuantity: {
                      oneOf : [
                        { type: 'number' },
                        { type: 'null'}
                      ]
                    },
                    date: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      })
      requestBody: {
        otherSection: {
          finding: string;
          result: boolean;
          description: string;
          evidences: string[];
          controlledBy?: {
            id: number;
            firstName: string;
            lastName: string;
            role: string;
            department: string;
            email: string;
          };
          moNumber?: string;
          moPartNumber?: string;
          testingQuantity?: number;
          totalQuantity?: number;
          date: Date;
        };
      }
    ): Promise<{ success: boolean; message: string }> {
      try {
        const { otherSection } = requestBody;
    
        const form = await this.internalValidationFormRepository.findById(formId);
    
        if (form && (!form.isDimensionsSectionDone || !form.isFunctionalTestingSectionDone)) {
          return {
            success: false,
            message: 'Please complete all sections',
          };
        }
    
        if (otherSection) {
          await this.internalValidationFormRepository.updateById(formId, {
            otherQuestionery: otherSection,
          });
        }
    
        return {
          success: true,
          message: 'form saved in draft',
        };
      } catch (error) {
        throw error;
      }
    }

    // update complete form...
    @authenticate({
      strategy : 'jwt',
      options : {required : [PermissionKeys.ADMIN, PermissionKeys.INITIATOR, PermissionKeys.VALIDATOR]}
    })
    @post('/save-internal-validation-form/{formId}')
    async saveInternalValidationForm(
      @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
      @param.path.number('formId') formId: number
    ) : Promise<{success: boolean; message: string}>{
      try{
        const form : any = await this.internalValidationFormRepository.findById(formId, {include : [{relation : 'tools'}]});

        if(!form){
          throw new HttpErrors.NotFound(`No internal validation form found`);
        }

        if(!form?.isFunctionalTestingSectionDone){
          return{
            success : false,
            message : 'Please complete functional testing section'
          }
        }

        if(!form?.isDimensionsSectionDone){
          return{
            success : false,
            message : 'Please complete dimensions section'
          }
        }

        await this.internalValidationFormRepository.updateById(formId, {
          isEditable: false,
        })

        if(!form?.isUsersApprovalDone){
          await this.notificationService.sendInternalValidationFormApproval(formId, [form?.userId]);
        }

        if(form?.isUsersApprovalDone && !form?.isAllValidatorsApprovalDone){
            await this.notificationService.sendInternalValidationFormApproval(formId, form?.validatorsIds);
        }

        if(form?.isUsersApprovalDone && form?.isAllValidatorsApprovalDone && !form?.isAllProductionHeadsApprovalDone){
            await this.notificationService.sendInternalValidationFormApproval(formId, form?.productionHeadIds);
        }

        await this.historyCardRepository.create({
          toolsId : form.toolsId,
          nature : 'Internal Validation created',
          description: `Internal Validation form submitted for approval of tool part number: ${form?.tools.partNumber} and serial no: ${form?.tools.meanSerialNumber}`,
          attendedBy: currentUser?.name,
          date: new Date().toISOString(),
          isActive: true,
        });

        return{
          success : true,
          message : 'Internal validation form completed'
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

    // Check form approval status
    async checkFormApproveStatus(formId: number): Promise<void> {
      try {
        const form = await this.internalValidationFormRepository.findById(formId);
        if (!form) {
          throw new HttpErrors.NotFound('Form not found');
        }

        const allValidatorsApproved = await this.checkValidatorsApproval(form.validatorsIds);

        if (allValidatorsApproved) {
          await this.internalValidationFormRepository.updateById(formId, { isAllValidatorsApprovalDone: true });
        }

        // Await production heads approval check
        const allProductionHeadsApproved = await this.checkProductionHeadsApproval(form.productionHeadIds);

        if(allProductionHeadsApproved){
          await this.internalValidationFormRepository.updateById(formId, { isAllProductionHeadsApprovalDone: true, status: 'approved' });
        };

        // Check User Approval...
        const userApproval = await this.checkUserApproval(form.userId);
        if(userApproval){
          await this.internalValidationFormRepository.updateById(formId, {isUsersApprovalDone : true});
        }

        if(userApproval && !allValidatorsApproved && !allProductionHeadsApproved){
          await this.notificationService.sendInternalValidationFormApproval(formId, form?.validatorsIds);
        };

        if(userApproval && allValidatorsApproved && !allProductionHeadsApproved){
          await this.notificationService.sendInternalValidationFormApproval(formId, form?.productionHeadIds);
        };

        if(allValidatorsApproved && allProductionHeadsApproved && userApproval){
          const updatedValues = {
            internalValidationStatus : 'approved',
            lastInternalValidationDate : new Date()
          }

          await this.toolsRepository.updateById(form?.id, updatedValues);
          const savedTool = await this.toolsRepository.findById(form?.id);

          if(savedTool && savedTool.installationStatus.toLowerCase() === 'approved' && savedTool.internalValidationStatus.toLowerCase() === 'approved'){
            await this.toolsRepository.updateById(form?.id, {isActive : true, status : 'Operational'});
          }

          await this.eventSchedulerService.createValidationHistory(formId);
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
    @post('/internal-validation-form/user-approval')
    async userApproval(
      @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
      @requestBody({
        content: {
          'application/json': {
            schema: {
              properties: {
                internalValidationFormId: { type: 'number' },
                approvedDate: { type: 'string' },
                remark: { type: 'string' }
              },
              required: ['installationFormId', 'approvedDate']
            }
          }
        }
      })
      requestBody: {
        internalValidationFormId: number;
        approvedDate: string;
        remark?: string;
      }
    ): Promise<{ success: boolean; message: string }> {
      try {
        const { internalValidationFormId, approvedDate, remark } = requestBody;
    
        const user = await this.userRepository.findById(currentUser.id);
        if (!user) {
          throw new HttpErrors.BadRequest('User not found');
        }
    
        const internalValidationForm = await this.internalValidationFormRepository.findById(internalValidationFormId);
        if (!internalValidationForm) {
          throw new HttpErrors.NotFound('Installation form for this tool not found');
        }
    
        const approvedUser = await this.approvalUsersRepository.findOne({
          where: {
            internalValidationFormId: internalValidationForm.id,
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
  
        this.checkFormApproveStatus(internalValidationFormId);
  
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
    @post('/internal-validation-form/user-saved-form')
      async saveFrom(
      @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
      @requestBody({
        content: {
          'application/json': {
            schema: {
              properties: {
                internalValidationFormId: { type: 'number' },
                remark: { type: 'string' }
              },
              required: ['installationFormId', 'remark']
            }
          }
        }
      })
      requestBody: {
        internalValidationFormId: number;
        remark: string;
      }
    ): Promise<{ success: boolean; message: string }> {
      try {
        const { internalValidationFormId, remark } = requestBody;
  
        const user = await this.userRepository.findById(currentUser.id);
        if (!user) {
          throw new HttpErrors.BadRequest('User not found');
        }
  
        const internalValidationForm = await this.internalValidationFormRepository.findById(internalValidationFormId);
        if (!internalValidationForm) {
          throw new HttpErrors.NotFound('Internal validation form for this tool not found');
        }
  
        const approvedUser = await this.approvalUsersRepository.findOne({
          where: {
            internalValidationFormId: internalValidationForm.id,
            userId: user.id
          }
        });
  
        if (!approvedUser) {
          throw new HttpErrors.BadRequest('User not found');
        }
  
        await this.approvalUsersRepository.updateById(approvedUser.id, {
          remark: remark
        });
  
        await this.internalValidationFormRepository.updateById(internalValidationFormId, {isEditable : true});
  
        await this.notificationService.sendInternalValidationFormSaved(internalValidationFormId)
  
        return { success: true, message: 'Saved successfully.' };
  
      } catch (error) {
        throw error;
      }
    }
}
