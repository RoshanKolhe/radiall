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
import {Station} from '../models';
import {StationRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {PermissionKeys} from '../authorization/permission-keys';

export class StationController {
  constructor(
    @repository(StationRepository)
    public stationRepository: StationRepository,
  ) {}

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN]},
  })
  @post('/stations')
  @response(200, {
    description: 'Station model instance',
    content: {'application/json': {schema: getModelSchemaRef(Station)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Station, {
            title: 'NewStation',
            exclude: ['id'],
          }),
        },
      },
    })
    station: Omit<Station, 'id'>,
  ): Promise<Station> {
    return this.stationRepository.create(station);
  }

  @authenticate({
    strategy: 'jwt',
  })
  @get('/stations')
  @response(200, {
    description: 'Array of Station model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Station, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Station) filter?: Filter<Station>,
  ): Promise<Station[]> {
    return this.stationRepository.find(filter);
  }

  @authenticate({
    strategy: 'jwt',
  })
  @get('/stations/{id}')
  @response(200, {
    description: 'Station model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Station, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Station, {exclude: 'where'})
    filter?: FilterExcludingWhere<Station>,
  ): Promise<Station> {
    return this.stationRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN]},
  })
  @patch('/stations/{id}')
  @response(204, {
    description: 'Station PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Station, {partial: true}),
        },
      },
    })
    station: Station,
  ): Promise<void> {
    await this.stationRepository.updateById(id, station);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN]},
  })
  @del('/stations/{id}')
  @response(204, {
    description: 'Station DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.stationRepository.deleteById(id);
  }
}
