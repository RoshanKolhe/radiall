import {Constructor, Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {User, UserRelations, Department} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {DepartmentRepository} from './department.repository';

export type Credentials = {
  email?: string;
  employeeId?: string;
  password: string;
};

export class UserRepository extends TimeStampRepositoryMixin<
  User,
  typeof User.prototype.id,
  Constructor<
    DefaultCrudRepository<User, typeof User.prototype.id, UserRelations>
  >
>(DefaultCrudRepository) {
  public readonly creator: BelongsToAccessor<User, typeof User.prototype.id>;

  public readonly updater: BelongsToAccessor<User, typeof User.prototype.id>;

  public readonly deleter: BelongsToAccessor<User, typeof User.prototype.id>;

  public readonly department: BelongsToAccessor<Department, typeof User.prototype.id>;

  constructor(
    @inject('datasources.radiall') dataSource: RadiallDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('DepartmentRepository') protected departmentRepositoryGetter: Getter<DepartmentRepository>,
  ) {
    super(User, dataSource);
    this.department = this.createBelongsToAccessorFor('department', departmentRepositoryGetter,);
    this.registerInclusionResolver('department', this.department.inclusionResolver);
    this.deleter = this.createBelongsToAccessorFor(
      'deleter',
      userRepositoryGetter,
    );
    this.registerInclusionResolver('deleter', this.deleter.inclusionResolver);
    this.updater = this.createBelongsToAccessorFor(
      'updater',
      userRepositoryGetter,
    );
    this.registerInclusionResolver('updater', this.updater.inclusionResolver);
    this.creator = this.createBelongsToAccessorFor(
      'creator',
      userRepositoryGetter,
    );
    this.registerInclusionResolver('creator', this.creator.inclusionResolver);
  }
}
