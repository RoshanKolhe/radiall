import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Tools} from './tools.model';
import {User} from './user.model';

@model()
export class InventoryOutEntries extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  serialNumber: number;

  @property({
    type: 'number',
    required: true,
  })
  moNumber: number;

  @property({
    type: 'number',
    required: true,
  })
  moQuantity: number;

  @property({
    type: 'date',
  })
  issuedDate?: Date;

  @property({
    type: 'number',
    required: true,
  })
  requiredDays: number;

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

  @belongsTo(() => Tools)
  toolsId: number;

  @belongsTo(() => User, {name: 'user'})
  issuedTo: number;

  @belongsTo(() => User, {name: 'issuedByUser'})
  issuedBy: number;

  constructor(data?: Partial<InventoryOutEntries>) {
    super(data);
  }
}

export interface InventoryOutEntriesRelations {
  // describe navigational properties here
}

export type InventoryOutEntriesWithRelations = InventoryOutEntries &
  InventoryOutEntriesRelations;
