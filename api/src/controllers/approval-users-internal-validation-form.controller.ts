import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  ApprovalUsers,
  InternalValidationForm,
} from '../models';
import {ApprovalUsersRepository} from '../repositories';

export class ApprovalUsersInternalValidationFormController {
  constructor(
    @repository(ApprovalUsersRepository)
    public approvalUsersRepository: ApprovalUsersRepository,
  ) { }

  @get('/approval-users/{id}/internal-validation-form', {
    responses: {
      '200': {
        description: 'InternalValidationForm belonging to ApprovalUsers',
        content: {
          'application/json': {
            schema: getModelSchemaRef(InternalValidationForm),
          },
        },
      },
    },
  })
  async getInternalValidationForm(
    @param.path.number('id') id: typeof ApprovalUsers.prototype.id,
  ): Promise<InternalValidationForm> {
    return this.approvalUsersRepository.internalValidationForm(id);
  }
}
