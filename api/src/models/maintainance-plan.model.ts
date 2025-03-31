import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Tools} from './tools.model';
import {User} from './user.model';

@model()
export class MaintainancePlan extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => Tools)
  toolsId: number;

  @property({
    type : 'string',
    required : true
  })
  level: string;

  @property({
    type : 'string',
    required : true
  })
  description: string;

  @property({
    type : 'number',
    required : true
  })
  periodicity: number;

  @belongsTo(() => User)
  responsibleUserId: number;

  @belongsTo(() => User)
  preparedByUserId: number;

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

  constructor(data?: Partial<MaintainancePlan>) {
    super(data);
  }
}

export interface MaintainancePlanRelations {
  // describe navigational properties here
}

export type MaintainancePlanWithRelations = MaintainancePlan & MaintainancePlanRelations;
