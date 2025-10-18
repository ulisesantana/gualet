import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../entities';
import { Id } from '@gualet/shared';

export class UserSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async run(): Promise<void> {
    const userRepository = this.dataSource.getRepository(UserEntity);

    // Check if test user already exists
    const existingUser = await userRepository.findOne({
      where: { email: 'test@gualet.app' },
    });

    if (existingUser) {
      console.log('✅ Test user already exists');
      return;
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('test1234', 10);
    const testUser = userRepository.create({
      id: new Id().toString(),
      email: 'test@gualet.app',
      password: hashedPassword,
    });

    await userRepository.save(testUser);
    console.log('✅ Test user created: test@gualet.app / test1234');
  }
}
