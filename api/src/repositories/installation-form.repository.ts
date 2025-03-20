import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {InstallationForm, InstallationFormRelations, User, Tools} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {UserRepository} from './user.repository';
import {ToolsRepository} from './tools.repository';

export class InstallationFormRepository extends TimeStampRepositoryMixin<
  InstallationForm,
  typeof InstallationForm.prototype.id,
  Constructor<
    DefaultCrudRepository<
      InstallationForm,
      typeof InstallationForm.prototype.id,
      InstallationFormRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly initiator: BelongsToAccessor<User, typeof InstallationForm.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof InstallationForm.prototype.id>;

  public readonly tools: BelongsToAccessor<Tools, typeof InstallationForm.prototype.id>;

  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ToolsRepository') protected toolsRepositoryGetter: Getter<ToolsRepository>,) {
    super(InstallationForm, dataSource);
    this.tools = this.createBelongsToAccessorFor('tools', toolsRepositoryGetter,);
    this.registerInclusionResolver('tools', this.tools.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.initiator = this.createBelongsToAccessorFor('initiator', userRepositoryGetter,);
    this.registerInclusionResolver('initiator', this.initiator.inclusionResolver);
  }
}
