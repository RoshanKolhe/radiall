import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {Manufacturer, ManufacturerRelations} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';

export class ManufacturerRepository extends TimeStampRepositoryMixin<
  Manufacturer,
  typeof Manufacturer.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Manufacturer,
      typeof Manufacturer.prototype.id,
      ManufacturerRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource) {
    super(Manufacturer, dataSource);
  }
}
