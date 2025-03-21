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
  InstallationForm,
} from '../models';
import {ApprovalUsersRepository} from '../repositories';

export class ApprovalUsersInstallationFormController {
  constructor(
    @repository(ApprovalUsersRepository)
    public approvalUsersRepository: ApprovalUsersRepository,
  ) { }

  @get('/approval-users/{id}/installation-form', {
    responses: {
      '200': {
        description: 'InstallationForm belonging to ApprovalUsers',
        content: {
          'application/json': {
            schema: getModelSchemaRef(InstallationForm),
          },
        },
      },
    },
  })
  async getInstallationForm(
    @param.path.number('id') id: typeof ApprovalUsers.prototype.id,
  ): Promise<InstallationForm> {
    return this.approvalUsersRepository.installationForm(id);
  }
}
