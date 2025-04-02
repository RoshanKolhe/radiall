import {
  Entity,
  model,
  property,
  belongsTo,
  hasMany,
} from '@loopback/repository';
import {Tools} from './tools.model';
import {User} from './user.model';
import {InventoryOutEntryTools} from './inventory-out-entry-tools.model';
import {InventoryInEntries} from './inventory-in-entries.model';

@model()
export class InventoryOutEntries extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  moPartNumber: string;

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
    type: 'string',
    required: true,
  })
  department: string;

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

  @belongsTo(() => User, {name: 'user'})
  issuedTo: number;

  @belongsTo(() => User, {name: 'issuedByUser'})
  issuedBy: number;

  @hasMany(() => Tools, {through: {model: () => InventoryOutEntryTools}})
  tools: Tools[];

  @hasMany(() => InventoryInEntries)
  inventoryInEntries: InventoryInEntries[];

  constructor(data?: Partial<InventoryOutEntries>) {
    super(data);
  }
}

export interface InventoryOutEntriesRelations {
  // describe navigational properties here
}

export type InventoryOutEntriesWithRelations = InventoryOutEntries &
  InventoryOutEntriesRelations;
