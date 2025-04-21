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
import {Supplier} from '../models';
import {SupplierRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {PermissionKeys} from '../authorization/permission-keys';

export class SupplierController {
  constructor(
    @repository(SupplierRepository)
    public supplierRepository: SupplierRepository,
  ) {}

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN]},
  })
  @post('/suppliers')
  @response(200, {
    description: 'Supplier model instance',
    content: {'application/json': {schema: getModelSchemaRef(Supplier)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Supplier, {
            title: 'NewSupplier',
            exclude: ['id'],
          }),
        },
      },
    })
    supplier: Omit<Supplier, 'id'>,
  ): Promise<Supplier> {
    return this.supplierRepository.create(supplier);
  }

  @authenticate({
    strategy: 'jwt',
  })
  @get('/suppliers')
  @response(200, {
    description: 'Array of Supplier model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Supplier, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Supplier) filter?: Filter<Supplier>,
  ): Promise<Supplier[]> {
    return this.supplierRepository.find(filter);
  }

  @authenticate({
    strategy: 'jwt',
  })
  @get('/suppliers/{id}')
  @response(200, {
    description: 'Supplier model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Supplier, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Supplier, {exclude: 'where'})
    filter?: FilterExcludingWhere<Supplier>,
  ): Promise<Supplier> {
    return this.supplierRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN]},
  })
  @patch('/suppliers/{id}')
  @response(204, {
    description: 'Supplier PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Supplier, {partial: true}),
        },
      },
    })
    supplier: Supplier,
  ): Promise<void> {
    await this.supplierRepository.updateById(id, supplier);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN]},
  })
  @del('/suppliers/{id}')
  @response(204, {
    description: 'Supplier DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.supplierRepository.deleteById(id);
  }
}
