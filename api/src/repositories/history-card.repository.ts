import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {HistoryCard, HistoryCardRelations, Tools} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {ToolsRepository} from './tools.repository';

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

  public readonly tools: BelongsToAccessor<Tools, typeof HistoryCard.prototype.id>;

  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource, @repository.getter('ToolsRepository') protected toolsRepositoryGetter: Getter<ToolsRepository>,) {
    super(HistoryCard, dataSource);
    this.tools = this.createBelongsToAccessorFor('tools', toolsRepositoryGetter,);
    this.registerInclusionResolver('tools', this.tools.inclusionResolver);
  }
}
