import { AppDataSource } from './data-source';
import {
  CategoryEntity,
  PaymentMethodEntity,
  TransactionEntity,
  UserEntity,
} from './entities';

async function clean() {
  console.log('🧹 Starting database cleanup...\n');

  await AppDataSource.initialize();
  console.log('✅ Database connected\n');

  // Delete all data in the correct order (respecting foreign keys)
  const transactionRepository = AppDataSource.getRepository(TransactionEntity);
  const categoryRepository = AppDataSource.getRepository(CategoryEntity);
  const paymentMethodRepository =
    AppDataSource.getRepository(PaymentMethodEntity);
  const userRepository = AppDataSource.getRepository(UserEntity);

  console.log('🗑️  Deleting transactions...');
  await transactionRepository.delete({});

  console.log('🗑️  Deleting categories...');
  await categoryRepository.delete({});

  console.log('🗑️  Deleting payment methods...');
  await paymentMethodRepository.delete({});

  console.log('🗑️  Deleting users...');
  await userRepository.delete({});

  console.log('\n✨ Database cleaned successfully');
  await AppDataSource.destroy();
  process.exit(0);
}

clean().catch(async (error) => {
  console.error('❌ Error during cleanup:', error);
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  process.exit(1);
});
