import { AppDataSource } from './data-source';
import { TransactionSeeder, UserSeeder } from './seeders';

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Initialize data source
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    // Run user seeder
    const userSeeder = new UserSeeder(AppDataSource);
    await userSeeder.run();

    // Get the test user ID
    const userRepository = AppDataSource.getRepository('UserEntity' as any);
    const testUser = await userRepository.findOne({
      where: { email: 'test@gualet.app' },
    });

    // Run transaction seeder if user exists
    if (testUser) {
      const transactionSeeder = new TransactionSeeder(AppDataSource);
      await transactionSeeder.run(testUser.id);
    }

    console.log('🎉 Seeding completed successfully');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}

seed();
