import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {Station, StationRelations} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';

export class StationRepository extends TimeStampRepositoryMixin<
  Station,
  typeof Station.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Station,
      typeof Station.prototype.id,
      StationRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource) {
    super(Station, dataSource);
  }
}
