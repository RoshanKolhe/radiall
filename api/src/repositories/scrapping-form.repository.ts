import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {ScrappingForm, ScrappingFormRelations, Tools, User, ApprovalUsers} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {ToolsRepository} from './tools.repository';
import {UserRepository} from './user.repository';
import {ApprovalUsersRepository} from './approval-users.repository';

export class ScrappingFormRepository extends TimeStampRepositoryMixin<
  ScrappingForm,
  typeof ScrappingForm.prototype.id,
  Constructor<
    DefaultCrudRepository<
      ScrappingForm,
      typeof ScrappingForm.prototype.id,
      ScrappingFormRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly tools: BelongsToAccessor<Tools, typeof ScrappingForm.prototype.id>;

  public readonly initiator: BelongsToAccessor<User, typeof ScrappingForm.prototype.id>;

  public readonly user: BelongsToAccessor<ApprovalUsers, typeof ScrappingForm.prototype.id>;

  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource, @repository.getter('ToolsRepository') protected toolsRepositoryGetter: Getter<ToolsRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ApprovalUsersRepository') protected approvalUsersRepositoryGetter: Getter<ApprovalUsersRepository>,) {
    super(ScrappingForm, dataSource);
    this.user = this.createBelongsToAccessorFor('user', approvalUsersRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.initiator = this.createBelongsToAccessorFor('initiator', userRepositoryGetter,);
    this.registerInclusionResolver('initiator', this.initiator.inclusionResolver);
    this.tools = this.createBelongsToAccessorFor('tools', toolsRepositoryGetter,);
    this.registerInclusionResolver('tools', this.tools.inclusionResolver);
  }
}