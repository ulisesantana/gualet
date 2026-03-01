import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DemoUserService } from '@src/users/demo-user.service';
import { CategoriesService } from '@src/categories/categories.service';
import { PaymentMethodsService } from '@src/payment-methods/payment-methods.service';
import { TransactionsService } from '@src/transactions/transactions.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CategoryEntity,
  PaymentMethodEntity,
  TransactionEntity,
} from '@src/db';
import {
  Category,
  Id,
  OperationType,
  PaymentMethod,
  TimeString,
} from '@gualet/shared';

/**
 * Demo Data Reset Service
 * Automatically resets demo account data periodically to ensure
 * it always has sample data available for new users.
 */
@Injectable()
export class DemoDataResetService {
  private readonly logger = new Logger(DemoDataResetService.name);
  private readonly demoUserId: string;

  constructor(
    private readonly demoUserService: DemoUserService,
    private readonly categoriesService: CategoriesService,
    private readonly paymentMethodsService: PaymentMethodsService,
    private readonly transactionsService: TransactionsService,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(PaymentMethodEntity)
    private readonly paymentMethodRepository: Repository<PaymentMethodEntity>,
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {
    this.demoUserId = this.demoUserService.getDemoUserId();
  }

  /**
   * Runs every day at 3 AM to reset demo data
   */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async scheduledReset() {
    this.logger.log('Starting scheduled demo data reset...');
    await this.resetDemoData();
    this.logger.log('Scheduled demo data reset completed');
  }

  /**
   * Manually reset demo data (can be called from endpoint)
   */
  async resetDemoData(): Promise<void> {
    try {
      this.logger.log(`Resetting data for demo user: ${this.demoUserId}`);

      // 1. Delete all existing data
      await this.deleteAllDemoData();

      // 2. Create default categories and payment methods
      const [categories, paymentMethods] = await Promise.all([
        this.categoriesService.createDefaultCategories(new Id(this.demoUserId)),
        this.paymentMethodsService.createDefaultPaymentMethods(
          new Id(this.demoUserId),
        ),
      ]);

      this.logger.log(
        `Created ${categories.length} categories and ${paymentMethods.length} payment methods`,
      );

      // 3. Create sample transactions
      if (categories.length > 0 && paymentMethods.length > 0) {
        await this.createSampleTransactions(categories, paymentMethods);
      }

      this.logger.log('Demo data reset completed successfully');
    } catch (error) {
      this.logger.error('Failed to reset demo data', error);
      throw error;
    }
  }

  private async deleteAllDemoData(): Promise<void> {
    this.logger.log('Deleting all demo data...');

    // Delete in correct order due to foreign key constraints
    await this.transactionRepository.delete({
      user: { id: this.demoUserId },
    });

    await this.categoryRepository.delete({
      user: { id: this.demoUserId },
    });

    await this.paymentMethodRepository.delete({
      user: { id: this.demoUserId },
    });

    this.logger.log('All demo data deleted');
  }

  private async createSampleTransactions(
    categories: Category[],
    paymentMethods: PaymentMethod[],
  ): Promise<void> {
    const expenseCategories = categories.filter(
      (c) => c.type === OperationType.Outcome,
    );
    const incomeCategories = categories.filter(
      (c) => c.type === OperationType.Income,
    );

    const sampleTransactions = [
      // Last month - Income
      {
        amount: 2500,
        description: 'Monthly Salary',
        categoryId: incomeCategories[0]?.id.toString(),
        paymentMethodId: paymentMethods[0]?.id.toString(),
        operation: OperationType.Income,
        date: this.getDateDaysAgo(35),
      },
      // This month - Expenses
      {
        amount: -45.5,
        description: 'Grocery shopping',
        categoryId: expenseCategories[0]?.id.toString(),
        paymentMethodId: paymentMethods[0]?.id.toString(),
        operation: OperationType.Outcome,
        date: this.getDateDaysAgo(5),
      },
      {
        amount: -120,
        description: 'Restaurant dinner',
        categoryId: expenseCategories[1]?.id.toString(),
        paymentMethodId: paymentMethods[1]?.id.toString(),
        operation: OperationType.Outcome,
        date: this.getDateDaysAgo(3),
      },
      {
        amount: -30,
        description: 'Movie tickets',
        categoryId: expenseCategories[2]?.id.toString(),
        paymentMethodId: paymentMethods[0]?.id.toString(),
        operation: OperationType.Outcome,
        date: this.getDateDaysAgo(7),
      },
      {
        amount: -15.99,
        description: 'Netflix subscription',
        categoryId: expenseCategories[3]?.id.toString(),
        paymentMethodId: paymentMethods[0]?.id.toString(),
        operation: OperationType.Outcome,
        date: this.getDateDaysAgo(10),
      },
      // This month - Income
      {
        amount: 2500,
        description: 'Monthly Salary',
        categoryId: incomeCategories[0]?.id.toString(),
        paymentMethodId: paymentMethods[0]?.id.toString(),
        operation: OperationType.Income,
        date: this.getDateDaysAgo(2),
      },
      {
        amount: 150,
        description: 'Freelance project',
        categoryId: incomeCategories[1]?.id.toString(),
        paymentMethodId: paymentMethods[1]?.id.toString(),
        operation: OperationType.Income,
        date: this.getDateDaysAgo(1),
      },
      // More expenses
      {
        amount: -85,
        description: 'Gas station',
        categoryId: expenseCategories[4]?.id.toString(),
        paymentMethodId: paymentMethods[0]?.id.toString(),
        operation: OperationType.Outcome,
        date: this.getDateDaysAgo(4),
      },
      {
        amount: -200,
        description: 'Electric bill',
        categoryId: expenseCategories[5]?.id.toString(),
        paymentMethodId: paymentMethods[0]?.id.toString(),
        operation: OperationType.Outcome,
        date: this.getDateDaysAgo(6),
      },
      {
        amount: -75,
        description: 'Internet bill',
        categoryId: expenseCategories[5]?.id.toString(),
        paymentMethodId: paymentMethods[0]?.id.toString(),
        operation: OperationType.Outcome,
        date: this.getDateDaysAgo(6),
      },
    ];

    const promises = sampleTransactions
      .filter((t) => t.categoryId && t.paymentMethodId)
      .map((transaction) =>
        this.transactionsService.create(new Id(this.demoUserId), {
          id: new Id(),
          amount: transaction.amount,
          description: transaction.description,
          categoryId: transaction.categoryId,
          paymentMethodId: transaction.paymentMethodId,
          operation: transaction.operation,
          date: transaction.date as TimeString,
        }),
      );

    const results = await Promise.allSettled(promises);
    const successful = results.filter((r) => r.status === 'fulfilled').length;

    this.logger.log(`Created ${successful} sample transactions`);
  }

  private getDateDaysAgo(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
  }
}
