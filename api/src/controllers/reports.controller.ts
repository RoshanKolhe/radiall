import { relation, repository } from "@loopback/repository";
import { ApprovalUsersRepository, InstallationFormRepository, InternalValidationFormRepository, ScrappingFormRepository, SpareRepository, ToolsRepository } from "../repositories";
import { get, HttpErrors, param, post, response, ResponseObject, RestBindings } from "@loopback/rest";
import { inject } from "@loopback/core";
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { httpsGetAsync } from "@loopback/testlab";

export class ReportsController {
  constructor(
    @repository(InstallationFormRepository)
    public installationFormRepository : InstallationFormRepository,
    @repository(InternalValidationFormRepository)
    public internalValidationFormRepository : InternalValidationFormRepository,
    @repository(SpareRepository)
    public spareRepository : SpareRepository,
    @repository(ToolsRepository)
    public toolsRepository : ToolsRepository,
    @repository(ApprovalUsersRepository)
    public approvalUsersRepository : ApprovalUsersRepository,
    @repository(ScrappingFormRepository)
    private scrappingFormRepository : ScrappingFormRepository,
  ) {}

  // internal validation report...
  @get('/download-internal-validation-form/{formId}')
  async downloadInternalValidationForm(
    @param.path.number('formId') formId: number,
    @inject(RestBindings.Http.RESPONSE) response: ResponseObject,
  ): Promise<any>{
    try{
      const formData : any  = await this.internalValidationFormRepository.findById(
        formId, 
        {
          include : [
            {relation : 'tools', 
              scope : {
                include : [
                  {relation : 'manufacturer'},
                  {relation : 'supplier'},
                ]
              }},
          ]
        }
      );

      if(!formData){
        throw new HttpErrors.NotFound(`Internal Validation Form of id ${formId} not found`);
      }

      let productionHeadsData : any = [];
      if(formData?.productionHeadIds && formData?.productionHeadIds?.length > 0){
        productionHeadsData= await this.approvalUsersRepository.find({
          where: {
            id: { inq: formData.productionHeadIds }
          },
          include: [
            {
              relation: 'user',
              scope: {
                include: [{ relation: 'department' }]
              }
            }
          ]
        });
      }


      const templatePath = path.join(__dirname, '../../.sandbox/Internal-validation-form.xlsx');
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(templatePath);

      const worksheet = workbook.getWorksheet(1);

      if(!worksheet){
        throw new HttpErrors.BadRequest('Error while fetching template');
      }

      // tool description
      worksheet.getCell('A3').value = formData?.tools?.description?.toUpperCase();
      // tool part number
      const partNumber = formData?.tools?.partNumber;
      worksheet.getCell('C4').value = partNumber;
      worksheet.getCell('C4').alignment = { horizontal: 'center', vertical: 'middle' };

      // for manufacturer
      const manufacturer = formData?.tools?.manufacturer?.manufacturer;
      worksheet.getCell('G4').value = manufacturer;
      worksheet.getCell('G4').alignment = {vertical: 'middle'};

      // for serial number
      const serialNumber = formData?.tools?.meanSerialNumber;
      worksheet.getCell('C5').value = serialNumber;
      worksheet.getCell('C5').alignment = { horizontal: 'center', vertical: 'middle' };

      // for supplier
      const supplier = formData?.tools?.supplier?.supplier;
      worksheet.getCell('G5').value = supplier;
      worksheet.getCell('G5').alignment = {vertical: 'middle'};

      // for dimensions
      const finding = formData?.dimensionsQuestionery?.finding;
      const result = formData?.dimensionsQuestionery?.result;
      const controlledByUser = formData?.dimensionsQuestionery?.controlledBy;
      const date = formData?.dimensionsQuestionery?.date;

      worksheet.getCell('A11').value = finding;

      if(!result){
        worksheet.getCell('C13').value = '';
        worksheet.getCell('F13').value = 'X';
      }

      worksheet.getCell('C15').value = `${controlledByUser?.firstName} ${controlledByUser?.lastName}`;
      worksheet.getCell('H15').value = date;

      // for functional testing
      const functionalDescription = formData?.functionalTestingQuestionery?.description;
      const functionalFinding = formData?.functionalTestingQuestionery?.finding;
      const functionalResult = formData?.functionalTestingQuestionery?.result;
      const funtionalControlledByUser = formData?.functionalTestingQuestionery?.controlledBy;
      const functionalDate = formData?.functionalTestingQuestionery?.date;

      worksheet.getCell('A21').value = functionalDescription
      worksheet.getCell('A25').value = functionalFinding;

      if(!functionalResult){
        worksheet.getCell('C27').value = '';
        worksheet.getCell('F27').value = 'X';
      }

      worksheet.getCell('C29').value = `${funtionalControlledByUser?.firstName} ${funtionalControlledByUser?.lastName}`;
      worksheet.getCell('H29').value = functionalDate;

      // for others
      const othersDescription = formData?.otherQuestionery?.description;
      const othersFinding = formData?.otherQuestionery?.finding;
      const othersResult = formData?.otherQuestionery?.result;
      const othersControlledByUser = formData?.otherQuestionery?.controlledBy;
      const othersDate = formData?.otherQuestionery?.date;

      worksheet.getCell('A35').value = othersDescription
      worksheet.getCell('A39').value = othersFinding;

      if(!othersResult){
        worksheet.getCell('C41').value = '';
        worksheet.getCell('F41').value = 'X';
      }

      worksheet.getCell('C43').value = `${othersControlledByUser?.firstName || ''} ${othersControlledByUser?.lastName || ''}`;
      worksheet.getCell('H43').value = othersDate;

      worksheet.getCell('A47').value = productionHeadsData[0]?.remark;
      worksheet.getCell('H47').value = `${productionHeadsData[0]?.user?.firstName ? productionHeadsData[0]?.user?.firstName : ''} ${productionHeadsData[0]?.user?.lastName ? productionHeadsData[0]?.user?.lastName : ''}`;
      worksheet.getCell('H48').value = productionHeadsData[0]?.approvalDate;
      worksheet.getCell('H48').numFmt = 'd/m/yyyy';


      response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      response.setHeader(
        'Content-Disposition',
        'attachment; filename=internal-validation-form.xlsx',
      );
  
      const res = response as any;
      await workbook.xlsx.write(res);
  
      response.end();
      return;
    }catch(error){
      throw error;
    }
  }

