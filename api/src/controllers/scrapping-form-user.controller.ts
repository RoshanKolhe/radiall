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
  User,
} from '../models';
import {ScrappingFormRepository} from '../repositories';

export class ScrappingFormUserController {
  constructor(
    @repository(ScrappingFormRepository)
    public scrappingFormRepository: ScrappingFormRepository,
  ) { }

  @get('/scrapping-forms/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to ScrappingForm',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof ScrappingForm.prototype.id,
  ): Promise<User> {
    return this.scrappingFormRepository.initiator(id);
  }
}
