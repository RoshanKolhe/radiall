import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {InternalValidationHistory, InternalValidationHistoryRelations, InternalValidationForm, Tools, User} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {InternalValidationFormRepository} from './internal-validation-form.repository';
import {ToolsRepository} from './tools.repository';
import {UserRepository} from './user.repository';

export class InternalValidationHistoryRepository extends TimeStampRepositoryMixin<
  InternalValidationHistory,
  typeof InternalValidationHistory.prototype.id,
  Constructor<
    DefaultCrudRepository<
      InternalValidationHistory,
      typeof InternalValidationHistory.prototype.id,
      InternalValidationHistoryRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly tools: BelongsToAccessor<Tools, typeof InternalValidationHistory.prototype.id>;

  public readonly initiator: BelongsToAccessor<User, typeof InternalValidationHistory.prototype.id>;

  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource, @repository.getter('InternalValidationFormRepository') protected internalValidationFormRepositoryGetter: Getter<InternalValidationFormRepository>, @repository.getter('ToolsRepository') protected toolsRepositoryGetter: Getter<ToolsRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,) {
    super(InternalValidationHistory, dataSource);
    this.initiator = this.createBelongsToAccessorFor('initiator', userRepositoryGetter,);
    this.registerInclusionResolver('initiator', this.initiator.inclusionResolver);
    this.tools = this.createBelongsToAccessorFor('tools', toolsRepositoryGetter,);
    this.registerInclusionResolver('tools', this.tools.inclusionResolver);
  }
}
