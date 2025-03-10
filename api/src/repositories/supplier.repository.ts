import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {Supplier, SupplierRelations} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';

export class SupplierRepository extends TimeStampRepositoryMixin<
  Supplier,
  typeof Supplier.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Supplier,
      typeof Supplier.prototype.id,
      SupplierRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource) {
    super(Supplier, dataSource);
  }
}
