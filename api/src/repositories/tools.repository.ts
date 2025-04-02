import {Constructor, inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {
  Tools,
  ToolsRelations,
  ToolType,
  Manufacturer,
  Supplier,
  StorageLocation,
  Spare,
  InventoryOutEntries,
  ToolsDepartment,
  Station,
  InventoryOutEntryTools,
} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';

import {ToolTypeRepository} from './tool-type.repository';
import {ManufacturerRepository} from './manufacturer.repository';
import {SupplierRepository} from './supplier.repository';
import {StorageLocationRepository} from './storage-location.repository';
import {SpareRepository} from './spare.repository';
import {InventoryOutEntriesRepository} from './inventory-out-entries.repository';
import {ToolsDepartmentRepository} from './tools-department.repository';
import {StationRepository} from './station.repository';
import {InventoryOutEntryToolsRepository} from './inventory-out-entry-tools.repository';

export class ToolsRepository extends TimeStampRepositoryMixin<
  Tools,
  typeof Tools.prototype.id,
  Constructor<
    DefaultCrudRepository<Tools, typeof Tools.prototype.id, ToolsRelations>
  >
>(DefaultCrudRepository) {
  public readonly toolType: BelongsToAccessor<
    ToolType,
    typeof Tools.prototype.id
  >;

  public readonly manufacturer: BelongsToAccessor<
    Manufacturer,
    typeof Tools.prototype.id
  >;

  public readonly supplier: BelongsToAccessor<
    Supplier,
    typeof Tools.prototype.id
  >;

  public readonly spares: HasManyRepositoryFactory<
    Spare,
    typeof Tools.prototype.id
  >;

  public readonly toolsDepartment: BelongsToAccessor<
    ToolsDepartment,
    typeof Tools.prototype.id
  >;

  public readonly station: BelongsToAccessor<
    Station,
    typeof Tools.prototype.id
  >;

  public readonly inventoryOutEntryTools: HasManyRepositoryFactory<
    InventoryOutEntryTools,
    typeof Tools.prototype.id
  >;

  constructor(
    @inject('datasources.radiall') dataSource: RadiallDataSource,
    @repository.getter('ToolTypeRepository')
    protected toolTypeRepositoryGetter: Getter<ToolTypeRepository>,
    @repository.getter('ManufacturerRepository')
    protected manufacturerRepositoryGetter: Getter<ManufacturerRepository>,
    @repository.getter('SupplierRepository')
    protected supplierRepositoryGetter: Getter<SupplierRepository>,
    @repository.getter('StorageLocationRepository')
    protected storageLocationRepositoryGetter: Getter<StorageLocationRepository>,
    @repository.getter('SpareRepository')
    protected spareRepositoryGetter: Getter<SpareRepository>,
    @repository.getter('InventoryOutEntriesRepository')
    protected inventoryOutEntriesRepositoryGetter: Getter<InventoryOutEntriesRepository>,
    @repository.getter('InventoryOutEntryToolsRepository')
    protected inventoryOutEntryToolsRepositoryGetter: Getter<InventoryOutEntryToolsRepository>,
    @repository.getter('ToolsDepartmentRepository')
    protected toolsDepartmentRepositoryGetter: Getter<ToolsDepartmentRepository>,
    @repository.getter('StationRepository')
    protected stationRepositoryGetter: Getter<StationRepository>,
  ) {
    super(Tools, dataSource);
    this.station = this.createBelongsToAccessorFor(
      'station',
      stationRepositoryGetter,
    );
    this.registerInclusionResolver('station', this.station.inclusionResolver);
    this.toolsDepartment = this.createBelongsToAccessorFor(
      'toolsDepartment',
      toolsDepartmentRepositoryGetter,
    );
    this.registerInclusionResolver(
      'toolsDepartment',
      this.toolsDepartment.inclusionResolver,
    );
    this.inventoryOutEntryTools = this.createHasManyRepositoryFactoryFor(
      'inventoryOutEntryTools',
      inventoryOutEntryToolsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'inventoryOutEntryTools',
      this.inventoryOutEntryTools.inclusionResolver,
    );
    this.spares = this.createHasManyRepositoryFactoryFor(
      'spares',
      spareRepositoryGetter,
    );
    this.registerInclusionResolver('spares', this.spares.inclusionResolver);

    this.supplier = this.createBelongsToAccessorFor(
      'supplier',
      supplierRepositoryGetter,
    );
    this.registerInclusionResolver('supplier', this.supplier.inclusionResolver);
    this.manufacturer = this.createBelongsToAccessorFor(
      'manufacturer',
      manufacturerRepositoryGetter,
    );
    this.registerInclusionResolver(
      'manufacturer',
      this.manufacturer.inclusionResolver,
    );
    this.toolType = this.createBelongsToAccessorFor(
      'toolType',
      toolTypeRepositoryGetter,
    );
    this.registerInclusionResolver('toolType', this.toolType.inclusionResolver);
  }
}
