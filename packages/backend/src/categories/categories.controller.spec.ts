import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dto';
import { buildCategory, buildUserEntity } from '@test/builders';
import { Category } from './category.model';
import { CategoryNotFoundError, NotAuthorizedForCategoryError } from './errors';
import { Id } from '@gualet/shared';
import { AuthenticatedRequest } from '@src/common/infrastructure';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import Mocked = jest.Mocked;

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;
  let res: Mocked<Response>;

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
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn((x: unknown) => x),
    } as unknown as Mocked<Response>;
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

    expect(result).toEqual({
      success: true,
      error: null,
      data: {
        categories: categories.map((c) => new Category(c).toJSON()),
      },
      pagination: null,
    });
    expect(service.findAll).toHaveBeenCalledWith(new Id(req.user.userId));
  });

  it('should create a new category', async () => {
    const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
    const category = buildCategory();
    jest.spyOn(service, 'create').mockResolvedValue(category);

    const result = await controller.create(req, {
      name: category.name,
      type: category.type,
      icon: category.icon,
      color: category.color,
    });

    expect(result).toEqual({
      success: true,
      error: null,
      data: {
        category: category.toJSON(),
      },
      pagination: null,
    });
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

      await controller.findOne(req, res, category.id.toString());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        error: null,
        data: {
          category: category.toJSON(),
        },
        pagination: null,
      });
      expect(service.findOne).toHaveBeenCalledWith(
        new Id(req.user.userId),
        category.id,
      );
    });

    describe('Error handling', () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const category = buildCategory();
      const id = category.id.toString();

      it('should handle 403 errors when throwing NotAuthorizedForCategoryError', async () => {
        const error = new NotAuthorizedForCategoryError(new Id('irrelevant'));
        jest.spyOn(service, 'findOne').mockRejectedValue(error);

        await controller.findOne(req, res, id);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({
          success: false,
          error: new ForbiddenException(error),
          data: null,
          pagination: null,
        });
        expect(service.findOne).toHaveBeenCalledWith(
          new Id(req.user.userId),
          category.id,
        );
      });

      it('should handle 404 errors when throwing CategoryNotFoundError', async () => {
        const error = new CategoryNotFoundError(new Id('irrelevant'));
        jest.spyOn(service, 'findOne').mockRejectedValue(error);

        await controller.findOne(req, res, id);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith({
          success: false,
          error: new NotFoundException(error),
          data: null,
          pagination: null,
        });
        expect(service.findOne).toHaveBeenCalledWith(
          new Id(req.user.userId),
          category.id,
        );
      });

      it('should handle 500 errors for the rest of errors', async () => {
        const error = new Error('💥 Boom!!');
        jest.spyOn(service, 'findOne').mockRejectedValue(error);

        await controller.findOne(req, res, id);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
          success: false,
          error: new InternalServerErrorException(error),
          data: null,
          pagination: null,
        });
        expect(service.findOne).toHaveBeenCalledWith(
          new Id(req.user.userId),
          category.id,
        );
      });
    });
  });

  describe('update a category', () => {
    it('should update an existing category', async () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const category = buildCategory();
      jest.spyOn(service, 'update').mockResolvedValue(category);

      await controller.update(req, res, category.id.toString(), {
        name: category.name,
        type: category.type,
        icon: category.icon,
        color: category.color,
      });

      expect(res.send).toHaveBeenCalledWith(new CategoryResponseDto(category));
      expect(service.update).toHaveBeenCalledWith(new Id('1'), {
        id: category.id,
        name: category.name,
        type: category.type,
        icon: category.icon,
        color: category.color,
      });
    });

    describe('Error handling', () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const category = buildCategory();
      const id = category.id.toString();
      const payload = {
        id,
        name: category.name,
        type: category.type,
      };

      beforeEach(() => {});

      it('should handle 403 errors when throwing NotAuthorizedForCategoryError', async () => {
        const error = new NotAuthorizedForCategoryError(new Id('irrelevant'));
        jest.spyOn(service, 'update').mockRejectedValue(error);

        try {
          await controller.update(req, res, id, payload);
        } catch (error) {
          expect(error).toBeInstanceOf(ForbiddenException);
          expect(error.response).toEqual({
            error: 'Forbidden',
            message: 'Not authorized for category with id "irrelevant".',
            statusCode: 403,
          });
        } finally {
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
          await controller.update(req, res, id, payload);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.response).toEqual({
            error: 'Not Found',
            message: 'Category with id "irrelevant" not found.',
            statusCode: 404,
          });
        } finally {
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
          await controller.update(req, res, id, payload);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
          expect(error.response).toEqual(error);
        } finally {
          expect(service.update).toHaveBeenCalledWith(new Id('1'), {
            ...payload,
            id: new Id(id),
          });
        }
      });
    });
  });

  describe('delete a category', () => {
    it('should delete an existing category', async () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const category = buildCategory();
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      await controller.delete(req, res, category.id.toString());

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
      expect(service.delete).toHaveBeenCalledWith(
        new Id('1'),
        category.id,
      );
    });

    describe('Error handling', () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const category = buildCategory();
      const id = category.id.toString();

      it('should handle 403 errors when throwing NotAuthorizedForCategoryError', async () => {
        const error = new NotAuthorizedForCategoryError(new Id('irrelevant'));
        jest.spyOn(service, 'delete').mockRejectedValue(error);

        await controller.delete(req, res, id);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({
          success: false,
          error: new ForbiddenException(error),
          data: null,
          pagination: null,
        });
        expect(service.delete).toHaveBeenCalledWith(
          new Id(req.user.userId),
          category.id,
        );
      });

      it('should handle 404 errors when throwing CategoryNotFoundError', async () => {
        const error = new CategoryNotFoundError(new Id('irrelevant'));
        jest.spyOn(service, 'delete').mockRejectedValue(error);

        await controller.delete(req, res, id);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith({
          success: false,
          error: new NotFoundException(error),
          data: null,
          pagination: null,
        });
        expect(service.delete).toHaveBeenCalledWith(
          new Id(req.user.userId),
          category.id,
        );
      });

      it('should handle 409 errors when category is in use', async () => {
        const error = new (class CategoryInUseError {
          code = 'CATEGORY_IN_USE';
          message = 'Category is in use';
        })();
        jest.spyOn(service, 'delete').mockRejectedValue(error);

        await controller.delete(req, res, id);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(service.delete).toHaveBeenCalledWith(
          new Id(req.user.userId),
          category.id,
        );
      });

      it('should handle 500 errors for the rest of errors', async () => {
        const error = new Error('💥 Boom!!');
        jest.spyOn(service, 'delete').mockRejectedValue(error);

        await controller.delete(req, res, id);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
          success: false,
          error: new InternalServerErrorException(error),
          data: null,
          pagination: null,
        });
        expect(service.delete).toHaveBeenCalledWith(
          new Id(req.user.userId),
          category.id,
        );
      });
    });
  });
});
