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
import {Questionery} from '../models';
import {QuestioneryRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { PermissionKeys } from '../authorization/permission-keys';

export class QuestioneryController {
  constructor(
    @repository(QuestioneryRepository)
    public questioneryRepository : QuestioneryRepository,
  ) {}

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @post('/questioneries')
  @response(200, {
    description: 'Questionery model instance',
    content: {'application/json': {schema: getModelSchemaRef(Questionery)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Questionery, {
            title: 'NewQuestionery',
            exclude: ['id'],
          }),
        },
      },
    })
    questionery: Omit<Questionery, 'id'>,
  ): Promise<Questionery> {
    return this.questioneryRepository.create(questionery);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @get('/questioneries/count')
  @response(200, {
    description: 'Questionery model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Questionery) where?: Where<Questionery>,
  ): Promise<Count> {
    return this.questioneryRepository.count(where);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @get('/questioneries')
  @response(200, {
    description: 'Array of Questionery model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Questionery, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Questionery) filter?: Filter<Questionery>,
  ): Promise<Questionery[]> {
    return this.questioneryRepository.find(filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @patch('/questioneries')
  @response(200, {
    description: 'Questionery PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Questionery, {partial: true}),
        },
      },
    })
    questionery: Questionery,
    @param.where(Questionery) where?: Where<Questionery>,
  ): Promise<Count> {
    return this.questioneryRepository.updateAll(questionery, where);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @get('/questioneries/{id}')
  @response(200, {
    description: 'Questionery model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Questionery, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Questionery, {exclude: 'where'}) filter?: FilterExcludingWhere<Questionery>
  ): Promise<Questionery> {
    return this.questioneryRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @patch('/questioneries/{id}')
  @response(204, {
    description: 'Questionery PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Questionery, {partial: true}),
        },
      },
    })
    questionery: Questionery,
  ): Promise<void> {
    await this.questioneryRepository.updateById(id, questionery);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @put('/questioneries/{id}')
  @response(204, {
    description: 'Questionery PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() questionery: Questionery,
  ): Promise<void> {
    await this.questioneryRepository.replaceById(id, questionery);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @del('/questioneries/{id}')
  @response(204, {
    description: 'Questionery DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.questioneryRepository.deleteById(id);
  }
}
