import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Tools,
  InventoryOutEntryTools,
} from '../models';
import {ToolsRepository} from '../repositories';

export class ToolsInventoryOutEntryToolsController {
  constructor(
    @repository(ToolsRepository) protected toolsRepository: ToolsRepository,
  ) { }

  @get('/tools/{id}/inventory-out-entry-tools', {
    responses: {
      '200': {
        description: 'Array of Tools has many InventoryOutEntryTools',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(InventoryOutEntryTools)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<InventoryOutEntryTools>,
  ): Promise<InventoryOutEntryTools[]> {
    return this.toolsRepository.inventoryOutEntryTools(id).find(filter);
  }

  @post('/tools/{id}/inventory-out-entry-tools', {
    responses: {
      '200': {
        description: 'Tools model instance',
        content: {'application/json': {schema: getModelSchemaRef(InventoryOutEntryTools)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Tools.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InventoryOutEntryTools, {
            title: 'NewInventoryOutEntryToolsInTools',
            exclude: ['id'],
            optional: ['toolsId']
          }),
        },
      },
    }) inventoryOutEntryTools: Omit<InventoryOutEntryTools, 'id'>,
  ): Promise<InventoryOutEntryTools> {
    return this.toolsRepository.inventoryOutEntryTools(id).create(inventoryOutEntryTools);
  }

  @patch('/tools/{id}/inventory-out-entry-tools', {
    responses: {
      '200': {
        description: 'Tools.InventoryOutEntryTools PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InventoryOutEntryTools, {partial: true}),
        },
      },
    })
    inventoryOutEntryTools: Partial<InventoryOutEntryTools>,
    @param.query.object('where', getWhereSchemaFor(InventoryOutEntryTools)) where?: Where<InventoryOutEntryTools>,
  ): Promise<Count> {
    return this.toolsRepository.inventoryOutEntryTools(id).patch(inventoryOutEntryTools, where);
  }

  @del('/tools/{id}/inventory-out-entry-tools', {
    responses: {
      '200': {
        description: 'Tools.InventoryOutEntryTools DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(InventoryOutEntryTools)) where?: Where<InventoryOutEntryTools>,
  ): Promise<Count> {
    return this.toolsRepository.inventoryOutEntryTools(id).delete(where);
  }
}
