import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model()
export class InventoryInEntries extends Entity {
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
  quantity: number;

  @property({
    type: 'date',
  })
  returnDate?: Date;

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
    type: 'number',
    default: 0,
  })
  status?: number; // 0: Out , 1: returned , 2: partially returned

  @property({
    type: 'string',
  })
  remark?: string;

  @property({
    type: 'number',
  })
  inventoryOutEntriesId?: number;

  @belongsTo(() => User, {name: 'receivedFromUser'})
  receivedFrom: number;

  @belongsTo(() => User, {name: 'returnByUser'})
  returnBy: number;

  constructor(data?: Partial<InventoryInEntries>) {
    super(data);
  }
}

export interface InventoryInEntriesRelations {
  // describe navigational properties here
}

export type InventoryInEntriesWithRelations = InventoryInEntries &
  InventoryInEntriesRelations;
