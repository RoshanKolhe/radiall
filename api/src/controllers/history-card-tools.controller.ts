import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  HistoryCard,
  Tools,
} from '../models';
import {HistoryCardRepository} from '../repositories';

export class HistoryCardToolsController {
  constructor(
    @repository(HistoryCardRepository)
    public historyCardRepository: HistoryCardRepository,
  ) { }

  @get('/history-cards/{id}/tools', {
    responses: {
      '200': {
        description: 'Tools belonging to HistoryCard',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Tools),
          },
        },
      },
    },
  })
  async getTools(
    @param.path.number('id') id: typeof HistoryCard.prototype.id,
  ): Promise<Tools> {
    return this.historyCardRepository.tools(id);
  }
}
