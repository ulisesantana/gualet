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
  private constructor(private readonly pool: Pool) {}

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

  async getUserByEmail(email: string): Promise<User | null> {
    const query = `SELECT id, email, password FROM users WHERE email = $1`;
    const result = await this.pool.query(query, [email]);
    return result.rows[0] || null;
  }

  async cleanupUserData(userId: string): Promise<void> {
    // Delete in order to respect foreign key constraints
    await this.pool.query('DELETE FROM transactions WHERE "userId" = $1', [
      userId,
    ]);
    await this.pool.query('DELETE FROM categories WHERE "userId" = $1', [
      userId,
    ]);
    await this.pool.query('DELETE FROM payment_methods WHERE "userId" = $1', [
      userId,
    ]);
    await this.pool.query('DELETE FROM user_preferences WHERE "userId" = $1', [
      userId,
    ]);
  }

  async reset(): Promise<void> {
    // Delete all data respecting foreign key constraints
    await this.pool.query('DELETE FROM transactions');
    await this.pool.query('DELETE FROM categories');
    await this.pool.query('DELETE FROM payment_methods');
    await this.pool.query('DELETE FROM user_preferences');
    await this.pool.query('DELETE FROM users');
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
