import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Tools,
  MaintainancePlan,
} from '../models';
import {ToolsRepository} from '../repositories';

export class ToolsMaintainancePlanController {
  constructor(
    @repository(ToolsRepository)
    public toolsRepository: ToolsRepository,
  ) { }

  @get('/tools/{id}/maintainance-plan', {
    responses: {
      '200': {
        description: 'MaintainancePlan belonging to Tools',
        content: {
          'application/json': {
            schema: getModelSchemaRef(MaintainancePlan),
          },
        },
      },
    },
  })
  async getMaintainancePlan(
    @param.path.number('id') id: typeof Tools.prototype.id,
  ): Promise<MaintainancePlan> {
    return this.toolsRepository.levelTwoMaintainance(id);
  }
}
