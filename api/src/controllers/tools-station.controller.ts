import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Tools,
  Station,
} from '../models';
import {ToolsRepository} from '../repositories';

export class ToolsStationController {
  constructor(
    @repository(ToolsRepository)
    public toolsRepository: ToolsRepository,
  ) { }

  @get('/tools/{id}/station', {
    responses: {
      '200': {
        description: 'Station belonging to Tools',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Station),
          },
        },
      },
    },
  })
  async getStation(
    @param.path.number('id') id: typeof Tools.prototype.id,
  ): Promise<Station> {
    return this.toolsRepository.station(id);
  }
}
