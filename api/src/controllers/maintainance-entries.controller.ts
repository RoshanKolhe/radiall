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
import {MaintainanceEntries} from '../models';
import {MaintainanceEntriesRepository} from '../repositories';

export class MaintainanceEntriesController {
  constructor(
    @repository(MaintainanceEntriesRepository)
    public maintainanceEntriesRepository : MaintainanceEntriesRepository,
  ) {}

  @post('/maintainance-entries')
  @response(200, {
    description: 'MaintainanceEntries model instance',
    content: {'application/json': {schema: getModelSchemaRef(MaintainanceEntries)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MaintainanceEntries, {
            title: 'NewMaintainanceEntries',
            exclude: ['id'],
          }),
        },
      },
    })
    maintainanceEntries: Omit<MaintainanceEntries, 'id'>,
  ): Promise<MaintainanceEntries> {
    return this.maintainanceEntriesRepository.create(maintainanceEntries);
  }

  @get('/maintainance-entries/count')
  @response(200, {
    description: 'MaintainanceEntries model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(MaintainanceEntries) where?: Where<MaintainanceEntries>,
  ): Promise<Count> {
    return this.maintainanceEntriesRepository.count(where);
  }

  @get('/maintainance-entries/{toolId}')
  @response(200, {
    description: 'Array of MaintainanceEntries model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(MaintainanceEntries, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.path.number('toolId') toolId: number,
    @param.filter(MaintainanceEntries) filter?: Filter<MaintainanceEntries>,
  ): Promise<MaintainanceEntries[]> {
    return this.maintainanceEntriesRepository.find({
      where: {
        toolsId: toolId,  
      },
      ...filter,
      include : [
        {relation : 'maintainancePlan', scope : {include : [{relation : 'responsibleUser'}]}}
      ]
    });
  }

  @patch('/maintainance-entries')
  @response(200, {
    description: 'MaintainanceEntries PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MaintainanceEntries, {partial: true}),
        },
      },
    })
    maintainanceEntries: MaintainanceEntries,
    @param.where(MaintainanceEntries) where?: Where<MaintainanceEntries>,
  ): Promise<Count> {
    return this.maintainanceEntriesRepository.updateAll(maintainanceEntries, where);
  }

  @get('/maintainance-entries/{id}')
  @response(200, {
    description: 'MaintainanceEntries model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(MaintainanceEntries, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(MaintainanceEntries, {exclude: 'where'}) filter?: FilterExcludingWhere<MaintainanceEntries>
  ): Promise<MaintainanceEntries> {
    return this.maintainanceEntriesRepository.findById(id, filter);
  }

  @patch('/maintainance-entries/{id}')
  @response(204, {
    description: 'MaintainanceEntries PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MaintainanceEntries, {partial: true}),
        },
      },
    })
    maintainanceEntries: MaintainanceEntries,
  ): Promise<void> {
    await this.maintainanceEntriesRepository.updateById(id, maintainanceEntries);
  }

  @put('/maintainance-entries/{id}')
  @response(204, {
    description: 'MaintainanceEntries PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() maintainanceEntries: MaintainanceEntries,
  ): Promise<void> {
    await this.maintainanceEntriesRepository.replaceById(id, maintainanceEntries);
  }

  @del('/maintainance-entries/{id}')
  @response(204, {
    description: 'MaintainanceEntries DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.maintainanceEntriesRepository.deleteById(id);
  }
}
