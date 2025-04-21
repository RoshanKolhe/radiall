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
import {ToolType} from '../models';
import {ToolTypeRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {PermissionKeys} from '../authorization/permission-keys';

export class ToolTypeController {
  constructor(
    @repository(ToolTypeRepository)
    public toolTypeRepository: ToolTypeRepository,
  ) {}

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN]},
  })
  @post('/tool-types')
  @response(200, {
    description: 'ToolType model instance',
    content: {'application/json': {schema: getModelSchemaRef(ToolType)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ToolType, {
            title: 'NewToolType',
            exclude: ['id'],
          }),
        },
      },
    })
    toolType: Omit<ToolType, 'id'>,
  ): Promise<ToolType> {
    return this.toolTypeRepository.create(toolType);
  }

  @authenticate({
    strategy: 'jwt',
  })
  @get('/tool-types')
  @response(200, {
    description: 'Array of ToolType model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ToolType, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ToolType) filter?: Filter<ToolType>,
  ): Promise<ToolType[]> {
    return this.toolTypeRepository.find(filter);
  }

  @authenticate({
    strategy: 'jwt',
  })
  @get('/tool-types/{id}')
  @response(200, {
    description: 'ToolType model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ToolType, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ToolType, {exclude: 'where'})
    filter?: FilterExcludingWhere<ToolType>,
  ): Promise<ToolType> {
    return this.toolTypeRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN]},
  })
  @patch('/tool-types/{id}')
  @response(204, {
    description: 'ToolType PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ToolType, {partial: true}),
        },
      },
    })
    toolType: ToolType,
  ): Promise<void> {
    await this.toolTypeRepository.updateById(id, toolType);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN]},
  })
  @del('/tool-types/{id}')
  @response(204, {
    description: 'ToolType DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.toolTypeRepository.deleteById(id);
  }
}
