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
import {Manufacturer} from '../models';
import {ManufacturerRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {PermissionKeys} from '../authorization/permission-keys';

export class ManufacturerController {
  constructor(
    @repository(ManufacturerRepository)
    public manufacturerRepository: ManufacturerRepository,
  ) {}

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.PRODUCTION_HEAD]},
  })
  @post('/manufacturers')
  @response(200, {
    description: 'Manufacturer model instance',
    content: {'application/json': {schema: getModelSchemaRef(Manufacturer)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Manufacturer, {
            title: 'NewManufacturer',
            exclude: ['id'],
          }),
        },
      },
    })
    manufacturer: Omit<Manufacturer, 'id'>,
  ): Promise<Manufacturer> {
    return this.manufacturerRepository.create(manufacturer);
  }

  @authenticate({
    strategy: 'jwt',
  })
  @get('/manufacturers')
  @response(200, {
    description: 'Array of Manufacturer model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Manufacturer, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Manufacturer) filter?: Filter<Manufacturer>,
  ): Promise<Manufacturer[]> {
    return this.manufacturerRepository.find(filter);
  }

  @authenticate({
    strategy: 'jwt',
  })
  @get('/manufacturers/{id}')
  @response(200, {
    description: 'Manufacturer model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Manufacturer, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Manufacturer, {exclude: 'where'})
    filter?: FilterExcludingWhere<Manufacturer>,
  ): Promise<Manufacturer> {
    return this.manufacturerRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.PRODUCTION_HEAD]},
  })
  @patch('/manufacturers/{id}')
  @response(204, {
    description: 'Manufacturer PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Manufacturer, {partial: true}),
        },
      },
    })
    manufacturer: Manufacturer,
  ): Promise<void> {
    await this.manufacturerRepository.updateById(id, manufacturer);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.PRODUCTION_HEAD]},
  })
  @del('/manufacturers/{id}')
  @response(204, {
    description: 'Manufacturer DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.manufacturerRepository.deleteById(id);
  }
}
