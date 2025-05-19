import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {MaintainancePlan, MaintainancePlanRelations, Tools, User} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {ToolsRepository} from './tools.repository';
import {UserRepository} from './user.repository';

export class MaintainancePlanRepository extends TimeStampRepositoryMixin<
  MaintainancePlan,
  typeof MaintainancePlan.prototype.id,
  Constructor<
    DefaultCrudRepository<
      MaintainancePlan,
      typeof MaintainancePlan.prototype.id,
      MaintainancePlanRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly tools: BelongsToAccessor<Tools, typeof MaintainancePlan.prototype.id>;

  public readonly preparedByUser: BelongsToAccessor<User, typeof MaintainancePlan.prototype.id>;

  public readonly responsibleUser: BelongsToAccessor<User, typeof MaintainancePlan.prototype.id>;

  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource, @repository.getter('ToolsRepository') protected toolsRepositoryGetter: Getter<ToolsRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,) {
    super(MaintainancePlan, dataSource);
    this.responsibleUser = this.createBelongsToAccessorFor('responsibleUser', userRepositoryGetter,);
    this.registerInclusionResolver('responsibleUser', this.responsibleUser.inclusionResolver);
    this.preparedByUser = this.createBelongsToAccessorFor('preparedByUser', userRepositoryGetter,);
    this.registerInclusionResolver('preparedByUser', this.preparedByUser.inclusionResolver);
    this.tools = this.createBelongsToAccessorFor('tools', toolsRepositoryGetter,);
    this.registerInclusionResolver('tools', this.tools.inclusionResolver);
  }
}