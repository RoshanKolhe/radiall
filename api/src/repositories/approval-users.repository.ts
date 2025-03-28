import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {ApprovalUsers, ApprovalUsersRelations, User, InstallationForm, InternalValidationForm, ScrappingForm} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {UserRepository} from './user.repository';
import {InstallationFormRepository} from './installation-form.repository';
import {InternalValidationFormRepository} from './internal-validation-form.repository';
import {ScrappingFormRepository} from './scrapping-form.repository';

export class ApprovalUsersRepository extends TimeStampRepositoryMixin<
  ApprovalUsers,
  typeof ApprovalUsers.prototype.id,
  Constructor<
    DefaultCrudRepository<
      ApprovalUsers,
      typeof ApprovalUsers.prototype.id,
      ApprovalUsersRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly user: BelongsToAccessor<User, typeof ApprovalUsers.prototype.id>;

  public readonly installationForm: BelongsToAccessor<InstallationForm, typeof ApprovalUsers.prototype.id>;

  public readonly internalValidationForm: BelongsToAccessor<InternalValidationForm, typeof ApprovalUsers.prototype.id>;

  public readonly scrappingForm: BelongsToAccessor<ScrappingForm, typeof ApprovalUsers.prototype.id>;

  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('InstallationFormRepository') protected installationFormRepositoryGetter: Getter<InstallationFormRepository>, @repository.getter('InternalValidationFormRepository') protected internalValidationFormRepositoryGetter: Getter<InternalValidationFormRepository>, @repository.getter('ScrappingFormRepository') protected scrappingFormRepositoryGetter: Getter<ScrappingFormRepository>,) {
    super(ApprovalUsers, dataSource);
    this.scrappingForm = this.createBelongsToAccessorFor('scrappingForm', scrappingFormRepositoryGetter,);
    this.registerInclusionResolver('scrappingForm', this.scrappingForm.inclusionResolver);
    this.internalValidationForm = this.createBelongsToAccessorFor('internalValidationForm', internalValidationFormRepositoryGetter,);
    this.registerInclusionResolver('internalValidationForm', this.internalValidationForm.inclusionResolver);
    this.installationForm = this.createBelongsToAccessorFor('installationForm', installationFormRepositoryGetter,);
    this.registerInclusionResolver('installationForm', this.installationForm.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}