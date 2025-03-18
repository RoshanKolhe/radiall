import {Entity, model, property} from '@loopback/repository';

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
    reuired: true
  })
  formName: string;     // for now it can be installation_form, scrapping_form

  @property({
    type: 'boolean',
    required: true
  })
  isNeedUpload: boolean;

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
