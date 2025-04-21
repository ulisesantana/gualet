import {Pool} from "pg";
import {generateRandomId} from "../generate-random-id";
import bcrypt from "bcrypt";
import {configDotenv} from "dotenv";
import {resolve} from "path";

configDotenv({
  path: resolve(__dirname, '../../../.env.e2e'),
})

interface User {
  id?: string;
  email: string;
  password: string;
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
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    const db = new DatabaseManager(pool);
    await db.reset()
    return db
  }

  async createUser(user: User): Promise<void> {
    const hash = await bcrypt.hash(user.password, 10);
    const query = `
      INSERT INTO users (id, email, password)
      VALUES ($1, $2, $3)
    `;
    const values = [user.id || generateRandomId(), user.email, hash];
    await this.pool.query(query, values);
  }

  async reset() {
    await this.pool.query(`DELETE FROM users`);
  }
}
