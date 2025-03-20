import {Entity, model, property} from '@loopback/repository';

@model()
export class Questionery extends Entity {
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
  question: string;

  @property({
    type: 'string',
    required: true
  })
  sectionName: string;    // for now family_classification, criticity

  @property({
    type: 'string',
    required: true
  })
  type: string;       // type can be text, boolean, select

  @property({
    type: 'array',
    itemType: 'string'
  })
  options: string[];

  @property({
    type: 'boolean',
    required: true,
  })
  isFieldChanging: boolean;

  @property({
    type: 'string',
  })
  fieldName: string;      // here we can give fields on which we can have control to change them at form filling.

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

  constructor(data?: Partial<Questionery>) {
    super(data);
  }
}

export interface QuestioneryRelations {
  // describe navigational properties here
}

export type QuestioneryWithRelations = Questionery & QuestioneryRelations;
