import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { LoginDto, RegisterDto } from './dto';
import { Response } from 'express';
import { AuthController } from './auth.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@src/users';
import { AuthenticatedRequest } from '@src/common/infrastructure';
import Mocked = jest.Mocked;

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let configService: ConfigService;
  let response: Mocked<Response>;

  beforeEach(async () => {
    authService = {
      validateUser: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
    } as any;
    configService = { get: jest.fn() } as any;
    response = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Mocked<Response>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login and set cookie', async () => {
    const loginData: LoginDto = {
      email: 'test@example.com',
      password: 'password',
    };
    const user = new User({ email: 'test@example.com' });
    const access_token = 'token';
    jest.mocked(authService.validateUser).mockResolvedValue(user);
    jest.mocked(authService.login).mockResolvedValue({ access_token });
    jest.mocked(configService.get).mockReturnValue('production');

    const result = await controller.login(loginData, response);

    expect(authService.validateUser).toHaveBeenCalledWith(
      loginData.email,
      loginData.password,
    );
    expect(authService.login).toHaveBeenCalledWith(user.toJSON());
    expect(response.cookie).toHaveBeenCalledWith('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    expect(response.status).toHaveBeenCalledWith(200);
    expect(result).toEqual({
      success: true,
      data: { user: user.toJSON() },
      error: null,
      pagination: null,
    });
  });

  it('should register a new user', async () => {
    const registerData: RegisterDto = {
      email: 'new@example.com',
      password: 'password',
    };
    const newUser = new User({ email: 'new@example.com' });
    jest.mocked(authService.register).mockResolvedValue(newUser);
    jest.mocked(authService.login).mockResolvedValue({ access_token: 't0k3n' });

    const result = await controller.register(registerData, response);

    expect(authService.register).toHaveBeenCalledWith(registerData);
    expect(response.cookie).toHaveBeenCalledWith('access_token', 't0k3n', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    expect(response.status).toHaveBeenCalledWith(200);
    expect(result).toEqual({
      success: true,
      data: { user: newUser.toJSON() },
      error: null,
      pagination: null,
    });
  });

  it('should clear cookie on logout', () => {
    controller.logout(response);

    expect(response.clearCookie).toHaveBeenCalledWith('access_token');
  });

  it('should verify user and return user response', async () => {
    const request = {
      user: {
        userId: '123',
        email: 'test@test.com',
      },
    } as AuthenticatedRequest;

    const result = controller.verify(request);

    expect(result).toMatchObject({
      success: true,
      data: {
        user: {
          id: request.user.userId,
          email: request.user.email,
        },
      },
      error: null,
      pagination: null,
    });
  });
});
