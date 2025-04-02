import {Constructor, inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor, HasManyThroughRepositoryFactory, HasManyRepositoryFactory} from '@loopback/repository';
import {RadiallDataSource} from '../datasources';
import {
  InventoryOutEntries,
  InventoryOutEntriesRelations,
  Tools,
  User, InventoryOutEntryTools, InventoryInEntries} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {ToolsRepository} from './tools.repository';
import {UserRepository} from './user.repository';
import {InventoryOutEntryToolsRepository} from './inventory-out-entry-tools.repository';
import {InventoryInEntriesRepository} from './inventory-in-entries.repository';

export class InventoryOutEntriesRepository extends TimeStampRepositoryMixin<
  InventoryOutEntries,
  typeof InventoryOutEntries.prototype.id,
  Constructor<
    DefaultCrudRepository<
      InventoryOutEntries,
      typeof InventoryOutEntries.prototype.id,
      InventoryOutEntriesRelations
    >
  >
>(DefaultCrudRepository) {
  public readonly user: BelongsToAccessor<
    User,
    typeof InventoryOutEntries.prototype.id
  >;

  public readonly issuedByUser: BelongsToAccessor<
    User,
    typeof InventoryOutEntries.prototype.id
  >;

  public readonly tools: HasManyThroughRepositoryFactory<Tools, typeof Tools.prototype.id,
          InventoryOutEntryTools,
          typeof InventoryOutEntries.prototype.id
        >;

  public readonly inventoryInEntries: HasManyRepositoryFactory<InventoryInEntries, typeof InventoryOutEntries.prototype.id>;

  constructor(
    @inject('datasources.radiall') dataSource: RadiallDataSource,
    @repository.getter('ToolsRepository')
    protected toolsRepositoryGetter: Getter<ToolsRepository>,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('InventoryOutEntryToolsRepository') protected inventoryOutEntryToolsRepositoryGetter: Getter<InventoryOutEntryToolsRepository>, @repository.getter('InventoryInEntriesRepository') protected inventoryInEntriesRepositoryGetter: Getter<InventoryInEntriesRepository>,
  ) {
    super(InventoryOutEntries, dataSource);
    this.inventoryInEntries = this.createHasManyRepositoryFactoryFor('inventoryInEntries', inventoryInEntriesRepositoryGetter,);
    this.registerInclusionResolver('inventoryInEntries', this.inventoryInEntries.inclusionResolver);
    this.tools = this.createHasManyThroughRepositoryFactoryFor('tools', toolsRepositoryGetter, inventoryOutEntryToolsRepositoryGetter,);
    this.registerInclusionResolver('tools', this.tools.inclusionResolver);
    this.issuedByUser = this.createBelongsToAccessorFor(
      'issuedByUser',
      userRepositoryGetter,
    );
    this.registerInclusionResolver(
      'issuedByUser',
      this.issuedByUser.inclusionResolver,
    );
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
