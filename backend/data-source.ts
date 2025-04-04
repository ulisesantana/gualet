// data-source.ts
import { configDotenv } from 'dotenv';
import { DataSource } from 'typeorm';
import { UserEntity } from '@src/users';
import { CategoryEntity } from '@src/categories';
import { PaymentMethodEntity } from '@src/payment-methods';
import { TransactionEntity } from '@src/transactions';

configDotenv({
  path: '../.env',
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
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
