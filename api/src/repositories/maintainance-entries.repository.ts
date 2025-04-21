import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {MaintainanceEntries, MaintainanceEntriesRelations, Tools, MaintainancePlan, User} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {ToolsRepository} from './tools.repository';
import {MaintainancePlanRepository} from './maintainance-plan.repository';
import {UserRepository} from './user.repository';

export class MaintainanceEntriesRepository extends TimeStampRepositoryMixin<
  MaintainanceEntries,
  typeof MaintainanceEntries.prototype.id,
  Constructor<
    DefaultCrudRepository<
      MaintainanceEntries,
      typeof MaintainanceEntries.prototype.id,
      MaintainanceEntriesRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly tools: BelongsToAccessor<Tools, typeof MaintainanceEntries.prototype.id>;

  public readonly preparedByUser: BelongsToAccessor<User, typeof MaintainanceEntries.prototype.id>;

  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource, @repository.getter('ToolsRepository') protected toolsRepositoryGetter: Getter<ToolsRepository>, @repository.getter('MaintainancePlanRepository') protected maintainancePlanRepositoryGetter: Getter<MaintainancePlanRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,) {
    super(MaintainanceEntries, dataSource);
    this.preparedByUser = this.createBelongsToAccessorFor('preparedByUser', userRepositoryGetter,);
    this.registerInclusionResolver('preparedByUser', this.preparedByUser.inclusionResolver);
    this.tools = this.createBelongsToAccessorFor('tools', toolsRepositoryGetter,);
    this.registerInclusionResolver('tools', this.tools.inclusionResolver);
  }
}