  // installation form report...
  @get('/download-installation-form/{formId}')
  async downloadInstallationForm(
    @param.path.number('formId') formId : number,
    @inject(RestBindings.Http.RESPONSE) response : ResponseObject,
  ) : Promise<any>{
    try{
      const formData : any = await this.installationFormRepository.findById(formId, 
        {
          include : [
            {
              relation : 'tools', 
              scope : {
                include : [
                  {relation : 'manufacturer'}, 
                  {relation : 'supplier'}
                ]
              }
            },
            {relation : 'initiator'},
            {relation : 'user', scope : {include : [{relation : 'user'}]}},
          ]
        }
      );

      if(!formData){
        throw new HttpErrors.NotFound(`Installation Form For Id ${formId} Not found`);
      }

      let validatorsData : any = [];
      if(formData?.validatorsIds && formData?.validatorsIds?.length > 0){
        validatorsData = await this.approvalUsersRepository.find({where : {
            id : {inq : formData.validatorsIds}
          }, include : [{relation : 'user', scope : {include : [{relation : 'department'}]}}]});
      }

      let productionHeadsData : any = [];
      if(formData?.productionHeadIds && formData?.productionHeadIds?.length > 0){
        productionHeadsData= await this.approvalUsersRepository.find({
          where: {
            id: { inq: formData.productionHeadIds }
          },
          include: [
            {
              relation: 'user',
              scope: {
                include: [{ relation: 'department' }]
              }
            }
          ]
        });
      }

      const templatePath = path.join(__dirname, '../../.sandbox/installation_form.xlsx');
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(templatePath);

      const worksheet = workbook.getWorksheet(1);

      if(!worksheet){
        throw new HttpErrors.BadRequest('Error while fetching template');
      }

      worksheet.getCell('C3').value = formData?.tools?.description;
      worksheet.getCell('C5').value = `PN:${formData?.tools?.partNumber}`;
      worksheet.getCell('F5').value = `SN:${formData?.tools?.meanSerialNumber}`;
      worksheet.getCell('I5').value = `Asset:${formData?.tools?.assetNumber || 'NA'}`;
      worksheet.getCell('M6').value = formData?.createdAt;
      worksheet.getCell('M6').numFmt = 'd/m/yyyy';

      let familyClassificationRow = 10;
      const filterFamilyClassificationQuestionery = formData?.familyClassificationQuestionery?.filter((question : any) => question.type === 'boolean');
      filterFamilyClassificationQuestionery?.map((question : any) => {
        worksheet.getCell(`D${familyClassificationRow}`).value = question.question;
        worksheet.getCell(`L${familyClassificationRow}`).value = question.answer === true ? 'Yes' : question.answer === false ? 'No' : '';
        familyClassificationRow = familyClassificationRow + 1;
      })

      if(filterFamilyClassificationQuestionery?.filter((question : any) => question.answer === true)?.length > 0){
        worksheet.getCell('J14').value = 'X';
        worksheet.getCell('I17').value = 'X';
      }else{
        worksheet.getCell('J13').value = 'X';
        worksheet.getCell('C17').value = 'X';
      }

      let criticityRow = 26;
      const filteredCriticityQuestionery = formData?.criticityQuestionery?.filter((question : any) => question.type === 'boolean');
      filteredCriticityQuestionery?.map((question : any) => {
        worksheet.getCell(`D${criticityRow}`).value = question.question;
        worksheet.getCell(`L${criticityRow}`).value = question.answer === true ? 'Yes' : question.answer === false ? 'No' : '';
        criticityRow = criticityRow + 1;
      })

      if(filteredCriticityQuestionery?.filter((question : any) => question.answer === true)?.length > 0){
        worksheet.getCell('J30').value = 'X';
        worksheet.getCell('I33').value = 'X';
      }else{
        worksheet.getCell('J29').value = 'X';
        worksheet.getCell('C33').value = 'X';
      }

      let requirementChecklistRow = 42;
      formData?.requirementChecklist?.map((requirement : any) => {
        worksheet.getCell(`B${requirementChecklistRow}`).value = requirement.requirement;
        worksheet.getCell(`F${requirementChecklistRow}`).value = requirement.critical?.toUpperCase();
        worksheet.getCell(`G${requirementChecklistRow}`).value = requirement.nonCritical?.toUpperCase();
        worksheet.getCell(`H${requirementChecklistRow}`).value = requirement.toDo === true ? 'X' : 'NA';
        worksheet.getCell(`I${requirementChecklistRow}`).value = `${requirement.actionOwner?.firstName ? requirement.actionOwner?.firstName : 'NA'} ${requirement?.actionOwner?.lastName ? requirement?.actionOwner?.lastName : ''}`;
        worksheet.getCell(`J${requirementChecklistRow}`).value = requirement.done === true ? 'X' : 'NA';
        worksheet.getCell(`K${requirementChecklistRow}`).value = requirement.comment;
        requirementChecklistRow = requirementChecklistRow + 1;
      })

      if(formData?.initiatorId){
        worksheet.getCell('D57').value = formData?.createdAt;
        worksheet.getCell('D57').numFmt = 'd/m/yyyy';
        worksheet.getCell('F57').value = `${formData?.initiator?.firstName} ${formData?.initiator?.lastName}`
      };

      if(formData?.userId){
        worksheet.getCell('D58').value = formData?.user?.approvalDate;
        worksheet.getCell('D58').numFmt = 'd/m/yyyy';
        worksheet.getCell('F58').value = `${formData?.user?.user?.firstName} ${formData?.user?.user?.lastName}`
      }

      if(productionHeadsData.length > 0){
        worksheet.getCell('D59').value = productionHeadsData[0]?.approvalDate;
        worksheet.getCell('D59').numFmt = 'd/m/yyyy';
        worksheet.getCell('F59').value = `${productionHeadsData[0]?.user?.firstName} ${productionHeadsData[0]?.user?.lastName}`;
      }

      // additional approvals yet remaining....

      response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      response.setHeader(
        'Content-Disposition',
        'attachment; filename=installation-form.xlsx',
      );
  
      const res = response as any;
      await workbook.xlsx.write(res);
  
      response.end();
      return;
    }catch(error){
      throw error;
    }
  }

