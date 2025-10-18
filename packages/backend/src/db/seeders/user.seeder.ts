import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CategoryEntity, PaymentMethodEntity, UserEntity } from '../entities';
import {
  generateDefaultCategories,
  generateDefaultPaymentMethods,
  Id,
} from '@gualet/shared';

export class UserSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async run(): Promise<string> {
    const userRepository = this.dataSource.getRepository(UserEntity);
    const categoryRepository = this.dataSource.getRepository(CategoryEntity);
    const paymentMethodRepository =
      this.dataSource.getRepository(PaymentMethodEntity);

    // Check if test user already exists
    const existingUser = await userRepository.findOne({
      where: { email: 'test@gualet.app' },
    });

    if (existingUser) {
      console.log('✅ Test user already exists');
      return existingUser.id;
    }

    // Create test user (emulating UserService.create())
    const userId = new Id().toString();
    const hashedPassword = await bcrypt.hash('test1234', 10);
    const testUser = userRepository.create({
      id: userId,
      email: 'test@gualet.app',
      password: hashedPassword,
    });

    await userRepository.save(testUser);
    console.log('✅ Test user created: test@gualet.app / test1234');

    // Create default categories (emulating categoryService.createDefaultCategories())
    const defaultCategories = generateDefaultCategories();
    const categories = defaultCategories.map((cat) =>
      categoryRepository.create({
        id: new Id().toString(),
        name: cat.name,
        type: cat.type,
        icon: cat.icon || '',
        color: cat.color || '',
        user: testUser,
      }),
    );

    await categoryRepository.save(categories);
    console.log(`✅ Created ${categories.length} default categories`);

    // Create default payment methods (emulating paymentMethodService.createDefaultPaymentMethods())
    const defaultPaymentMethods = generateDefaultPaymentMethods();
    const paymentMethods = defaultPaymentMethods.map((pm) =>
      paymentMethodRepository.create({
        id: new Id().toString(),
        name: pm.name,
        icon: pm.icon || '',
        color: pm.color || '',
        user: testUser,
      }),
    );

    await paymentMethodRepository.save(paymentMethods);
    console.log(`✅ Created ${paymentMethods.length} default payment methods`);

    return userId;
  }
}
