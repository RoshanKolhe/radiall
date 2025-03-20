import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {Questionery, QuestioneryRelations} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';

export class QuestioneryRepository extends TimeStampRepositoryMixin<
  Questionery,
  typeof Questionery.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Questionery,
      typeof Questionery.prototype.id,
      QuestioneryRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource) {
    super(Questionery, dataSource);
  }
}
