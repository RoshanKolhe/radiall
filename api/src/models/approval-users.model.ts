import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';
import {InstallationForm} from './installation-form.model';

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

  constructor(data?: Partial<ApprovalUsers>) {
    super(data);
  }
}

export interface ApprovalUsersRelations {
  // describe navigational properties here
}

export type ApprovalUsersWithRelations = ApprovalUsers & ApprovalUsersRelations;
