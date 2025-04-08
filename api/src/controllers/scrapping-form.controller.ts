import { authenticate, AuthenticationBindings } from "@loopback/authentication";
import { PermissionKeys } from "../authorization/permission-keys";
import { get, HttpErrors, param, patch, post, requestBody } from "@loopback/rest";
import { repository } from "@loopback/repository";
import { ApprovalUsersRepository, ScrappingFormRepository, ToolsRepository, UserRepository } from "../repositories";
import { User } from "../models";
import { inject } from "@loopback/core";
import { UserProfile } from "@loopback/security";

export class ScrappingFormController {
  constructor(
    @repository(ScrappingFormRepository)
    public scrappingFormRepository : ScrappingFormRepository,
    @repository(ApprovalUsersRepository)
    public approvalUsersRepository : ApprovalUsersRepository,
    @repository(UserRepository)
    public userRepository : UserRepository,
    @repository(ToolsRepository)
    public toolsRepository : ToolsRepository,
  ) {}

  // Get scrapping form of a tool with tool id...
  @authenticate({
    strategy : 'jwt',
    options : {required : [PermissionKeys.PRODUCTION_HEAD, PermissionKeys.INITIATOR, PermissionKeys.VALIDATOR]}
  })
  @get('/scrapping-form/form-by-toolId/{toolId}')
  async formByToolId(
    @param.path.number('toolId') toolId : number
  ) : Promise<{
    success : boolean;
    message : string;
    data : object | null;
  }>{
    try{
      const scrappingForm : any = await this.scrappingFormRepository.findOne({
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
      
      if(!scrappingForm){
        throw new HttpErrors.NotFound('No scrapping form against this tool');
      }

      const validatorIds = scrappingForm.validatorsIds || [];

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

      const productionHeadIds = scrappingForm.productionHeadIds || [];

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
        ...scrappingForm,
        validators : validators,
        productionHeads : productionHeads
      }

      return{
        success : true,
        message : 'Scrapping Form Data',
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
          scrappingFormId: formId,
        },
      });

      const existingValidatorIds = new Set(existingValidators.map((v) => v.userId));

      // Filter out validators that already exist
      const newValidatorsData = validatorsId
        .filter((id) => !existingValidatorIds.has(id))
        .map((id) => ({
          userId: id,
          scrappingFormId: formId,
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
          scrappingFormId: formId,
        },
      });

      const existingProductionHeadIds = new Set(existingProductionHeads.map((h) => h.userId));

      // Filter out production heads that already exist
      const newProductionHeadsData = productionHeadsId
        .filter((id) => !existingProductionHeadIds.has(id))
        .map((id) => ({
          userId: id,
          scrappingFormId: formId,
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
          scrappingFormId : formId
        }
      });

      if(existingUser){
        await this.scrappingFormRepository.updateById(formId, {
          userId : existingUser?.id
        });
      }else{
        const userApproval = await this.approvalUsersRepository.create({
          userId: userId,
          scrappingFormId: formId,
          isApproved: false,
        });

        if(userApproval){
          await this.scrappingFormRepository.updateById(formId, {
            userId : userApproval?.id
          });
        }
      }

      // Update installation form only if new validators or production heads were added
      if (validatorIds.length  || productionHeadIds.length) {
        if(validatorIds.length <= 0){
          await this.scrappingFormRepository.updateById(formId, {
            isAllValidatorsApprovalDone : true
          })
        }
        await this.scrappingFormRepository.updateById(formId, {
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
  
  // form submission...
  @authenticate({
    strategy : 'jwt',
    options : {required : [PermissionKeys.PRODUCTION_HEAD, PermissionKeys.INITIATOR, PermissionKeys.VALIDATOR]}
  })
  @patch('/scrapping-form-submission/{id}')
  async scrappingFormSubmission(
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
              justification: {
                type: 'string'
              },
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
                    // nonCritical: {
                    //   type: 'string',
                    // },
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
                    // routes: {
                    //   oneOf : [
                    //     {type : 'object'},
                    //     {type : 'null'}
                    //   ]
                    // }
                  },
                },
              },
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
      justification: string;
      requirementChecklist: Array<{
        requirement: string;
        isNeedUpload: boolean;
        critical: string;
        // nonCritical: string;
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
        // routes: any;
      }>;
    }
  ):Promise<{
    success : boolean;
    message : string;
  }>{
    try{
      const { initiatorId, userId, validatorsId, productionHeadsId, justification, requirementChecklist } = requestBody;

      await this.scrappingFormRepository.updateById(formId, {
        initiatorId : initiatorId,
        userId : userId,
        justification : justification,
        requirementChecklist : requirementChecklist,
        isEditable : false
      });

      const response = await this.createValidatorsAndHeads(validatorsId, productionHeadsId, userId, formId);

      if(response.success){
        return{
          success : true,
          message : 'Scrapping form completed'
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
      const form = await this.scrappingFormRepository.findById(formId);
      if (!form) {
        throw new HttpErrors.NotFound('Form not found');
      }

      const allValidatorsApproved = await this.checkValidatorsApproval(form.validatorsIds);

      if (allValidatorsApproved) {
        await this.scrappingFormRepository.updateById(formId, { isAllValidatorsApprovalDone: true });
      }

      // Await production heads approval check
      const allProductionHeadsApproved = await this.checkProductionHeadsApproval(form.productionHeadIds);

      if(allProductionHeadsApproved){
        await this.scrappingFormRepository.updateById(formId, { isAllProductionHeadsApprovalDone: true, status: 'approved' });
      };

      // Check User Approval...
      const userApproval = await this.checkUserApproval(form.userId);
      if(userApproval){
        await this.scrappingFormRepository.updateById(formId, {isUsersApprovalDone : true});
      }

      if(allValidatorsApproved && allProductionHeadsApproved && userApproval){
        const updatedValues = {
          scrapDate : new Date(),
          status : 'Scrapped',
          isActive : false
        }

        await this.toolsRepository.updateById(form?.id, updatedValues);
      }

    } catch (error) {
      console.error('Error in form approval:', error);
    }
  }

  // approval user from approve api....
  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.PRODUCTION_HEAD, PermissionKeys.VALIDATOR] }
  })
  @post('/scrapping-form/user-approval')
  async userApproval(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              scrappingFormId: { type: 'number' },
              approvedDate: { type: 'string' },
              remark: { type: 'string' }
            },
            required: ['scrappingFormId', 'approvedDate']
          }
        }
      }
    })
    requestBody: {
      scrappingFormId: number;
      approvedDate: string;
      remark?: string;
    }
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { scrappingFormId, approvedDate, remark } = requestBody;
  
      const user = await this.userRepository.findById(currentUser.id);
      if (!user) {
        throw new HttpErrors.BadRequest('User not found');
      }
  
      const scrappingForm = await this.scrappingFormRepository.findById(scrappingFormId);
      if (!scrappingForm) {
        throw new HttpErrors.NotFound('Scrapping form for this tool not found');
      }
  
      const approvedUser = await this.approvalUsersRepository.findOne({
        where: {
          scrappingFormId: scrappingForm.id,
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

      this.checkFormApproveStatus(scrappingFormId);

      return { success: true, message: 'Approved successfully.' };
  
    } catch (error) {
      throw error;
    }
  }

  // approval user from save api....
  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.PRODUCTION_HEAD, PermissionKeys.VALIDATOR] }
  })
  @post('/scrapping-form/user-saved-form')
    async saveFrom(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              scrappingFormId: { type: 'number' },
              remark: { type: 'string' }
            },
            required: ['scrappingFormId', 'remark']
          }
        }
      }
    })
    requestBody: {
      scrappingFormId: number;
      remark: string;
    }
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { scrappingFormId, remark } = requestBody;

      const user = await this.userRepository.findById(currentUser.id);
      if (!user) {
        throw new HttpErrors.BadRequest('User not found');
      }

      const scrappingForm = await this.scrappingFormRepository.findById(scrappingFormId);
      if (!scrappingForm) {
        throw new HttpErrors.NotFound('Installation form for this tool not found');
      }

      const approvedUser = await this.approvalUsersRepository.findOne({
        where: {
          scrappingFormId: scrappingForm.id,
          userId: user.id
        }
      });

      if (!approvedUser) {
        throw new HttpErrors.BadRequest('User not found');
      }

      await this.approvalUsersRepository.updateById(approvedUser.id, {
        remark: remark
      });

      await this.scrappingFormRepository.updateById(scrappingFormId, {isEditable : true});

      // send mail to initiator...

      return { success: true, message: 'Saved successfully.' };

    } catch (error) {
      throw error;
    }
  }
}
