import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Tools} from './tools.model';
import {MaintainancePlan} from './maintainance-plan.model';
import {User} from './user.model';

@model()
export class MaintainanceEntries extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => Tools)
  toolsId: number;

  @property({
    type: 'number',
    required: true
  })
  level: number;

  @property({
    type: 'string',
    required: true
  })
  description: string;

  @property({
    type: 'number',
    required: true
  })
  periodicity: number;

  @property({
    type: 'string',
    required: true
  })
  responsibleUser: string;

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

  @belongsTo(() => User)
  preparedByUserId: number;

  constructor(data?: Partial<MaintainanceEntries>) {
    super(data);
  }
}

export interface MaintainanceEntriesRelations {
  // describe navigational properties here
}

export type MaintainanceEntriesWithRelations = MaintainanceEntries & MaintainanceEntriesRelations;
