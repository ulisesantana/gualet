import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { LoginDto, RegisterDto, UserResponseDto } from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthenticatedRequest } from '@src/common/infrastructure';
import { User } from '@src/users';

@Controller('auth')
export class AuthController {
  private readonly accessToken = 'access_token';

  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('login')
  async login(
    @Body() loginData: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(
      loginData.email,
      loginData.password,
    );
    const { access_token } = await this.authService.login(user.toJSON());

    this.saveAccessToken(res, access_token);

    return res.status(200).send(new UserResponseDto(user));
  }

  @Post('register')
  async register(
    @Body() registerData: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.register(registerData);

    const { access_token } = await this.authService.login(user.toJSON());
    this.saveAccessToken(res, access_token);

    return res.status(200).send(new UserResponseDto(user));
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(this.accessToken);
    return res.status(200);
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
}
