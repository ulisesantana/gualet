import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let configService: ConfigService;

  beforeEach(() => {
    configService = { get: jest.fn() } as any;
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
});
