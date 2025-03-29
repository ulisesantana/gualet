import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dto';
import { buildCategoryEntity } from '@test/builders';
import { Category } from './category.model';
import { CategoryNotFoundError, NotAuthorizedForCategoryError } from './errors';
import { Id } from '@src/common/domain';
import { AuthenticatedRequest } from '@src/common/infrastructure';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

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
            findById: jest.fn(),
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
    const categories = [
      buildCategoryEntity({ user_id: '1' }),
      buildCategoryEntity({ user_id: '1' }),
    ].map(CategoriesService.mapToDomain);
    jest.spyOn(service, 'findAllForUser').mockResolvedValue(categories);

    const result = await controller.findAll(req);

    expect(result.categories).toStrictEqual(
      categories.map((c) => new Category(c).toJSON()),
    );
    expect(service.findAllForUser).toHaveBeenCalledWith(1);
  });

  it('should create a new category', async () => {
    const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
    const category = CategoriesService.mapToDomain(buildCategoryEntity());
    jest.spyOn(service, 'create').mockResolvedValue(category);

    const result = await controller.create(req, {
      name: category.name,
      type: category.type,
      icon: category.icon as string,
      color: category.color as string,
    });

    expect(result).toStrictEqual(new CategoryResponseDto(category));
    expect(result.category.id).not.toBeUndefined();
    expect(service.create).toHaveBeenCalledWith('1', expect.any(Category));
  });

  describe('find a category by id', () => {
    it('should find an existing category', async () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const category = new Category(buildCategoryEntity());
      jest.spyOn(service, 'findById').mockResolvedValue(category);

      const result = await controller.findById(req, category.id.toString());

      expect(result).toStrictEqual(new CategoryResponseDto(category));
      expect(service.findById).toHaveBeenCalledWith(
        category.id,
        new Id(req.user.userId),
      );
    });

    describe('Error handling', () => {
      let throwError: boolean;
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const category = new Category(buildCategoryEntity());
      const id = category.id.toString();

      beforeEach(() => {
        throwError = true;
      });

      it('should handle 403 errors when throwing NotAuthorizedForCategoryError', async () => {
        const error = new NotAuthorizedForCategoryError(new Id('irrelevant'));
        jest.spyOn(service, 'findById').mockRejectedValue(error);

        try {
          await controller.findById(req, id);
          throwError = false;
        } catch (error) {
          expect(error).toBeInstanceOf(ForbiddenException);
          expect(error.response).toEqual({
            error: 'Forbidden',
            message: 'Not authorized for category with id "irrelevant".',
            statusCode: 403,
          });
        } finally {
          expect(throwError).toEqual(true);
          expect(service.findById).toHaveBeenCalledWith(
            category.id,
            new Id(req.user.userId),
          );
        }
      });

      it('should handle 404 errors when throwing CategoryNotFoundError', async () => {
        const error = new CategoryNotFoundError(new Id('irrelevant'));
        jest.spyOn(service, 'findById').mockRejectedValue(error);

        try {
          await controller.findById(req, id);
          throwError = false;
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.response).toEqual({
            error: 'Not Found',
            message: 'Category with id "irrelevant" not found.',
            statusCode: 404,
          });
        } finally {
          expect(throwError).toEqual(true);
          expect(service.findById).toHaveBeenCalledWith(
            category.id,
            new Id(req.user.userId),
          );
        }
      });

      it('should handle 500 errors for the rest of errors', async () => {
        const error = new Error('💥 Boom!!');
        jest.spyOn(service, 'findById').mockRejectedValue(error);

        try {
          await controller.findById(req, id);
          throwError = false;
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
          expect(error.response).toEqual(error);
        } finally {
          expect(throwError).toEqual(true);
          expect(service.findById).toHaveBeenCalledWith(
            category.id,
            new Id(req.user.userId),
          );
        }
      });
    });
  });

  describe('save a category', () => {
    it('should save an existing category', async () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const category = new Category(buildCategoryEntity());
      jest.spyOn(service, 'save').mockResolvedValue(category);

      const result = await controller.save(req, category.id.toString(), {
        id: category.id.toString(),
        name: category.name,
        type: category.type,
        icon: category.icon as string,
        color: category.color as string,
      });

      expect(result).toStrictEqual(new CategoryResponseDto(category));
      expect(service.save).toHaveBeenCalledWith('1', category);
    });

    it('should save an existing category with missing icon and color on payload', async () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const category = new Category(buildCategoryEntity());
      jest.spyOn(service, 'save').mockResolvedValue(category);

      const result = await controller.save(req, category.id.toString(), {
        id: category.id.toString(),
        name: category.name,
        type: category.type,
      });

      expect(result).toStrictEqual(new CategoryResponseDto(category));
      expect(service.save).toHaveBeenCalledWith('1', {
        ...category,
        icon: null,
        color: null,
      });
    });

    describe('Error handling', () => {
      let throwError: boolean;
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const category = new Category(buildCategoryEntity());
      const id = category.id.toString();
      const payload = {
        id,
        name: category.name,
        type: category.type,
      };

      beforeEach(() => {
        throwError = true;
      });

      it('should handle 403 errors when throwing NotAuthorizedForCategoryError', async () => {
        const error = new NotAuthorizedForCategoryError(new Id('irrelevant'));
        jest.spyOn(service, 'save').mockRejectedValue(error);

        try {
          await controller.save(req, id, payload);
          throwError = false;
        } catch (error) {
          expect(error).toBeInstanceOf(ForbiddenException);
          expect(error.response).toEqual({
            error: 'Forbidden',
            message: 'Not authorized for category with id "irrelevant".',
            statusCode: 403,
          });
        } finally {
          expect(throwError).toEqual(true);
          expect(service.save).toHaveBeenCalledWith('1', expect.any(Category));
        }
      });

      it('should handle 404 errors when throwing CategoryNotFoundError', async () => {
        const error = new CategoryNotFoundError(new Id('irrelevant'));
        jest.spyOn(service, 'save').mockRejectedValue(error);

        try {
          await controller.save(req, id, payload);
          throwError = false;
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.response).toEqual({
            error: 'Not Found',
            message: 'Category with id "irrelevant" not found.',
            statusCode: 404,
          });
        } finally {
          expect(throwError).toEqual(true);
          expect(service.save).toHaveBeenCalledWith('1', expect.any(Category));
        }
      });

      it('should handle 500 errors for the rest of errors', async () => {
        const error = new Error('💥 Boom!!');
        jest.spyOn(service, 'save').mockRejectedValue(error);

        try {
          await controller.save(req, id, payload);
          throwError = false;
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
          expect(error.response).toEqual(error);
        } finally {
          expect(throwError).toEqual(true);
          expect(service.save).toHaveBeenCalledWith('1', expect.any(Category));
        }
      });
    });
  });
});
