import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {Spare, SpareRelations, Tools, Manufacturer, Supplier} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {ToolsRepository} from './tools.repository';
import {ManufacturerRepository} from './manufacturer.repository';
import {SupplierRepository} from './supplier.repository';

export class SpareRepository extends TimeStampRepositoryMixin<
  Spare,
  typeof Spare.prototype.id,
  Constructor<
    DefaultCrudRepository<Spare, typeof Spare.prototype.id, SpareRelations>
  >
>(DefaultCrudRepository) {

  public readonly tools: BelongsToAccessor<Tools, typeof Spare.prototype.id>;

  public readonly manufacturer: BelongsToAccessor<Manufacturer, typeof Spare.prototype.id>;

  public readonly supplier: BelongsToAccessor<Supplier, typeof Spare.prototype.id>;

  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource, @repository.getter('ToolsRepository') protected toolsRepositoryGetter: Getter<ToolsRepository>, @repository.getter('ManufacturerRepository') protected manufacturerRepositoryGetter: Getter<ManufacturerRepository>, @repository.getter('SupplierRepository') protected supplierRepositoryGetter: Getter<SupplierRepository>,) {
    super(Spare, dataSource);
    this.supplier = this.createBelongsToAccessorFor('supplier', supplierRepositoryGetter,);
    this.registerInclusionResolver('supplier', this.supplier.inclusionResolver);
    this.manufacturer = this.createBelongsToAccessorFor('manufacturer', manufacturerRepositoryGetter,);
    this.registerInclusionResolver('manufacturer', this.manufacturer.inclusionResolver);
    this.tools = this.createBelongsToAccessorFor('tools', toolsRepositoryGetter,);
    this.registerInclusionResolver('tools', this.tools.inclusionResolver);
  }
}
