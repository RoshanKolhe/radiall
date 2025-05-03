import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {MaintainanceChecklist, MaintainanceChecklistRelations} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';

export class MaintainanceChecklistRepository extends TimeStampRepositoryMixin<
  MaintainanceChecklist,
  typeof MaintainanceChecklist.prototype.id,
  Constructor<
    DefaultCrudRepository<
      MaintainanceChecklist,
      typeof MaintainanceChecklist.prototype.id,
      MaintainanceChecklistRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource) {
    super(MaintainanceChecklist, dataSource);
  }
}
