import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';
import {Tools} from './tools.model';
import {ApprovalUsers} from './approval-users.model';

@model()
export class InternalValidationForm extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => Tools)
  toolsId: number;

  @belongsTo(() => User)
  initiatorId: number;

  @belongsTo(() => ApprovalUsers)
  userId: number;

  @property({
    type: 'array',
    itemType: 'number',
  })
  validatorsIds: number[];

  @property({
    type: 'array',
    itemType: 'number',
  })
  productionHeadIds: number[];

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
    type: 'boolean',
    required: true
  })
  isDimensionsSectionDone: boolean;

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
    moNumber: string;
    moPartNumber: string;
    testingQuantity: number;
    totalQuantity: number;
    date: Date;
  };

  @property({
    type: 'boolean',
    required: true
  })
  isFunctionalTestingSectionDone: boolean;

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
    moNumber: string;
    moPartNumber: string;
    testingQuantity: number;
    totalQuantity: number;
    date: Date;
  };

  @property({
    type: 'boolean'
  })
  isUsersApprovalDone: boolean;

  @property({
    type: 'boolean',
  })
  isAllValidatorsApprovalDone: boolean;

  @property({
    type: 'boolean',
  })
  isAllProductionHeadsApprovalDone: boolean;

  @property({
    type: 'boolean',
  })
  isEditable: boolean;

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

  constructor(data?: Partial<InternalValidationForm>) {
    super(data);
  }
}

export interface InternalValidationFormRelations {
  // describe navigational properties here
}

export type InternalValidationFormWithRelations = InternalValidationForm & InternalValidationFormRelations;
