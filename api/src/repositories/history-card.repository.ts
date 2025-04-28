import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {HistoryCard, HistoryCardRelations} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';

export class HistoryCardRepository extends TimeStampRepositoryMixin<
  HistoryCard,
  typeof HistoryCard.prototype.id,
  Constructor<
    DefaultCrudRepository<
      HistoryCard,
      typeof HistoryCard.prototype.id,
      HistoryCardRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource) {
    super(HistoryCard, dataSource);
  }
}
