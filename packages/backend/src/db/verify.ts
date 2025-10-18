import { AppDataSource } from './data-source';
import {
  CategoryEntity,
  PaymentMethodEntity,
  TransactionEntity,
  UserEntity,
} from './entities';

async function verify() {
  console.log('🔍 Verifying database content...\n');

  await AppDataSource.initialize();
  console.log('✅ Database connected\n');

  const userRepository = AppDataSource.getRepository(UserEntity);
  const categoryRepository = AppDataSource.getRepository(CategoryEntity);
  const paymentMethodRepository =
    AppDataSource.getRepository(PaymentMethodEntity);
  const transactionRepository = AppDataSource.getRepository(TransactionEntity);

  const users = await userRepository.find();
  console.log(`👥 Users: ${users.length}`);
  users.forEach((user) => console.log(`   - ${user.email} (${user.id})`));

  const categories = await categoryRepository.find({ relations: ['user'] });
  console.log(`\n📁 Categories: ${categories.length}`);
  categories.forEach((cat) =>
    console.log(
      `   - ${cat.name} (${cat.type}) - User: ${cat.user?.email || 'NO USER'}`,
    ),
  );

  const paymentMethods = await paymentMethodRepository.find({
    relations: ['user'],
  });
  console.log(`\n💳 Payment Methods: ${paymentMethods.length}`);
  paymentMethods.forEach((pm) =>
    console.log(`   - ${pm.name} - User: ${pm.user?.email || 'NO USER'}`),
  );

  const transactions = await transactionRepository.find({
    relations: ['user', 'category', 'payment_method'],
  });
  console.log(`\n💰 Transactions: ${transactions.length}`);
  console.log(`   First 5 transactions:`);
  transactions
    .slice(0, 5)
    .forEach((tx) =>
      console.log(
        `   - ${tx.description}: $${tx.amount} (${tx.operation}) - User: ${tx.user?.email || 'NO USER'}`,
      ),
    );

  await AppDataSource.destroy();
  process.exit(0);
}

verify().catch(async (error) => {
  console.error('❌ Error:', error);
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  process.exit(1);
});
