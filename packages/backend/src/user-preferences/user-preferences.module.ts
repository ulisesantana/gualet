import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPreferencesEntity } from '@src/db/entities';
import { UserPreferencesController } from './user-preferences.controller';
import { UserPreferencesService } from './user-preferences.service';
import { UserPreferencesRepository } from './user-preferences.repository';
import { UserPreferencesRepositoryFactory } from './user-preferences.repository.factory';
import { PaymentMethodsModule } from '@src/payment-methods/payment-methods.module';
import { DemoModule } from '@src/demo';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPreferencesEntity]),
    PaymentMethodsModule,
    DemoModule,
  ],
  controllers: [UserPreferencesController],
  providers: [
    UserPreferencesService,
    UserPreferencesRepository,
    UserPreferencesRepositoryFactory,
  ],
  exports: [UserPreferencesService, UserPreferencesRepositoryFactory],
})
export class UserPreferencesModule {}
