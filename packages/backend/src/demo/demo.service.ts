import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  DEMO_CATEGORIES,
  DEMO_PAYMENT_METHODS,
  DEMO_TRANSACTIONS,
  DemoTransactionData,
} from './demo-data.seed';
import { Category, PaymentMethod } from '@gualet/shared';

@Injectable()
export class DemoService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DemoService.name);
  private readonly resetInterval: number = 30 * 60 * 1000; // 30 minutes
  private resetTimer: NodeJS.Timeout | null = null;

  private categories: Map<string, Category>;
  private paymentMethods: Map<string, PaymentMethod>;
  private transactions: Map<string, DemoTransactionData>;

  onModuleInit() {
    this.logger.log('Initializing demo service');
    this.initializeDemoData();
    this.scheduleReset();
  }

  onModuleDestroy() {
    if (this.resetTimer) {
      clearInterval(this.resetTimer);
      this.resetTimer = null;
      this.logger.log('Demo service reset timer cleared');
    }
  }

  getCategories(): Map<string, Category> {
    return this.categories;
  }

  getPaymentMethods(): Map<string, PaymentMethod> {
    return this.paymentMethods;
  }

  getTransactions(): Map<string, DemoTransactionData> {
    return this.transactions;
  }

  getLastResetTime(): Date {
    return new Date(Date.now() - (Date.now() % this.resetInterval));
  }

  getNextResetTime(): Date {
    return new Date(this.getLastResetTime().getTime() + this.resetInterval);
  }

  private scheduleReset() {
    if (this.resetTimer) {
      clearInterval(this.resetTimer);
    }

    this.resetTimer = setInterval(() => {
      this.logger.log('Resetting demo data');
      this.initializeDemoData();
    }, this.resetInterval);

    if (this.resetTimer && typeof this.resetTimer.unref === 'function') {
      this.resetTimer.unref();
    }
  }

  private initializeDemoData() {
    this.categories = new Map();
    DEMO_CATEGORIES.forEach((category) => {
      this.categories.set(category.id.toString(), category);
    });

    this.paymentMethods = new Map();
    DEMO_PAYMENT_METHODS.forEach((pm) => {
      this.paymentMethods.set(pm.id.toString(), pm);
    });

    this.transactions = new Map();
    DEMO_TRANSACTIONS.forEach((tx) => {
      this.transactions.set(tx.id, tx);
    });

    this.logger.log(
      `Demo data initialized: ${this.categories.size} categories, ${this.paymentMethods.size} payment methods, ${this.transactions.size} transactions`,
    );
  }
}
