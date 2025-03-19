import {Entity, model, property, belongsTo} from '@loopback/repository';
import {ToolType} from './tool-type.model';
import {Manufacturer} from './manufacturer.model';
import {Supplier} from './supplier.model';
import {StorageLocation} from './storage-location.model';

@model()
export class Tools extends Entity {
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
  modelNumber: string;

  @property({
    type: 'number',
    required: true
  })
  meanSerialNumber: number;

  @property({
    type: 'string',
  })
  assetNumber: string;

  @property({
    type: 'number',
    required: true
  })
  quantity: number;

  @property({
    type: 'number',
  })
  balanceQuantity: number;

  @property({
    type: 'string',
  })
  criticalLevel: string;

  @property({
    type: 'string',
  })
  toolFamily: string;

  @property({
    type: 'string',
  })
  description: string;

  @property({
    type: 'string',
  })
  designation: string;

  @property({
    type: 'string',
  })
  calibration: string;

  @property({
    type: 'string',
  })
  spareList: string;

  @property({
    type: 'string',
  })
  productionMeans: string;

  @property({
    type: 'string',
  })
  technicalDrawing: string;

  @property({
    type: 'date',
    required: true
  })
  manufacturingDate: Date;

  @property({
    type: 'boolean',
  })
  isMaintaincePlanNeeded: boolean;

  @property({
    type: 'boolean',
  })
  installationChecklist: boolean;

  @property({
    type: 'string',
  })
  installationStatus: boolean;

  @property({
    type: 'string',
  })
  internalValidationStatus: boolean;

  @property({
    type: 'boolean',
  })
  individualManagement: boolean;

  @belongsTo(() => ToolType)
  toolTypeId: number;

  @belongsTo(() => Manufacturer)
  manufacturerId: number;

  @belongsTo(() => Supplier)
  supplierId: number;

  @belongsTo(() => StorageLocation)
  storageLocationId: number;

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

  constructor(data?: Partial<Tools>) {
    super(data);
  }
}

export interface ToolsRelations {
  // describe navigational properties here
}

export type ToolsWithRelations = Tools & ToolsRelations;
