import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { LoginDto, RegisterDto, UserResponseDto } from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  AuthenticatedRequest,
  BaseController,
  ErrorResponse,
} from '@src/common/infrastructure';
import { User } from '@src/users';
import { UserErrorCodes } from '@src/users/errors/user.error-codes';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController extends BaseController {
  private readonly logger = new Logger(AuthController.name);
  private readonly accessToken = 'access_token';

  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    super();
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async login(
    @Body() loginData: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const user = await this.authService.validateUser(
        loginData.email,
        loginData.password,
      );
      const { access_token } = await this.authService.login(user.toJSON());

      this.saveAccessToken(res, access_token);

      res.status(200);
      return new UserResponseDto(user);
    } catch (error) {
      this.handleAuthError(res, error);
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 200,
    description: 'Registration successful',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(
    @Body() registerData: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const user = await this.authService.register(registerData);

      const { access_token } = await this.authService.login(user.toJSON());
      this.saveAccessToken(res, access_token);

      res.status(200);
      return new UserResponseDto(user);
    } catch (error: any) {
      if (
        this.isBaseError(error) &&
        error.code === UserErrorCodes.UserAlreadyExists
      ) {
        res.status(409).send(new ErrorResponse(error.message));
      } else {
        this.handleAuthError(res, error);
      }
    }
  }

  @Get('login/demo')
  @ApiOperation({ summary: 'Demo account login' })
  @ApiResponse({
    status: 200,
    description: 'Demo login successful',
    type: UserResponseDto,
  })
  async loginDemo(@Res({ passthrough: true }) res: Response) {
    try {
      const { access_token } = await this.authService.loginDemo();
      this.saveAccessToken(res, access_token);

      res.status(200);
      return new UserResponseDto(
        new User({
          id: 'demo-user-id',
          email: 'demo@gualet.app',
        }),
      );
    } catch (error) {
      this.handleAuthError(res, error);
    }
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(this.accessToken);
    res.status(200);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify user session' })
  @ApiResponse({
    status: 200,
    description: 'Session valid',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  verify(@Req() req: AuthenticatedRequest) {
    return new UserResponseDto(
      new User({
        id: req.user.userId,
        email: req.user.email,
      }),
    );
  }

  private saveAccessToken(res: Response, access_token: string) {
    res.cookie(this.accessToken, access_token, {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') !== 'development',
      sameSite: 'lax',
    });
  }

  private handleAuthError(res: Response, error: any) {
    this.logger.error('Authentication error:', error);
    if (this.isBaseError(error)) {
      switch (error.code) {
        case UserErrorCodes.UserNotFound: {
          res
            .status(404)
            .send(new ErrorResponse(new NotFoundException(error.message)));
          break;
        }
        case UserErrorCodes.InvalidCredentials: {
          res
            .status(401)
            .send(new ErrorResponse(new UnauthorizedException(error.message)));
          break;
        }
      }
    } else {
      res
        .status(500)
        .send(new ErrorResponse(new InternalServerErrorException(error)));
    }
  }
}
