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
import {Spare} from '../models';
import {SpareRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {PermissionKeys} from '../authorization/permission-keys';

export class SpareController {
  constructor(
    @repository(SpareRepository)
    public spareRepository: SpareRepository,
  ) {}

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.PRODUCTION_HEAD],
    },
  })
  @post('/spares')
  @response(200, {
    description: 'Spare model instance',
    content: {'application/json': {schema: getModelSchemaRef(Spare)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Spare, {
            title: 'NewSpare',
            exclude: ['id'],
          }),
        },
      },
    })
    spare: Omit<Spare, 'id'>,
  ): Promise<Spare> {
    return this.spareRepository.create(spare);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.PRODUCTION_HEAD],
    },
  })
  @get('/spares')
  @response(200, {
    description: 'Array of Spare model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Spare, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Spare) filter?: Filter<Spare>): Promise<Spare[]> {
    return this.spareRepository.find({
      ...filter,
      include: ['supplier', 'manufacturer'],
    });
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.PRODUCTION_HEAD],
    },
  })
  @get('/spares/{id}')
  @response(200, {
    description: 'Spare model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Spare, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Spare, {exclude: 'where'})
    filter?: FilterExcludingWhere<Spare>,
  ): Promise<Spare> {
    return this.spareRepository.findById(id, {
      ...filter,
      include: ['supplier', 'manufacturer'],
    });
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.PRODUCTION_HEAD],
    },
  })
  @patch('/spares/{id}')
  @response(204, {
    description: 'Spare PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Spare, {partial: true}),
        },
      },
    })
    spare: Spare,
  ): Promise<void> {
    await this.spareRepository.updateById(id, spare);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.PRODUCTION_HEAD],
    },
  })
  @del('/spares/{id}')
  @response(204, {
    description: 'Spare DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.spareRepository.deleteById(id);
  }
}
