import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  MaintainanceEntries,
  Tools,
} from '../models';
import {MaintainanceEntriesRepository} from '../repositories';

export class MaintainanceEntriesToolsController {
  constructor(
    @repository(MaintainanceEntriesRepository)
    public maintainanceEntriesRepository: MaintainanceEntriesRepository,
  ) { }

  @get('/maintainance-entries/{id}/tools', {
    responses: {
      '200': {
        description: 'Tools belonging to MaintainanceEntries',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Tools),
          },
        },
      },
    },
  })
  async getTools(
    @param.path.number('id') id: typeof MaintainanceEntries.prototype.id,
  ): Promise<Tools> {
    return this.maintainanceEntriesRepository.tools(id);
  }
}
