import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  MaintainancePlan,
  Tools,
} from '../models';
import {MaintainancePlanRepository} from '../repositories';

export class MaintainancePlanToolsController {
  constructor(
    @repository(MaintainancePlanRepository)
    public maintainancePlanRepository: MaintainancePlanRepository,
  ) { }

  @get('/maintainance-plans/{id}/tools', {
    responses: {
      '200': {
        description: 'Tools belonging to MaintainancePlan',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Tools),
          },
        },
      },
    },
  })
  async getTools(
    @param.path.number('id') id: typeof MaintainancePlan.prototype.id,
  ): Promise<Tools> {
    return this.maintainancePlanRepository.tools(id);
  }
}
