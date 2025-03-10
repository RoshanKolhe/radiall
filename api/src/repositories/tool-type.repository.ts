import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {ToolType, ToolTypeRelations} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';

export class ToolTypeRepository extends TimeStampRepositoryMixin<
  ToolType,
  typeof ToolType.prototype.id,
  Constructor<
    DefaultCrudRepository<
      ToolType,
      typeof ToolType.prototype.id,
      ToolTypeRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource) {
    super(ToolType, dataSource);
  }
}
