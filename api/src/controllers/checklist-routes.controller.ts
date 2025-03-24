import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Checklist,
  Routes,
} from '../models';
import {ChecklistRepository} from '../repositories';

export class ChecklistRoutesController {
  constructor(
    @repository(ChecklistRepository)
    public checklistRepository: ChecklistRepository,
  ) { }

  @get('/checklists/{id}/routes', {
    responses: {
      '200': {
        description: 'Routes belonging to Checklist',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Routes),
          },
        },
      },
    },
  })
  async getRoutes(
    @param.path.number('id') id: typeof Checklist.prototype.id,
  ): Promise<Routes> {
    return this.checklistRepository.routes(id);
  }
}
