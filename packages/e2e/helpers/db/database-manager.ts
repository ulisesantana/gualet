import {Pool} from 'pg';
import {generateRandomId} from '../generate-random-id';
import bcrypt from 'bcrypt';
import {configDotenv} from 'dotenv';
import {resolve} from 'path';

configDotenv({
  path: resolve(__dirname, '../../../../.env.e2e'),
});

interface User {
  id?: string;
  email: string;
  password: string;
}

interface Category {
  id?: string;
  userId: string;
  name: string;
  type: 'INCOME' | 'OUTCOME';
  icon?: string;
  color?: string;
}

interface PaymentMethod {
  id?: string;
  userId: string;
  name: string;
  icon?: string;
  color?: string;
}

export class DatabaseManager {
  private constructor(public readonly pool: Pool) {}

  static async create() {
    const pool = new Pool({
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    });
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
    const db = new DatabaseManager(pool);
    await db.reset();
    return db;
  }

  async createUser(user: User): Promise<string> {
    const userId = user.id || generateRandomId();
    const hash = await bcrypt.hash(user.password, 10);
    const query = `
      INSERT INTO users (id, email, password)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    const values = [userId, user.email, hash];
    await this.pool.query(query, values);
    return userId;
  }

  async createCategory(category: Category): Promise<string> {
    const categoryId = category.id || generateRandomId();
    const query = `
      INSERT INTO categories (id, "userId", name, type, icon, color)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    const values = [
      categoryId,
      category.userId,
      category.name,
      category.type,
      category.icon || null,
      category.color || null,
    ];
    await this.pool.query(query, values);
    return categoryId;
  }

  async createPaymentMethod(paymentMethod: PaymentMethod): Promise<string> {
    const pmId = paymentMethod.id || generateRandomId();
    const query = `
      INSERT INTO payment_methods (id, "userId", name, icon, color)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const values = [
      pmId,
      paymentMethod.userId,
      paymentMethod.name,
      paymentMethod.icon || null,
      paymentMethod.color || null,
    ];
    await this.pool.query(query, values);
    return pmId;
  }

  async createTransaction(transaction: {
    userId: string;
    categoryId: string;
    paymentMethodId: string;
    amount: number;
    description: string;
    operation: 'INCOME' | 'OUTCOME';
    date: string;
  }): Promise<string> {
    const txId = generateRandomId();
    const query = `
      INSERT INTO transactions (id, "userId", "categoryId", "paymentMethodId", amount, description, operation, date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;
    const values = [
      txId,
      transaction.userId,
      transaction.categoryId,
      transaction.paymentMethodId,
      transaction.amount,
      transaction.description,
      transaction.operation,
      transaction.date,
    ];
    await this.pool.query(query, values);
    return txId;
  }


  async reset(): Promise<void> {
    // Delete all data respecting foreign key constraints
    await this.pool.query('DELETE FROM transactions');
    await this.pool.query('DELETE FROM categories');
    await this.pool.query('DELETE FROM payment_methods');
    await this.pool.query('DELETE FROM user_preferences');
    await this.pool.query('DELETE FROM users');
  }

  // ===== Helper methods for test verification =====

  /**
   * Get a category by name and userId
   */
  async getCategoryByName(userId: string, name: string): Promise<any | null> {
    const result = await this.pool.query(
      'SELECT * FROM categories WHERE "userId" = $1 AND name = $2',
      [userId, name]
    );
    return result.rows[0] || null;
  }

  /**
   * Get all categories for a user
   */
  async getUserCategories(userId: string): Promise<any[]> {
    const result = await this.pool.query(
      'SELECT * FROM categories WHERE "userId" = $1 ORDER BY type, name',
      [userId]
    );
    return result.rows;
  }

  /**
   * Count categories for a user
   */
  async countUserCategories(userId: string): Promise<number> {
    const result = await this.pool.query(
      'SELECT COUNT(*) as count FROM categories WHERE "userId" = $1',
      [userId]
    );
    return parseInt(result.rows[0].count, 10);
  }

  /**
   * Verify if a category exists
   */
  async categoryExists(userId: string, name: string, type?: 'INCOME' | 'OUTCOME'): Promise<boolean> {
    let query = 'SELECT id FROM categories WHERE "userId" = $1 AND name = $2';
    const params: any[] = [userId, name];

    if (type) {
      query += ' AND type = $3';
      params.push(type);
    }

    const result = await this.pool.query(query, params);
    return result.rows.length > 0;
  }

  /**
   * Get a payment method by name and userId
   */
  async getPaymentMethodByName(userId: string, name: string): Promise<any | null> {
    const result = await this.pool.query(
      'SELECT * FROM payment_methods WHERE "userId" = $1 AND name = $2',
      [userId, name]
    );
    return result.rows[0] || null;
  }

  /**
   * Get all payment methods for a user
   */
  async getUserPaymentMethods(userId: string): Promise<any[]> {
    const result = await this.pool.query(
      'SELECT * FROM payment_methods WHERE "userId" = $1 ORDER BY name',
      [userId]
    );
    return result.rows;
  }

  /**
   * Get all transactions for a user
   */
  async getUserTransactions(userId: string): Promise<any[]> {
    const result = await this.pool.query(
      'SELECT * FROM transactions WHERE "userId" = $1 ORDER BY date DESC',
      [userId]
    );
    return result.rows;
  }

  /**
   * Count transactions for a user
   */
  async countUserTransactions(userId: string): Promise<number> {
    const result = await this.pool.query(
      'SELECT COUNT(*) as count FROM transactions WHERE "userId" = $1',
      [userId]
    );
    return parseInt(result.rows[0].count, 10);
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
