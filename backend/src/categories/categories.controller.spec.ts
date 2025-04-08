import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dto';
import { buildCategory, buildUserEntity } from '@test/builders';
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
            findOne: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
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
      buildCategory({ user: buildUserEntity({ id: '1' }) }),
      buildCategory({ user: buildUserEntity({ id: '1' }) }),
    ];
    jest.spyOn(service, 'findAll').mockResolvedValue(categories);

    const result = await controller.findAll(req);

    expect(result.categories).toStrictEqual(
      categories.map((c) => new Category(c).toJSON()),
    );
    expect(service.findAll).toHaveBeenCalledWith(new Id(req.user.userId));
  });

  it('should create a new category', async () => {
    const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
    const category = buildCategory();
    jest.spyOn(service, 'create').mockResolvedValue(category);

    const result = await controller.create(req, {
      name: category.name,
      type: category.type,
      icon: category.icon as string,
      color: category.color as string,
    });

    expect(result).toStrictEqual(new CategoryResponseDto(category));
    expect(result.category.id).not.toBeUndefined();
    expect(service.create).toHaveBeenCalledWith(new Id(req.user.userId), {
      name: category.name,
      type: category.type,
      icon: category.icon,
      color: category.color,
    });
  });

  describe('find a category by id', () => {
    it('should find an existing category', async () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const category = buildCategory();
      jest.spyOn(service, 'findOne').mockResolvedValue(category);

      const result = await controller.findOne(req, category.id.toString());

      expect(result).toStrictEqual(new CategoryResponseDto(category));
      expect(service.findOne).toHaveBeenCalledWith(
        new Id(req.user.userId),
        category.id,
      );
    });

    describe('Error handling', () => {
      let throwError: boolean;
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const category = buildCategory();
      const id = category.id.toString();

      beforeEach(() => {
        throwError = true;
      });

      it('should handle 403 errors when throwing NotAuthorizedForCategoryError', async () => {
        const error = new NotAuthorizedForCategoryError(new Id('irrelevant'));
        jest.spyOn(service, 'findOne').mockRejectedValue(error);

        try {
          await controller.findOne(req, id);
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
          expect(service.findOne).toHaveBeenCalledWith(
            new Id(req.user.userId),
            category.id,
          );
        }
      });

      it('should handle 404 errors when throwing CategoryNotFoundError', async () => {
        const error = new CategoryNotFoundError(new Id('irrelevant'));
        jest.spyOn(service, 'findOne').mockRejectedValue(error);

        try {
          await controller.findOne(req, id);
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
          expect(service.findOne).toHaveBeenCalledWith(
            new Id(req.user.userId),
            category.id,
          );
        }
      });

      it('should handle 500 errors for the rest of errors', async () => {
        const error = new Error('💥 Boom!!');
        jest.spyOn(service, 'findOne').mockRejectedValue(error);

        try {
          await controller.findOne(req, id);
          throwError = false;
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
          expect(error.response).toEqual(error);
        } finally {
          expect(throwError).toEqual(true);
          expect(service.findOne).toHaveBeenCalledWith(
            new Id(req.user.userId),
            category.id,
          );
        }
      });
    });
  });

  describe('update a category', () => {
    it('should update an existing category', async () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const category = buildCategory();
      jest.spyOn(service, 'update').mockResolvedValue(category);

      const result = await controller.update(req, category.id.toString(), {
        name: category.name,
        type: category.type,
        icon: category.icon as string,
        color: category.color as string,
      });

      expect(result).toStrictEqual(new CategoryResponseDto(category));
      expect(service.update).toHaveBeenCalledWith(new Id('1'), category);
    });

    describe('Error handling', () => {
      let throwError: boolean;
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const category = buildCategory();
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
        jest.spyOn(service, 'update').mockRejectedValue(error);

        try {
          await controller.update(req, id, payload);
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
          expect(service.update).toHaveBeenCalledWith(new Id('1'), {
            ...payload,
            id: new Id(id),
          });
        }
      });

      it('should handle 404 errors when throwing CategoryNotFoundError', async () => {
        const error = new CategoryNotFoundError(new Id('irrelevant'));
        jest.spyOn(service, 'update').mockRejectedValue(error);

        try {
          await controller.update(req, id, payload);
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
          expect(service.update).toHaveBeenCalledWith(new Id('1'), {
            ...payload,
            id: new Id(id),
          });
        }
      });

      it('should handle 500 errors for the rest of errors', async () => {
        const error = new Error('💥 Boom!!');
        jest.spyOn(service, 'update').mockRejectedValue(error);

        try {
          await controller.update(req, id, payload);
          throwError = false;
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
          expect(error.response).toEqual(error);
        } finally {
          expect(throwError).toEqual(true);
          expect(service.update).toHaveBeenCalledWith(new Id('1'), {
            ...payload,
            id: new Id(id),
          });
        }
      });
    });
  });
});
