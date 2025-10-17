import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InvalidCredentialsError, User, UserService } from '@src/users';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  register(registerData: { email: string; password: string }): Promise<User> {
    return this.usersService.create(registerData);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmailWithPassword(email);

    if (await bcrypt.compare(password, user.password)) {
      return UserService.mapToDomain(user);
    }

    throw new InvalidCredentialsError();
  }

  async login(user: {
    id: string;
    email: string;
  }): Promise<{ access_token: string }> {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: '1w',
      }),
    };
  }
}