  // spare list
  @get('/download-spare-list/{toolId}')
  async downloadSpareListReport(
    @param.path.number('toolId') toolId : number,
    @inject(RestBindings.Http.RESPONSE) response: ResponseObject,
  ) : Promise<any>{
    try{
      const toolData : any = await this.toolsRepository.findById(toolId, {include : [{relation : 'manufacturer'}, {relation : 'supplier'}]});
      const spareList : any = await this.spareRepository.find({where : {toolsId : toolId}, include : [{relation : 'tools'}, {relation: 'manufacturer'}, {relation : 'supplier'}]});

      if(spareList.length <= 0){
        throw new HttpErrors.NotFound('No records found');
      }

      const templatePath = path.join(__dirname, '../../.sandbox/spare_list.xlsx');
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(templatePath);

      const worksheet = workbook.getWorksheet(1);

      if(!worksheet){
        throw new HttpErrors.BadRequest('Error while fetching template');
      }

      // tool data
      worksheet.getCell('C1').value = toolData?.description?.toUpperCase()
      worksheet.getCell('C3').value = toolData.partNumber;
      worksheet.getCell('H3').value = toolData?.manufacturer?.manufacturer;

      worksheet.getCell('C4').value = toolData.meanSerialNumber;
      worksheet.getCell('H4').value = toolData?.supplier?.supplier;

      worksheet.getCell('C5').value = toolData.assetNumber || 'NA';
      worksheet.getCell('H5').value = toolData?.storageLocation || 'NA';

      let row = 10;
      await Promise.all(spareList.map((spare : any) => {
        if(spare){
          worksheet.getCell(`B${row}`).value = spare.description;
          worksheet.getCell(`E${row}`).value = spare.stock;
          worksheet.getCell(`G${row}`).value = `${spare.manufacturer?.manufacturer}/${spare.supplier?.supplier}`;
          worksheet.getCell(`I${row}`).value = spare.partNumber;
          worksheet.getCell(`K${row}`).value = spare.comment;
          row = row + 1;
        }
      }))

      response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      response.setHeader(
        'Content-Disposition',
        'attachment; filename=spare-list.xlsx',
      );
  
      const res = response as any;
      await workbook.xlsx.write(res);
  
      response.end();
      return;

    }catch(error){
      throw error;
    }
  }

