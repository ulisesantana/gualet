import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { Category } from './category.model';
import { Id, OperationType } from '@src/common/domain';
import { buildCategory, buildUserEntity } from '@test/builders';
import { CategoriesRepository } from './categories.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryEntity } from '@src/db';

describe('CategoriesService', () => {
  const userId = new Id('user-123');
  let service: CategoriesService;
  let categoryRepository: CategoriesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        CategoriesRepository,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoryRepository = module.get<CategoriesRepository>(CategoriesRepository);
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

    jest
      .spyOn(categoryRepository, 'findAll')
      .mockResolvedValue(categoryEntities);

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
    jest.spyOn(categoryRepository, 'findAll').mockResolvedValue([]);

    const result = await service.findAll(userId);

    expect(result).toEqual([]);
  });

  it('should create a new category', async () => {
    const newCategoryData = {
      name: 'Shopping',
      icon: '🛒',
      color: '#00FF00',
      type: OperationType.Outcome,
    };

    const savedCategory = new Category({
      ...newCategoryData,
      id: new Id('new-id'),
    });
    jest.spyOn(categoryRepository, 'create').mockResolvedValue(savedCategory);

    const result = await service.create(userId, new Category(newCategoryData));

    expect(categoryRepository.create).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Category);
    expect(result.id).toStrictEqual(new Id('new-id'));
    expect(result.name).toBe('Shopping');
    expect(result.icon).toBe('🛒');
    expect(result.color).toBe('#00FF00');
  });

  it('should create a category handling missing optional fields', async () => {
    const categoryWithoutOptionals = buildCategory({
      user: buildUserEntity({ id: userId.toString() }),
      icon: undefined,
      color: undefined,
    });

    jest
      .spyOn(categoryRepository, 'create')
      .mockResolvedValue(categoryWithoutOptionals);

    const result = await service.create(userId, categoryWithoutOptionals);

    expect(result.icon).toBe('');
    expect(result.color).toBe('#545454');
  });

  it('should find an existing category by id', async () => {
    const category = buildCategory({
      name: 'Updated Category',
      icon: '💰',
      color: '#0000FF',
    });
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(category);
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
    jest
      .spyOn(categoryRepository, 'update')
      .mockResolvedValue(categoryEntityToSave);

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

    jest
      .spyOn(categoryRepository, 'update')
      .mockResolvedValue(categoryWithoutOptionals);

    const result = await service.update(userId, categoryWithoutOptionals);

    expect(result.icon).toBe('');
    expect(result.color).toBe('#545454');
  });
});
