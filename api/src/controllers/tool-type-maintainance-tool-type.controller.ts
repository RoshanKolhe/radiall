import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  ToolTypeMaintainance,
  ToolType,
} from '../models';
import {ToolTypeMaintainanceRepository} from '../repositories';

export class ToolTypeMaintainanceToolTypeController {
  constructor(
    @repository(ToolTypeMaintainanceRepository)
    public toolTypeMaintainanceRepository: ToolTypeMaintainanceRepository,
  ) { }

  @get('/tool-type-maintainances/{id}/tool-type', {
    responses: {
      '200': {
        description: 'ToolType belonging to ToolTypeMaintainance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ToolType),
          },
        },
      },
    },
  })
  async getToolType(
    @param.path.number('id') id: typeof ToolTypeMaintainance.prototype.id,
  ): Promise<ToolType> {
    return this.toolTypeMaintainanceRepository.toolType(id);
  }
}
