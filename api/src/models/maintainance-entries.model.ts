import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Tools} from './tools.model';
import {MaintainancePlan} from './maintainance-plan.model';

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

  @belongsTo(() => MaintainancePlan)
  maintainancePlanId: number;

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

  constructor(data?: Partial<MaintainanceEntries>) {
    super(data);
  }
}

export interface MaintainanceEntriesRelations {
  // describe navigational properties here
}

export type MaintainanceEntriesWithRelations = MaintainanceEntries & MaintainanceEntriesRelations;
