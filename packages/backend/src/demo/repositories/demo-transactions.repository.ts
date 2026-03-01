import { Injectable } from '@nestjs/common';
import { Id, TimeString } from '@gualet/shared';
import { Transaction } from '@src/transactions/transaction.model';
import { DemoService } from '../demo.service';
import { TransactionNotFoundError } from '@src/transactions/errors';
import { FindTransactionsCriteria } from '@src/transactions/dto';
import { TransactionToCreate } from '@src/transactions/transactions.service';
import { Pagination } from '@src/common/infrastructure';
import { CategoryNotFoundError } from '@src/categories/errors';
import { PaymentMethodNotFoundError } from '@src/payment-methods/errors';
import { DemoTransactionData } from '../demo-data.seed';

type TransactionPayload = TransactionToCreate & { id: Id };

@Injectable()
export class DemoTransactionsRepository {
  constructor(private readonly demoService: DemoService) {}

  async create(
    userId: Id,
    transaction: TransactionPayload,
  ): Promise<Transaction> {
    await this.validateTransactionRelationship(userId, transaction);

    const transactions = this.demoService.getTransactions();

    const newTxData: DemoTransactionData = {
      id: transaction.id.toString(),
      amount: transaction.amount,
      description: transaction.description || '',
      date: transaction.date,
      operation: transaction.operation,
      categoryId: transaction.categoryId,
      paymentMethodId: transaction.paymentMethodId,
    };

    transactions.set(transaction.id.toString(), newTxData);
    return this.findById(userId, transaction.id);
  }

  async findById(userId: Id, id: Id): Promise<Transaction> {
    const transactions = this.demoService.getTransactions();
    const txData = transactions.get(id.toString());

    if (!txData) {
      throw new TransactionNotFoundError(id);
    }

    return this.mapToTransaction(txData);
  }

  async find(
    userId: Id,
    criteria: FindTransactionsCriteria & {
      sort: 'asc' | 'desc';
      page: number;
      pageSize: number;
    },
  ): Promise<{ pagination: Pagination; transactions: Transaction[] }> {
    const transactions = this.demoService.getTransactions();
    let filteredData = Array.from(transactions.values());

    // Apply filters
    const {
      from,
      to,
      categoryId,
      paymentMethodId,
      operation,
      sort,
      page,
      pageSize,
    } = criteria;

    if (categoryId) {
      filteredData = filteredData.filter((tx) => tx.categoryId === categoryId);
    }

    if (paymentMethodId) {
      filteredData = filteredData.filter(
        (tx) => tx.paymentMethodId === paymentMethodId,
      );
    }

    if (operation) {
      filteredData = filteredData.filter((tx) => tx.operation === operation);
    }

    if (from && !to) {
      const fromDate = new Date(from);
      filteredData = filteredData.filter((tx) => new Date(tx.date) >= fromDate);
    }

    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      filteredData = filteredData.filter(
        (tx) => new Date(tx.date) >= fromDate && new Date(tx.date) <= toDate,
      );
    }

    if (!from && to) {
      const toDate = new Date(to);
      filteredData = filteredData.filter((tx) => new Date(tx.date) <= toDate);
    }

    // Sort by date
    filteredData.sort((a, b) => {
      const dateComparison =
        new Date(a.date).getTime() - new Date(b.date).getTime();
      return sort === 'asc' ? dateComparison : -dateComparison;
    });

    // Handle pagination
    if (pageSize === 0) {
      return {
        pagination: new Pagination({
          total: filteredData.length,
          page: 1,
          pageSize: filteredData.length,
        }),
        transactions: filteredData.map((data) => this.mapToTransaction(data)),
      };
    }

    const skip = (page - 1) * pageSize;
    const paginatedData = filteredData.slice(skip, skip + pageSize);

    return {
      pagination: new Pagination({
        total: filteredData.length,
        page,
        pageSize,
      }),
      transactions: paginatedData.map((data) => this.mapToTransaction(data)),
    };
  }

  async update(
    userId: Id,
    transaction: TransactionPayload,
  ): Promise<Transaction> {
    const transactions = this.demoService.getTransactions();
    const existingTxData = transactions.get(transaction.id.toString());

    if (!existingTxData) {
      throw new TransactionNotFoundError(transaction.id);
    }

    await this.validateTransactionRelationship(userId, transaction);

    const updatedTxData: DemoTransactionData = {
      id: transaction.id.toString(),
      amount: transaction.amount,
      description: transaction.description || '',
      date: transaction.date,
      operation: transaction.operation,
      categoryId: transaction.categoryId,
      paymentMethodId: transaction.paymentMethodId,
    };

    transactions.set(transaction.id.toString(), updatedTxData);
    return this.mapToTransaction(updatedTxData);
  }

  async delete(userId: Id, transactionId: Id): Promise<void> {
    const transactions = this.demoService.getTransactions();
    const existingTxData = transactions.get(transactionId.toString());

    if (!existingTxData) {
      throw new TransactionNotFoundError(transactionId);
    }

    transactions.delete(transactionId.toString());
  }

  private mapToTransaction(data: DemoTransactionData): Transaction {
    const categories = this.demoService.getCategories();
    const paymentMethods = this.demoService.getPaymentMethods();

    const category = categories.get(data.categoryId);
    const paymentMethod = paymentMethods.get(data.paymentMethodId);

    if (!category || !paymentMethod) {
      throw new Error(
        'Invalid transaction data: missing category or payment method',
      );
    }

    return new Transaction({
      id: data.id,
      amount: data.amount,
      description: data.description,
      date: data.date as TimeString,
      operation: data.operation,
      category,
      paymentMethod,
    });
  }

  private async validateTransactionRelationship(
    userId: Id,
    transaction: TransactionPayload,
  ): Promise<void> {
    const categories = this.demoService.getCategories();
    const paymentMethods = this.demoService.getPaymentMethods();

    const category = categories.get(transaction.categoryId);
    if (!category) {
      throw new CategoryNotFoundError(new Id(transaction.categoryId));
    }

    const paymentMethod = paymentMethods.get(transaction.paymentMethodId);
    if (!paymentMethod) {
      throw new PaymentMethodNotFoundError(new Id(transaction.paymentMethodId));
    }
  }
}
