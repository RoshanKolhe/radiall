import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Tools} from './tools.model';

@model()
export class HistoryCard extends Entity {
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
  date: string;

  @property({
    type: 'string',
    required: true,
  })
  nature: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string',
    required: true,
  })
  attendedBy: string;

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

  @belongsTo(() => Tools)
  toolsId: number;

  constructor(data?: Partial<HistoryCard>) {
    super(data);
  }
}

export interface HistoryCardRelations {
  // describe navigational properties here
}

export type HistoryCardWithRelations = HistoryCard & HistoryCardRelations;
