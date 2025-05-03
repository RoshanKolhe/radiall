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
import {InventoryInEntries, InventoryOutEntries} from '../models';
import {
  InventoryInEntriesRepository,
  InventoryOutEntriesRepository,
  InventoryOutEntryToolsRepository,
  ToolsRepository,
} from '../repositories';

export class InventoryInEntriesController {
  constructor(
    @repository(ToolsRepository)
    public toolsRepository: ToolsRepository,
    @repository(InventoryInEntriesRepository)
    public inventoryInEntriesRepository: InventoryInEntriesRepository,
    @repository(InventoryOutEntryToolsRepository)
    public inventoryOutEntryToolsRepository: InventoryOutEntryToolsRepository,
    @repository(InventoryOutEntriesRepository)
    public inventoryOutEntriesRepository: InventoryOutEntriesRepository,
  ) {}

  @post('/inventory-in-entries')
  @response(200, {
    description: 'InventoryInEntries model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(InventoryInEntries)},
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              inventoryInEntries: getModelSchemaRef(InventoryInEntries, {
                title: 'NewInventoryInEntries',
                exclude: ['id'],
              }),
              toolsIds: {
                type: 'array',
                items: {type: 'number'},
                description: 'Array of tool IDs',
              },
            },
            required: ['inventoryInEntries', 'toolsIds'],
          },
        },
      },
    })
    requestBody: {
      inventoryInEntries: Omit<InventoryInEntries, 'id'>;
      toolsIds: number[];
    },
  ): Promise<InventoryInEntries> {
    const {inventoryInEntries, toolsIds} = requestBody;

    const newInventoryEntry =
      await this.inventoryInEntriesRepository.create(inventoryInEntries);
    await Promise.all(
      toolsIds.map(async res => {
        await this.inventoryOutEntryToolsRepository.updateAll(
          {inventoryInEntriesId: newInventoryEntry.id, status: 1},
          {
            toolsId: res,
            inventoryOutEntriesId: inventoryInEntries.inventoryOutEntriesId,
          },
        );

        await this.inventoryOutEntriesRepository.updateById(inventoryInEntries.inventoryOutEntriesId, {status: 1});

        await this.toolsRepository.updateById(res, {balanceQuantity: 1});
      }),
    );

    return newInventoryEntry;
  }

  @get('/inventory-in-entries')
  @response(200, {
    description: 'Array of InventoryInEntries model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(InventoryInEntries, {
            includeRelations: true,
          }),
        },
      },
    },
  })
  async find(
    @param.filter(InventoryInEntries) filter?: Filter<InventoryInEntries>,
  ): Promise<InventoryInEntries[]> {
    return this.inventoryInEntriesRepository.find(filter);
  }

  @get('/inventory-in-entries/{id}')
  @response(200, {
    description: 'InventoryInEntries model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(InventoryInEntries, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(InventoryInEntries, {exclude: 'where'})
    filter?: FilterExcludingWhere<InventoryInEntries>,
  ): Promise<InventoryInEntries> {
    return this.inventoryInEntriesRepository.findById(id, filter);
  }

  @patch('/inventory-in-entries/{id}')
  @response(204, {
    description: 'InventoryInEntries PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InventoryInEntries, {partial: true}),
        },
      },
    })
    inventoryInEntries: InventoryInEntries,
  ): Promise<void> {
    await this.inventoryInEntriesRepository.updateById(id, inventoryInEntries);
  }

  @del('/inventory-in-entries/{id}')
  @response(204, {
    description: 'InventoryInEntries DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.inventoryInEntriesRepository.deleteById(id);
  }

  //  Get inventory In entries with inventory out Id....
  @get('/inventory-in-entries/by-out-entry-id/{id}')
  async getInventoryInEntries(
    @param.path.number('id') id : number
  ):Promise<InventoryInEntries[]>{
    try{
      const inventoryInEntries = await this.inventoryInEntriesRepository.find({where : {inventoryOutEntriesId : id}, include : [{relation : 'receivedFromUser'}, {relation : 'returnByUser'}]});

      return inventoryInEntries
    }catch(error){
      throw error;
    }
  }
}
