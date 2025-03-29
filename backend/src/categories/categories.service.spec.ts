import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryEntity } from './entities';
import { Repository } from 'typeorm';
import { Category } from './category.model';
import { Id, OperationType } from '@src/common/domain';
import { buildCategoryEntity } from '@test/builders';
import {
  CategoryNotFoundError,
  NotAuthorizedForCategoryError,
} from '@src/categories/errors';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryRepository: Repository<CategoryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoryRepository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all categories for a user', async () => {
    const userId = 'user-123';
    const categoryEntities = [
      buildCategoryEntity({ user_id: userId }),
      buildCategoryEntity({
        user_id: userId,
        name: 'Food',
        icon: '🍔',
        color: '#FF0000',
      }),
    ];

    jest.spyOn(categoryRepository, 'find').mockResolvedValue(categoryEntities);

    const result = await service.findAllForUser(userId);

    expect(categoryRepository.find).toHaveBeenCalledWith({
      where: { user_id: userId },
    });
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(Category);
    expect(result[0].id).toBeInstanceOf(Id);
    expect(result[0].id.toString()).toBe(categoryEntities[0].id);
    expect(result[1].name).toBe('Food');
    expect(result[1].icon).toBe('🍔');
    expect(result[1].color).toBe('#FF0000');
  });

  it('should return empty array when user has no categories', async () => {
    jest.spyOn(categoryRepository, 'find').mockResolvedValue([]);

    const result = await service.findAllForUser('user-123');

    expect(result).toEqual([]);
  });

  it('should create a new category', async () => {
    const newCategoryData = buildCategoryEntity({
      user_id: 'user-123',
      name: 'Shopping',
      icon: '🛒',
      color: '#00FF00',
      type: OperationType.Outcome,
    });

    const savedCategory = { ...newCategoryData, id: 'new-id' };
    jest.spyOn(categoryRepository, 'save').mockResolvedValue(savedCategory);

    const result = await service.create(
      'user-123',
      new Category(newCategoryData),
    );

    expect(categoryRepository.save).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Category);
    expect(result.id.toString()).toBe('new-id');
    expect(result.name).toBe('Shopping');
    expect(result.icon).toBe('🛒');
    expect(result.color).toBe('#00FF00');
  });

  it('should create a category handling missing optional fields', async () => {
    const categoryWithoutOptionals = buildCategoryEntity();
    categoryWithoutOptionals.icon = undefined;
    categoryWithoutOptionals.color = undefined;

    jest
      .spyOn(categoryRepository, 'save')
      .mockResolvedValue(categoryWithoutOptionals);

    const result = await service.create(
      categoryWithoutOptionals.user_id,
      new Category(categoryWithoutOptionals),
    );

    expect(result.icon).toBeNull();
    expect(result.color).toBeNull();
  });

  it('should find an existing category by id', async () => {
    const category = buildCategoryEntity({
      name: 'Updated Category',
      icon: '💰',
      color: '#0000FF',
    });
    jest.spyOn(categoryRepository, 'findOneBy').mockResolvedValue(category);
    const categoryId = new Id(category.id);
    const userId = new Id(category.user_id);

    const result = await service.findById(categoryId, userId);

    expect(categoryRepository.findOneBy).toHaveBeenCalledWith({
      id: categoryId.toString(),
    });
    expect(result).toBeInstanceOf(Category);
    expect(result.id.equals(category.id)).toBe(true);
    expect(result.name).toBe('Updated Category');
    expect(result.icon).toBe('💰');
    expect(result.color).toBe('#0000FF');
  });

  it('should throw error when trying to find a non-existing category', async () => {
    jest.spyOn(categoryRepository, 'findOneBy').mockResolvedValue(null);
    const categoryId = new Id();
    const userId = new Id();

    await expect(service.findById(categoryId, userId)).rejects.toThrow(
      CategoryNotFoundError,
    );
  });

  it('should throw error when trying to find a category from another user', async () => {
    const categoryId = new Id();
    const userId = new Id();
    jest
      .spyOn(categoryRepository, 'findOneBy')
      .mockResolvedValue(
        buildCategoryEntity({ user_id: 'a-different-user-456' }),
      );

    await expect(service.findById(categoryId, userId)).rejects.toThrow(
      NotAuthorizedForCategoryError,
    );
  });

  it('should save an existing category', async () => {
    const categoryToSave = buildCategoryEntity({
      name: 'Updated Category',
      icon: '💰',
      color: '#0000FF',
    });
    const mockDate = new Date('2023-01-01T00:00:00Z');
    const mockISOString = mockDate.toISOString();
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    jest.spyOn(categoryRepository, 'save').mockResolvedValue(categoryToSave);
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(categoryToSave);

    const result = await service.save(
      categoryToSave.user_id,
      new Category(categoryToSave),
    );

    expect(categoryRepository.save).toHaveBeenCalledWith({
      ...new Category(categoryToSave).toJSON(),
      updatedAt: mockISOString,
    });
    expect(result).toBeInstanceOf(Category);
    expect(result.id.equals(categoryToSave.id)).toBe(true);
    expect(result.name).toBe('Updated Category');
    expect(result.icon).toBe('💰');
    expect(result.color).toBe('#0000FF');
  });

  it('should save a category handling missing optional fields', async () => {
    const categoryWithoutOptionals = buildCategoryEntity();
    categoryWithoutOptionals.icon = undefined;
    categoryWithoutOptionals.color = undefined;

    jest
      .spyOn(categoryRepository, 'findOne')
      .mockResolvedValue(categoryWithoutOptionals);
    jest
      .spyOn(categoryRepository, 'save')
      .mockResolvedValue(categoryWithoutOptionals);

    const result = await service.save(
      categoryWithoutOptionals.user_id,
      new Category(categoryWithoutOptionals),
    );

    expect(result.icon).toBeNull();
    expect(result.color).toBeNull();
  });

  it('should throw error when trying to save a non-existing category', async () => {
    const nonExistingCategory = new Category({
      id: new Id().toString(),
      name: 'Non-existing Category',
      type: OperationType.Outcome,
    });

    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

    await expect(service.save('user-123', nonExistingCategory)).rejects.toThrow(
      CategoryNotFoundError,
    );
  });

  it('should throw error when trying to save a category from another user', async () => {
    const category = new Category({
      id: new Id().toString(),
      name: 'Non-existing Category',
      type: OperationType.Outcome,
    });

    jest
      .spyOn(categoryRepository, 'findOne')
      .mockResolvedValue(
        buildCategoryEntity({ user_id: 'a-different-user-456' }),
      );

    await expect(service.save('user-123', category)).rejects.toThrow(
      NotAuthorizedForCategoryError,
    );
  });
});
