import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';
import { CategoriesRepositoryFactory } from './categories.repository.factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity, TransactionEntity } from '@src/db';
import { DemoModule } from '@src/demo';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, TransactionEntity]),
    DemoModule,
  ],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    CategoriesRepository,
    CategoriesRepositoryFactory,
  ],
  exports: [
    TypeOrmModule,
    CategoriesRepository,
    CategoriesService,
    CategoriesRepositoryFactory,
  ],
})
export class CategoriesModule {}
