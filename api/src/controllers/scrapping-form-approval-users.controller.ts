import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  ScrappingForm,
  ApprovalUsers,
} from '../models';
import {ScrappingFormRepository} from '../repositories';

export class ScrappingFormApprovalUsersController {
  constructor(
    @repository(ScrappingFormRepository)
    public scrappingFormRepository: ScrappingFormRepository,
  ) { }

  @get('/scrapping-forms/{id}/approval-users', {
    responses: {
      '200': {
        description: 'ApprovalUsers belonging to ScrappingForm',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ApprovalUsers),
          },
        },
      },
    },
  })
  async getApprovalUsers(
    @param.path.number('id') id: typeof ScrappingForm.prototype.id,
  ): Promise<ApprovalUsers> {
    return this.scrappingFormRepository.user(id);
  }
}
