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
  ScrappingForm,
} from '../models';
import {ApprovalUsersRepository} from '../repositories';

export class ApprovalUsersScrappingFormController {
  constructor(
    @repository(ApprovalUsersRepository)
    public approvalUsersRepository: ApprovalUsersRepository,
  ) { }

  @get('/approval-users/{id}/scrapping-form', {
    responses: {
      '200': {
        description: 'ScrappingForm belonging to ApprovalUsers',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ScrappingForm),
          },
        },
      },
    },
  })
  async getScrappingForm(
    @param.path.number('id') id: typeof ApprovalUsers.prototype.id,
  ): Promise<ScrappingForm> {
    return this.approvalUsersRepository.scrappingForm(id);
  }
}
