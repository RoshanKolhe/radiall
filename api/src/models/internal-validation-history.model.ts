import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Tools} from './tools.model';
import {User} from './user.model';

@model()
export class InternalValidationHistory extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => User)
  initiatorId: number;

  @belongsTo(() => Tools)
  toolsId: number;

  @property({
    type: 'object',
  })
  user: {
    userId: number;
    isApproved: boolean;
    approvalDate: string;
    remark: string;
  }

  @property({
    type: 'array',
    itemType: 'object'
  })
  validators: Array<Record<string, any>>

  @property({
    type: 'array',
    itemType: 'object'
  })
  productionHeads: Array<Record<string, any>>

  @property({
    type: 'object',
  })
  dimensionsQuestionery: {
    finding: string;
    result: boolean;
    evidences: string[];
    controlledBy: {
      id: number,
      firstName: string,
      lastName: string,
      role: string;
      department: string;
      email: string;
    };
    date: Date;
  };

  @property({
    type: 'object',
  })
  functionalTestingQuestionery: {
    finding: string;
    description: string;
    result: boolean;
    evidences: string[];
    controlledBy: {
      id: number,
      firstName: string,
      lastName: string,
      role: string;
      department: string;
      email: string;
    };
    date: Date;
  };

  @property({
    type: 'object',
  })
  otherQuestionery: {
    finding: string;
    description: string;
    result: boolean;
    evidences: string[];
    controlledBy: {
      id: number,
      firstName: string,
      lastName: string,
      role: string;
      department: string;
      email: string;
    };
    date: Date;
  };

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
    type: 'string',
    required: true,
  })
  status: string;

  @property({
    type: 'string',
  })
  remark?: string;

  constructor(data?: Partial<InternalValidationHistory>) {
    super(data);
  }
}

export interface InternalValidationHistoryRelations {
  // describe navigational properties here
}

export type InternalValidationHistoryWithRelations = InternalValidationHistory & InternalValidationHistoryRelations;
