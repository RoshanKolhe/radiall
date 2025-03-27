import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Tools} from './tools.model';
import {Manufacturer} from './manufacturer.model';
import {Supplier} from './supplier.model';

@model()
export class Spare extends Entity {
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
  partNumber: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'number',
    default: 0,
  })
  stock?: number;

  @property({
    type: 'number',
    default: 0,
  })
  stockInHand?: number;

  @property({
    type: 'string',
  })
  unit?: string;

  @property({
    type: 'string',
  })
  comment?: string;

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

  @belongsTo(() => Manufacturer)
  manufacturerId: number;

  @belongsTo(() => Supplier)
  supplierId: number;

  constructor(data?: Partial<Spare>) {
    super(data);
  }
}

export interface SpareRelations {
  // describe navigational properties here
}

export type SpareWithRelations = Spare & SpareRelations;
