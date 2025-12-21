import { Test } from '@nestjs/testing';
import { CategoriesRepository } from './categories.repository';
import { CategoryEntity, TransactionEntity } from '@src/db';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Id } from '@gualet/shared';
import { Category } from './category.model';
import {
  CategoryNotFoundError,
  NotAuthorizedForCategoryError,
} from '@src/categories/errors';
import {
  buildCategory,
  buildCategoryEntity,
  buildUserEntity,
} from '@test/builders';

describe('CategoriesRepository', () => {
  const userId = new Id('user-123');
  let repository: CategoriesRepository;
  let entityRepository: Repository<CategoryEntity>;
  let transactionRepository: Repository<TransactionEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CategoriesRepository,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(TransactionEntity),
          useValue: {
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = moduleRef.get<CategoriesRepository>(CategoriesRepository);
    entityRepository = moduleRef.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity),
    );
    transactionRepository = moduleRef.get<Repository<TransactionEntity>>(
      getRepositoryToken(TransactionEntity),
    );
  });

  describe('findOne', () => {
    it('should return a category when it exists and user is authorized', async () => {
      const userId = new Id('user-123');
      const categoryId = new Id('category-123');
      const categoryEntity = buildCategoryEntity({
        id: categoryId.toString(),
        user: buildUserEntity({ id: userId.toString() }),
      });

      jest
        .spyOn(entityRepository, 'findOneBy')
        .mockResolvedValue(categoryEntity);

      const result = await repository.findOne(userId, categoryId);

      expect(entityRepository.findOneBy).toHaveBeenCalledWith({
        id: categoryId.toString(),
      });
      expect(result).toBeInstanceOf(Category);
      expect(result.id).toEqual(categoryId);
    });

    it('should throw CategoryNotFoundError when category does not exist', async () => {
      const userId = new Id('user-123');
      const categoryId = new Id('category-123');

      jest.spyOn(entityRepository, 'findOneBy').mockResolvedValue(null);

      await expect(repository.findOne(userId, categoryId)).rejects.toThrow(
        CategoryNotFoundError,
      );
    });

    it('should throw NotAuthorizedForCategoryError when user is not authorized', async () => {
      const userId = new Id('user-123');
      const categoryId = new Id('category-123');
      const categoryEntity = buildCategoryEntity({
        id: categoryId.toString(),
        user: buildUserEntity({ id: 'different-user-456' }),
      });

      jest
        .spyOn(entityRepository, 'findOneBy')
        .mockResolvedValue(categoryEntity);

      await expect(repository.findOne(userId, categoryId)).rejects.toThrow(
        NotAuthorizedForCategoryError,
      );
    });
  });

  describe('findAll', () => {
    it('should return all categories for a user', async () => {
      const categoryEntities = [
        buildCategoryEntity({
          user: buildUserEntity({ id: userId.toString() }),
        }),
        buildCategoryEntity({
          user: buildUserEntity({ id: userId.toString() }),
        }),
      ];

      jest.spyOn(entityRepository, 'find').mockResolvedValue(categoryEntities);

      const result = await repository.findAll(userId);

      expect(entityRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId.toString() } },
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Category);
      expect(result[1]).toBeInstanceOf(Category);
    });

    it('should return empty array when user has no categories', async () => {
      jest.spyOn(entityRepository, 'find').mockResolvedValue([]);

      const result = await repository.findAll(userId);

      expect(entityRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId.toString() } },
      });
      expect(result).toHaveLength(0);
    });
  });

  describe('create', () => {
    it('should create a new category for a user', async () => {
      const categoryEntity = buildCategoryEntity({
        user: buildUserEntity({ id: userId.toString() }),
      });
      const category = buildCategory(categoryEntity);

      jest.spyOn(entityRepository, 'create').mockReturnValue(categoryEntity);
      jest.spyOn(entityRepository, 'save').mockResolvedValue(categoryEntity);

      const result = await repository.create(userId, category);

      expect(entityRepository.save).toHaveBeenCalledWith(categoryEntity);
      expect(result).toBeInstanceOf(Category);
      expect(result.id).toEqual(category.id);
    });

    it('should handle category with empty icon and color', async () => {
      const categoryEntity = buildCategoryEntity({
        user: buildUserEntity({ id: userId.toString() }),
        icon: undefined,
        color: undefined,
      });
      const category = buildCategory(categoryEntity);

      jest.spyOn(entityRepository, 'create').mockReturnValue(categoryEntity);
      jest.spyOn(entityRepository, 'save').mockResolvedValue(categoryEntity);

      const result = await repository.create(userId, category);

      expect(entityRepository.save).toHaveBeenCalledWith(categoryEntity);
      expect(result).toBeInstanceOf(Category);
      expect(result.icon).toBe('');
      expect(result.color).toBe('#545454');
    });
  });

  describe('update', () => {
    it('should update a category when it exists and user is authorized', async () => {
      const categoryId = new Id('category-123');
      const categoryToUpdate = {
        id: categoryId,
        name: 'Updated Category',
        icon: 'icon-123',
        color: '#ffffff',
      };
      const existingCategory = buildCategoryEntity({
        id: categoryId.toString(),
        user: buildUserEntity({ id: userId.toString() }),
      });
      const updatedCategory = buildCategoryEntity({
        id: categoryId.toString(),
        name: 'Updated Category',
        icon: 'icon-123',
        color: '#ffffff',
        user: buildUserEntity({ id: userId.toString() }),
      });

      jest
        .spyOn(entityRepository, 'findOne')
        .mockResolvedValue(existingCategory);
      jest.spyOn(entityRepository, 'save').mockResolvedValue(updatedCategory);

      const result = await repository.update(userId, categoryToUpdate);

      expect(entityRepository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId.toString() },
      });
      expect(entityRepository.save).toHaveBeenCalledWith({
        ...existingCategory,
        ...categoryToUpdate,
        id: categoryId.toString(),
      });
      expect(result).toBeInstanceOf(Category);
      expect(result.name).toEqual('Updated Category');
    });

    it('should throw CategoryNotFoundError when category does not exist', async () => {
      const categoryId = new Id('category-123');
      const categoryToUpdate = {
        id: categoryId,
        name: 'Updated Category',
      };

      jest.spyOn(entityRepository, 'findOne').mockResolvedValue(null);

      await expect(repository.update(userId, categoryToUpdate)).rejects.toThrow(
        CategoryNotFoundError,
      );
    });

    it('should throw NotAuthorizedForCategoryError when user is not authorized', async () => {
      const categoryId = new Id('category-123');
      const categoryToUpdate = {
        id: categoryId,
        name: 'Updated Category',
      };
      const existingCategory = buildCategoryEntity({
        id: categoryId.toString(),
        user: buildUserEntity({ id: 'different-user-456' }),
      });

      jest
        .spyOn(entityRepository, 'findOne')
        .mockResolvedValue(existingCategory);

      await expect(repository.update(userId, categoryToUpdate)).rejects.toThrow(
        NotAuthorizedForCategoryError,
      );
    });

    it('should handle category update with null icon and color', async () => {
      const categoryId = new Id('category-123');
      const categoryToUpdate = {
        id: categoryId,
        name: 'Updated Category',
        icon: undefined,
        color: undefined,
      };
      const existingCategory = buildCategoryEntity({
        id: categoryId.toString(),
        user: buildUserEntity({ id: userId.toString() }),
        icon: 'old-icon',
        color: '#000000',
      });
      const updatedCategory = buildCategoryEntity({
        id: categoryId.toString(),
        name: 'Updated Category',
        icon: 'old-icon',
        color: '#000000',
        user: buildUserEntity({ id: userId.toString() }),
      });

      jest
        .spyOn(entityRepository, 'findOne')
        .mockResolvedValue(existingCategory);
      jest.spyOn(entityRepository, 'save').mockResolvedValue(updatedCategory);

      const result = await repository.update(userId, categoryToUpdate);

      expect(entityRepository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId.toString() },
      });
      expect(entityRepository.save).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Category);
      expect(result.name).toBe('Updated Category');
      expect(result.icon).toBe('old-icon');
      expect(result.color).toBe('#000000');
    });

    it('should handle category update with explicit null icon and color to clear them', async () => {
      const categoryId = new Id('category-123');
      const categoryToUpdate = {
        id: categoryId,
        name: 'Updated Category',
        icon: null,
        color: null,
      };
      const existingCategory = buildCategoryEntity({
        id: categoryId.toString(),
        user: buildUserEntity({ id: userId.toString() }),
        icon: 'old-icon',
        color: '#000000',
      });
      const updatedCategory = buildCategoryEntity({
        id: categoryId.toString(),
        name: 'Updated Category',
        icon: undefined,
        color: undefined,
        user: buildUserEntity({ id: userId.toString() }),
      });

      jest
        .spyOn(entityRepository, 'findOne')
        .mockResolvedValue(existingCategory);
      jest.spyOn(entityRepository, 'save').mockResolvedValue(updatedCategory);

      const result = await repository.update(userId, categoryToUpdate);

      expect(entityRepository.save).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Category);
    });
  });

  describe('delete', () => {
    it('should delete a category when it exists, user is authorized, and not in use', async () => {
      const categoryId = new Id('category-123');
      const existingCategory = buildCategoryEntity({
        id: categoryId.toString(),
        user: buildUserEntity({ id: userId.toString() }),
      });

      jest
        .spyOn(entityRepository, 'findOne')
        .mockResolvedValue(existingCategory);
      jest.spyOn(transactionRepository, 'count').mockResolvedValue(0);
      jest.spyOn(entityRepository, 'delete').mockResolvedValue({
        raw: [],
        affected: 1,
      });

      await repository.delete(userId, categoryId);

      expect(entityRepository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId.toString() },
      });
      expect(transactionRepository.count).toHaveBeenCalledWith({
        where: { category: { id: categoryId.toString() } },
      });
      expect(entityRepository.delete).toHaveBeenCalledWith({
        id: categoryId.toString(),
      });
    });

    it('should throw CategoryNotFoundError when category does not exist', async () => {
      const categoryId = new Id('category-123');

      jest.spyOn(entityRepository, 'findOne').mockResolvedValue(null);

      await expect(repository.delete(userId, categoryId)).rejects.toThrow(
        CategoryNotFoundError,
      );
      expect(entityRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw NotAuthorizedForCategoryError when user is not authorized', async () => {
      const categoryId = new Id('category-123');
      const existingCategory = buildCategoryEntity({
        id: categoryId.toString(),
        user: buildUserEntity({ id: 'different-user-456' }),
      });

      jest
        .spyOn(entityRepository, 'findOne')
        .mockResolvedValue(existingCategory);

      await expect(repository.delete(userId, categoryId)).rejects.toThrow(
        NotAuthorizedForCategoryError,
      );
      expect(entityRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw CategoryInUseError when category is used by transactions', async () => {
      const categoryId = new Id('category-123');
      const existingCategory = buildCategoryEntity({
        id: categoryId.toString(),
        user: buildUserEntity({ id: userId.toString() }),
      });

      jest
        .spyOn(entityRepository, 'findOne')
        .mockResolvedValue(existingCategory);
      jest.spyOn(transactionRepository, 'count').mockResolvedValue(5);

      await expect(repository.delete(userId, categoryId)).rejects.toThrow(
        'is in use and cannot be deleted',
      );
      expect(entityRepository.delete).not.toHaveBeenCalled();
    });
  });
});
