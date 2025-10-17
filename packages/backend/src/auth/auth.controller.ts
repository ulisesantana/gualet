import {
  Body,
  Controller,
  InternalServerErrorException,
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

@Controller('auth')
export class AuthController extends BaseController {
  private readonly accessToken = 'access_token';

  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    super();
  }

  @Post('login')
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
        res
          .status(409)
          .send(new ErrorResponse(new UnauthorizedException(error)));
      } else {
        this.handleAuthError(res, error);
      }
    }
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(this.accessToken);
    res.status(200);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
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
    if (this.isBaseError(error)) {
      switch (error.code) {
        case UserErrorCodes.UserNotFound: {
          res.status(404).send(new ErrorResponse(new NotFoundException(error)));
          break;
        }
        case UserErrorCodes.InvalidCredentials: {
          res
            .status(401)
            .send(new ErrorResponse(new UnauthorizedException(error)));
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
