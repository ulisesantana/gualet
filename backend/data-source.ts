// data-source.ts
import { configDotenv } from 'dotenv';
import { DataSource } from 'typeorm';
import { UserEntity } from './src/users/entities';

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
  entities: [UserEntity],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
