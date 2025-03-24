import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {Routes, RoutesRelations} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';

export class RoutesRepository extends TimeStampRepositoryMixin<
  Routes,
  typeof Routes.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Routes,
      typeof Routes.prototype.id,
      RoutesRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource) {
    super(Routes, dataSource);
  }
}
