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
import {Checklist} from '../models';
import {ChecklistRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { PermissionKeys } from '../authorization/permission-keys';

export class CheklistController {
  constructor(
    @repository(ChecklistRepository)
    public checklistRepository : ChecklistRepository,
  ) {}

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.PRODUCTION_HEAD],
    },
  })
  @post('/checklists')
  @response(200, {
    description: 'Checklist model instance',
    content: {'application/json': {schema: getModelSchemaRef(Checklist)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Checklist, {
            title: 'NewChecklist',
            exclude: ['id'],
          }),
        },
      },
    })
    checklist: Omit<Checklist, 'id'>,
  ): Promise<Checklist> {
    return this.checklistRepository.create(checklist);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.PRODUCTION_HEAD],
    },
  })
  @get('/checklists/count')
  @response(200, {
    description: 'Checklist model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Checklist) where?: Where<Checklist>,
  ): Promise<Count> {
    return this.checklistRepository.count(where);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.PRODUCTION_HEAD],
    },
  })
  @get('/checklists')
  @response(200, {
    description: 'Array of Checklist model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Checklist, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Checklist) filter?: Filter<Checklist>,
  ): Promise<Checklist[]> {
    return this.checklistRepository.find(filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.PRODUCTION_HEAD],
    },
  })
  @patch('/checklists')
  @response(200, {
    description: 'Checklist PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Checklist, {partial: true}),
        },
      },
    })
    checklist: Checklist,
    @param.where(Checklist) where?: Where<Checklist>,
  ): Promise<Count> {
    return this.checklistRepository.updateAll(checklist, where);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.PRODUCTION_HEAD],
    },
  })
  @get('/checklists/{id}')
  @response(200, {
    description: 'Checklist model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Checklist, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Checklist, {exclude: 'where'}) filter?: FilterExcludingWhere<Checklist>
  ): Promise<Checklist> {
    return this.checklistRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.PRODUCTION_HEAD],
    },
  })
  @patch('/checklists/{id}')
  @response(204, {
    description: 'Checklist PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Checklist, {partial: true}),
        },
      },
    })
    checklist: Checklist,
  ): Promise<void> {
    await this.checklistRepository.updateById(id, checklist);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.PRODUCTION_HEAD],
    },
  })
  @put('/checklists/{id}')
  @response(204, {
    description: 'Checklist PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() checklist: Checklist,
  ): Promise<void> {
    await this.checklistRepository.replaceById(id, checklist);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.PRODUCTION_HEAD],
    },
  })
  @del('/checklists/{id}')
  @response(204, {
    description: 'Checklist DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.checklistRepository.deleteById(id);
  }
}
