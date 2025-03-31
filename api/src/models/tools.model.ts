import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {ToolType} from './tool-type.model';
import {Manufacturer} from './manufacturer.model';
import {Supplier} from './supplier.model';
import {StorageLocation} from './storage-location.model';
import {Spare} from './spare.model';
import {InventoryOutEntries} from './inventory-out-entries.model';
import {ToolsDepartment} from './tools-department.model';
import {Station} from './station.model';

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
    type: 'string',
    required: true
  })
  meanSerialNumber: string;

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
  installationStatus: string;

  @property({
    type: 'date',
  })
  installationDate: Date;

  @property({
    type: 'date',
  })
  lastInternalValidationDate: Date;

  @property({
    type: 'date',
  })
  scrapDate: Date;

  @property({
    type: 'string',
  })
  internalValidationStatus: string;

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

  // newly added....
  @belongsTo(() => ToolsDepartment)
  toolsDepartmentId: number;

  @belongsTo(() => Station)
  stationId: number;

  @property({
    type: 'string',
    required: true
  })
  storageLocation: string;
  // -----------------------------------------------------

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
    required: true
  })
  status: string;

  @property({
    type: 'string',
  })
  remark?: string;

  @hasMany(() => Spare)
  spares: Spare[];

  @hasMany(() => InventoryOutEntries)
  inventoryOutEntries: InventoryOutEntries[];

  constructor(data?: Partial<Tools>) {
    super(data);
  }
}

export interface ToolsRelations {
  // describe navigational properties here
}

export type ToolsWithRelations = Tools & ToolsRelations;
