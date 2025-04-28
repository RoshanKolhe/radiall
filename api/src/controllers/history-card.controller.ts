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
import {HistoryCard} from '../models';
import {HistoryCardRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {PermissionKeys} from '../authorization/permission-keys';

export class HistoryCardController {
  constructor(
    @repository(HistoryCardRepository)
    public historyCardRepository: HistoryCardRepository,
  ) {}

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @post('/history-cards')
  @response(200, {
    description: 'HistoryCard model instance',
    content: {'application/json': {schema: getModelSchemaRef(HistoryCard)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HistoryCard, {
            title: 'NewHistoryCard',
            exclude: ['id'],
          }),
        },
      },
    })
    historyCard: Omit<HistoryCard, 'id'>,
  ): Promise<HistoryCard> {
    return this.historyCardRepository.create(historyCard);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @get('/history-cards')
  @response(200, {
    description: 'Array of HistoryCard model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(HistoryCard, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(HistoryCard) filter?: Filter<HistoryCard>,
  ): Promise<HistoryCard[]> {
    return this.historyCardRepository.find(filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @get('/history-cards/{id}')
  @response(200, {
    description: 'HistoryCard model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(HistoryCard, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(HistoryCard, {exclude: 'where'})
    filter?: FilterExcludingWhere<HistoryCard>,
  ): Promise<HistoryCard> {
    return this.historyCardRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @patch('/history-cards/{id}')
  @response(204, {
    description: 'HistoryCard PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HistoryCard, {partial: true}),
        },
      },
    })
    historyCard: HistoryCard,
  ): Promise<void> {
    await this.historyCardRepository.updateById(id, historyCard);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @del('/history-cards/{id}')
  @response(204, {
    description: 'HistoryCard DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.historyCardRepository.deleteById(id);
  }
}
