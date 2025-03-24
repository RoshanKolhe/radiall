import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {Checklist, ChecklistRelations, Routes} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {RoutesRepository} from './routes.repository';

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

  public readonly routes: BelongsToAccessor<Routes, typeof Checklist.prototype.id>;

  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource, @repository.getter('RoutesRepository') protected routesRepositoryGetter: Getter<RoutesRepository>,) {
    super(Checklist, dataSource);
    this.routes = this.createBelongsToAccessorFor('routes', routesRepositoryGetter,);
    this.registerInclusionResolver('routes', this.routes.inclusionResolver);
  }
}
