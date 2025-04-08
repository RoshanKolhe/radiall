import { repository } from "@loopback/repository";
import { InternalValidationHistoryRepository } from "../repositories";
import { authenticate } from "@loopback/authentication";
import { PermissionKeys } from "../authorization/permission-keys";
import { get, param, requestBody } from "@loopback/rest";
import { InternalValidationHistory } from "../models";

export class InternalValidationHistoryController {
  constructor(
    @repository(InternalValidationHistoryRepository)
    public internalValidationHistoryRepository: InternalValidationHistoryRepository
  ) {}

    @authenticate({
      strategy: 'jwt',
      options: {
        required: [
          PermissionKeys.PRODUCTION_HEAD,
          PermissionKeys.INITIATOR,
          PermissionKeys.VALIDATOR,
        ],
      },
    })
    @get('/internal-validation-forms-history/{id}')
    async getInternalValidationForm(
      @param.path.number('id') formId : number,
    ) : Promise<{success: boolean; message: string; data: InternalValidationHistory | null}>{
      try{
        const internalValidationForm = await this.internalValidationHistoryRepository.findById(formId, {include : [{relation : 'initiator'}, {relation: 'tools'}]});

        return{
          success: true,
          message: 'Internal Validation Form',
          data: internalValidationForm
        }
      }catch(error){
        throw error;
      }
    }
}
