import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  ApprovalUsers,
  User,
} from '../models';
import {ApprovalUsersRepository} from '../repositories';

export class ApprovalUsersUserController {
  constructor(
    @repository(ApprovalUsersRepository)
    public approvalUsersRepository: ApprovalUsersRepository,
  ) { }

  @get('/approval-users/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to ApprovalUsers',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof ApprovalUsers.prototype.id,
  ): Promise<User> {
    return this.approvalUsersRepository.user(id);
  }
}
