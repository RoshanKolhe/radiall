import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';
import {Tools} from './tools.model';
import {ApprovalUsers} from './approval-users.model';

@model()
export class InstallationForm extends Entity {
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
    type: 'array',
    itemType: 'object'
  })
  familyClassificationQuestionery: Array<{
    question: string;
    type: string;
    options: string[];
    isFieldChanging: boolean;
    fieldName: string;
    answer: string;
  }>;

  @property({
    type: 'boolean',
  })
  isFamilyClassificationSectionDone: boolean;

  @property({
    type: 'array',
    itemType: 'object'
  })
  criticityQuestionery: Array<{
    question: string;
    type: string;
    options: string[];
    isFieldChanging: boolean;
    fieldName: string;
    answer: string;
  }>;

  @property({
    type: 'boolean',
  })
  isCriticitySectionDone: boolean;

  @property({
    type: 'array',
    itemType: 'object'
  })
  requirementChecklist: Array<{
    requirement: string;
    isNeedUpload: boolean;
    critical: string;
    nonCritical: string;
    toDo: boolean;
    actionOwner: {
      id: number;
      firstName: string;
      lastName: string;
      role: string;
      email: string;
      department: object;
    };
    done: boolean;
    comment: string;
    upload: string;
    routes: object;
  }>;

  @property({
    type: 'boolean',
  })
  isRequirementChecklistSectionDone: boolean;

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

  constructor(data?: Partial<InstallationForm>) {
    super(data);
  }
}

export interface InstallationFormRelations {
  // describe navigational properties here
}

export type InstallationFormWithRelations = InstallationForm & InstallationFormRelations;
