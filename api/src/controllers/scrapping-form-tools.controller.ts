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
  Tools,
} from '../models';
import {ScrappingFormRepository} from '../repositories';

export class ScrappingFormToolsController {
  constructor(
    @repository(ScrappingFormRepository)
    public scrappingFormRepository: ScrappingFormRepository,
  ) { }

  @get('/scrapping-forms/{id}/tools', {
    responses: {
      '200': {
        description: 'Tools belonging to ScrappingForm',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Tools),
          },
        },
      },
    },
  })
  async getTools(
    @param.path.number('id') id: typeof ScrappingForm.prototype.id,
  ): Promise<Tools> {
    return this.scrappingFormRepository.tools(id);
  }
}
