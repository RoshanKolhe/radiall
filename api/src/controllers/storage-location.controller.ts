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
import {StorageLocation} from '../models';
import {StorageLocationRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {PermissionKeys} from '../authorization/permission-keys';

export class StorageLocationController {
  constructor(
    @repository(StorageLocationRepository)
    public storageLocationRepository: StorageLocationRepository,
  ) {}

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.PRODUCTION_HEAD]},
  })
  @post('/storage-locations')
  @response(200, {
    description: 'StorageLocation model instance',
    content: {'application/json': {schema: getModelSchemaRef(StorageLocation)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StorageLocation, {
            title: 'NewStorageLocation',
            exclude: ['id'],
          }),
        },
      },
    })
    storageLocation: Omit<StorageLocation, 'id'>,
  ): Promise<StorageLocation> {
    return this.storageLocationRepository.create(storageLocation);
  }

  @authenticate({
    strategy: 'jwt',
  })
  @get('/storage-locations')
  @response(200, {
    description: 'Array of StorageLocation model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(StorageLocation, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(StorageLocation) filter?: Filter<StorageLocation>,
  ): Promise<StorageLocation[]> {
    return this.storageLocationRepository.find(filter);
  }

  @authenticate({
    strategy: 'jwt',
  })
  @get('/storage-locations/{id}')
  @response(200, {
    description: 'StorageLocation model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(StorageLocation, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(StorageLocation, {exclude: 'where'})
    filter?: FilterExcludingWhere<StorageLocation>,
  ): Promise<StorageLocation> {
    return this.storageLocationRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.PRODUCTION_HEAD]},
  })
  @patch('/storage-locations/{id}')
  @response(204, {
    description: 'StorageLocation PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StorageLocation, {partial: true}),
        },
      },
    })
    storageLocation: StorageLocation,
  ): Promise<void> {
    await this.storageLocationRepository.updateById(id, storageLocation);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.PRODUCTION_HEAD]},
  })
  @del('/storage-locations/{id}')
  @response(204, {
    description: 'StorageLocation DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.storageLocationRepository.deleteById(id);
  }
}
