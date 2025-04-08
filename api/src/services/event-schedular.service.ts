import { repository } from "@loopback/repository";
import { ApprovalUsersRepository, InternalValidationFormRepository } from "../repositories";
import { HttpErrors } from "@loopback/rest";
import { inject } from "@loopback/core";
import { RadiallDataSource } from "../datasources";

export class EventSchedular {
    constructor(
        @inject('datasources.radiall') private dataSource: RadiallDataSource,
        @repository(InternalValidationFormRepository)
        public internalValidationFormRepository: InternalValidationFormRepository,
        @repository(ApprovalUsersRepository)
        public approvalUsersRepository: ApprovalUsersRepository
    ) {}

    async createValidationHistory(validationFormId: number) {
        try {
            const validationForm = await this.internalValidationFormRepository.findById(validationFormId);
            if (!validationForm) {
                throw new HttpErrors.NotFound('No Validation form found');
            }

            const approvalValidators = await this.approvalUsersRepository.find({
                where: {
                    id: { inq: validationForm.validatorsIds },
                    internalValidationFormId: validationForm?.id
                },
                include: [{ relation: 'user', scope: { include: [{ relation: 'department' }] } }]
            });

            const approvalProductionHeads = await this.approvalUsersRepository.find({
                where: {
                    id: { inq: validationForm.productionHeadIds },
                    internalValidationFormId: validationForm?.id
                },
                include: [{ relation: 'user', scope: { include: [{ relation: 'department' }] } }]
            });

            const approvalUser = await this.approvalUsersRepository.findOne({
                where: {
                    id: validationForm?.userId,
                    internalValidationFormId: validationForm?.id
                },
                include: [{ relation: 'user', scope: { include: [{ relation: 'department' }] } }]
            });

            const approvalValidatorsJSON = JSON.stringify(approvalValidators);
            const approvalProductionHeadsJSON = JSON.stringify(approvalProductionHeads);
            const approvalUserJSON = JSON.stringify(approvalUser);
            const dimensionsJSON = JSON.stringify(validationForm.dimensionsQuestionery);
            const functionalTestingJSON = JSON.stringify(validationForm.functionalTestingQuestionery);
            const otherQuestioneryJSON = JSON.stringify(validationForm.otherQuestionery);

            const nextYearDate = new Date();

            // Add time difference (in minutes) manually if needed
            const offsetMinutes = 330; // Example: IST (UTC+5:30) = 330 minutes ahead
            nextYearDate.setMinutes(nextYearDate.getMinutes() + 2 + offsetMinutes);

            // Format to MySQL datetime format (YYYY-MM-DD HH:MM:SS)
            const formattedDate = nextYearDate.toISOString().slice(0, 19).replace('T', ' ');

            console.log("Formatted Date for MySQL:", formattedDate);

            const eventSQL = `
                CREATE EVENT \`insert_validation_form_${validationForm.toolsId}_${Date.now()}\`
                ON SCHEDULE AT '${formattedDate}'
                DO 
                INSERT INTO internalvalidationhistory 
                (initiatorId, toolsId, user, validators, productionHeads, dimensionsQuestionery, functionalTestingQuestionery, otherQuestionery, createdAt, updatedAt)
                VALUES 
                (${validationForm.initiatorId}, ${validationForm.toolsId}, '${approvalUserJSON}', '${approvalValidatorsJSON}', '${approvalProductionHeadsJSON}', '${dimensionsJSON}', '${functionalTestingJSON}', '${otherQuestioneryJSON}', NOW(), NOW());
            `;

            await this.dataSource.execute(eventSQL);
            console.log("Event scheduled successfully");

            const dimensionsQuestionery = {
                finding: '',
                result: false,
                evidences: [],
                controlledBy: undefined,
                date: undefined,
            };

            const functionalTestingQuestionery = {
                finding: '',
                description: '',
                result: false,
                evidences: [],
                controlledBy: undefined,
                date: undefined,
            };

            const otherQuestionery = {
                finding: '',
                description: '',
                result: false,
                evidences: [],
                controlledBy: undefined,
                date: undefined,
            };

            const dimensionsQuestioneryJSON = JSON.stringify(dimensionsQuestionery);
            const functionalTestingQuestioneryJSON = JSON.stringify(functionalTestingQuestionery);
            const otherQuestioneryNewJSON = JSON.stringify(otherQuestionery)

            // to clear internal validation form to fill again
            const secondEventSQL = `
                CREATE EVENT \`update_internal_validation_${validationForm.toolsId}_${Date.now()}\`
                ON SCHEDULE AT TIMESTAMP('${formattedDate}') + INTERVAL 3 MINUTE
                DO 
                UPDATE internalvalidationform
                SET 
                    status = 'pending',
                    dimensionsQuestionery = '${dimensionsQuestioneryJSON}',
                    functionalTestingQuestionery = '${functionalTestingQuestioneryJSON}',
                    otherQuestionery = '${otherQuestioneryNewJSON}',
                    validatorsIds = NULL,
                    productionHeadIds = NULL,
                    initiatorId = NULL,
                    userId = NULL,
                    isEditable = TRUE,
                    isDimensionsSectionDone = FALSE,
                    isFunctionalTestingSectionDone = FALSE,
                    isAllValidatorsApprovalDone = FALSE,
                    isAllProductionHeadsApprovalDone = FALSE
                WHERE id = ${validationForm.id};
            `;        

            await this.dataSource.execute(secondEventSQL);
            console.log("Second Event scheduled successfully");

            // delete approval users and change tools internal validation status
            const thirdEventSQL = `
                CREATE EVENT \`update_tools_internal_validation_status_${validationForm.toolsId}_${Date.now()}\`
                ON SCHEDULE AT TIMESTAMP('${formattedDate}') + INTERVAL 4 MINUTE
                DO BEGIN
                    UPDATE tools
                    SET 
                        internalValidationStatus = 'pending',
                        status = 'Non-Operational',
                        isActive = FALSE
                    WHERE id = ${validationForm.toolsId};

                    DELETE FROM approvalusers
                    WHERE internalValidationFormId = ${validationForm.id};
                END;
            `;

            await this.dataSource.execute(thirdEventSQL);
            console.log("Third Event scheduled successfully");

        } catch (error) {
            console.error("Error scheduling event:", error);
            throw error;
        }
    }
}
