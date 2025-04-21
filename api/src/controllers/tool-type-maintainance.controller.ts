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
import {ToolTypeMaintainance} from '../models';
import {ToolTypeMaintainanceRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { PermissionKeys } from '../authorization/permission-keys';

export class ToolTypeMaintainanceController {
  constructor(
    @repository(ToolTypeMaintainanceRepository)
    public toolTypeMaintainanceRepository : ToolTypeMaintainanceRepository,
  ) {}

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @post('/tool-type-maintainances')
  @response(200, {
    description: 'ToolTypeMaintainance model instance',
    content: {'application/json': {schema: getModelSchemaRef(ToolTypeMaintainance)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ToolTypeMaintainance, {
            title: 'NewToolTypeMaintainance',
            exclude: ['id'],
          }),
        },
      },
    })
    toolTypeMaintainance: Omit<ToolTypeMaintainance, 'id'>,
  ): Promise<ToolTypeMaintainance> {
    return this.toolTypeMaintainanceRepository.create(toolTypeMaintainance);
  }


  @get('/tool-type-maintainances/count')
  @response(200, {
    description: 'ToolTypeMaintainance model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ToolTypeMaintainance) where?: Where<ToolTypeMaintainance>,
  ): Promise<Count> {
    return this.toolTypeMaintainanceRepository.count(where);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN, PermissionKeys.INITIATOR, PermissionKeys.VALIDATOR, PermissionKeys.VIEWER],
    },
  })
  @get('/tool-type-maintainances')
  @response(200, {
    description: 'Array of ToolTypeMaintainance model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ToolTypeMaintainance, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ToolTypeMaintainance) filter?: Filter<ToolTypeMaintainance>,
  ): Promise<ToolTypeMaintainance[]> {
    return this.toolTypeMaintainanceRepository.find(filter);
  }

  @patch('/tool-type-maintainances')
  @response(200, {
    description: 'ToolTypeMaintainance PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ToolTypeMaintainance, {partial: true}),
        },
      },
    })
    toolTypeMaintainance: ToolTypeMaintainance,
    @param.where(ToolTypeMaintainance) where?: Where<ToolTypeMaintainance>,
  ): Promise<Count> {
    return this.toolTypeMaintainanceRepository.updateAll(toolTypeMaintainance, where);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN, PermissionKeys.INITIATOR, PermissionKeys.VALIDATOR, PermissionKeys.VIEWER],
    },
  })
  @get('/tool-type-maintainances/{id}')
  @response(200, {
    description: 'ToolTypeMaintainance model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ToolTypeMaintainance, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ToolTypeMaintainance, {exclude: 'where'}) filter?: FilterExcludingWhere<ToolTypeMaintainance>
  ): Promise<ToolTypeMaintainance> {
    return this.toolTypeMaintainanceRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @patch('/tool-type-maintainances/{id}')
  @response(204, {
    description: 'ToolTypeMaintainance PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ToolTypeMaintainance, {partial: true}),
        },
      },
    })
    toolTypeMaintainance: ToolTypeMaintainance,
  ): Promise<void> {
    await this.toolTypeMaintainanceRepository.updateById(id, toolTypeMaintainance);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @put('/tool-type-maintainances/{id}')
  @response(204, {
    description: 'ToolTypeMaintainance PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() toolTypeMaintainance: ToolTypeMaintainance,
  ): Promise<void> {
    await this.toolTypeMaintainanceRepository.replaceById(id, toolTypeMaintainance);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @del('/tool-type-maintainances/{id}')
  @response(204, {
    description: 'ToolTypeMaintainance DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.toolTypeMaintainanceRepository.deleteById(id);
  }


  // Fetch maintainance plan of tooltype from tool  type ID.

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @get('/tool-type-maintainances/by-tool-type/{id}')
  async fetchMaintainancePlanByToolTypeId(
    @param.path.number('id') toolTypeId : number,
  ) : Promise<{success: boolean; message : string; data: object | null}>{
    try{
      const maintainancePlan = await this.toolTypeMaintainanceRepository.findOne({where: {toolTypeId : toolTypeId}, include: [{relation : 'toolType'}]});

      return{
        success: true,
        message: 'Tool Type Maintainance plan',
        data : maintainancePlan
      }
    }catch(error){
      throw error;
    }
  }
}
