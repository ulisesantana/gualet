import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPreferencesEntity } from '@src/db/entities';
import { UserPreferencesController } from './user-preferences.controller';
import { UserPreferencesService } from './user-preferences.service';
import { UserPreferencesRepository } from './user-preferences.repository';
import { PaymentMethodsModule } from '@src/payment-methods/payment-methods.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPreferencesEntity]),
    PaymentMethodsModule,
  ],
  controllers: [UserPreferencesController],
  providers: [UserPreferencesService, UserPreferencesRepository],
  exports: [UserPreferencesService],
})
export class UserPreferencesModule {}
