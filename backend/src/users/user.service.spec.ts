import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './models';
import { UserMapper } from './mappers';
import { UserNotFoundError } from './errors';
import * as bcrypt from 'bcrypt';
import { buildUserEntity } from '@test/builders';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Id } from '@src/common/domain';
import { UserEntity } from '@src/db';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
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

  it('should create a new user', async () => {
    const hashedPassword = 'hashedPassword';
    const user = buildUserEntity();
    const userData = { email: user.email, password: user.password };
    // @ts-expect-error for some reason TypeScript doesn't recognize the mock
    jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);
    jest.spyOn(repository, 'create').mockReturnValue(user);
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
});
