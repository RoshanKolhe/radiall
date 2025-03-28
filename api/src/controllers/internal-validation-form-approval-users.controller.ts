import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  InternalValidationForm,
  ApprovalUsers,
} from '../models';
import {InternalValidationFormRepository} from '../repositories';

export class InternalValidationFormApprovalUsersController {
  constructor(
    @repository(InternalValidationFormRepository)
    public internalValidationFormRepository: InternalValidationFormRepository,
  ) { }

  @get('/internal-validation-forms/{id}/approval-users', {
    responses: {
      '200': {
        description: 'ApprovalUsers belonging to InternalValidationForm',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ApprovalUsers),
          },
        },
      },
    },
  })
  async getApprovalUsers(
    @param.path.number('id') id: typeof InternalValidationForm.prototype.id,
  ): Promise<ApprovalUsers> {
    return this.internalValidationFormRepository.user(id);
  }
}
