import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {InternalValidationForm, InternalValidationFormRelations, User, Tools, ApprovalUsers} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {UserRepository} from './user.repository';
import {ToolsRepository} from './tools.repository';
import {ApprovalUsersRepository} from './approval-users.repository';

export class InternalValidationFormRepository extends TimeStampRepositoryMixin<
  InternalValidationForm,
  typeof InternalValidationForm.prototype.id,
  Constructor<
    DefaultCrudRepository<
      InternalValidationForm,
      typeof InternalValidationForm.prototype.id,
      InternalValidationFormRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly initiator: BelongsToAccessor<User, typeof InternalValidationForm.prototype.id>;

  public readonly tools: BelongsToAccessor<Tools, typeof InternalValidationForm.prototype.id>;

  public readonly user: BelongsToAccessor<ApprovalUsers, typeof InternalValidationForm.prototype.id>;

  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ToolsRepository') protected toolsRepositoryGetter: Getter<ToolsRepository>, @repository.getter('ApprovalUsersRepository') protected approvalUsersRepositoryGetter: Getter<ApprovalUsersRepository>,) {
    super(InternalValidationForm, dataSource);
    this.user = this.createBelongsToAccessorFor('user', approvalUsersRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.tools = this.createBelongsToAccessorFor('tools', toolsRepositoryGetter,);
    this.registerInclusionResolver('tools', this.tools.inclusionResolver);
    this.initiator = this.createBelongsToAccessorFor('initiator', userRepositoryGetter,);
    this.registerInclusionResolver('initiator', this.initiator.inclusionResolver);
  }
}
