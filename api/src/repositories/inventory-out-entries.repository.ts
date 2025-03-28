import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {InventoryOutEntries, InventoryOutEntriesRelations, Tools, User} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {ToolsRepository} from './tools.repository';
import {UserRepository} from './user.repository';

export class InventoryOutEntriesRepository extends TimeStampRepositoryMixin<
  InventoryOutEntries,
  typeof InventoryOutEntries.prototype.id,
  Constructor<
    DefaultCrudRepository<
      InventoryOutEntries,
      typeof InventoryOutEntries.prototype.id,
      InventoryOutEntriesRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly tools: BelongsToAccessor<Tools, typeof InventoryOutEntries.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof InventoryOutEntries.prototype.id>;

  public readonly issuedByUser: BelongsToAccessor<User, typeof InventoryOutEntries.prototype.id>;

  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource, @repository.getter('ToolsRepository') protected toolsRepositoryGetter: Getter<ToolsRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,) {
    super(InventoryOutEntries, dataSource);
    this.issuedByUser = this.createBelongsToAccessorFor('issuedByUser', userRepositoryGetter,);
    this.registerInclusionResolver('issuedByUser', this.issuedByUser.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.tools = this.createBelongsToAccessorFor('tools', toolsRepositoryGetter,);
    this.registerInclusionResolver('tools', this.tools.inclusionResolver);
  }
}
