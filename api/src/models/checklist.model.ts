import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Routes} from './routes.model';

@model()
export class Checklist extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true
  })
  requirement: string;

  @property({
    type: 'string',
  })
  critical: 'string'; // passed "md" or "apr"

  @property({
    type: 'string',
  })
  nonCritical: 'string';  // passed "md" or "apr"

  @belongsTo(() => Routes)
  routesId: number;

  @property({
    type: 'string',
    reuired: true
  })
  formName: string;     // for now it can be installation_form, scrapping_form

  @property({
    type: 'boolean',
    required: true
  })
  isNeedUpload: boolean;

  @property({
    type: 'boolean',
    required: true
  })
  isFieldChanging: boolean;

  @property({
    type: 'string',
  })
  fieldName: string;

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

  constructor(data?: Partial<Checklist>) {
    super(data);
  }
}

export interface ChecklistRelations {
  // describe navigational properties here
}

export type ChecklistWithRelations = Checklist & ChecklistRelations;
