import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {StorageLocation, StorageLocationRelations} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';

export class StorageLocationRepository extends TimeStampRepositoryMixin<
  StorageLocation,
  typeof StorageLocation.prototype.id,
  Constructor<
    DefaultCrudRepository<
      StorageLocation,
      typeof StorageLocation.prototype.id,
      StorageLocationRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource) {
    super(StorageLocation, dataSource);
  }
}
