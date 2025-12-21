import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let configService: ConfigService;

  beforeEach(() => {
    configService = { get: jest.fn().mockReturnValue('test-secret') } as any;
    jwtStrategy = new JwtStrategy(configService);
  });

  it('should validate payload and return user data', async () => {
    const payload = { sub: '123', email: 'test@example.com' };
    const result = await jwtStrategy.validate(payload);
    expect(result).toEqual({
      userId: '123',
      email: 'test@example.com',
      raw: payload,
    });
  });

  it('should throw UnauthorizedException when payload is null', async () => {
    await expect(jwtStrategy.validate(null as any)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when payload is not an object', async () => {
    await expect(jwtStrategy.validate('invalid' as any)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should use default secret when JWT_SECRET is not configured', () => {
    const configServiceNoSecret = {
      get: jest.fn().mockReturnValue(null),
    } as any;
    const strategy = new JwtStrategy(configServiceNoSecret);
    expect(strategy).toBeDefined();
  });
});
