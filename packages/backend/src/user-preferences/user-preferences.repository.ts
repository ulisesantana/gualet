import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Id, Nullable, PaymentMethod } from '@gualet/shared';
import { UserPreferencesEntity } from '@src/db/entities';
import { UserPreferences } from './user-preferences.model';

@Injectable()
export class UserPreferencesRepository {
  constructor(
    @InjectRepository(UserPreferencesEntity)
    private readonly repository: Repository<UserPreferencesEntity>,
  ) {}

  async findByUserId(userId: Id): Promise<Nullable<UserPreferences>> {
    const entity = await this.repository.findOne({
      where: { userId: userId.value },
      relations: ['defaultPaymentMethod'],
    });

    if (!entity) {
      return null;
    }

    return new UserPreferences(
      userId,
      new PaymentMethod({
        id: new Id(entity.defaultPaymentMethod.id),
        name: entity.defaultPaymentMethod.name,
        icon: entity.defaultPaymentMethod.icon,
        color: entity.defaultPaymentMethod.color,
      }),
      entity.language as 'en' | 'es',
    );
  }

  async save(
    userId: Id,
    defaultPaymentMethodId: Id,
    language?: string,
  ): Promise<UserPreferences> {
    const existing = await this.repository.findOne({
      where: { userId: userId.value },
    });

    if (existing) {
      existing.defaultPaymentMethodId = defaultPaymentMethodId.value;
      if (language) {
        existing.language = language;
      }
      await this.repository.save(existing);
    } else {
      await this.repository.save({
        userId: userId.value,
        defaultPaymentMethodId: defaultPaymentMethodId.value,
        language: language || 'en',
      });
    }

    const saved = await this.findByUserId(userId);
    if (!saved) {
      throw new Error(
        `Failed to save user preferences for user ${userId.toString()}`,
      );
    }

    return saved;
  }
}
