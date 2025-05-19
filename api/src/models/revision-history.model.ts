import {Entity, model, property} from '@loopback/repository';

@model()
export class RevisionHistory extends Entity {
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
  revision: number;

  @property({
    type: 'string',
    required: true,
  })
  date: string;

  @property({
    type: 'string',
    required: true,
  })
  author: string;

  @property({
    type: 'string',
    required: true,
  })
  reason: string;

  @property({
    type: 'string',
    required: true,
  })
  formName: string;

  @property({
    type: 'string',
    required: true,
  })
  change: string;

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

  constructor(data?: Partial<RevisionHistory>) {
    super(data);
  }
}

export interface RevisionHistoryRelations {
  // describe navigational properties here
}

export type RevisionHistoryWithRelations = RevisionHistory &
  RevisionHistoryRelations;
