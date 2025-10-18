import { AppDataSource } from './data-source';
import { TransactionSeeder, UserSeeder } from './seeders';

async function seed() {
  console.log('🌱 Starting database seeding...\n');

  // Initialize data source
  await AppDataSource.initialize();
  console.log('✅ Database connected\n');

  // Run user seeder (creates user, categories, and payment methods)
  console.log('👤 Creating test user with default data...');
  const userSeeder = new UserSeeder(AppDataSource);
  const userId = await userSeeder.run();
  console.log('');

  // Run transaction seeder
  console.log('💰 Creating sample transactions...');
  const transactionSeeder = new TransactionSeeder(AppDataSource);
  await transactionSeeder.run(userId);
  console.log('');

  console.log('🎉 Seeding completed successfully');
  await AppDataSource.destroy();
  process.exit(0);
}

seed().catch(async (error) => {
  console.error('❌ Error during seeding:', error);
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  process.exit(1);
});
