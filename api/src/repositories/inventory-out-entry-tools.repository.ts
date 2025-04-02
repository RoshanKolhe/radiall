import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {
  InventoryOutEntryTools,
  InventoryOutEntryToolsRelations, InventoryInEntries} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {InventoryInEntriesRepository} from './inventory-in-entries.repository';

export class InventoryOutEntryToolsRepository extends TimeStampRepositoryMixin<
  InventoryOutEntryTools,
  typeof InventoryOutEntryTools.prototype.id,
  Constructor<
    DefaultCrudRepository<
      InventoryOutEntryTools,
      typeof InventoryOutEntryTools.prototype.id,
      InventoryOutEntryToolsRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly inventoryInEntries: BelongsToAccessor<InventoryInEntries, typeof InventoryOutEntryTools.prototype.id>;

  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource, @repository.getter('InventoryInEntriesRepository') protected inventoryInEntriesRepositoryGetter: Getter<InventoryInEntriesRepository>,) {
    super(InventoryOutEntryTools, dataSource);
    this.inventoryInEntries = this.createBelongsToAccessorFor('inventoryInEntries', inventoryInEntriesRepositoryGetter,);
    this.registerInclusionResolver('inventoryInEntries', this.inventoryInEntries.inclusionResolver);
  }
}
