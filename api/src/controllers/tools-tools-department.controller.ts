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
  ToolsDepartment,
} from '../models';
import {ToolsRepository} from '../repositories';

export class ToolsToolsDepartmentController {
  constructor(
    @repository(ToolsRepository)
    public toolsRepository: ToolsRepository,
  ) { }

  @get('/tools/{id}/tools-department', {
    responses: {
      '200': {
        description: 'ToolsDepartment belonging to Tools',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ToolsDepartment),
          },
        },
      },
    },
  })
  async getToolsDepartment(
    @param.path.number('id') id: typeof Tools.prototype.id,
  ): Promise<ToolsDepartment> {
    return this.toolsRepository.toolsDepartment(id);
  }
}
