import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {ToolsDepartment, ToolsDepartmentRelations} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';

export class ToolsDepartmentRepository extends TimeStampRepositoryMixin<
  ToolsDepartment,
  typeof ToolsDepartment.prototype.id,
  Constructor<
    DefaultCrudRepository<
      ToolsDepartment,
      typeof ToolsDepartment.prototype.id,
      ToolsDepartmentRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource) {
    super(ToolsDepartment, dataSource);
  }
}
