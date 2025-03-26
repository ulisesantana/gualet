import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { AuthenticatedRequest, OperationType } from '../common/types';
import { CategoryEntity } from './entities';
import { CategoryResponseDto } from './dto';

const generateRandomId = () => Math.floor(Math.random() * 1000).toString();

function generateCategoryEntity(): CategoryEntity {
  return {
    id: generateRandomId(),
    name: `Category ${generateRandomId()}`,
    type: OperationType.Outcome,
    icon: '😅',
    user_id: generateRandomId(),
  };
}

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            findAllForUser: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all categories for a user', async () => {
    const req = { user: { userId: 1 } } as unknown as AuthenticatedRequest;
    const categories = [generateCategoryEntity()];
    jest.spyOn(service, 'findAllForUser').mockResolvedValue(categories);

    const result = await controller.findAll(req);

    expect(result.categories).toStrictEqual(
      categories.map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        icon: c.icon,
      })),
    );
    expect(service.findAllForUser).toHaveBeenCalledWith(1);
  });

  it('should create a new category', async () => {
    const req = { user: { userId: 1 } } as unknown as AuthenticatedRequest;
    const category = generateCategoryEntity();
    jest.spyOn(service, 'create').mockResolvedValue(category);

    const result = await controller.create(req, {
      name: category.name,
      type: category.type,
      icon: category.icon,
    });

    expect(result).toStrictEqual(new CategoryResponseDto(category));
    expect(service.create).toHaveBeenCalledWith({
      name: category.name,
      type: category.type,
      icon: category.icon,
      user_id: 1,
    });
  });

  it('should save an existing category', async () => {
    const req = { user: { userId: 1 } } as unknown as AuthenticatedRequest;
    const category = generateCategoryEntity();
    jest.spyOn(service, 'save').mockResolvedValue(category);

    const result = await controller.save(req, {
      id: category.id,
      name: category.name,
      type: category.type,
      icon: category.icon,
    });

    expect(result).toStrictEqual(new CategoryResponseDto(category));
    expect(service.save).toHaveBeenCalledWith({ ...category, user_id: 1 });
  });
});
