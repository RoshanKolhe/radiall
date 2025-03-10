import {Entity, model, property} from '@loopback/repository';

@model()
export class Supplier extends Entity {
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
  supplier: string;

  @property({
    type: 'string',
  })
  description?: string;

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

  constructor(data?: Partial<Supplier>) {
    super(data);
  }
}

export interface SupplierRelations {
  // describe navigational properties here
}

export type SupplierWithRelations = Supplier & SupplierRelations;
