import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CategoriesRepositoryFactory } from './categories.repository.factory';
import { Category } from './category.model';
import { Id, OperationType } from '@gualet/shared';
import { buildCategory, buildUserEntity } from '@test/builders';
import { CategoriesRepository } from './categories.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryEntity, TransactionEntity } from '@src/db';

describe('CategoriesService', () => {
  const userId = new Id('user-123');
  let service: CategoriesService;
  let categoryRepository: jest.Mocked<CategoriesRepository>;
  let repositoryFactory: CategoriesRepositoryFactory;

  beforeEach(async () => {
    const mockCategoryRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockTransactionRepo = {
      count: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CategoriesRepositoryFactory,
          useValue: {
            getRepository: jest.fn().mockReturnValue(mockCategoryRepo),
          },
        },
        {
          provide: CategoriesRepository,
          useValue: mockCategoryRepo,
        },
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: mockCategoryRepo,
        },
        {
          provide: getRepositoryToken(TransactionEntity),
          useValue: mockTransactionRepo,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoryRepository = module.get(CategoriesRepository);
    repositoryFactory = module.get<CategoriesRepositoryFactory>(
      CategoriesRepositoryFactory,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all categories for a user', async () => {
    const categoryEntities = [
      buildCategory(),
      buildCategory({
        name: 'Food',
        icon: '🍔',
        color: '#FF0000',
      }),
    ];

    categoryRepository.findAll.mockResolvedValue(categoryEntities);

    const result = await service.findAll(userId);

    expect(categoryRepository.findAll).toHaveBeenCalledWith(userId);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(Category);
    expect(result[0].id).toBeInstanceOf(Id);
    expect(result[0].id).toBe(categoryEntities[0].id);
    expect(result[1].name).toBe('Food');
    expect(result[1].icon).toBe('🍔');
    expect(result[1].color).toBe('#FF0000');
  });

  it('should return empty array when user has no categories', async () => {
    categoryRepository.findAll.mockResolvedValue([]);

    const result = await service.findAll(userId);

    expect(result).toEqual([]);
  });

  it('should create a new category', async () => {
    const categoryId = 'new-id';
    const newCategoryData = {
      id: categoryId,
      name: 'Shopping',
      icon: '🛒',
      color: '#00FF00',
      type: OperationType.Outcome,
    };

    const savedCategory = new Category({
      ...newCategoryData,
      id: new Id(categoryId),
    });
    categoryRepository.create.mockResolvedValue(savedCategory);

    const result = await service.create(userId, newCategoryData);

    expect(categoryRepository.create).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Category);
    expect(result.id).toStrictEqual(new Id(categoryId));
    expect(result.name).toBe('Shopping');
    expect(result.icon).toBe('🛒');
    expect(result.color).toBe('#00FF00');
  });

  it('should create a category handling missing optional fields', async () => {
    const categoryId = 'test-id';
    const categoryWithoutOptionals = buildCategory({
      id: categoryId,
      user: buildUserEntity({ id: userId.toString() }),
      icon: undefined,
      color: undefined,
    });

    categoryRepository.create.mockResolvedValue(categoryWithoutOptionals);

    const result = await service.create(userId, {
      id: categoryId,
      name: categoryWithoutOptionals.name,
      type: categoryWithoutOptionals.type,
      icon: undefined,
      color: undefined,
    });

    expect(result.icon).toBe('');
    expect(result.color).toBe('#545454');
  });

  it('should find an existing category by id', async () => {
    const category = buildCategory({
      name: 'Updated Category',
      icon: '💰',
      color: '#0000FF',
    });
    categoryRepository.findOne.mockResolvedValue(category);
    const categoryId = new Id(category.id);

    const result = await service.findOne(userId, categoryId);

    expect(categoryRepository.findOne).toHaveBeenCalledWith(userId, categoryId);
    expect(result).toBeInstanceOf(Category);
    expect(result.id.equals(category.id)).toBe(true);
    expect(result.name).toBe('Updated Category');
    expect(result.icon).toBe('💰');
    expect(result.color).toBe('#0000FF');
  });

  it('should update an existing category', async () => {
    const categoryEntityToSave = buildCategory({
      name: 'Updated Category',
      icon: '💰',
      color: '#0000FF',
      user: buildUserEntity({ id: userId.toString() }),
    });
    const categoryToSave = new Category(categoryEntityToSave);
    categoryRepository.update.mockResolvedValue(categoryEntityToSave);

    const result = await service.update(userId, categoryToSave);

    expect(categoryRepository.update).toHaveBeenCalledWith(
      userId,
      categoryToSave,
    );
    expect(result).toBeInstanceOf(Category);
    expect(result.id.equals(categoryToSave.id)).toBe(true);
    expect(result.name).toBe('Updated Category');
    expect(result.icon).toBe('💰');
    expect(result.color).toBe('#0000FF');
  });

  it('should update a category handling missing optional fields', async () => {
    const categoryWithoutOptionals = buildCategory({
      user: buildUserEntity({ id: userId.toString() }),
      name: 'Updated Category',
      type: OperationType.Outcome,
      icon: undefined,
      color: undefined,
    });

    categoryRepository.update.mockResolvedValue(categoryWithoutOptionals);

    const result = await service.update(userId, categoryWithoutOptionals);

    expect(result.icon).toBe('');
    expect(result.color).toBe('#545454');
  });

  it('should delete a category', async () => {
    const categoryId = new Id('category-to-delete');
    categoryRepository.delete.mockResolvedValue(undefined);

    await service.delete(userId, categoryId);

    expect(categoryRepository.delete).toHaveBeenCalledWith(userId, categoryId);
  });

  describe('createDefaultCategories', () => {
    it('should create all default categories successfully', async () => {
      const mockCategory = buildCategory();
      categoryRepository.create.mockResolvedValue(mockCategory);

      const result = await service.createDefaultCategories(userId);

      expect(result.length).toBeGreaterThan(0);
      expect(categoryRepository.create).toHaveBeenCalled();
      result.forEach((category) => {
        expect(category).toBeInstanceOf(Category);
      });
    });

    it('should handle failures when creating default categories', async () => {
      const mockCategory = buildCategory();
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      categoryRepository.create
        .mockResolvedValueOnce(mockCategory)
        .mockRejectedValueOnce(new Error('Database error'))
        .mockResolvedValue(mockCategory);

      const result = await service.createDefaultCategories(userId);

      expect(result.length).toBeGreaterThan(0);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to create default category:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
