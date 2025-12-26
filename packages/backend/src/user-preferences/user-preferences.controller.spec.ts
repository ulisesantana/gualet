import { Test, TestingModule } from '@nestjs/testing';
import { UserPreferencesController } from './user-preferences.controller';
import { UserPreferencesService } from './user-preferences.service';
import { buildPaymentMethod } from '@test/builders';
import { Id } from '@gualet/shared';
import { AuthenticatedRequest } from '@src/common/infrastructure';
import { Response } from 'express';
import { UserPreferences } from './user-preferences.model';
import Mocked = jest.Mocked;

describe('UserPreferencesController', () => {
  let controller: UserPreferencesController;
  let service: UserPreferencesService;
  let res: Mocked<Response>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPreferencesController],
      providers: [
        {
          provide: UserPreferencesService,
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserPreferencesController>(
      UserPreferencesController,
    );
    service = module.get<UserPreferencesService>(UserPreferencesService);
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Mocked<Response>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    it('should return user preferences successfully', async () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const paymentMethod = buildPaymentMethod();
      const preferences = new UserPreferences(new Id('1'), paymentMethod);

      jest.spyOn(service, 'find').mockResolvedValue(preferences);

      await controller.find(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          preferences: {
            defaultPaymentMethod: {
              id: paymentMethod.id.value,
              name: paymentMethod.name,
              icon: paymentMethod.icon ?? '',
              color: paymentMethod.color ?? '',
            },
          },
        },
      });
      expect(service.find).toHaveBeenCalledWith(new Id('1'));
    });

    it('should handle errors when fetching preferences', async () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const error = new Error('Database error');

      jest.spyOn(service, 'find').mockRejectedValue(error);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await controller.find(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch user preferences',
        },
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching user preferences:',
        error,
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle payment methods with undefined icon and color', async () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const paymentMethod = buildPaymentMethod();
      const preferences = new UserPreferences(new Id('1'), paymentMethod);
      // Mock the preferences to return undefined for icon and color
      Object.defineProperty(paymentMethod, 'icon', {
        value: undefined,
        writable: false,
      });
      Object.defineProperty(paymentMethod, 'color', {
        value: undefined,
        writable: false,
      });

      jest.spyOn(service, 'find').mockResolvedValue(preferences);

      await controller.find(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          preferences: {
            defaultPaymentMethod: {
              id: paymentMethod.id.value,
              name: paymentMethod.name,
              icon: '',
              color: '',
            },
          },
        },
      });
    });

    it('should return null when no preferences are available', async () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;

      jest.spyOn(service, 'find').mockResolvedValue(null);

      await controller.find(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          preferences: null,
        },
      });
      expect(service.find).toHaveBeenCalledWith(new Id('1'));
    });
  });

  describe('save', () => {
    it('should save user preferences successfully', async () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const paymentMethod = buildPaymentMethod({ id: 'pm-123' });
      const preferences = new UserPreferences(new Id('1'), paymentMethod);
      const dto = { defaultPaymentMethodId: 'pm-123' };

      jest.spyOn(service, 'save').mockResolvedValue(preferences);

      await controller.save(dto, req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          preferences: {
            defaultPaymentMethod: {
              id: paymentMethod.id.value,
              name: paymentMethod.name,
              icon: paymentMethod.icon ?? '',
              color: paymentMethod.color ?? '',
            },
          },
        },
      });
      expect(service.save).toHaveBeenCalledWith(new Id('1'), new Id('pm-123'));
    });

    it('should handle errors when saving preferences', async () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const dto = { defaultPaymentMethodId: 'pm-123' };
      const error = new Error('Payment method not found');

      jest.spyOn(service, 'save').mockRejectedValue(error);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await controller.save(dto, req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to save user preferences',
        },
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error saving user preferences:',
        error,
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle payment methods with undefined icon and color when saving', async () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const paymentMethod = buildPaymentMethod({ id: 'pm-123' });
      const preferences = new UserPreferences(new Id('1'), paymentMethod);
      // Mock the preferences to return undefined for icon and color
      Object.defineProperty(paymentMethod, 'icon', {
        value: undefined,
        writable: false,
      });
      Object.defineProperty(paymentMethod, 'color', {
        value: undefined,
        writable: false,
      });
      const dto = { defaultPaymentMethodId: 'pm-123' };

      jest.spyOn(service, 'save').mockResolvedValue(preferences);

      await controller.save(dto, req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          preferences: {
            defaultPaymentMethod: {
              id: paymentMethod.id.value,
              name: paymentMethod.name,
              icon: '',
              color: '',
            },
          },
        },
      });
    });
  });
});
