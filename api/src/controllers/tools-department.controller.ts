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
import {ToolsDepartment} from '../models';
import {ToolsDepartmentRepository} from '../repositories';
import { PermissionKeys } from '../authorization/permission-keys';
import { authenticate } from '@loopback/authentication';

export class ToolsDepartmentController {
  constructor(
    @repository(ToolsDepartmentRepository)
    public toolsDepartmentRepository : ToolsDepartmentRepository,
  ) {}

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.PRODUCTION_HEAD]},
  })
  @post('/tools-departments')
  @response(200, {
    description: 'ToolsDepartment model instance',
    content: {'application/json': {schema: getModelSchemaRef(ToolsDepartment)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ToolsDepartment, {
            title: 'NewToolsDepartment',
            exclude: ['id'],
          }),
        },
      },
    })
    toolsDepartment: Omit<ToolsDepartment, 'id'>,
  ): Promise<ToolsDepartment> {
    return this.toolsDepartmentRepository.create(toolsDepartment);
  }

  @get('/tools-departments/count')
  @response(200, {
    description: 'ToolsDepartment model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ToolsDepartment) where?: Where<ToolsDepartment>,
  ): Promise<Count> {
    return this.toolsDepartmentRepository.count(where);
  }

  @get('/tools-departments')
  @response(200, {
    description: 'Array of ToolsDepartment model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ToolsDepartment, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ToolsDepartment) filter?: Filter<ToolsDepartment>,
  ): Promise<ToolsDepartment[]> {
    return this.toolsDepartmentRepository.find(filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.PRODUCTION_HEAD]},
  })
  @patch('/tools-departments')
  @response(200, {
    description: 'ToolsDepartment PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ToolsDepartment, {partial: true}),
        },
      },
    })
    toolsDepartment: ToolsDepartment,
    @param.where(ToolsDepartment) where?: Where<ToolsDepartment>,
  ): Promise<Count> {
    return this.toolsDepartmentRepository.updateAll(toolsDepartment, where);
  }

  @get('/tools-departments/{id}')
  @response(200, {
    description: 'ToolsDepartment model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ToolsDepartment, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ToolsDepartment, {exclude: 'where'}) filter?: FilterExcludingWhere<ToolsDepartment>
  ): Promise<ToolsDepartment> {
    return this.toolsDepartmentRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.PRODUCTION_HEAD]},
  })
  @patch('/tools-departments/{id}')
  @response(204, {
    description: 'ToolsDepartment PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ToolsDepartment, {partial: true}),
        },
      },
    })
    toolsDepartment: ToolsDepartment,
  ): Promise<void> {
    await this.toolsDepartmentRepository.updateById(id, toolsDepartment);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.PRODUCTION_HEAD]},
  })
  @put('/tools-departments/{id}')
  @response(204, {
    description: 'ToolsDepartment PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() toolsDepartment: ToolsDepartment,
  ): Promise<void> {
    await this.toolsDepartmentRepository.replaceById(id, toolsDepartment);
  }

  @del('/tools-departments/{id}')
  @response(204, {
    description: 'ToolsDepartment DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.toolsDepartmentRepository.deleteById(id);
  }
}
