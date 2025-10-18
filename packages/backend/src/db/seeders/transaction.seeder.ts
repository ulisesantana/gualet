import { DataSource } from 'typeorm';
import {
  CategoryEntity,
  PaymentMethodEntity,
  TransactionEntity,
  UserEntity,
} from '../entities';
import { Id, OperationType } from '@gualet/shared';
import { TimeString } from '@gualet/shared';

export class TransactionSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async run(userId: string): Promise<void> {
    const transactionRepository =
      this.dataSource.getRepository(TransactionEntity);
    const categoryRepository = this.dataSource.getRepository(CategoryEntity);
    const paymentMethodRepository =
      this.dataSource.getRepository(PaymentMethodEntity);
    const userRepository = this.dataSource.getRepository(UserEntity);

    // Check if user already has transactions
    const existingTransactions = await transactionRepository.count({
      where: { user: { id: userId } },
    });

    if (existingTransactions > 0) {
      console.log('✅ Transactions already exist for test user');
      return;
    }

    // Get user
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      console.log('❌ User not found, skipping transaction seeding');
      return;
    }

    // Get categories
    const categories = await categoryRepository.find({
      where: { user: { id: userId } },
    });

    const incomeCategories = categories.filter(
      (c) => c.type === OperationType.Income,
    );
    const outcomeCategories = categories.filter(
      (c) => c.type === OperationType.Outcome,
    );

    if (incomeCategories.length === 0 || outcomeCategories.length === 0) {
      console.log('❌ No categories found, skipping transaction seeding');
      return;
    }

    // Get payment methods
    const paymentMethods = await paymentMethodRepository.find({
      where: { user: { id: userId } },
    });

    if (paymentMethods.length === 0) {
      console.log('❌ No payment methods found, skipping transaction seeding');
      return;
    }

    // Create sample transactions for the last 30 days
    const now = new Date();
    const transactions: Partial<TransactionEntity>[] = [
      // Income transactions
      {
        id: new Id().toString(),
        user,
        category: incomeCategories[0],
        payment_method: paymentMethods[0],
        amount: 3000,
        description: 'Monthly salary',
        operation: OperationType.Income,
        date: new Date(
          now.getTime() - 30 * 24 * 60 * 60 * 1000,
        ).toISOString() as TimeString,
      },
      {
        id: new Id().toString(),
        user,
        category: incomeCategories[0],
        payment_method: paymentMethods[0],
        amount: 500,
        description: 'Freelance project',
        operation: OperationType.Income,
        date: new Date(
          now.getTime() - 15 * 24 * 60 * 60 * 1000,
        ).toISOString() as TimeString,
      },
      // Outcome transactions
      {
        id: new Id().toString(),
        user,
        category: outcomeCategories[0],
        payment_method: paymentMethods[0],
        amount: 85.5,
        description: 'Supermarket shopping',
        operation: OperationType.Outcome,
        date: new Date(
          now.getTime() - 2 * 24 * 60 * 60 * 1000,
        ).toISOString() as TimeString,
      },
      {
        id: new Id().toString(),
        user,
        category: outcomeCategories[1] || outcomeCategories[0],
        payment_method: paymentMethods[1] || paymentMethods[0],
        amount: 1200,
        description: 'Monthly rent',
        operation: OperationType.Outcome,
        date: new Date(
          now.getTime() - 5 * 24 * 60 * 60 * 1000,
        ).toISOString() as TimeString,
      },
      {
        id: new Id().toString(),
        user,
        category: outcomeCategories[0],
        payment_method: paymentMethods[0],
        amount: 45.0,
        description: 'Restaurant dinner',
        operation: OperationType.Outcome,
        date: new Date(
          now.getTime() - 7 * 24 * 60 * 60 * 1000,
        ).toISOString() as TimeString,
      },
      {
        id: new Id().toString(),
        user,
        category: outcomeCategories[2] || outcomeCategories[0],
        payment_method: paymentMethods[0],
        amount: 65.0,
        description: 'Gas station',
        operation: OperationType.Outcome,
        date: new Date(
          now.getTime() - 10 * 24 * 60 * 60 * 1000,
        ).toISOString() as TimeString,
      },
      {
        id: new Id().toString(),
        user,
        category: outcomeCategories[0],
        payment_method: paymentMethods[0],
        amount: 120.0,
        description: 'Monthly gym membership',
        operation: OperationType.Outcome,
        date: new Date(
          now.getTime() - 12 * 24 * 60 * 60 * 1000,
        ).toISOString() as TimeString,
      },
      {
        id: new Id().toString(),
        user,
        category: outcomeCategories[1] || outcomeCategories[0],
        payment_method: paymentMethods[1] || paymentMethods[0],
        amount: 150.0,
        description: 'Electricity bill',
        operation: OperationType.Outcome,
        date: new Date(
          now.getTime() - 14 * 24 * 60 * 60 * 1000,
        ).toISOString() as TimeString,
      },
      {
        id: new Id().toString(),
        user,
        category: outcomeCategories[0],
        payment_method: paymentMethods[0],
        amount: 35.0,
        description: 'Coffee and snacks',
        operation: OperationType.Outcome,
        date: new Date(
          now.getTime() - 1 * 24 * 60 * 60 * 1000,
        ).toISOString() as TimeString,
      },
      {
        id: new Id().toString(),
        user,
        category: outcomeCategories[0],
        payment_method: paymentMethods[0],
        amount: 95.0,
        description: 'Online shopping',
        operation: OperationType.Outcome,
        date: new Date(
          now.getTime() - 3 * 24 * 60 * 60 * 1000,
        ).toISOString() as TimeString,
      },
    ];

    // Save all transactions
    for (const transaction of transactions) {
      await transactionRepository.save(transaction);
    }

    console.log(
      `✅ Created ${transactions.length} sample transactions for test user`,
    );
  }
}
