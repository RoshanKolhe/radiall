import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {InventoryInEntries, InventoryInEntriesRelations, User} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {UserRepository} from './user.repository';

export class InventoryInEntriesRepository extends TimeStampRepositoryMixin<
  InventoryInEntries,
  typeof InventoryInEntries.prototype.id,
  Constructor<
    DefaultCrudRepository<
      InventoryInEntries,
      typeof InventoryInEntries.prototype.id,
      InventoryInEntriesRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly receivedFromUser: BelongsToAccessor<User, typeof InventoryInEntries.prototype.id>;

  public readonly returnByUser: BelongsToAccessor<User, typeof InventoryInEntries.prototype.id>;

  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,) {
    super(InventoryInEntries, dataSource);
    this.returnByUser = this.createBelongsToAccessorFor('returnByUser', userRepositoryGetter,);
    this.registerInclusionResolver('returnByUser', this.returnByUser.inclusionResolver);
    this.receivedFromUser = this.createBelongsToAccessorFor('receivedFromUser', userRepositoryGetter,);
    this.registerInclusionResolver('receivedFromUser', this.receivedFromUser.inclusionResolver);
  }
}
