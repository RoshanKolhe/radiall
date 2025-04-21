import {Entity, model, property, belongsTo} from '@loopback/repository';
import {ToolType} from './tool-type.model';
import {User} from './user.model';

@model()
export class ToolTypeMaintainance extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => ToolType)
  toolTypeId: number;

  @belongsTo(() => User)
  preparedByUserId: number;

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

  constructor(data?: Partial<ToolTypeMaintainance>) {
    super(data);
  }
}

export interface ToolTypeMaintainanceRelations {
  // describe navigational properties here
}

export type ToolTypeMaintainanceWithRelations = ToolTypeMaintainance & ToolTypeMaintainanceRelations;
