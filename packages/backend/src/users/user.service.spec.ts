import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './models';
import { UserMapper } from './mappers';
import { UserAlreadyExistsError, UserNotFoundError } from './errors';
import * as bcrypt from 'bcrypt';
import { buildUserEntity } from '@test/builders';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Id } from '@gualet/shared';
import { UserEntity } from '@src/db';
import { CategoriesService } from '@src/categories';
import { PaymentMethodsService } from '@src/payment-methods';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;
  const mockCategoriesService = {
    createDefaultCategories: jest.fn().mockResolvedValue([]),
  };
  const mockPaymentMethodsService = {
    createDefaultPaymentMethods: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
        {
          provide: PaymentMethodsService,
          useValue: mockPaymentMethodsService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find user by id', async () => {
    const user = buildUserEntity({ id: '1' });
    jest.spyOn(repository, 'findOne').mockResolvedValue(user);

    const result = await service.findById(new Id('1'));

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(result).toEqual(UserService.mapToDomain(user));
  });

  it('should throw UserNotFoundError if user not found by id', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.findById(new Id('1'))).rejects.toThrow(
      UserNotFoundError,
    );
  });

  it('should find user by email with password', async () => {
    const user = buildUserEntity();
    jest.spyOn(repository, 'findOne').mockResolvedValue(user);

    const result = await service.findByEmailWithPassword(user.email);

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { email: user.email },
    });
    expect(result).toEqual(UserMapper.toUserWithPassword(user));
  });

  it('should throw error if user not found by email', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(
      service.findByEmailWithPassword('test@example.com'),
    ).rejects.toThrow('User not found');
  });

  describe('should create a new user', () => {
    it('successfully', async () => {
      const hashedPassword = 'hashedPassword';
      const user = buildUserEntity();
      const userData = { email: user.email, password: user.password };
      // @ts-expect-error for some reason TypeScript doesn't recognize the mock
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      const result = await service.create(userData);

      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...new User(user).toJSON(),
          id: expect.any(String),
          password: hashedPassword,
        }),
      );
      expect(result).toEqual(UserService.mapToDomain(user));
    });

    it('creating default categories for the user', async () => {
      const user = buildUserEntity();
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      await service.create({ email: user.email, password: user.password });

      expect(
        mockCategoriesService.createDefaultCategories,
      ).toHaveBeenCalledTimes(1);
    });

    it('creating default payment methods for the user', async () => {
      const user = buildUserEntity();
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      await service.create({ email: user.email, password: user.password });

      expect(
        mockPaymentMethodsService.createDefaultPaymentMethods,
      ).toHaveBeenCalledTimes(1);
    });

    it('throw error if user already exists', async () => {
      const user = buildUserEntity();
      const userData = { email: user.email, password: user.password };
      jest.spyOn(repository, 'findOne').mockResolvedValue({} as UserEntity);

      await expect(service.create(userData)).rejects.toThrow(
        new UserAlreadyExistsError(user.email),
      );
    });
  });
});
