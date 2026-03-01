import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  InvalidCredentialsError,
  User,
  UserService,
  UserWithPassword,
} from '@src/users';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UserService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    usersService = {
      create: jest.fn(),
      findByEmailWithPassword: jest.fn(),
    } as unknown as jest.Mocked<UserService>;
    jwtService = { signAsync: jest.fn() } as unknown as jest.Mocked<JwtService>;
    configService = { get: jest.fn() } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should register a new user', async () => {
    const registerData = { email: 'new@example.com', password: 'password' };
    const newUser = new User({ id: '2', email: 'new@example.com' });
    jest.mocked(usersService.create).mockResolvedValue(newUser);

    const result = await service.register(registerData);

    expect(usersService.create).toHaveBeenCalledWith(registerData);
    expect(result).toBe(newUser);
  });

  it('should validate user with correct credentials', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const user = new UserWithPassword({
      id: '1',
      email,
      password: await bcrypt.hash(password, 10),
    });
    jest.mocked(usersService.findByEmailWithPassword).mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

    const result = await service.validateUser(email, password);

    expect(usersService.findByEmailWithPassword).toHaveBeenCalledWith(email);
    expect(result).toEqual(UserService.mapToDomain(user));
  });

  it('should throw InvalidCredentialsError with incorrect credentials', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const user = new UserWithPassword({
      id: '1',
      email,
      password: await bcrypt.hash('wrongpassword', 10),
    });
    jest.mocked(usersService.findByEmailWithPassword).mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

    await expect(service.validateUser(email, password)).rejects.toThrow(
      InvalidCredentialsError,
    );
  });

  it('should login and return access token', async () => {
    const user = { id: '1', email: 'test@example.com' };
    const access_token = 'token';
    jest.mocked(jwtService.signAsync).mockResolvedValue(access_token);
    jest.mocked(configService.get).mockReturnValue('secret');

    const result = await service.login(user);

    expect(jwtService.signAsync).toHaveBeenCalledWith(
      { sub: user.id, email: user.email },
      { secret: 'secret', expiresIn: '1w' },
    );
    expect(result).toEqual({ access_token });
  });

  it('should login demo and return access token with isDemo flag', async () => {
    const access_token = 'demo-token';
    jest.mocked(jwtService.signAsync).mockResolvedValue(access_token);
    jest.mocked(configService.get).mockReturnValue('secret');

    const result = await service.loginDemo();

    expect(jwtService.signAsync).toHaveBeenCalledWith(
      { sub: 'demo-user-id', email: 'demo@gualet.app', isDemo: true },
      { secret: 'secret', expiresIn: '1w' },
    );
    expect(result).toEqual({ access_token });
  });
});
