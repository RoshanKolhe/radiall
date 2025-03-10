import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {Department, DepartmentRelations, User} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {UserRepository} from './user.repository';

export class DepartmentRepository extends TimeStampRepositoryMixin<
  Department,
  typeof Department.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Department,
      typeof Department.prototype.id,
      DepartmentRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly users: HasManyRepositoryFactory<User, typeof Department.prototype.id>;

  constructor(@inject('datasources.radiall') dataSource: RadiallDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,) {
    super(Department, dataSource);
    this.users = this.createHasManyRepositoryFactoryFor('users', userRepositoryGetter,);
    this.registerInclusionResolver('users', this.users.inclusionResolver);
  }
}
