import { repository } from "@loopback/repository";
import { ApprovalUsersRepository, InstallationFormRepository, InternalValidationFormRepository, NotificationRepository, ScrappingFormRepository } from "../repositories";

export class NotificationService{
    constructor(
        @repository(ApprovalUsersRepository)
        public approvalUsersRepository: ApprovalUsersRepository,
        @repository(InstallationFormRepository)
        public installationFormRepository: InstallationFormRepository,
        @repository(NotificationRepository)
        public notificationRepository: NotificationRepository,
        @repository(ScrappingFormRepository)
        public scrappingFormRepository: ScrappingFormRepository,
        @repository(InternalValidationFormRepository)
        public internalValidationFormRepository: InternalValidationFormRepository,
    ) {}

    // INSTALLATION FORM APPROVAL NOOTIFICATION...
    async sendInstallationFormApproval(formId: number, approvalUsers: number[]): Promise<void> {
        try {
            const installationForm : any = await this.installationFormRepository.findById(formId, {include : [{relation : 'tools'}]});

            if (!installationForm) {
                console.log('No Installation Form Found with Id', formId);
                return;
            }

            const approvalUsersData : any = await this.approvalUsersRepository.find({
                where: {
                    id: { inq: approvalUsers },
                },
                include: [{ relation: 'user' }],
            });

            if (approvalUsersData.length > 0) {
                const notifications = approvalUsersData.map((item : any) => {
                    return {
                        title: 'Installation Form Approval',
                        body: `Hello ${item.user?.firstName || 'User'}, you have a new installation form of tool No: ${installationForm?.tools?.partNumber} and serial no: ${installationForm?.tools?.meanSerialNumber} to approve.`,
                        userId: item.user?.id,
                        template: 'installation_form',
                        pathname: `tools/${installationForm?.id}/installation-form`
                    };
                });

                const newNotifications = await this.notificationRepository.createAll(notifications);
            }
        } catch (error) {
            console.error('Error while sending notification of installation form', error);
        }
    }

    // INTERNAL VALIDATION FORM APPROVAL NOOTIFICATION...
    async sendInternalValidationFormApproval(formId: number, approvalUsers: number[]): Promise<void> {
        try {
            const internalValidationForm : any = await this.internalValidationFormRepository.findById(formId, {include : [{relation : 'tools'}]});

            if (!internalValidationForm) {
                console.log('No Internal validation Form Found with Id', formId);
                return;
            }

            const approvalUsersData : any = await this.approvalUsersRepository.find({
                where: {
                    id: { inq: approvalUsers },
                },
                include: [{ relation: 'user' }],
            });

            if (approvalUsersData.length > 0) {
                const notifications = approvalUsersData.map((item : any) => {
                    return {
                        title: 'Internal Validation Form Approval',
                        body: `Hello ${item.user?.firstName || 'User'}, you have a new internal validation form of tool No: ${internalValidationForm?.tools?.partNumber} and serial no: ${internalValidationForm?.tools?.meanSerialNumber} to approve.`,
                        userId: item.user?.id,
                        template: 'internal_validation_form',
                        pathname: `tools/${internalValidationForm?.id}/internal-validation-form`
                    };
                });

                const newNotifications = await this.notificationRepository.createAll(notifications);
            }
        } catch (error) {
            console.error('Error while sending notification of internal validation form', error);
        }
    }

    // SCRAPPING FORM APPROVAL NOOTIFICATION...
    async sendScrappingFormApproval(formId: number, approvalUsers: number[]): Promise<void> {
        try {
            const scrappingForm : any = await this.scrappingFormRepository.findById(formId, {include : [{relation : 'tools'}]});

            if (!scrappingForm) {
                console.log('No Scrapping Form Found with Id', formId);
                return;
            }

            const approvalUsersData : any = await this.approvalUsersRepository.find({
                where: {
                    id: { inq: approvalUsers },
                },
                include: [{ relation: 'user' }],
            });

            if (approvalUsersData.length > 0) {
                const notifications = approvalUsersData.map((item : any) => {
                    return {
                        title: 'Scrapping Form Approval',
                        body: `Hello ${item.user?.firstName || 'User'}, you have a new scrapping form of tool No: ${scrappingForm?.tools?.partNumber} and serial no: ${scrappingForm?.tools?.meanSerialNumber} to approve.`,
                        userId: item.user?.id,
                        template: 'scrapping_form',
                        pathname: `tools/${scrappingForm?.id}/scrapping-form`
                    };
                });

                const newNotifications = await this.notificationRepository.createAll(notifications);
            }
        } catch (error) {
            console.error('Error while sending notification of scrapping form', error);
        }
    }

    // INITIATOR FORMED SAVED NOTIFICATION FOR INSTALLATION FORM
    async sendInstallationFormSaved(formId: number): Promise<void> {
        try{
            const form : any = await this.installationFormRepository.findById(formId, {include : [{relation : 'initiator'}, {relation : 'tools'}]});

            if(!form){
                console.log('Error while searcing for form :', formId);
            }

            const newNotification = {
                title: 'Installation Form Saved',
                body: `Hello ${form.initiator?.firstName || 'User'}, Please do necessary changes which mention in remark of installtion form of tool part no: ${form?.tools?.partNumber} and of serial no: ${form?.tools?.meanSerialNumber}`,
                userId: form.initiator.id,
                template: 'installation_form_save',
                pathname: `tools/${form?.id}/installation-form`
            };

            await this.notificationRepository.create(newNotification);
        }catch(error){
            console.log('Error while sending notification to initiator :', error);
        }
    } 

    // INITIATOR FORMED SAVED NOTIFICATION FOR INTERNAL VALIDATION FORM
    async sendInternalValidationFormSaved(formId: number): Promise<void> {
        try{
            const form : any = await this.internalValidationFormRepository.findById(formId, {include : [{relation : 'initiator'}, {relation: 'tools'}]});

            if(!form){
                console.log('Error while searcing for form :', formId);
            }

            const newNotification = {
                title: 'Internal Validation Form Saved',
                body: `Hello ${form.initiator?.firstName || 'User'}, Please do necessary changes which mention in remark of internal validation form of tool part no: ${form?.tools?.partNumber} and of serial no: ${form?.tools?.meanSerialNumber}`,
                userId: form.initiator?.id,
                template: 'internal_validation_form_save',
                pathname: `tools/${form?.id}/internal-validation-form`
            };

            await this.notificationRepository.create(newNotification);
        }catch(error){
            console.log('Error while sending notification to initiator :', error);
        }
    } 

    // INITIATOR FORMED SAVED NOTIFICATION FOR SCRAPPING FORM
    async sendScrappingFormSaved(formId: number): Promise<void> {
        try{
            const form : any = await this.scrappingFormRepository.findById(formId, {include : [{relation : 'user'}, {relation : 'tools'}]});

            if(!form){
                console.log('Error while searcing for form :', formId);
            }

            const newNotification = {
                title: 'Scrapping Form Saved',
                body: `Hello ${form.initiator?.firstName || 'User'}, Please do necessary changes which mention in remark of scrapping form of tool part no: ${form?.tools?.partNumber} and of serial no: ${form?.tools?.meanSerialNumber}`,
                userId: form.initiator?.id,
                template: 'scrapping_form_save',
                pathname: `tools/${form?.id}/scrapping-form`
            };

            await this.notificationRepository.create(newNotification);
        }catch(error){
            console.log('Error while sending notification to initiator :', error);
        }
    } 
} 