import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreferencesRepository } from './user-preferences.repository';
import { UserPreferencesEntity } from '@src/db/entities';
import { Id } from '@gualet/shared';
import { buildPaymentMethodEntity, buildUserEntity } from '@test/builders';

describe('UserPreferencesRepository', () => {
  let repository: UserPreferencesRepository;
  let mockRepository: jest.Mocked<Repository<UserPreferencesEntity>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserPreferencesRepository,
        {
          provide: getRepositoryToken(UserPreferencesEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = moduleRef.get<UserPreferencesRepository>(
      UserPreferencesRepository,
    );
    mockRepository = moduleRef.get(getRepositoryToken(UserPreferencesEntity));
  });

  describe('findByUserId', () => {
    it('should return user preferences when they exist', async () => {
      const userId = new Id('user-123');
      const paymentMethod = buildPaymentMethodEntity({ id: 'pm-123' });
      const mockEntity: UserPreferencesEntity = {
        userId: userId.value,
        user: buildUserEntity({ id: userId.value }),
        defaultPaymentMethodId: paymentMethod.id,
        defaultPaymentMethod: paymentMethod,
        language: 'en',
        createdAt: new Date().toISOString() as any,
        updatedAt: new Date().toISOString() as any,
      };

      mockRepository.findOne.mockResolvedValue(mockEntity);

      const result = await repository.findByUserId(userId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { userId: userId.value },
        relations: ['defaultPaymentMethod'],
      });
      expect(result).not.toBeNull();
      expect(result?.userId).toEqual(userId);
      expect(result?.defaultPaymentMethod.id.value).toEqual(paymentMethod.id);
      expect(result?.defaultPaymentMethod.name).toEqual(paymentMethod.name);
    });

    it('should return null when user preferences do not exist', async () => {
      const userId = new Id('user-123');

      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.findByUserId(userId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { userId: userId.value },
        relations: ['defaultPaymentMethod'],
      });
      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should update existing user preferences', async () => {
      const userId = new Id('user-123');
      const paymentMethodId = new Id('pm-123');
      const paymentMethod = buildPaymentMethodEntity({
        id: paymentMethodId.value,
      });
      const existingEntity: UserPreferencesEntity = {
        userId: userId.value,
        user: buildUserEntity({ id: userId.value }),
        defaultPaymentMethodId: 'old-pm-id',
        defaultPaymentMethod: buildPaymentMethodEntity({ id: 'old-pm-id' }),
        language: 'en',
        createdAt: new Date().toISOString() as any,
        updatedAt: new Date().toISOString() as any,
      };

      const updatedEntity: UserPreferencesEntity = {
        ...existingEntity,
        defaultPaymentMethodId: paymentMethodId.value,
        defaultPaymentMethod: paymentMethod,
      };

      mockRepository.findOne
        .mockResolvedValueOnce(existingEntity)
        .mockResolvedValueOnce(updatedEntity);
      mockRepository.save.mockResolvedValue(updatedEntity);

      const result = await repository.save(userId, paymentMethodId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { userId: userId.value },
      });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...existingEntity,
        defaultPaymentMethodId: paymentMethodId.value,
      });
      expect(result.userId).toEqual(userId);
      expect(result.defaultPaymentMethod.id).toEqual(paymentMethodId);
    });

    it('should create new user preferences when none exist', async () => {
      const userId = new Id('user-123');
      const paymentMethodId = new Id('pm-123');
      const paymentMethod = buildPaymentMethodEntity({
        id: paymentMethodId.value,
      });

      const newEntity: UserPreferencesEntity = {
        userId: userId.value,
        user: buildUserEntity({ id: userId.value }),
        defaultPaymentMethodId: paymentMethodId.value,
        defaultPaymentMethod: paymentMethod,
        language: 'en',
        createdAt: new Date().toISOString() as any,
        updatedAt: new Date().toISOString() as any,
      };

      mockRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(newEntity);
      mockRepository.save.mockResolvedValue(newEntity);

      const result = await repository.save(userId, paymentMethodId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { userId: userId.value },
      });
      expect(mockRepository.save).toHaveBeenCalledWith({
        userId: userId.value,
        defaultPaymentMethodId: paymentMethodId.value,
      });
      expect(result.userId).toEqual(userId);
      expect(result.defaultPaymentMethod.id).toEqual(paymentMethodId);
    });

    it('should throw error when save fails', async () => {
      const userId = new Id('user-123');
      const paymentMethodId = new Id('pm-123');

      mockRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      mockRepository.save.mockResolvedValue({
        userId: userId.value,
        defaultPaymentMethodId: paymentMethodId.value,
      } as UserPreferencesEntity);

      await expect(repository.save(userId, paymentMethodId)).rejects.toThrow(
        `Failed to save user preferences for user ${userId.toString()}`,
      );
    });
  });
});
