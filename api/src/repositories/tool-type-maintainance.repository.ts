import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {ToolTypeMaintainance, ToolTypeMaintainanceRelations, ToolType, User} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {ToolTypeRepository} from './tool-type.repository';
import {UserRepository} from './user.repository';

export class ToolTypeMaintainanceRepository extends TimeStampRepositoryMixin<
  ToolTypeMaintainance,
  typeof ToolTypeMaintainance.prototype.id,
  Constructor<
    DefaultCrudRepository<
      ToolTypeMaintainance,
      typeof ToolTypeMaintainance.prototype.id,
      ToolTypeMaintainanceRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly toolType: BelongsToAccessor<ToolType, typeof ToolTypeMaintainance.prototype.id>;

  public readonly preparedByUser: BelongsToAccessor<User, typeof ToolTypeMaintainance.prototype.id>;

  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource, @repository.getter('ToolTypeRepository') protected toolTypeRepositoryGetter: Getter<ToolTypeRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,) {
    super(ToolTypeMaintainance, dataSource);
    this.preparedByUser = this.createBelongsToAccessorFor('preparedByUser', userRepositoryGetter,);
    this.registerInclusionResolver('preparedByUser', this.preparedByUser.inclusionResolver);
    this.toolType = this.createBelongsToAccessorFor('toolType', toolTypeRepositoryGetter,);
    this.registerInclusionResolver('toolType', this.toolType.inclusionResolver);
  }
}