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
      required: [PermissionKeys.ADMIN],
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
    const existingSpare = await this.spareRepository.findOne({
      where: {partNumber: spare.partNumber},
    });

    if (existingSpare) {
      throw new HttpErrors.BadRequest(
        'A spare with this part number already exists.',
      );
    }

    // If not found, create a new spare
    return this.spareRepository.create(spare);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
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
      required: [PermissionKeys.ADMIN],
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
      required: [PermissionKeys.ADMIN],
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
    // Check if partNumber is being updated
    if (spare.partNumber) {
      // Look for an existing spare with the same partNumber but a different ID
      const existingSpare = await this.spareRepository.findOne({
        where: {partNumber: spare.partNumber, id: {neq: id}},
      });

      if (existingSpare) {
        throw new HttpErrors.BadRequest(
          'A spare with this part number already exists.',
        );
      }
    }

    // Proceed with update if no duplicate found
    await this.spareRepository.updateById(id, spare);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
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
