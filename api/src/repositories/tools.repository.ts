import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {Tools, ToolsRelations, ToolType, Manufacturer, Supplier, StorageLocation, Spare, InventoryOutEntries} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {ToolTypeRepository} from './tool-type.repository';
import {ManufacturerRepository} from './manufacturer.repository';
import {SupplierRepository} from './supplier.repository';
import {StorageLocationRepository} from './storage-location.repository';
import {SpareRepository} from './spare.repository';
import {InventoryOutEntriesRepository} from './inventory-out-entries.repository';

export class ToolsRepository extends TimeStampRepositoryMixin<
  Tools,
  typeof Tools.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Tools,
      typeof Tools.prototype.id,
      ToolsRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly toolType: BelongsToAccessor<ToolType, typeof Tools.prototype.id>;

  public readonly manufacturer: BelongsToAccessor<Manufacturer, typeof Tools.prototype.id>;

  public readonly supplier: BelongsToAccessor<Supplier, typeof Tools.prototype.id>;

  public readonly storageLocation: BelongsToAccessor<StorageLocation, typeof Tools.prototype.id>;

  public readonly spares: HasManyRepositoryFactory<Spare, typeof Tools.prototype.id>;

  public readonly inventoryOutEntries: HasManyRepositoryFactory<InventoryOutEntries, typeof Tools.prototype.id>;

  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource, @repository.getter('ToolTypeRepository') protected toolTypeRepositoryGetter: Getter<ToolTypeRepository>, @repository.getter('ManufacturerRepository') protected manufacturerRepositoryGetter: Getter<ManufacturerRepository>, @repository.getter('SupplierRepository') protected supplierRepositoryGetter: Getter<SupplierRepository>, @repository.getter('StorageLocationRepository') protected storageLocationRepositoryGetter: Getter<StorageLocationRepository>, @repository.getter('SpareRepository') protected spareRepositoryGetter: Getter<SpareRepository>, @repository.getter('InventoryOutEntriesRepository') protected inventoryOutEntriesRepositoryGetter: Getter<InventoryOutEntriesRepository>,) {
    super(Tools, dataSource);
    this.inventoryOutEntries = this.createHasManyRepositoryFactoryFor('inventoryOutEntries', inventoryOutEntriesRepositoryGetter,);
    this.registerInclusionResolver('inventoryOutEntries', this.inventoryOutEntries.inclusionResolver);
    this.spares = this.createHasManyRepositoryFactoryFor('spares', spareRepositoryGetter,);
    this.registerInclusionResolver('spares', this.spares.inclusionResolver);
    this.storageLocation = this.createBelongsToAccessorFor('storageLocation', storageLocationRepositoryGetter,);
    this.registerInclusionResolver('storageLocation', this.storageLocation.inclusionResolver);
    this.supplier = this.createBelongsToAccessorFor('supplier', supplierRepositoryGetter,);
    this.registerInclusionResolver('supplier', this.supplier.inclusionResolver);
    this.manufacturer = this.createBelongsToAccessorFor('manufacturer', manufacturerRepositoryGetter,);
    this.registerInclusionResolver('manufacturer', this.manufacturer.inclusionResolver);
    this.toolType = this.createBelongsToAccessorFor('toolType', toolTypeRepositoryGetter,);
    this.registerInclusionResolver('toolType', this.toolType.inclusionResolver);
  }
}