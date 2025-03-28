import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {InstallationForm, InstallationFormRelations, User, Tools, ApprovalUsers} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {UserRepository} from './user.repository';
import {ToolsRepository} from './tools.repository';
import {ApprovalUsersRepository} from './approval-users.repository';

export class InstallationFormRepository extends TimeStampRepositoryMixin<
  InstallationForm,
  typeof InstallationForm.prototype.id,
  Constructor<
    DefaultCrudRepository<
      InstallationForm,
      typeof InstallationForm.prototype.id,
      InstallationFormRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly initiator: BelongsToAccessor<User, typeof InstallationForm.prototype.id>;

  public readonly tools: BelongsToAccessor<Tools, typeof InstallationForm.prototype.id>;

  public readonly user: BelongsToAccessor<ApprovalUsers, typeof InstallationForm.prototype.id>;

  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ToolsRepository') protected toolsRepositoryGetter: Getter<ToolsRepository>, @repository.getter('ApprovalUsersRepository') protected approvalUsersRepositoryGetter: Getter<ApprovalUsersRepository>,) {
    super(InstallationForm, dataSource);
    this.user = this.createBelongsToAccessorFor('user', approvalUsersRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.tools = this.createBelongsToAccessorFor('tools', toolsRepositoryGetter,);
    this.registerInclusionResolver('tools', this.tools.inclusionResolver);
    this.initiator = this.createBelongsToAccessorFor('initiator', userRepositoryGetter,);
    this.registerInclusionResolver('initiator', this.initiator.inclusionResolver);
  }
}
