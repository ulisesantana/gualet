import { Body, Controller, Get, Logger, Put, Req, Res } from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { Id } from '@gualet/shared';
import {
  AuthenticatedRequest,
  SecureController,
} from '@src/common/infrastructure';
import { UserPreferencesDto } from './dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

interface UserPreferencesResponse {
  success: boolean;
  data: {
    preferences: {
      defaultPaymentMethod: {
        id: string;
        name: string;
        icon: string;
        color: string;
      };
      language: string;
    };
  };
}

@ApiTags('User Preferences')
@ApiBearerAuth()
@Controller('me/preferences')
export class UserPreferencesController extends SecureController {
  private readonly logger = new Logger(UserPreferencesController.name);

  constructor(private readonly userPreferencesService: UserPreferencesService) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get user preferences' })
  @ApiResponse({
    status: 200,
    description: 'Preferences retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            preferences: {
              type: 'object',
              properties: {
                defaultPaymentMethod: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      example: 'a3e23c3c-6dae-4783-84e6-753f44038cd4',
                    },
                    name: { type: 'string', example: 'Cash' },
                    icon: { type: 'string', example: '💵' },
                    color: { type: 'string', example: '#4caf50' },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async find(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const preferences = await this.userPreferencesService.find(
        new Id(req.user.userId),
      );

      if (!preferences) {
        // No preferences available (no payment methods)
        res.status(200).json({
          success: true,
          data: {
            preferences: null,
          },
        });
        return;
      }

      const response: UserPreferencesResponse = {
        success: true,
        data: {
          preferences: {
            defaultPaymentMethod: {
              id: preferences.defaultPaymentMethod.id.value,
              name: preferences.defaultPaymentMethod.name,
              icon: preferences.defaultPaymentMethod.icon ?? '',
              color: preferences.defaultPaymentMethod.color ?? '',
            },
            language: preferences.language,
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      this.logger.error('Error fetching user preferences:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch user preferences',
        },
      });
    }
  }

  @Put()
  @ApiOperation({ summary: 'Save user preferences' })
  @ApiResponse({
    status: 200,
    description: 'Preferences saved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            preferences: {
              type: 'object',
              properties: {
                defaultPaymentMethod: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      example: 'a3e23c3c-6dae-4783-84e6-753f44038cd4',
                    },
                    name: { type: 'string', example: 'Cash' },
                    icon: { type: 'string', example: '💵' },
                    color: { type: 'string', example: '#4caf50' },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async save(
    @Body() dto: UserPreferencesDto,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const preferences = await this.userPreferencesService.save(
        new Id(req.user.userId),
        new Id(dto.defaultPaymentMethodId),
        dto.language,
      );

      const response: UserPreferencesResponse = {
        success: true,
        data: {
          preferences: {
            defaultPaymentMethod: {
              id: preferences.defaultPaymentMethod.id.value,
              name: preferences.defaultPaymentMethod.name,
              icon: preferences.defaultPaymentMethod.icon ?? '',
              color: preferences.defaultPaymentMethod.color ?? '',
            },
            language: preferences.language,
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      this.logger.error('Error saving user preferences:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to save user preferences',
        },
      });
    }
  }
}