  // passport
  @get('/download-passport/{toolId}')
  async downloadPassport(
    @param.path.number('toolId') toolId : number,
    @inject(RestBindings.Http.RESPONSE) response: ResponseObject,
  ) : Promise<any>{
    try{
      const toolData : any = await this.toolsRepository.findById(toolId, {include : [{relation : 'manufacturer'}, {relation : 'supplier'}]});

      const templatePath = path.join(__dirname, '../../.sandbox/passport.xlsx');
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(templatePath);

      const worksheet = workbook.getWorksheet(1);

      if(!worksheet){
        throw new HttpErrors.BadRequest('Error while fetching template');
      }

      // tool data
      worksheet.getCell('D6').value = toolData?.description?.toUpperCase();
      worksheet.getCell('D7').value = toolData?.meanSerialNumber?.toString() || 'NA';
      worksheet.getCell('D8').value = toolData?.partNumber;
      worksheet.getCell('D9').value = toolData?.assetNumber || 'NA';
      worksheet.getCell('D10').value = toolData?.supplier?.supplier || 'NA';
      worksheet.getCell('D11').value = toolData?.manufacturer?.manufacturer || 'NA';
      worksheet.getCell('D12').value = toolData?.manufacturingDate || 'NA';
      if(toolData?.manufacturingDate){
        worksheet.getCell('D12').numFmt = 'd/m/yyyy';
      }
      worksheet.getCell('D13').value = toolData?.toolFamily || 'NA';
      worksheet.getCell('D14').value = toolData?.criticalLevel || 'NA';
      worksheet.getCell('D15').value = toolData.individualManagement ? 'Yes' : 'No';
      worksheet.getCell('D16').value = '1';      
      worksheet.getCell('D17').value = toolData?.isMaintaincePlanNeeded ? 'Yes' : 'No';
      worksheet.getCell('D18').value = toolData?.calibration || 'NA';
      worksheet.getCell('D19').value = toolData?.spareList ? 'Yes' : 'No';
      worksheet.getCell('D20').value = toolData?.createdAt || 'NA';
      worksheet.getCell('D21').value = toolData?.installationDate || 'NA';
      worksheet.getCell('D22').value = toolData?.storageLocation || 'NA';
      worksheet.getCell('D23').value = toolData?.status;
      worksheet.getCell('D24').value = toolData?.scrapDate || 'NA';
      if(toolData?.scrapDate){
        worksheet.getCell('D24').numFmt = 'd/m/yyyy';
      }

      response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      response.setHeader(
        'Content-Disposition',
        'attachment; filename=passport.xlsx',
      );
  
      const res = response as any;
      await workbook.xlsx.write(res);
  
      response.end();
      return;

    }catch(error){
      throw error;
    }
  }

