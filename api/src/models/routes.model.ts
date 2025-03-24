import {Entity, model, property} from '@loopback/repository';

@model()
export class Routes extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true
  })
  routeName: string;

  @property({
    type: 'string',
    required: true
  })
  route: string;    // add route in this way /tools/:id/edit <=== like this (keep note in env don't add "/" at the end of base url)

  @property({
    type: 'object',
    required: true
  })
  params: object;   // send in this format {"id" : "toolsId"} basically id is url param name and toolsId is actual model field name which is available in installation form.

  @property({
    type: 'date',
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  @property({
    type: 'date',
  })
  deletedAt?: Date;

  @property({
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  isActive: boolean;

  @property({
    type: 'string',
  })
  remark?: string;

  constructor(data?: Partial<Routes>) {
    super(data);
  }
}

export interface RoutesRelations {
  // describe navigational properties here
}

export type RoutesWithRelations = Routes & RoutesRelations;
