import {RadiallApplication} from './application';

export async function migrate(args: string[]) {
  const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter';
  console.log('Migrating schemas (%s existing schema)', existingSchema);

  const app = new RadiallApplication();
  await app.boot();
  await app.migrateSchema({
    existingSchema,
    models: [
      'User',
      'Department',
      'ToolType',
      'Manufacturer',
      'Supplier',
      'StorageLocation',
      'Station',
      'Tools',
      'InstallationForm',
      'Questionery',
      'Checklist',
      'ApprovalUsers',
      'Spare',
      'Routes',
      'InternalValidationForm',
      'ScrappingForm',
      'InventoryOutEntries',
      'ToolsDepartment',
      'InventoryOutEntryTools',
      'InventoryInEntries',
      'MaintainancePlan',
      'MaintainanceEntries',
      'InternalValidationHistory',
      'ToolTypeMaintainance',
      'RevisionHistory',
      'HistoryCard',
    ],
  });

  // Connectors usually keep a pool of opened connections,
  // this keeps the process running even after all work is done.
  // We need to exit explicitly.
  process.exit(0);
}

migrate(process.argv).catch(err => {
  console.error('Cannot migrate database schema', err);
  process.exit(1);
});
