import {
  Count,
  CountSchema,
  DefaultTransactionalRepository,
  Filter,
  FilterExcludingWhere,
  IsolationLevel,
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
  HttpErrors,
} from '@loopback/rest';
import {InventoryOutEntries} from '../models';
import {
  InventoryOutEntriesRepository,
  InventoryOutEntryToolsRepository,
  ToolsRepository,
} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {PermissionKeys} from '../authorization/permission-keys';
import {inject} from '@loopback/core';
import {RadiallDataSource} from '../datasources';

export class InventoryOutEntriesController {
  constructor(
    @inject('datasources.radiall')
    public dataSource: RadiallDataSource,
    @repository(InventoryOutEntriesRepository)
    public inventoryOutEntriesRepository: InventoryOutEntriesRepository,
    @repository(InventoryOutEntryToolsRepository)
    public inventoryOutEntryToolsRepository: InventoryOutEntryToolsRepository,
    @repository(ToolsRepository)
    public toolsRepository: ToolsRepository,
  ) {}

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.PRODUCTION_HEAD, PermissionKeys.INITIATOR],
    },
  })
  @post('/inventory-out-entries')
  async createInventoryOutEntries(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                moPartNumber: {type: 'string'},
                moNumber: {type: 'number'},
                moQuantity: {type: 'number'},
                issuedDate: {type: 'string', format: 'date-time'},
                requiredDays: {type: 'number'},
                department: {type: 'string'},
                issuedTo: {type: 'number'},
                issuedBy: {type: 'number'},
                remark: {type: 'string'},
                tools: {
                  type: 'array',
                  items: {type: 'number'},
                },
              },
              required: [
                'moPartNumber',
                'moNumber',
                'moQuantity',
                'requiredDays',
                'department',
                'issuedTo',
                'issuedBy',
                'tools',
              ],
            },
          },
        },
      },
    })
    requestData: {
      moPartNumber: string;
      moNumber: number;
      moQuantity: number;
      issuedDate?: string;
      requiredDays: number;
      department: string;
      issuedTo: number;
      issuedBy: number;
      remark?: string;
      tools: number[];
    }[],
  ) {
    const createdEntries = [];

    for (const data of requestData) {
      const issuedDateISO = data.issuedDate
        ? new Date(data.issuedDate).toISOString()
        : undefined;

      if (!data.tools || data.tools.length === 0) {
        throw new HttpErrors.BadRequest('Tools array cannot be empty.');
      }

      const tools = await this.toolsRepository.find({
        where: {id: {inq: data.tools}},
      });

      if (tools.length !== data.tools.length) {
        throw new HttpErrors.BadRequest('Some tools do not exist.');
      }

      const insufficientStockTools = tools.filter(
        tool => tool.balanceQuantity <= 0,
      );
      if (insufficientStockTools.length > 0) {
        throw new HttpErrors.BadRequest(
          `The following tools are out of stock: ${insufficientStockTools.map(t => t.id).join(', ')}`,
        );
      }

      const bulkUpdateTools = tools.map(tool => ({
        id: tool.id,
        balanceQuantity: tool.balanceQuantity - 1,
      }));

      await Promise.all(
        bulkUpdateTools.map(tool =>
          this.toolsRepository.updateById(tool.id, {
            balanceQuantity: tool.balanceQuantity,
          }),
        ),
      );

      const inventoryOutEntry = await this.inventoryOutEntriesRepository.create(
        {
          moPartNumber: data.moPartNumber,
          moNumber: data.moNumber,
          moQuantity: data.moQuantity,
          issuedDate: issuedDateISO,
          requiredDays: data.requiredDays,
          department: data.department,
          issuedTo: data.issuedTo,
          issuedBy: data.issuedBy,
          remark: data.remark,
        },
      );

      const inventoryOutEntryToolsData = data.tools.map(toolId => ({
        inventoryOutEntriesId: inventoryOutEntry.id,
        toolsId: toolId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await this.inventoryOutEntryToolsRepository.createAll(
        inventoryOutEntryToolsData,
      );

      createdEntries.push(inventoryOutEntry);
    }

    return {
      message: 'Inventory Out Entries created successfully',
      createdEntries,
    };
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.PRODUCTION_HEAD, PermissionKeys.INITIATOR],
    },
  })
  @post('/tools/available-serials')
  async getAvailableSerials(
    @requestBody({
      description: 'Get available serial numbers for a tool part number',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              partNumber: {type: 'string'},
              quantity: {type: 'number'},
            },
            required: ['partNumber', 'quantity'],
          },
        },
      },
    })
    requestData: {
      partNumber: string;
      quantity: number;
    },
  ) {
    const {partNumber, quantity} = requestData;

    if (!partNumber || quantity <= 0) {
      throw new HttpErrors.BadRequest('Invalid part number or quantity');
    }

    const partExists = await this.toolsRepository.count({partNumber});
    if (partExists.count === 0) {
      throw new HttpErrors.NotFound(`Part number ${partNumber} does not exist`);
    }

    const allocatedToolIds = (
      await this.inventoryOutEntryToolsRepository.find({
        fields: {toolsId: true},
      })
    ).map(entry => entry.toolsId);

    // Find available tools that are not allocated
    const availableTools = await this.toolsRepository.find({
      where: {
        partNumber,
        id: {nin: allocatedToolIds},
      },
      limit: quantity,
    });

    if (availableTools.length < quantity) {
      throw new HttpErrors.UnprocessableEntity(
        `Only ${availableTools.length} tools available for part number ${partNumber}`,
      );
    }

    return availableTools.map(tool => ({
      toolId: tool.id,
      serialNo: tool.meanSerialNumber,
    }));
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.PRODUCTION_HEAD, PermissionKeys.INITIATOR],
    },
  })
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
  @get('/inventory-out-entries')
  async find(
    @param.filter(InventoryOutEntries) filter?: Filter<InventoryOutEntries>,
    @param.query.number('toolsId') toolsId?: number,
  ): Promise<InventoryOutEntries[]> {
    const whereClause = toolsId
      ? {
          id: {
            inq: (
              await this.inventoryOutEntryToolsRepository.find({
                where: {toolsId},
                fields: {inventoryOutEntriesId: true},
              })
            ).map(entry => entry.inventoryOutEntriesId),
          },
        }
      : {};

    return this.inventoryOutEntriesRepository.find({
      ...filter,
      where: {...filter?.where, ...whereClause},
      include: ['issuedByUser', 'user'],
    });
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
    return this.inventoryOutEntriesRepository.findById(id, {
      ...filter,
      include: [
        'issuedByUser',
        'user',
        {
          relation: 'inventoryInEntries',
          scope: {
            include: ['returnByUser', 'receivedFromUser'],
          },
        },
        {
          relation: 'tools',
          scope: {
            include: [
              'manufacturer',
              'supplier',
              {
                relation: 'inventoryOutEntryTools',
                scope: {
                  include: ['inventoryInEntries'],
                },
              },
            ],
          },
        },
      ],
    });
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
