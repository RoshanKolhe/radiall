import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';
import {InstallationForm} from './installation-form.model';
import {InternalValidationForm} from './internal-validation-form.model';
import {ScrappingForm} from './scrapping-form.model';

@model()
export class ApprovalUsers extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => User)
  userId: number;

  @belongsTo(() => InstallationForm)
  installationFormId: number;

  @property({
    type: 'boolean'
  })
  isApproved: boolean;

  @property({
    type: 'date'
  })
  approvalDate: Date;

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
  })
  remark?: string;

  @belongsTo(() => InternalValidationForm)
  internalValidationFormId: number;

  @belongsTo(() => ScrappingForm)
  scrappingFormId: number;

  constructor(data?: Partial<ApprovalUsers>) {
    super(data);
  }
}

export interface ApprovalUsersRelations {
  // describe navigational properties here
}

export type ApprovalUsersWithRelations = ApprovalUsers & ApprovalUsersRelations;
