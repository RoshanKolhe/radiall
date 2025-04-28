import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {RevisionHistory, RevisionHistoryRelations} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';

export class RevisionHistoryRepository extends TimeStampRepositoryMixin<
  RevisionHistory,
  typeof RevisionHistory.prototype.id,
  Constructor<
    DefaultCrudRepository<
      RevisionHistory,
      typeof RevisionHistory.prototype.id,
      RevisionHistoryRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource) {
    super(RevisionHistory, dataSource);
  }
}