  // scrapping form...
  @get('/download-scrapping-form/{formId}')
  async downloadScrappingForm(
    @param.path.number('formId') formId : number,
    @inject(RestBindings.Http.RESPONSE) response: ResponseObject,
  ):Promise<any>{
    try{
      const formData : any = await this.scrappingFormRepository.findById(formId,  {
          include : [
            {
              relation : 'tools', 
              scope : {
                include : [
                  {relation : 'manufacturer'}, 
                  {relation : 'supplier'}
                ]
              }
            },
            {relation : 'initiator'},
            {relation : 'user', scope : {include : [{relation : 'user'}]}},
          ]
        }
      );

      if(!formData){
        throw new HttpErrors.NotFound(`Installation Form For Id ${formId} Not found`);
      }

      const validatorsData : any = await this.approvalUsersRepository.find({where : {
        id : {inq : formData.validatorsIds}
      }, include : [{relation : 'user', scope : {include : [{relation : 'department'}]}}]});

      const productionHeadsData: any = await this.approvalUsersRepository.find({
        where: {
          id: { inq: formData.productionHeadIds }
        },
        include: [
          {
            relation: 'user',
            scope: {
              include: [{ relation: 'department' }]
            }
          }
        ]
      });

      const templatePath = path.join(__dirname, '../../.sandbox/scrapping_form.xlsx');
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(templatePath);

      const worksheet = workbook.getWorksheet(1);

      if(!worksheet){
        throw new HttpErrors.BadRequest('Error while fetching template');
      }

      worksheet.getCell('C3').value = formData?.tools?.description;
      worksheet.getCell('C5').value = `PN:${formData?.tools?.partNumber}`;
      worksheet.getCell('F5').value = `SN:${formData?.tools?.meanSerialNumber}`;
      worksheet.getCell('I5').value = `Asset:${formData?.tools?.assetNumber || 'NA'}`;
      // worksheet.getCell('M6').value = formData?.createdAt;

      worksheet.getCell('B10').value = formData?.justification;

      let actionChecklistRow = 16;
      formData?.requirementChecklist?.map((action : any) => {
        worksheet.getCell(`B${actionChecklistRow}`).value = action?.requirement;
        worksheet.getCell(`G${actionChecklistRow}`).value = action?.critical?.toUpperCase();
        worksheet.getCell(`H${actionChecklistRow}`).value = action?.toDo === true ? 'X' : 'NA';
        worksheet.getCell(`H${actionChecklistRow}`).font = {bold : true};
        worksheet.getCell(`I${actionChecklistRow}`).value = `${action?.actionOwner?.firstName} ${action?.actionOwner?.lastName}`;
        worksheet.getCell(`J${actionChecklistRow}`).value = action.done === true ? 'X' : 'NA';
        worksheet.getCell(`J${actionChecklistRow}`).font = {bold : true};
        worksheet.getCell(`K${actionChecklistRow}`).value = action.comment;
        actionChecklistRow = actionChecklistRow + 1;
      });

      if(formData?.userId){
        worksheet.getCell('D28').value = formData?.user?.approvalDate;
        worksheet.getCell('D28').numFmt = 'd/m/yyyy';
        worksheet.getCell('F28').value = `${formData?.user?.user?.firstName} ${formData?.user?.user?.lastName}`
      }

      if(productionHeadsData.length > 0){
        worksheet.getCell('D29').value = productionHeadsData[0]?.approvalDate;
        worksheet.getCell('D29').numFmt = 'd/m/yyyy';
        worksheet.getCell('F29').value = `${productionHeadsData[0]?.user?.firstName} ${productionHeadsData[0]?.user?.lastName}`
      }

      // additional approvals are remaining...

      response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      response.setHeader(
        'Content-Disposition',
        'attachment; filename=installation-form.xlsx',
      );
  
      const res = response as any;
      await workbook.xlsx.write(res);
  
      response.end();
      return;

    }catch(error){
      throw error;
    }
  }
}
