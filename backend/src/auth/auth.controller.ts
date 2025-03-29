import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { LoginDto, RegisterDto } from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly cookieName = 'access_token';
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

    res.cookie(this.cookieName, access_token, {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') !== 'development',
      sameSite: 'lax',
    });

    return user;
  }

  @Post('register')
  async register(@Body() registerData: RegisterDto) {
    return this.authService.register(registerData);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(this.cookieName);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  async verify() {}
}
