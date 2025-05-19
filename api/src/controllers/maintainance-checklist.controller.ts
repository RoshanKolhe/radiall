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
  HttpErrors,
} from '@loopback/rest';
import {MaintainanceChecklist} from '../models';
import {MaintainanceChecklistRepository, ToolTypeRepository} from '../repositories';

export class MaintainanceChecklistController {
  constructor(
    @repository(MaintainanceChecklistRepository)
    public maintainanceChecklistRepository : MaintainanceChecklistRepository,
    @repository(ToolTypeRepository)
    public toolTypeRepository: ToolTypeRepository,
  ) {}

  @post('/maintainance-checklists')
  @response(200, {
    description: 'MaintainanceChecklist model instance',
    content: {'application/json': {schema: getModelSchemaRef(MaintainanceChecklist)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MaintainanceChecklist, {
            title: 'NewMaintainanceChecklist',
            exclude: ['id'],
          }),
        },
      },
    })
    maintainanceChecklist: Omit<MaintainanceChecklist, 'id'>,
  ): Promise<MaintainanceChecklist> {
    return this.maintainanceChecklistRepository.create(maintainanceChecklist);
  }

  @get('/maintainance-checklists/count')
    @response(200, {
      description: 'MaintainanceChecklist model count',
      content: {'application/json': {schema: CountSchema}},
    })
    async count(
      @param.where(MaintainanceChecklist) where?: Where<MaintainanceChecklist>,
    ): Promise<Count> {
      return this.maintainanceChecklistRepository.count(where);
    }

  @get('/maintainance-checklists')
  @response(200, {
    description: 'Array of MaintainanceChecklist model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(MaintainanceChecklist, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(MaintainanceChecklist) filter?: Filter<MaintainanceChecklist>,
  ): Promise<object[]> {
    const checklists = await this.maintainanceChecklistRepository.find(filter);

    const newChecklist = await Promise.all(
      checklists.map(async (item: MaintainanceChecklist) => {
        if(item?.toolTypes && !item?.isLevelTwoCheckpoint){
          const toolTypes = item.toolTypes;
          const toolTypesData = await this.toolTypeRepository.find({
            where: {
              id: {inq: toolTypes},
            },
          });

          return {
            ...item,
            toolTypes: toolTypesData,
          };
        }
        
        return item;
      })
    );

    return newChecklist;
  }

  @patch('/maintainance-checklists')
  @response(200, {
    description: 'MaintainanceChecklist PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MaintainanceChecklist, {partial: true}),
        },
      },
    })
    maintainanceChecklist: MaintainanceChecklist,
    @param.where(MaintainanceChecklist) where?: Where<MaintainanceChecklist>,
  ): Promise<Count> {
    return this.maintainanceChecklistRepository.updateAll(maintainanceChecklist, where);
  }

  @get('/maintainance-checklists/{id}')
  @response(200, {
    description: 'MaintainanceChecklist model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(MaintainanceChecklist, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(MaintainanceChecklist, {exclude: 'where'}) filter?: FilterExcludingWhere<MaintainanceChecklist>
  ): Promise<object | undefined> {
    const checklist = await this.maintainanceChecklistRepository.findById(id, filter);
    if(!checklist){
      throw new HttpErrors.NotFound('No checklist found with given Id.')
    }

    if(!checklist.isLevelTwoCheckpoint && checklist.toolTypes){
      const toolTypes = checklist.toolTypes;
      const toolTypesData = await this.toolTypeRepository.find({
        where: {
          id: {inq: toolTypes},
        },
      });

      const newChecklist = {
        ...checklist,
        toolTypes: toolTypesData
      };

      console.log('newChecklist', newChecklist);

      return newChecklist;
    }

    return checklist;
  }

  @patch('/maintainance-checklists/{id}')
  @response(204, {
    description: 'MaintainanceChecklist PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MaintainanceChecklist, {partial: true}),
        },
      },
    })
    maintainanceChecklist: MaintainanceChecklist,
  ): Promise<void> {
    await this.maintainanceChecklistRepository.updateById(id, maintainanceChecklist);
  }

  @put('/maintainance-checklists/{id}')
  @response(204, {
    description: 'MaintainanceChecklist PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() maintainanceChecklist: MaintainanceChecklist,
  ): Promise<void> {
    await this.maintainanceChecklistRepository.replaceById(id, maintainanceChecklist);
  }

  @del('/maintainance-checklists/{id}')
  @response(204, {
    description: 'MaintainanceChecklist DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.maintainanceChecklistRepository.deleteById(id);
  }
}
