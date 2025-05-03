import {Entity, model, property} from '@loopback/repository';

@model()
export class MaintainanceChecklist extends Entity {
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
  checklistPoint: string;

  @property({
    type: 'string',
    required: true
  })
  description: string;

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
  })
  isActive?: boolean; 

  @property({
    type: 'string',
  })
  remark?: string;
  constructor(data?: Partial<MaintainanceChecklist>) {
    super(data);
  }
}

export interface MaintainanceChecklistRelations {
  // describe navigational properties here
}

export type MaintainanceChecklistWithRelations = MaintainanceChecklist & MaintainanceChecklistRelations;
