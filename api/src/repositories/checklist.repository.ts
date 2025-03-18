import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {Checklist, ChecklistRelations} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';

export class ChecklistRepository extends TimeStampRepositoryMixin<
  Checklist,
  typeof Checklist.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Checklist,
      typeof Checklist.prototype.id,
      ChecklistRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource) {
    super(Checklist, dataSource);
  }
}
