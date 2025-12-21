import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity, TransactionEntity } from '@src/db';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, TransactionEntity])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
  exports: [TypeOrmModule, CategoriesRepository, CategoriesService],
})
export class CategoriesModule {}
