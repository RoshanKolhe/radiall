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
  User,
} from '../models';
import {MaintainanceEntriesRepository} from '../repositories';

export class MaintainanceEntriesUserController {
  constructor(
    @repository(MaintainanceEntriesRepository)
    public maintainanceEntriesRepository: MaintainanceEntriesRepository,
  ) { }

  @get('/maintainance-entries/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to MaintainanceEntries',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof MaintainanceEntries.prototype.id,
  ): Promise<User> {
    return this.maintainanceEntriesRepository.preparedByUser(id);
  }
}
