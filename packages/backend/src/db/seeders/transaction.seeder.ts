import { DataSource } from 'typeorm';
import {
  CategoryEntity,
  PaymentMethodEntity,
  TransactionEntity,
  UserEntity,
} from '../entities';
import { Id, OperationType, TimeString } from '@gualet/shared';

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
      console.log(
        `✅ User already has ${existingTransactions} transactions, skipping seed`,
      );
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

    // Generate 50 diverse transactions over the last 90 days
    const transactions: Partial<TransactionEntity>[] = [];
    const now = new Date();

    // Income transactions (10)
    const incomeTransactions = [
      { amount: 3000, description: 'Monthly salary', daysAgo: 60 },
      { amount: 3000, description: 'Monthly salary', daysAgo: 30 },
      { amount: 3000, description: 'Monthly salary', daysAgo: 1 },
      { amount: 500, description: 'Freelance project', daysAgo: 45 },
      { amount: 750, description: 'Freelance project', daysAgo: 20 },
      { amount: 200, description: 'Sold old furniture', daysAgo: 55 },
      { amount: 150, description: 'Tax refund', daysAgo: 40 },
      { amount: 100, description: 'Gift received', daysAgo: 25 },
      { amount: 50, description: 'Cashback reward', daysAgo: 15 },
      { amount: 75, description: 'Online sale', daysAgo: 8 },
    ];

    // Outcome transactions (40)
    const outcomeTransactions = [
      // Housing & utilities
      { amount: 1200, description: 'Rent payment', daysAgo: 60 },
      { amount: 1200, description: 'Rent payment', daysAgo: 30 },
      { amount: 1200, description: 'Rent payment', daysAgo: 1 },
      { amount: 150, description: 'Electricity bill', daysAgo: 55 },
      { amount: 145, description: 'Electricity bill', daysAgo: 25 },
      { amount: 80, description: 'Water bill', daysAgo: 50 },
      { amount: 50, description: 'Internet service', daysAgo: 58 },
      { amount: 50, description: 'Internet service', daysAgo: 28 },

      // Groceries & food
      { amount: 120, description: 'Supermarket shopping', daysAgo: 2 },
      { amount: 95, description: 'Grocery store', daysAgo: 7 },
      { amount: 110, description: 'Weekly groceries', daysAgo: 14 },
      { amount: 88, description: 'Supermarket', daysAgo: 21 },
      { amount: 105, description: 'Food shopping', daysAgo: 35 },
      { amount: 92, description: 'Grocery shopping', daysAgo: 42 },
      { amount: 45, description: 'Restaurant dinner', daysAgo: 5 },
      { amount: 32, description: 'Lunch with friends', daysAgo: 12 },
      { amount: 28, description: 'Coffee shop', daysAgo: 18 },
      { amount: 65, description: 'Pizza night', daysAgo: 24 },

      // Transportation
      { amount: 65, description: 'Gas station', daysAgo: 10 },
      { amount: 60, description: 'Fuel', daysAgo: 22 },
      { amount: 70, description: 'Gas refill', daysAgo: 38 },
      { amount: 45, description: 'Metro card', daysAgo: 32 },
      { amount: 25, description: 'Taxi ride', daysAgo: 16 },
      { amount: 30, description: 'Uber trip', daysAgo: 48 },

      // Health & fitness
      { amount: 120, description: 'Monthly gym membership', daysAgo: 62 },
      { amount: 120, description: 'Monthly gym membership', daysAgo: 32 },
      { amount: 120, description: 'Monthly gym membership', daysAgo: 2 },
      { amount: 85, description: 'Pharmacy', daysAgo: 27 },
      { amount: 50, description: 'Vitamins and supplements', daysAgo: 44 },

      // Shopping & entertainment
      { amount: 95, description: 'Online shopping', daysAgo: 3 },
      { amount: 150, description: 'Clothing store', daysAgo: 36 },
      { amount: 220, description: 'Electronics purchase', daysAgo: 52 },
      { amount: 35, description: 'Books', daysAgo: 19 },
      { amount: 45, description: 'Movie tickets', daysAgo: 11 },
      { amount: 80, description: 'Concert tickets', daysAgo: 41 },

      // Subscriptions & services
      { amount: 15, description: 'Netflix subscription', daysAgo: 9 },
      { amount: 12, description: 'Spotify premium', daysAgo: 17 },
      { amount: 20, description: 'Cloud storage', daysAgo: 33 },
      { amount: 40, description: 'Phone bill', daysAgo: 29 },
    ];

    // Create income transactions
    incomeTransactions.forEach((tx) => {
      const randomCategory =
        incomeCategories[Math.floor(Math.random() * incomeCategories.length)];
      const randomPaymentMethod =
        paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

      transactions.push({
        id: new Id().toString(),
        user,
        category: randomCategory,
        payment_method: randomPaymentMethod,
        amount: tx.amount,
        description: tx.description,
        operation: OperationType.Income,
        date: new Date(
          now.getTime() - tx.daysAgo * 24 * 60 * 60 * 1000,
        ).toISOString() as TimeString,
      });
    });

    // Create outcome transactions
    outcomeTransactions.forEach((tx) => {
      const randomCategory =
        outcomeCategories[Math.floor(Math.random() * outcomeCategories.length)];
      const randomPaymentMethod =
        paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

      transactions.push({
        id: new Id().toString(),
        user,
        category: randomCategory,
        payment_method: randomPaymentMethod,
        amount: tx.amount,
        description: tx.description,
        operation: OperationType.Outcome,
        date: new Date(
          now.getTime() - tx.daysAgo * 24 * 60 * 60 * 1000,
        ).toISOString() as TimeString,
      });
    });

    // Save all transactions in batches for better performance
    await transactionRepository.save(transactions);

    console.log(
      `✅ Created ${transactions.length} sample transactions for test user`,
    );
  }
}
