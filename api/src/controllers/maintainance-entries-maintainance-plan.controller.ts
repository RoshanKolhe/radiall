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
  MaintainancePlan,
} from '../models';
import {MaintainanceEntriesRepository} from '../repositories';

export class MaintainanceEntriesMaintainancePlanController {
  constructor(
    @repository(MaintainanceEntriesRepository)
    public maintainanceEntriesRepository: MaintainanceEntriesRepository,
  ) { }

  @get('/maintainance-entries/{id}/maintainance-plan', {
    responses: {
      '200': {
        description: 'MaintainancePlan belonging to MaintainanceEntries',
        content: {
          'application/json': {
            schema: getModelSchemaRef(MaintainancePlan),
          },
        },
      },
    },
  })
  async getMaintainancePlan(
    @param.path.number('id') id: typeof MaintainanceEntries.prototype.id,
  ): Promise<MaintainancePlan> {
    return this.maintainanceEntriesRepository.maintainancePlan(id);
  }
}
