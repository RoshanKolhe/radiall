import {Entity, model, property, belongsTo} from '@loopback/repository';
import {InventoryInEntries} from './inventory-in-entries.model';

@model()
export class InventoryOutEntryTools extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  inventoryOutEntriesId?: number;

  @property({
    type: 'number',
  })
  toolsId?: number;

  @property({
    type: 'number',
    default: 0,
  })
  status?: number; // 0: Not Returned , 1: returned

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
    type: 'string',
  })
  remark?: string;

  @belongsTo(() => InventoryInEntries)
  inventoryInEntriesId: number;

  constructor(data?: Partial<InventoryOutEntryTools>) {
    super(data);
  }
}

export interface InventoryOutEntryToolsRelations {
  // describe navigational properties here
}

export type InventoryOutEntryToolsWithRelations = InventoryOutEntryTools &
  InventoryOutEntryToolsRelations;
