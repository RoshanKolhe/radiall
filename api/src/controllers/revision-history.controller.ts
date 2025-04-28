import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {RevisionHistory} from '../models';
import {RevisionHistoryRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {PermissionKeys} from '../authorization/permission-keys';

export class RevisionHistoryController {
  constructor(
    @repository(RevisionHistoryRepository)
    public revisionHistoryRepository: RevisionHistoryRepository,
  ) {}

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @post('/revision-histories')
  @response(200, {
    description: 'RevisionHistory model instance',
    content: {'application/json': {schema: getModelSchemaRef(RevisionHistory)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RevisionHistory, {
            title: 'NewRevisionHistory',
            exclude: ['id'],
          }),
        },
      },
    })
    revisionHistory: Omit<RevisionHistory, 'id'>,
  ): Promise<RevisionHistory> {
    return this.revisionHistoryRepository.create(revisionHistory);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @get('/revision-histories')
  @response(200, {
    description: 'Array of RevisionHistory model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RevisionHistory, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(RevisionHistory) filter?: Filter<RevisionHistory>,
  ): Promise<RevisionHistory[]> {
    return this.revisionHistoryRepository.find(filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @get('/revision-histories/{id}')
  @response(200, {
    description: 'RevisionHistory model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(RevisionHistory, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(RevisionHistory, {exclude: 'where'})
    filter?: FilterExcludingWhere<RevisionHistory>,
  ): Promise<RevisionHistory> {
    return this.revisionHistoryRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @patch('/revision-histories/{id}')
  @response(204, {
    description: 'RevisionHistory PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RevisionHistory, {partial: true}),
        },
      },
    })
    revisionHistory: RevisionHistory,
  ): Promise<void> {
    await this.revisionHistoryRepository.updateById(id, revisionHistory);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @del('/revision-histories/{id}')
  @response(204, {
    description: 'RevisionHistory DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.revisionHistoryRepository.deleteById(id);
  }
}
