import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { LoginDto, RegisterDto } from './dto';
import { Response } from 'express';
import { AuthController } from './auth.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@src/users';
import { AuthenticatedRequest } from '@src/common/infrastructure';
import {
  InvalidCredentialsError,
  UserAlreadyExistsError,
  UserNotFoundError,
} from '@src/users/errors';
import { Id } from '@gualet/shared';
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
      loginDemo: jest.fn(),
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

  describe('loginDemo', () => {
    it('should login as demo user and set cookie', async () => {
      const access_token = 'demo-token';
      jest.mocked(authService.loginDemo).mockResolvedValue({ access_token });
      jest.mocked(configService.get).mockReturnValue('production');

      const result = await controller.loginDemo(response);

      expect(authService.loginDemo).toHaveBeenCalledTimes(1);
      expect(response.cookie).toHaveBeenCalledWith(
        'access_token',
        access_token,
        {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        },
      );
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result).toEqual({
        success: true,
        data: {
          user: {
            id: 'demo-user-id',
            email: 'demo@gualet.app',
          },
        },
        error: null,
        pagination: null,
      });
    });

    it('should set insecure cookie in development environment', async () => {
      const access_token = 'demo-token';
      jest.mocked(authService.loginDemo).mockResolvedValue({ access_token });
      jest.mocked(configService.get).mockReturnValue('development');

      await controller.loginDemo(response);

      expect(response.cookie).toHaveBeenCalledWith(
        'access_token',
        access_token,
        {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
        },
      );
    });

    it('should handle error during demo login', async () => {
      const error = new Error('Unexpected error');
      jest.mocked(authService.loginDemo).mockRejectedValue(error);

      await controller.loginDemo(response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle UserNotFoundError on login', async () => {
      const loginData: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password',
      };
      const error = new UserNotFoundError(new Id('nonexistent-id'));
      jest.mocked(authService.validateUser).mockRejectedValue(error);

      await controller.login(loginData, response);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.send).toHaveBeenCalled();
    });

    it('should handle InvalidCredentialsError on login', async () => {
      const loginData: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      const error = new InvalidCredentialsError();
      jest.mocked(authService.validateUser).mockRejectedValue(error);

      await controller.login(loginData, response);

      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.send).toHaveBeenCalled();
    });

    it('should handle generic error on login', async () => {
      const loginData: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const error = new Error('Unexpected error');
      jest.mocked(authService.validateUser).mockRejectedValue(error);

      await controller.login(loginData, response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalled();
    });

    it('should handle UserAlreadyExistsError on register', async () => {
      const registerData: RegisterDto = {
        email: 'existing@example.com',
        password: 'password',
      };
      const error = new UserAlreadyExistsError('existing@example.com');
      jest.mocked(authService.register).mockRejectedValue(error);

      await controller.register(registerData, response);

      expect(response.status).toHaveBeenCalledWith(409);
      expect(response.send).toHaveBeenCalled();
    });

    it('should handle generic error on register', async () => {
      const registerData: RegisterDto = {
        email: 'new@example.com',
        password: 'password',
      };
      const error = new Error('Unexpected error');
      jest.mocked(authService.register).mockRejectedValue(error);

      await controller.register(registerData, response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalled();
    });
  });
});
