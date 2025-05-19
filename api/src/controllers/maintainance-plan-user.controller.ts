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
  User,
} from '../models';
import {MaintainancePlanRepository} from '../repositories';

export class MaintainancePlanUserController {
  constructor(
    @repository(MaintainancePlanRepository)
    public maintainancePlanRepository: MaintainancePlanRepository,
  ) { }

  @get('/maintainance-plans/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to MaintainancePlan',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof MaintainancePlan.prototype.id,
  ): Promise<User> {
    return this.maintainancePlanRepository.responsibleUser(id);
  }
}
