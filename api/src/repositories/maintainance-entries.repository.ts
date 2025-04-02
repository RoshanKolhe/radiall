import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {MaintainanceEntries, MaintainanceEntriesRelations, Tools, MaintainancePlan} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {ToolsRepository} from './tools.repository';
import {MaintainancePlanRepository} from './maintainance-plan.repository';

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

  public readonly maintainancePlan: BelongsToAccessor<MaintainancePlan, typeof MaintainanceEntries.prototype.id>;

  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource, @repository.getter('ToolsRepository') protected toolsRepositoryGetter: Getter<ToolsRepository>, @repository.getter('MaintainancePlanRepository') protected maintainancePlanRepositoryGetter: Getter<MaintainancePlanRepository>,) {
    super(MaintainanceEntries, dataSource);
    this.maintainancePlan = this.createBelongsToAccessorFor('maintainancePlan', maintainancePlanRepositoryGetter,);
    this.registerInclusionResolver('maintainancePlan', this.maintainancePlan.inclusionResolver);
    this.tools = this.createBelongsToAccessorFor('tools', toolsRepositoryGetter,);
    this.registerInclusionResolver('tools', this.tools.inclusionResolver);
  }
}
