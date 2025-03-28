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
import {InventoryOutEntries} from '../models';
import {InventoryOutEntriesRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {PermissionKeys} from '../authorization/permission-keys';

export class InventoryOutEntriesController {
  constructor(
    @repository(InventoryOutEntriesRepository)
    public inventoryOutEntriesRepository: InventoryOutEntriesRepository,
  ) {}

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.PRODUCTION_HEAD, PermissionKeys.INITIATOR],
    },
  })
  @post('/inventory-out-entries')
  @response(200, {
    description: 'InventoryOutEntries model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(InventoryOutEntries)},
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InventoryOutEntries, {
            title: 'NewInventoryOutEntries',
            exclude: ['id'],
          }),
        },
      },
    })
    inventoryOutEntries: Omit<InventoryOutEntries, 'id'>,
  ): Promise<InventoryOutEntries> {
    return this.inventoryOutEntriesRepository.create(inventoryOutEntries);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.PRODUCTION_HEAD, PermissionKeys.INITIATOR],
    },
  })
  @get('/inventory-out-entries')
  @response(200, {
    description: 'Array of InventoryOutEntries model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(InventoryOutEntries, {
            includeRelations: true,
          }),
        },
      },
    },
  })
  async find(
    @param.filter(InventoryOutEntries) filter?: Filter<InventoryOutEntries>,
  ): Promise<InventoryOutEntries[]> {
    return this.inventoryOutEntriesRepository.find(filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.PRODUCTION_HEAD, PermissionKeys.INITIATOR],
    },
  })
  @get('/inventory-out-entries/{id}')
  @response(200, {
    description: 'InventoryOutEntries model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(InventoryOutEntries, {
          includeRelations: true,
        }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(InventoryOutEntries, {exclude: 'where'})
    filter?: FilterExcludingWhere<InventoryOutEntries>,
  ): Promise<InventoryOutEntries> {
    return this.inventoryOutEntriesRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.PRODUCTION_HEAD, PermissionKeys.INITIATOR],
    },
  })
  @patch('/inventory-out-entries/{id}')
  @response(204, {
    description: 'InventoryOutEntries PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InventoryOutEntries, {partial: true}),
        },
      },
    })
    inventoryOutEntries: InventoryOutEntries,
  ): Promise<void> {
    await this.inventoryOutEntriesRepository.updateById(
      id,
      inventoryOutEntries,
    );
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.PRODUCTION_HEAD],
    },
  })
  @del('/inventory-out-entries/{id}')
  @response(204, {
    description: 'InventoryOutEntries DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.inventoryOutEntriesRepository.deleteById(id);
  }
}
