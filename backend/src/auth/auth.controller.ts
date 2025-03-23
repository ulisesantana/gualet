import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiProperty } from '@nestjs/swagger';

class LoginDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

class RegisterDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginData: LoginDto) {
    const user = await this.authService.validateUser(
      loginData.email,
      loginData.password,
    );
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() registerData: RegisterDto) {
    return this.authService.register(registerData);
  }
}
