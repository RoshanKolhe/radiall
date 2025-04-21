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
  User,
} from '../models';
import {ToolTypeMaintainanceRepository} from '../repositories';

export class ToolTypeMaintainanceUserController {
  constructor(
    @repository(ToolTypeMaintainanceRepository)
    public toolTypeMaintainanceRepository: ToolTypeMaintainanceRepository,
  ) { }

  @get('/tool-type-maintainances/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to ToolTypeMaintainance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof ToolTypeMaintainance.prototype.id,
  ): Promise<User> {
    return this.toolTypeMaintainanceRepository.preparedByUser(id);
  }
}
