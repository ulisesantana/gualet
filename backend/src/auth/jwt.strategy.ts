import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { TokenPayload } from './dto';

interface ValidatePayload extends TokenPayload {
  userId: string;
  email: string;
  raw: object;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly secret: string;

  constructor(configService: ConfigService) {
    const secret = configService.get('JWT_SECRET') || 'secret';
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return request?.cookies?.access_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
    this.secret = secret;
  }

  async validate(payload: {
    sub: string;
    email: string;
  }): Promise<ValidatePayload> {
    if (!payload || typeof payload !== 'object') {
      throw new UnauthorizedException();
    }

    return {
      userId: payload.sub,
      email: payload.email,
      raw: payload,
    };
  }
}
