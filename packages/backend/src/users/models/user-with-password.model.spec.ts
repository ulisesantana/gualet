import { UserWithPassword } from './user-with-password.model';
import { Id } from '@gualet/shared';

describe('UserWithPassword', () => {
  it('should create a user with password', () => {
    const userData = {
      id: new Id('user-123'),
      email: 'test@example.com',
      password: 'hashed-password',
    };

    const user = new UserWithPassword(userData);

    expect(user.id).toEqual(userData.id);
    expect(user.email).toBe(userData.email);
    expect(user.password).toBe(userData.password);
  });

  it('should serialize user with password to JSON', () => {
    const userData = {
      id: new Id('user-123'),
      email: 'test@example.com',
      password: 'hashed-password',
    };

    const user = new UserWithPassword(userData);
    const json = user.toJSON();

    expect(json).toEqual({
      id: userData.id.toString(),
      email: userData.email,
      password: userData.password,
    });
  });
});
