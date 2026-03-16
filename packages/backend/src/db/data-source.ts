import { configDotenv } from 'dotenv';
import { DataSource } from 'typeorm';
import { resolve } from 'node:path';
import 'tsconfig-paths/register';
import {
  CategoryEntity,
  PaymentMethodEntity,
  TransactionEntity,
  UserEntity,
} from '@src/db/entities';

const envFilePath = resolve(
  __dirname,
  `../../../../${process.env.ENV_FILE || '.env'}`,
);
configDotenv({
  path: envFilePath,
});

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [
    UserEntity,
    CategoryEntity,
    PaymentMethodEntity,
    TransactionEntity,
  ],
  migrations: [
    process.env.NODE_ENV === 'production'
      ? `${__dirname}/../migrations/*.js`
      : 'src/migrations/*.ts',
  ],
  synchronize: process.env.NODE_ENV === 'development',
});
