import { Test, TestingModule } from '@nestjs/testing';
import { DemoCategoriesRepository } from '../repositories/demo-categories.repository';
import { DemoService } from '../demo.service';
import { Category, Id, OperationType } from '@gualet/shared';
import {
  CategoryInUseError,
  CategoryNotFoundError,
  DuplicateCategoryError,
} from '@src/categories/errors';

describe('DemoCategoriesRepository', () => {
  let repository: DemoCategoriesRepository;
  let demoService: DemoService;
  const userId = new Id('demo-user-id');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DemoCategoriesRepository, DemoService],
    }).compile();

    repository = module.get<DemoCategoriesRepository>(DemoCategoriesRepository);
    demoService = module.get<DemoService>(DemoService);
    demoService.onModuleInit();
  });

  afterEach(() => {
    if (demoService) {
      demoService.onModuleDestroy();
    }
  });

  describe('findAll', () => {
    it('should return all demo categories', async () => {
      const categories = await repository.findAll(userId);

      expect(categories).toBeDefined();
      expect(categories.length).toBeGreaterThan(0);
      expect(categories[0]).toBeInstanceOf(Category);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const categories = await repository.findAll(userId);
      const firstCategory = categories[0];

      const category = await repository.findOne(userId, firstCategory.id);

      expect(category).toBeDefined();
      expect(category.id.equals(firstCategory.id)).toBe(true);
      expect(category.name).toBe(firstCategory.name);
    });

    it('should throw CategoryNotFoundError if category does not exist', async () => {
      const nonExistentId = new Id('non-existent-id');

      await expect(repository.findOne(userId, nonExistentId)).rejects.toThrow(
        CategoryNotFoundError,
      );
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const newCategory = new Category({
        id: new Id('new-cat-id'),
        name: 'Test Category',
        icon: '🧪',
        color: '#FF0000',
        type: OperationType.Outcome,
      });

      const createdCategory = await repository.create(userId, newCategory);

      expect(createdCategory).toBeDefined();
      expect(createdCategory.id.equals(newCategory.id)).toBe(true);
      expect(createdCategory.name).toBe(newCategory.name);

      // Verify it was added to the collection
      const foundCategory = await repository.findOne(userId, newCategory.id);
      expect(foundCategory).toBeDefined();
    });

    it('should throw DuplicateCategoryError if category with same name and type exists', async () => {
      const categories = await repository.findAll(userId);
      const existingCategory = categories[0];

      const duplicateCategory = new Category({
        id: new Id('duplicate-id'),
        name: existingCategory.name,
        type: existingCategory.type,
        icon: '🧪',
        color: '#FF0000',
      });

      await expect(
        repository.create(userId, duplicateCategory),
      ).rejects.toThrow(DuplicateCategoryError);
    });
  });

  describe('update', () => {
    it('should update an existing category', async () => {
      const categories = await repository.findAll(userId);
      const categoryToUpdate = categories[0];

      const updatedData = {
        id: categoryToUpdate.id,
        name: 'Updated Name',
        type: categoryToUpdate.type,
        icon: categoryToUpdate.icon,
        color: categoryToUpdate.color,
      };

      const updatedCategory = await repository.update(userId, updatedData);

      expect(updatedCategory.name).toBe('Updated Name');
      expect(updatedCategory.id.equals(categoryToUpdate.id)).toBe(true);
    });

    it('should throw CategoryNotFoundError if category does not exist', async () => {
      const nonExistentId = new Id('non-existent-id');

      await expect(
        repository.update(userId, {
          id: nonExistentId,
          name: 'Updated',
          type: OperationType.Outcome,
        }),
      ).rejects.toThrow(CategoryNotFoundError);
    });

    it('should partially update category fields', async () => {
      const categories = await repository.findAll(userId);
      const categoryToUpdate = categories[0];
      const originalName = categoryToUpdate.name;

      const updatedCategory = await repository.update(userId, {
        id: categoryToUpdate.id,
        icon: '🆕',
      });

      expect(updatedCategory.icon).toBe('🆕');
      expect(updatedCategory.name).toBe(originalName);
    });
  });

  describe('delete', () => {
    it('should delete a category not in use', async () => {
      const newCategory = new Category({
        id: new Id('to-delete-id'),
        name: 'To Delete',
        icon: '🗑️',
        color: '#FF0000',
        type: OperationType.Outcome,
      });

      await repository.create(userId, newCategory);
      await repository.delete(userId, newCategory.id);

      await expect(repository.findOne(userId, newCategory.id)).rejects.toThrow(
        CategoryNotFoundError,
      );
    });

    it('should throw CategoryNotFoundError if category does not exist', async () => {
      const nonExistentId = new Id('non-existent-id');

      await expect(repository.delete(userId, nonExistentId)).rejects.toThrow(
        CategoryNotFoundError,
      );
    });

    it('should throw CategoryInUseError if category is used by transactions', async () => {
      const categories = await repository.findAll(userId);
      // Pick the first category which is used in demo transactions
      const categoryInUse = categories[0];

      await expect(repository.delete(userId, categoryInUse.id)).rejects.toThrow(
        CategoryInUseError,
      );
    });
  });

  describe('data isolation', () => {
    it('should not persist data after service reset', async () => {
      const newCategory = new Category({
        id: new Id('temp-cat-id'),
        name: 'Temporary Category',
        icon: '⏰',
        color: '#FF0000',
        type: OperationType.Outcome,
      });

      await repository.create(userId, newCategory);

      // Verify it exists
      const found = await repository.findOne(userId, newCategory.id);
      expect(found).toBeDefined();

      // Reset demo data
      demoService.onModuleInit();

      // Verify it no longer exists
      await expect(repository.findOne(userId, newCategory.id)).rejects.toThrow(
        CategoryNotFoundError,
      );
    });
  });
});
